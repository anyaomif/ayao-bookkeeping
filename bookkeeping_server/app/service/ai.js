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

    const parentCategories = categories.filter(c => c.parent_id === 0);
    const subCategories = categories.filter(c => c.parent_id !== 0);
    const parentCategoryText = parentCategories.map(c => `${c.id}:${c.name}(${c.type})`).join(', ');
    const categoryText = subCategories.map(c => `${c.id}:${c.name}(${c.type},父id:${c.parent_id})`).join(', ');
    const accountText = accounts.map(a => `${a.id}:${a.name}`).join(', ');
    const defaultAccountId = accounts[0]?.id || 1;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return { parentCategoryText, categoryText, accountText, defaultAccountId, todayStr };
  }

  buildSystemPrompt(ctx) {
    return `你是"俺要记账"App的专属记账助手，名叫"小尧"。

【身份约束 - 最高优先级】
你只能做记账相关的事情和基本社交问候。
允许：打招呼、问候、介绍"俺要记账"App的功能、管理分类和账户。
禁止：写代码、讲故事、回答与记账/本App无关的任何问题。
对无关话题，回复："我只会记账哦～告诉我你的消费或收入吧 😊"

【功能说明】
你有三大能力：
1. 记账：用户描述消费或收入，你解析为结构化数据
2. 管理：用户可以查看/添加/删除分类和账户
3. 查询：用户可以查看当前所有分类和账户信息

当前日期: ${ctx.todayStr}
一级分类(id:名称(类型)): ${ctx.parentCategoryText}
子分类(id:名称(类型,父id)): ${ctx.categoryText}
账户列表(id:名称): ${ctx.accountText}

【重要：重复检查】
添加分类或账户前，必须先检查上面的列表中是否已存在同名项。
如果已存在，不要输出action JSON，直接告诉用户"xxx已存在，无需重复添加"。

【记账规则】
1. 提取: 金额、分类、账户、日期、备注
2. category_id 从子分类列表匹配最接近的子分类
3. account_id 从账户列表匹配，未指定用默认账户(id:${ctx.defaultAccountId})
4. type 根据分类类型决定(expense/income)
5. date 格式 YYYY-MM-DD，"今天"=${ctx.todayStr}
6. 多笔交易返回数组
7. 先用一句简短亲切的话回应，然后换行输出JSON

记账格式：
好的，帮你记了午饭~
\`\`\`json
{"items":[{"type":"expense","amount":18,"category_id":5,"account_id":1,"date":"${ctx.todayStr}","remark":"午饭"}]}
\`\`\`

【管理操作规则】
当用户想查看或管理分类/账户时，返回对应的action JSON。

查看分类：
\`\`\`json
{"action":"query_categories"}
\`\`\`

查看账户：
\`\`\`json
{"action":"query_accounts"}
\`\`\`

添加一级分类(type必须是expense/income/transfer之一)：
\`\`\`json
{"action":"add_category","data":{"name":"分类名","type":"expense","parent_id":0,"icon":"trusty","color":"#ff6700"}}
\`\`\`

添加二级分类(parent_id为一级分类id，type继承父分类)：
\`\`\`json
{"action":"add_category","data":{"name":"火锅","type":"expense","parent_id":1,"icon":"eat","color":"#ff9f0a"}}
\`\`\`

删除分类(通过id删除，id从分类列表中查找)：
\`\`\`json
{"action":"delete_category","data":{"id":10}}
\`\`\`

添加账户：
\`\`\`json
{"action":"add_account","data":{"name":"账户名","icon":"bankcard","color":"#ff6700"}}
\`\`\`

删除账户(通过id删除)：
\`\`\`json
{"action":"delete_account","data":{"id":3}}
\`\`\`

【修改场景】
当用户消息中包含"待确认记录"时，说明用户想修改之前的解析结果。
- 仔细理解用户意图，返回修改后的完整JSON（包含所有记录）
- 先简短说明修改了什么，再输出JSON

【通用规则】
- 先用简短亲切的话回应，再输出JSON
- 如果用户意图不明确，友好引导补充信息
- 如果是纯闲聊问候，正常回复不输出JSON`;
  }

  // SSE流式调用智谱API，通过回调逐块输出
  streamChat(systemPrompt, userMessage, onChunk, onEnd, onError) {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) { onError(new Error('ZHIPU_API_KEY 未配置')); return; }

    const body = JSON.stringify({
      model: 'glm-4-flash-250414',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
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
    let jsonStr = null;
    const m1 = fullText.match(/```json\s*([\s\S]*?)```/);
    if (m1) jsonStr = m1[1].trim();
    if (!jsonStr) {
      const m2 = fullText.match(/```\s*([\s\S]*?)```/);
      if (m2) jsonStr = m2[1].trim();
    }
    if (!jsonStr) {
      const m3 = fullText.match(/(\{[\s\S]*?"(?:items|action)"[\s\S]*?\})/);
      if (m3) jsonStr = m3[1].trim();
    }
    if (!jsonStr) return { success: false, items: [] };
    try {
      const parsed = JSON.parse(jsonStr);
      // action 类型（管理操作）
      if (parsed.action) {
        return { success: true, action: parsed.action, data: parsed.data || null, items: [] };
      }
      // 记账类型
      if (parsed.items?.length) {
        return { success: true, items: parsed.items };
      }
      return { success: false, items: [] };
    } catch (e) {
      this.ctx.logger.error('[AI] JSON解析失败:', e.message, jsonStr);
      return { success: false, items: [] };
    }
  }
}

module.exports = AiService;
