const { Controller } = require('egg');

class PersonalCategoryController extends Controller {
  async init() {
    const { ctx } = this;
    await ctx.service.personalCategory.initDefaults(ctx.state.user.id);
    ctx.success(null, '初始化成功');
  }

  async index() {
    const { ctx } = this;
    const { type } = ctx.query;
    let data;
    if (type) {
      data = await ctx.service.personalCategory.listByType(ctx.state.user.id, type);
    } else {
      data = await ctx.service.personalCategory.listAll(ctx.state.user.id);
    }
    ctx.success(data);
  }

  async create() {
    const { ctx } = this;
    const data = await ctx.service.personalCategory.create(ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async update() {
    const { ctx } = this;
    const data = await ctx.service.personalCategory.update(ctx.params.id, ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async destroy() {
    const { ctx } = this;
    await ctx.service.personalCategory.destroy(ctx.params.id, ctx.state.user.id);
    ctx.success(null, '删除成功');
  }
}

module.exports = PersonalCategoryController;
