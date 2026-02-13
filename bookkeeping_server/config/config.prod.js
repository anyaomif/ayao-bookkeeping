/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * 生产环境特定配置
 */
module.exports = {
  // 配置服务运行端口
  cluster: {
    listen: {
      port: 7002,
      hostname: '0.0.0.0',
    },
  },

  // 配置跨域（生产环境限定域名）
  cors: {
    origin(ctx) {
      const allowOrigins = [
        'http://aybk.anyaowl.cn',
        'https://aybk.anyaowl.cn',
      ];
      const requestOrigin = ctx.get('origin');
      if (allowOrigins.includes(requestOrigin)) {
        return requestOrigin;
      }
      return '';
    },
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    maxAge: 86400,
  },

  // 安全配置
  security: {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://aybk.anyaowl.cn', 'https://aybk.anyaowl.cn' ],
  },

  // 生产环境数据库（从环境变量读取）
  sequelize: {
    dialect: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'aybk_formal',
    username: process.env.DB_USER || 'aybk_formal',
    password: process.env.DB_PASSWORD || '',
    define: {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    },
    timezone: '+08:00',
  },
};
