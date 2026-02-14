module.exports = app => {
  const { STRING, INTEGER, BOOLEAN, DATE, TEXT, DECIMAL } = app.Sequelize;

  const AppVersion = app.model.define('app_version', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    platform: {
      type: STRING(20),
      allowNull: false,
      comment: '平台类型：android/ios',
      validate: {
        isIn: [[ 'android', 'ios' ]],
      },
    },
    version: {
      type: STRING(20),
      allowNull: false,
      comment: '版本号',
    },
    min_version: {
      type: STRING(20),
      allowNull: false,
      comment: '最低要求版本',
    },
    force_update: {
      type: BOOLEAN,
      defaultValue: false,
      comment: '是否强制更新',
    },
    download_url: {
      type: STRING(500),
      allowNull: false,
      comment: '下载地址',
    },
    package_size: {
      type: DECIMAL(10, 2),
      allowNull: false,
      comment: '安装包大小（MB）',
    },
    change_log: {
      type: TEXT,
      comment: '更新日志',
    },
    publish_time: {
      type: DATE,
      allowNull: false,
      comment: '发布时间',
    },
    created_at: DATE,
    updated_at: DATE,
  }, {
    tableName: 'app_versions',
    timestamps: true,
    underscored: true,
  });

  AppVersion.sync();

  return AppVersion;
};
