const { Controller } = require('egg');

class RecordController extends Controller {
  async create() {
    const { ctx } = this;
    const data = await ctx.service.record.create(ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async index() {
    const { ctx } = this;
    const data = await ctx.service.record.list(ctx.query, ctx.state.user.id);
    ctx.success(data);
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.record.findOne(ctx.params.id, ctx.state.user.id);
    ctx.success(data);
  }

  async update() {
    const { ctx } = this;
    const data = await ctx.service.record.update(ctx.params.id, ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async destroy() {
    const { ctx } = this;
    await ctx.service.record.destroy(ctx.params.id, ctx.state.user.id);
    ctx.success(null, '删除成功');
  }

  async getProjectRecords() {
    const { ctx } = this;
    const data = await ctx.service.record.getProjectRecords(ctx.params.project_id, ctx.state.user.id);
    ctx.success(data);
  }

  async getStatistics() {
    const { ctx } = this;
    const data = await ctx.service.record.getStatistics(ctx.request.body, ctx.state.user.id);
    ctx.success({ statistics: data });
  }

  async getUserWorkStats() {
    const { ctx } = this;
    const data = await ctx.service.record.getUserWorkStats(ctx.state.user.id);
    ctx.success(data);
  }
}

module.exports = RecordController;
