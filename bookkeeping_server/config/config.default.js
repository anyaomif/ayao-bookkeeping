/* eslint valid-jsdoc: "off" */

'use strict';

require('dotenv').config();

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1707447627112_7935';

  // errorHandler 必须在最外层捕获所有异常
  config.middleware = ['errorHandler'];

  // 配置集群
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0', // 设置hostname为0.0.0.0以允许所有IP访问
    },
  };

  // 配置文件上传
  config.multipart = {
    mode: 'file',
    fileSize: '50mb',
    whitelist: [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
    ],
  };

  // 配置 JWT（从环境变量读取）
  config.jwt = {
    secret: process.env.JWT_SECRET || 'anyaobookkeeping-jwt-secret-dev',
  };

  // 配置数据库（从环境变量读取）
  config.sequelize = {
    dialect: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'anyaobookkeeping',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    define: {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    },
    timezone: '+08:00',
  };

  // 配置CORS
  config.cors = {
    origin(ctx) {
      return ctx.get('origin') || '*';
    },
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    maxAge: 86400,
  };

  // 配置安全策略
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ], // 允许所有域名访问
  };

  // 配置网络
  config.ipv6 = false;

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
