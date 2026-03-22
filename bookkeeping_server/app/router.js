/**
 * @param {Egg.Application} app - egg application
 */
const validate = require('./middleware/validate');

module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.jwt();

  // 校验规则定义
  const registerSchema = validate({
    username: { required: true, type: 'string', min: 2, max: 20 },
    password: { required: true, type: 'string', min: 6, max: 32 },
  });

  const loginSchema = validate({
    username: { required: true, type: 'string' },
    password: { required: true, type: 'string' },
  });

  const passwordSchema = validate({
    oldPassword: { required: true, type: 'string' },
    newPassword: { required: true, type: 'string', min: 6, max: 32 },
  });

  const projectSchema = validate({
    name: { required: true, type: 'string' },
    start_date: { required: true, type: 'string' },
  });

  const recordSchema = validate({
    date: { required: true, type: 'string' },
    project: { required: true, type: 'number' },
    type: { required: true, enum: ['点工', '包工'] },
  });

  const statisticsSchema = validate({
    project_id: { required: true, type: 'number' },
    type: { required: true, enum: ['month', 'lastMonth', 'year', 'custom'] },
  });

  const checkUpdateSchema = validate({
    version: { required: true, type: 'string' },
    platform: { required: true, type: 'string' },
  });

  router.get('/', controller.home.index);
  router.post('/api/check-update', checkUpdateSchema, controller.home.checkUpdate);
  router.post('/upload', jwt, controller.upload.upload);

  // ========== 管理后台 ==========
  router.get('/admin', controller.admin.page);
  router.post('/api/admin/login', controller.admin.login);
  router.put('/api/admin/password', jwt, controller.admin.changePassword);
  router.get('/api/admin/dashboard', jwt, controller.admin.dashboard);
  router.get('/api/admin/versions', jwt, controller.admin.listVersions);
  router.post('/api/admin/versions', jwt, controller.admin.createVersion);
  router.put('/api/admin/versions/:id', jwt, controller.admin.updateVersion);
  router.delete('/api/admin/versions/:id', jwt, controller.admin.deleteVersion);

  // ========== 个人记账模块 ==========
  // 账户
  router.post('/api/personal/accounts/init', jwt, controller.personalAccount.init);
  router.post('/api/personal/accounts', jwt, controller.personalAccount.create);
  router.get('/api/personal/accounts', jwt, controller.personalAccount.index);
  router.get('/api/personal/accounts/:id', jwt, controller.personalAccount.show);
  router.put('/api/personal/accounts/:id', jwt, controller.personalAccount.update);
  router.delete('/api/personal/accounts/:id', jwt, controller.personalAccount.destroy);

  // 分类
  router.post('/api/personal/categories/init', jwt, controller.personalCategory.init);
  router.post('/api/personal/categories/reset', jwt, controller.personalCategory.reset);
  router.get('/api/personal/categories', jwt, controller.personalCategory.index);
  router.post('/api/personal/categories', jwt, controller.personalCategory.create);
  router.put('/api/personal/categories/:id', jwt, controller.personalCategory.update);
  router.delete('/api/personal/categories/:id', jwt, controller.personalCategory.destroy);

  // 交易
  router.get('/api/personal/transactions/recent', jwt, controller.personalTransaction.recentDays);
  router.post('/api/personal/transactions', jwt, controller.personalTransaction.create);
  router.get('/api/personal/transactions', jwt, controller.personalTransaction.index);
  router.get('/api/personal/transactions/:id', jwt, controller.personalTransaction.show);
  router.put('/api/personal/transactions/:id', jwt, controller.personalTransaction.update);
  router.delete('/api/personal/transactions/:id', jwt, controller.personalTransaction.destroy);
  router.get('/api/personal/statistics', jwt, controller.personalTransaction.statistics);
  router.get('/api/personal/statistics/report', jwt, controller.personalTransaction.report);
  router.get('/api/personal/statistics/user-stats', jwt, controller.personalTransaction.userStats);

  // AI智能记账
  router.post('/api/personal/ai/stream', jwt, controller.ai.stream);
  router.post('/api/personal/ai/chat', jwt, controller.ai.chat);
  router.post('/api/personal/ai/confirm', jwt, controller.ai.confirm);
  router.get('/api/personal/ai/history', jwt, controller.ai.history);
  router.delete('/api/personal/ai/history', jwt, controller.ai.clearHistory);
  router.post('/api/personal/ai/discard', jwt, controller.ai.discard);

  // 用户
  router.post('/api/user/register', registerSchema, controller.user.register);
  router.post('/api/user/login', loginSchema, controller.user.login);
  router.get('/api/user/info', jwt, controller.user.info);
  router.put('/api/user/update', jwt, controller.user.update);
  router.put('/api/user/mode', jwt, controller.user.updateMode);
  router.put('/api/user/password', jwt, passwordSchema, controller.user.updatePassword);

  // 项目
  router.post('/api/projects', jwt, projectSchema, controller.project.create);
  router.get('/api/projects', jwt, controller.project.index);
  router.get('/api/projects/:id', jwt, controller.project.show);
  router.put('/api/projects/:id', jwt, controller.project.update);
  router.delete('/api/projects/:id', jwt, controller.project.destroy);

  // 记录
  router.post('/api/records', jwt, recordSchema, controller.record.create);
  router.get('/api/records', jwt, controller.record.index);
  router.get('/api/records/:id', jwt, controller.record.show);
  router.put('/api/records/:id', jwt, controller.record.update);
  router.delete('/api/records/:id', jwt, controller.record.destroy);
  router.get('/api/projects/:project_id/records', jwt, controller.record.getProjectRecords);
  router.post('/api/statistics', jwt, statisticsSchema, controller.record.getStatistics);
  router.post('/api/statistics/multi', jwt, controller.record.getMultiStatistics);
  router.get('/api/user/work-stats', jwt, controller.record.getUserWorkStats);
};
