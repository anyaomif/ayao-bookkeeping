// 统一响应格式封装
module.exports = {
  success(data = null, message = 'ok') {
    this.body = { code: 200, success: true, data, message };
  },
  fail(message = '操作失败', code = 400) {
    this.body = { code, success: false, data: null, message };
  },
};
