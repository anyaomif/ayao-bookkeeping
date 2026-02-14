module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const PersonalCategory = app.model.define('personal_category', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: INTEGER, allowNull: false, comment: '用户ID' },
    type: {
      type: STRING(10), allowNull: false, comment: '类型：expense/income/transfer',
      validate: { isIn: [['expense', 'income', 'transfer']] },
    },
    parent_id: { type: INTEGER, defaultValue: 0, comment: '父分类ID，0为主分类' },
    name: { type: STRING(50), allowNull: false, comment: '分类名称' },
    icon: { type: STRING(50), defaultValue: 'eat', comment: '图标名称' },
    color: { type: STRING(20), defaultValue: '#ff9f0a', comment: '颜色' },
    sort_order: { type: INTEGER, defaultValue: 0, comment: '排序' },
    is_default: { type: BOOLEAN, defaultValue: false, comment: '是否系统默认分类' },
    created_at: { type: DATE },
    updated_at: { type: DATE },
  }, {
    tableName: 'personal_categories',
    timestamps: true,
    underscored: true,
  });

  PersonalCategory.sync();

  return PersonalCategory;
};
