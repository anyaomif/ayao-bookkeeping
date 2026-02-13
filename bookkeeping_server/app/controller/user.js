const { Controller } = require('egg');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class UserController extends Controller {
  // 用户注册
  async register() {
    const { ctx } = this;
    const { username, password, nickname, phone } = ctx.request.body;

    try {
      // 检查用户名是否已存在
      const existUser = await ctx.model.User.findOne({
        where: { username },
      });

      if (existUser) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '用户名已存在',
        };
        return;
      }

      // 密码加密
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');

      // 创建用户，添加默认头像
      const user = await ctx.model.User.create({
        username,
        password: `${salt}:${hashedPassword}`,
        nickname: nickname || username,
        phone,
        avatar: '/public/uploads/default_avatar.png', // 设置默认头像
      });

      // 生成 token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        ctx.app.config.jwt.secret,
        { expiresIn: '7d' }
      );

      ctx.body = {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          phone: user.phone,
          avatar: user.avatar, // 返回头像URL
          token,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 用户登录
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    try {
      // 查找用户
      const user = await ctx.model.User.findOne({
        where: { username },
      });

      if (!user) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '用户名或密码错误',
        };
        return;
      }

      // 验证密码
      const [ salt, hashedPassword ] = user.password.split(':');
      const inputHashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');

      if (hashedPassword !== inputHashedPassword) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '用户名或密码错误',
        };
        return;
      }

      // 生成 token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        ctx.app.config.jwt.secret,
        { expiresIn: '7d' }
      );

      ctx.body = {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          phone: user.phone,
          token,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 获取用户信息
  async info() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    try {
      const user = await ctx.model.User.findByPk(userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '用户不存在',
        };
        return;
      }

      ctx.body = {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          phone: user.phone,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 更新用户信息
  async update() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { nickname, phone, avatar } = ctx.request.body;

    try {
      const user = await ctx.model.User.findByPk(userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '用户不存在',
        };
        return;
      }

      await user.update({
        nickname,
        phone,
        avatar,
      });

      ctx.body = {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          phone: user.phone,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 修改密码
  async updatePassword() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { oldPassword, newPassword } = ctx.request.body;

    try {
      const user = await ctx.model.User.findByPk(userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '用户不存在',
        };
        return;
      }

      // 验证旧密码
      const [ salt, hashedPassword ] = user.password.split(':');
      const oldHashedPassword = crypto
        .pbkdf2Sync(oldPassword, salt, 10000, 64, 'sha512')
        .toString('hex');

      if (hashedPassword !== oldHashedPassword) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '旧密码错误',
        };
        return;
      }

      // 生成新密码
      const newSalt = crypto.randomBytes(16).toString('hex');
      const newHashedPassword = crypto
        .pbkdf2Sync(newPassword, newSalt, 10000, 64, 'sha512')
        .toString('hex');

      await user.update({
        password: `${newSalt}:${newHashedPassword}`,
      });

      ctx.body = {
        success: true,
        message: '密码修改成功',
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = UserController;
