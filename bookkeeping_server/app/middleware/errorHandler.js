// 统一错误处理，消除 Controller 中重复的 try/catch
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      const status = err.status || 500;
      const message = status === 500 && ctx.app.config.env === 'prod'
        ? '服务器内部错误'
        : err.message;

      ctx.status = status;
      ctx.body = { code: status, success: false, data: null, message };

      if (status === 500) {
        ctx.logger.error(err);
      }
    }
  };
};
