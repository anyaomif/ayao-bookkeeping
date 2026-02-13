module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL } = app.Sequelize;

  const PersonalTransaction = app.model.define('personal_transaction', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: INTEGER, allowNull: false, comment: '用户ID' },
    type: {
      type: STRING(10), allowNull: false, comment: '类型：expense/income/transfer',
      validate: { isIn: [['expense', 'income', 'transfer']] },
    },
    amount: { type: DECIMAL(12, 2), allowNull: false, comment: '金额' },
    category_id: { type: INTEGER, allowNull: true, comment: '分类ID' },
    account_id: { type: INTEGER, allowNull: false, comment: '账户ID' },
    target_account_id: { type: INTEGER, allowNull: true, comment: '转账目标账户ID' },
    date: { type: STRING(10), allowNull: false, comment: '日期 YYYY-MM-DD' },
    time: { type: STRING(5), allowNull: true, comment: '时间 HH:mm' },
    remark: { type: STRING(200), allowNull: true, comment: '备注' },
    created_at: { type: DATE },
    updated_at: { type: DATE },
  }, {
    tableName: 'personal_transactions',
    timestamps: true,
    underscored: true,
  });

  PersonalTransaction.sync({ alter: true });

  return PersonalTransaction;
};
