// 轻量参数校验中间件，基于 schema 校验请求参数
module.exports = (schema, source = 'body') => {
  return async function validate(ctx, next) {
    const data = source === 'body' ? ctx.request.body : ctx.query;
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} 不能为空`);
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rules.type === 'number' && isNaN(Number(value))) {
        errors.push(`${field} 必须为数字`);
      }

      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} 必须为字符串`);
      }

      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} 的值必须是 ${rules.enum.join('/')}`);
      }

      if (rules.min !== undefined && String(value).length < rules.min) {
        errors.push(`${field} 长度不能小于 ${rules.min}`);
      }

      if (rules.max !== undefined && String(value).length > rules.max) {
        errors.push(`${field} 长度不能大于 ${rules.max}`);
      }

      if (rules.pattern && !rules.pattern.test(String(value))) {
        errors.push(`${field} 格式不正确`);
      }
    }

    if (errors.length) {
      ctx.throw(422, errors.join('; '));
    }

    await next();
  };
};
