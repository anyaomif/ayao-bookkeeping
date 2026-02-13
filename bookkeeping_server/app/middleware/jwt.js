const jwt = require('jsonwebtoken');

module.exports = () => {
  return async function verifyToken(ctx, next) {
    try {
      const token = ctx.request.header.authorization;
      if (!token) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '未登录或登录已过期',
        };
        return;
      }

      // 验证 token
      const decoded = jwt.verify(token.replace('Bearer ', ''), ctx.app.config.jwt.secret);
      ctx.state.user = decoded;

      await next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '登录已过期，请重新登录',
        };
      } else {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '无效的token',
        };
      }
    }
  };
};
