const { Controller } = require('egg');

class AiController extends Controller {
  async stream() {
    const { ctx } = this;
    const { text, pendingItems } = ctx.request.body;
    if (!text || !text.trim()) ctx.throw(400, '请输入记账内容');

    const userId = ctx.state.user.id;
    const promptCtx = await ctx.service.ai.getPromptContext(userId);

    let userMessage = text.trim();
    if (pendingItems && pendingItems.length) {
      userMessage = `当前有${pendingItems.length}条待确认记录：${JSON.stringify(pendingItems)}\n用户说：${text.trim()}\n请根据用户意图修改这些记录并返回修改后的完整JSON（包含所有记录）。`;
    }

    // 存用户消息
    await ctx.service.aiMessage.save(userId, 'user', text.trim());

    const systemPrompt = ctx.service.ai.buildSystemPrompt(promptCtx);

    ctx.status = 200;
    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    ctx.flushHeaders && ctx.flushHeaders();

    let fullReply = '';

    await new Promise((resolve) => {
      ctx.service.ai.streamChat(systemPrompt, userMessage,
        (chunk) => {
          fullReply += chunk;
          ctx.res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
        },
        async () => {
          const parsed = ctx.service.ai.extractItems(fullReply);
          const extra = {};
          if (parsed.success && parsed.items?.length) {
            extra.pendingCards = parsed.items;
            extra.showActions = true;
          }
          if (parsed.success && parsed.action) {
            extra.action = parsed.action;
            extra.data = parsed.data;
          }
          // 存 AI 回复
          const aiMsg = await ctx.service.aiMessage.save(userId, 'ai', fullReply, Object.keys(extra).length ? extra : null);
          ctx.res.write(`data: ${JSON.stringify({ type: 'done', msgId: aiMsg.id, ...parsed })}\n\n`);
          ctx.res.end();
          resolve();
        },
        async (err) => {
          ctx.logger.error('[AI] 流式调用失败:', err.message);
          await ctx.service.aiMessage.save(userId, 'ai', '服务异常');
          ctx.res.write(`data: ${JSON.stringify({ type: 'error', message: '服务异常' })}\n\n`);
          ctx.res.end();
          resolve();
        }
      );
    });
  }

  async chat() {
    const { ctx } = this;
    const { text, pendingItems } = ctx.request.body;
    if (!text || !text.trim()) ctx.throw(400, '请输入记账内容');

    const userId = ctx.state.user.id;
    const promptCtx = await ctx.service.ai.getPromptContext(userId);

    let userMessage = text.trim();
    if (pendingItems && pendingItems.length) {
      userMessage = `当前有${pendingItems.length}条待确认记录：${JSON.stringify(pendingItems)}\n用户说：${text.trim()}\n请根据用户意图修改这些记录并返回修改后的完整JSON（包含所有记录）。`;
    }

    await ctx.service.aiMessage.save(userId, 'user', text.trim());

    const systemPrompt = ctx.service.ai.buildSystemPrompt(promptCtx);

    let fullReply = '';
    await new Promise((resolve, reject) => {
      ctx.service.ai.streamChat(systemPrompt, userMessage,
        (chunk) => { fullReply += chunk; },
        () => resolve(),
        (err) => reject(err)
      );
    });

    const parsed = ctx.service.ai.extractItems(fullReply);
    const extra = {};
    if (parsed.success && parsed.items?.length) {
      extra.pendingCards = parsed.items;
      extra.showActions = true;
    }
    if (parsed.success && parsed.action) {
      extra.action = parsed.action;
      extra.data = parsed.data;
    }
    const aiMsg = await ctx.service.aiMessage.save(userId, 'ai', fullReply, Object.keys(extra).length ? extra : null);
    ctx.success({ reply: fullReply, msgId: aiMsg.id, ...parsed });
  }

  async confirm() {
    const { ctx } = this;
    const { items, msgId } = ctx.request.body;
    if (!items?.length) ctx.throw(400, '无记录');

    const userId = ctx.state.user.id;
    const created = [];
    for (const item of items) {
      const tx = await ctx.service.personalTransaction.create({
        type: item.type,
        amount: item.amount,
        category_id: item.category_id,
        account_id: item.account_id,
        date: item.date,
        remark: item.remark || '',
      }, userId);
      created.push(tx);
    }
    // 标记该 AI 消息已确认
    if (msgId) {
      await ctx.service.aiMessage.updateExtra(msgId, userId, { confirmed: true, showActions: false });
    }
    ctx.success(created);
  }

  async history() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { page = 1, pageSize = 100 } = ctx.query;
    const result = await ctx.service.aiMessage.getHistory(userId, Number(page), Number(pageSize));
    ctx.success(result);
  }

  async clearHistory() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    await ctx.service.aiMessage.clear(userId);
    ctx.success(null);
  }

  // 放弃待确认记录时更新状态
  async discard() {
    const { ctx } = this;
    const { msgId } = ctx.request.body;
    if (!msgId) ctx.throw(400, '缺少 msgId');
    const userId = ctx.state.user.id;
    await ctx.service.aiMessage.updateExtra(msgId, userId, { discarded: true, showActions: false });
    ctx.success(null);
  }
}

module.exports = AiController;
