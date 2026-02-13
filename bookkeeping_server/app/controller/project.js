const { Controller } = require('egg');

class ProjectController extends Controller {
  async create() {
    const { ctx } = this;
    const data = await ctx.service.project.create(ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async index() {
    const { ctx } = this;
    const data = await ctx.service.project.list(ctx.query, ctx.state.user.id);
    ctx.success(data);
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.project.findOne(ctx.params.id, ctx.state.user.id);
    ctx.success(data);
  }

  async update() {
    const { ctx } = this;
    const data = await ctx.service.project.update(ctx.params.id, ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async destroy() {
    const { ctx } = this;
    await ctx.service.project.destroy(ctx.params.id, ctx.state.user.id);
    ctx.success(null, '删除成功');
  }
}

module.exports = ProjectController;
