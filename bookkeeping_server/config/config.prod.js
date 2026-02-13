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

  // 配置跨域
  cors: {
    origin: [ 'http://aybk.anyaowl.cn/', 'https://aybk.anyaowl.cn/' ], // 生产环境建议配置具体域名
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    maxAge: 86400,
  },

  // 安全配置
  security: {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://aybk.anyaowl.cn/', 'https://aybk.anyaowl.cn/' ],
  },

  // 如果生产环境数据库配置不同，则在这里覆盖
  sequelize: {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'anyaobookkeeping_formal',
    username: 'anyaobookkeeping_formal',
    password: '252SNbyYaL745C5C',
    define: {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    },
    timezone: '+08:00',
  },
};
