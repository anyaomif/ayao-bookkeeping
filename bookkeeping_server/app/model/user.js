module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: STRING(50), allowNull: false, unique: true },
    password: { type: STRING(500), allowNull: false },
    nickname: { type: STRING(50) },
    avatar: { type: STRING(200) },
    phone: { type: STRING(20) },
    created_at: { type: DATE },
    updated_at: { type: DATE },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  });

  // 自动同步数据库结构
  User.sync({ alter: true });

  return User;
};
