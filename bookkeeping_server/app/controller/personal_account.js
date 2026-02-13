const { Controller } = require('egg');

class PersonalAccountController extends Controller {
  async init() {
    const { ctx } = this;
    await ctx.service.personalAccount.initDefaults(ctx.state.user.id);
    ctx.success(null, '初始化成功');
  }

  async create() {
    const { ctx } = this;
    const data = await ctx.service.personalAccount.create(ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async index() {
    const { ctx } = this;
    const data = await ctx.service.personalAccount.list(ctx.state.user.id);
    ctx.success({ list: data });
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.personalAccount.findOne(ctx.params.id, ctx.state.user.id);
    ctx.success(data);
  }

  async update() {
    const { ctx } = this;
    const data = await ctx.service.personalAccount.update(ctx.params.id, ctx.request.body, ctx.state.user.id);
    ctx.success(data);
  }

  async destroy() {
    const { ctx } = this;
    await ctx.service.personalAccount.destroy(ctx.params.id, ctx.state.user.id);
    ctx.success(null, '删除成功');
  }
}

module.exports = PersonalAccountController;
