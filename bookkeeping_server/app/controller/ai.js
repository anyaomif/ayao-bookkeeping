const { Controller } = require('egg');

class AiController extends Controller {
  // SSE流式接口 - 只解析不入库
  async stream() {
    const { ctx } = this;
    const { text, pendingItems } = ctx.request.body;
    if (!text || !text.trim()) ctx.throw(400, '请输入记账内容');

    const userId = ctx.state.user.id;
    const promptCtx = await ctx.service.ai.getPromptContext(userId);

    // 如果有待修改的记录，注入上下文让AI修改
    let userMessage = text.trim();
    if (pendingItems && pendingItems.length) {
      userMessage = `当前有${pendingItems.length}条待确认记录：${JSON.stringify(pendingItems)}\n用户说：${text.trim()}\n请根据用户意图修改这些记录并返回修改后的完整JSON（包含所有记录）。`;
    }

    const systemPrompt = ctx.service.ai.buildSystemPrompt(promptCtx);

    // egg SSE: 手动接管响应
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
        () => {
          // 流结束，提取解析结果但不入库
          const parsed = ctx.service.ai.extractItems(fullReply);
          ctx.res.write(`data: ${JSON.stringify({ type: 'done', ...parsed })}\n\n`);
          ctx.res.end();
          resolve();
        },
        (err) => {
          ctx.logger.error('[AI] 流式调用失败:', err.message);
          ctx.res.write(`data: ${JSON.stringify({ type: 'error', message: '服务异常' })}\n\n`);
          ctx.res.end();
          resolve();
        }
      );
    });
  }

  // 用户确认后提交入库
  async confirm() {
    const { ctx } = this;
    const { items } = ctx.request.body;
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
    ctx.success(created);
  }
}

module.exports = AiController;
