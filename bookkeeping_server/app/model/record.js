module.exports = app => {
  const { STRING, INTEGER, BOOLEAN, DATE, DECIMAL, TEXT } = app.Sequelize;

  const Record = app.model.define('record', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: INTEGER, allowNull: false, comment: '用户ID' },
    // 基础字段
    date: { type: STRING(10), allowNull: false, comment: '日期 YYYY-MM-DD' },
    project: { type: INTEGER, allowNull: false, comment: '项目ID' },
    type: {
      type: STRING(10),
      allowNull: false,
      comment: '工作类型：点工/包工',
      validate: {
        isIn: [[ '点工', '包工' ]],
      },
    },
    remark: { type: STRING(500), comment: '备注信息' },
    image_list: {
      type: TEXT,
      comment: '图片URL数组，JSON字符串',
      get() {
        const val = this.getDataValue('image_list');
        return val ? JSON.parse(val) : [];
      },
      set(val) {
        this.setDataValue('image_list', JSON.stringify(val || []));
      },
    },
    // 点工字段
    work_option: {
      type: INTEGER,
      comment: '工作选项：0-1个工，1-选工天，2-休息',
      validate: {
        isIn: [[ 0, 1, 2 ]],
      },
    },
    work_days: {
      type: DECIMAL(10, 1),
      defaultValue: 0,
      comment: '工作天数',
    },
    has_overtime: {
      type: BOOLEAN,
      defaultValue: false,
      comment: '是否有加班',
    },
    overtime_amount: {
      type: DECIMAL(10, 2),
      defaultValue: 0,
      comment: '加班费用',
    },
    point_income: {
      type: DECIMAL(10, 2),
      defaultValue: 0,
      comment: '点工金额',
    },
    // 包工字段
    contract_option: {
      type: INTEGER,
      comment: '包工选项：0-砌墙，1-贴砖，2-刷漆，3-其他',
      validate: {
        isIn: [[ 0, 1, 2, 3 ]],
      },
    },
    contract_content: {
      type: STRING(200),
      comment: '其他包工内容',
    },
    amount: {
      type: DECIMAL(10, 2),
      defaultValue: 0,
      comment: '包工金额',
    },
    // 时间戳
    created_at: { type: DATE },
    updated_at: { type: DATE },
  }, {
    tableName: 'records',
    timestamps: true,
    underscored: true,
  });

  Record.sync();

  return Record;
};
