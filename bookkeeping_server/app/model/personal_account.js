module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL } = app.Sequelize;

  const PersonalAccount = app.model.define('personal_account', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: INTEGER, allowNull: false, comment: '用户ID' },
    name: { type: STRING(50), allowNull: false, comment: '账户名称' },
    balance: { type: DECIMAL(12, 2), defaultValue: 0, comment: '账户余额' },
    icon: { type: STRING(50), defaultValue: 'wallet', comment: '图标名称' },
    color: { type: STRING(20), defaultValue: '#ff6700', comment: '颜色' },
    sort_order: { type: INTEGER, defaultValue: 0, comment: '排序' },
    created_at: { type: DATE },
    updated_at: { type: DATE },
  }, {
    tableName: 'personal_accounts',
    timestamps: true,
    underscored: true,
  });

  PersonalAccount.sync();

  return PersonalAccount;
};
