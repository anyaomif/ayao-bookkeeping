const { Controller } = require('egg');

class PersonalTransactionController extends Controller {
  async create() {
    const { ctx } = this;
    const data = await ctx.service.personalTransaction.create(ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async index() {
    const { ctx } = this;
    const data = await ctx.service.personalTransaction.list(ctx.query, ctx.state.user.id);
    ctx.success(data);
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.personalTransaction.findOne(ctx.params.id, ctx.state.user.id);
    ctx.success(data);
  }

  async update() {
    const { ctx } = this;
    const data = await ctx.service.personalTransaction.update(ctx.params.id, ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async destroy() {
    const { ctx } = this;
    await ctx.service.personalTransaction.destroy(ctx.params.id, ctx.state.user.id);
    ctx.success(null, '删除成功');
  }

  async statistics() {
    const { ctx } = this;
    const { year, month } = ctx.query;
    if (!year || !month) ctx.throw(400, '缺少 year 或 month 参数');
    const data = await ctx.service.personalTransaction.getMonthlyStats(year, month, ctx.state.user.id);
    ctx.success(data);
  }
}

module.exports = PersonalTransactionController;
