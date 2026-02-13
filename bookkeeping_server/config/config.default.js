/* eslint valid-jsdoc: "off" */

'use strict';

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

  // add your middleware config here
  config.middleware = [];

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

  // 配置 JWT
  config.jwt = {
    secret: 'anyaobookkeeping-jwt-secret',
  };

  // 配置数据库
  config.sequelize = {
    dialect: 'mysql',
    host: '47.108.69.33',
    port: 3306,
    database: 'anyaobookkeeping',
    username: 'anyaobookkeeping',
    password: 'zZ8cSShYKzrjBYNz',
    define: {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    },
    timezone: '+08:00',
  };

  // 配置CORS
  config.cors = {
    origin: '*', // 允许所有域名访问
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
