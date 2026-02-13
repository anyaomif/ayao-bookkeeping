/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.jwt();

  router.get('/', controller.home.index);
  router.post('/api/check-update', controller.home.checkUpdate);
  router.post('/upload', controller.upload.upload);

  // 用户认证相关路由
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/info', jwt, controller.user.info);
  router.put('/api/user/update', jwt, controller.user.update);
  router.put('/api/user/password', jwt, controller.user.updatePassword);

  // 项目相关路由
  router.post('/api/projects', jwt, controller.project.create);
  router.get('/api/projects', jwt, controller.project.index);
  router.get('/api/projects/:id', jwt, controller.project.show);
  router.put('/api/projects/:id', jwt, controller.project.update);
  router.delete('/api/projects/:id', jwt, controller.project.destroy);

  // 记工记录相关路由
  router.post('/api/records', jwt, controller.record.create);
  router.get('/api/records', jwt, controller.record.index);
  router.get('/api/records/:id', jwt, controller.record.show);
  router.put('/api/records/:id', jwt, controller.record.update);
  router.delete('/api/records/:id', jwt, controller.record.destroy);
  router.get('/api/projects/:project_id/records', jwt, controller.record.getProjectRecords);
  router.post('/api/statistics', jwt, controller.record.getStatistics);
  router.get('/api/user/work-stats', jwt, controller.record.getUserWorkStats);
};
