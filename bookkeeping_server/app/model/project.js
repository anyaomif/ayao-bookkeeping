module.exports = app => {
  const { STRING, INTEGER, DATE, DECIMAL, TEXT } = app.Sequelize;

  const Project = app.model.define('project', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: INTEGER, allowNull: false, comment: '创建者ID' },
    name: { type: STRING(100), allowNull: false, comment: '项目名称' },
    start_date: {
      type: DATE,
      allowNull: false,
      comment: '项目开始时间',
      get() {
        const date = this.getDataValue('start_date');
        return date ? date.toISOString().split('T')[0] : null;
      },
    },
    end_date: {
      type: DATE,
      allowNull: true,
      comment: '项目结束时间',
      get() {
        const date = this.getDataValue('end_date');
        return date ? date.toISOString().split('T')[0] : null;
      },
    },
    daily_wage: { type: DECIMAL(10, 2), allowNull: false, comment: '点工日薪' },
    status: { type: INTEGER, defaultValue: 1, comment: '项目状态：1进行中，2已完成，3已终止' },
    location: { type: STRING(200), comment: '项目地点' },
    description: { type: TEXT, comment: '项目描述' },
    contact_person: { type: STRING(50), comment: '项目联系人' },
    contact_phone: { type: STRING(20), comment: '联系人电话' },
    created_at: { type: DATE },
    updated_at: { type: DATE },
  }, {
    tableName: 'projects',
    timestamps: true,
    underscored: true,
  });

  Project.sync();

  return Project;
};
