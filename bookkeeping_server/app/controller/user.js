const { Controller } = require('egg');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password, nickname, phone } = ctx.request.body;

    const existUser = await ctx.model.User.findOne({ where: { username } });
    if (existUser) ctx.throw(400, '用户名已存在');

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    const user = await ctx.model.User.create({
      username,
      password: `${salt}:${hashedPassword}`,
      nickname: nickname || username,
      phone,
      avatar: '/public/uploads/default_avatar.png',
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      ctx.app.config.jwt.secret,
      { expiresIn: '7d' }
    );

    ctx.success({
      id: user.id, username: user.username, nickname: user.nickname,
      phone: user.phone, avatar: user.avatar, token,
    });
  }

  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    const user = await ctx.model.User.findOne({ where: { username } });
    if (!user) ctx.throw(401, '用户名或密码错误');

    const [salt, hashedPassword] = user.password.split(':');
    const inputHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    if (hashedPassword !== inputHash) ctx.throw(401, '用户名或密码错误');

    const token = jwt.sign(
      { id: user.id, username: user.username },
      ctx.app.config.jwt.secret,
      { expiresIn: '7d' }
    );

    ctx.success({
      id: user.id, username: user.username, nickname: user.nickname,
      phone: user.phone, token,
    });
  }

  async info() {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(ctx.state.user.id);
    if (!user) ctx.throw(404, '用户不存在');

    ctx.success({
      id: user.id, username: user.username, nickname: user.nickname,
      phone: user.phone, avatar: user.avatar,
    });
  }

  async update() {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(ctx.state.user.id);
    if (!user) ctx.throw(404, '用户不存在');

    const { nickname, phone, avatar } = ctx.request.body;
    await user.update({ nickname, phone, avatar });

    ctx.success({
      id: user.id, username: user.username, nickname: user.nickname,
      phone: user.phone, avatar: user.avatar,
    });
  }

  async updatePassword() {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(ctx.state.user.id);
    if (!user) ctx.throw(404, '用户不存在');

    const { oldPassword, newPassword } = ctx.request.body;
    const [salt, hashedPassword] = user.password.split(':');
    const oldHash = crypto.pbkdf2Sync(oldPassword, salt, 10000, 64, 'sha512').toString('hex');
    if (hashedPassword !== oldHash) ctx.throw(400, '旧密码错误');

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 10000, 64, 'sha512').toString('hex');
    await user.update({ password: `${newSalt}:${newHash}` });

    ctx.success(null, '密码修改成功');
  }
}

module.exports = UserController;
