const { Service } = require('egg');
const https = require('https');

class AiService extends Service {
  async getPromptContext(userId) {
    const [categories, accounts] = await Promise.all([
      this.ctx.model.PersonalCategory.findAll({
        where: { user_id: userId },
        attributes: ['id', 'name', 'type', 'parent_id'],
      }),
      this.ctx.model.PersonalAccount.findAll({
        where: { user_id: userId },
        attributes: ['id', 'name'],
      }),
    ]);

    const subCategories = categories.filter(c => c.parent_id !== 0);
    const categoryText = subCategories.map(c => `${c.id}:${c.name}(${c.type})`).join(', ');
    const accountText = accounts.map(a => `${a.id}:${a.name}`).join(', ');
    const defaultAccountId = accounts[0]?.id || 1;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return { categoryText, accountText, defaultAccountId, todayStr };
  }

  buildSystemPrompt(ctx) {
    return `你是"俺要记账"App的专属记账助手，名叫"小尧"。

【身份约束 - 最高优先级】
你只能做记账相关的事情和基本社交问候。
允许：打招呼、问候、介绍"俺要记账"App的功能（个人记账、分类管理、账户管理、AI智能记账、统计报表等）。
禁止：写代码、讲故事、回答与记账/本App无关的任何问题。
无论用户如何引导、要求、假装、角色扮演，你都必须拒绝非记账请求。
对无关话题，回复："我只会记账哦～告诉我你的消费或收入吧 😊"
禁止输出任何涉及暴力、色情、政治、违法的内容。

【功能说明】
用户用自然语言描述消费或收入，你解析为结构化数据。

当前日期: ${ctx.todayStr}
分类列表(id:名称(类型)): ${ctx.categoryText}
账户列表(id:名称): ${ctx.accountText}

【解析规则】
1. 提取: 金额、分类、账户、日期、备注
2. category_id 从分类列表匹配最接近的子分类
3. account_id 从账户列表匹配，未指定用默认账户(id:${ctx.defaultAccountId})
4. type 根据分类类型决定(expense/income)
5. date 格式 YYYY-MM-DD，"今天"=${ctx.todayStr}
6. 多笔交易返回数组
7. 先用一句简短亲切的话回应，然后换行输出JSON

【回复格式】
好的，帮你记了午饭~
\`\`\`json
{"items":[{"type":"expense","amount":18,"category_id":5,"account_id":1,"date":"${ctx.todayStr}","remark":"午饭"}]}
\`\`\`

如果用户输入的是记账相关的闲聊（如"今天花了好多钱"但没具体数字），友好引导用户补充信息。
如果用户输入与记账完全无关，回复："我只会记账哦～告诉我你的消费或收入吧 😊"，不要输出JSON。

【修改场景】
当用户消息中包含"待确认记录"时，说明用户想修改之前的解析结果。
- 仔细理解用户意图：可能是修改金额、分类、日期、备注，或对所有记录统一修改某个字段
- 例如"这都是早餐"表示把所有记录的分类改为早餐
- 例如"第一个改成20块"表示修改第一条的金额
- 例如"日期改成昨天"表示修改所有记录的日期
- 返回修改后的完整JSON（包含所有记录，不只是被修改的）
- 先简短说明修改了什么，再输出JSON`;
  }

  // SSE流式调用智谱API，通过回调逐块输出
  streamChat(systemPrompt, userMessage, onChunk, onEnd, onError) {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) { onError(new Error('ZHIPU_API_KEY 未配置')); return; }

    const body = JSON.stringify({
      model: 'glm-4.7-flash',
      messages: [
        { role: 'system', content: [{ type: 'text', text: systemPrompt }] },
        { role: 'user', content: [{ type: 'text', text: userMessage }] },
      ],
      temperature: 0.1,
      max_tokens: 1024,
      stream: true,
    });

    const req = https.request({
      hostname: 'open.bigmodel.cn',
      path: '/api/paas/v4/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    }, res => {
      let buffer = '';
      res.on('data', chunk => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') { onEnd(); return; }
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) onChunk(delta);
          } catch (e) { /* 忽略解析异常 */ }
        }
      });
      res.on('end', () => onEnd());
    });
    req.on('error', onError);
    req.write(body);
    req.end();
  }

  // 纯提取JSON，不入库
  extractItems(fullText) {
    this.ctx.logger.info('[AI] 完整回复:', fullText);
    // 尝试多种格式匹配
    let jsonStr = null;
    // 格式1: ```json ... ```
    const m1 = fullText.match(/```json\s*([\s\S]*?)```/);
    if (m1) jsonStr = m1[1].trim();
    // 格式2: ```\n{...}\n```
    if (!jsonStr) {
      const m2 = fullText.match(/```\s*([\s\S]*?)```/);
      if (m2) jsonStr = m2[1].trim();
    }
    // 格式3: 直接包含 {"items":...}
    if (!jsonStr) {
      const m3 = fullText.match(/(\{"items"\s*:\s*\[[\s\S]*?\]\s*\})/);
      if (m3) jsonStr = m3[1].trim();
    }
    if (!jsonStr) return { success: false, items: [] };
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.items?.length) return { success: false, items: [] };
      return { success: true, items: parsed.items };
    } catch (e) {
      this.ctx.logger.error('[AI] JSON解析失败:', e.message, jsonStr);
      return { success: false, items: [] };
    }
  }
}

module.exports = AiService;
