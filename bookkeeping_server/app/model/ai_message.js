module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const AiMessage = app.model.define('ai_message', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: INTEGER, allowNull: false },
    role: { type: STRING(10), allowNull: false, validate: { isIn: [['user', 'ai']] } },
    content: { type: TEXT, allowNull: false, defaultValue: '' },
    extra: { type: TEXT, allowNull: true, defaultValue: null,
      get() {
        const v = this.getDataValue('extra');
        if (!v) return null;
        try { return JSON.parse(v); } catch (e) { return null; }
      },
      set(val) {
        this.setDataValue('extra', val ? JSON.stringify(val) : null);
      },
    },
    created_at: { type: DATE },
    updated_at: { type: DATE },
  }, {
    tableName: 'ai_messages',
    timestamps: true,
    underscored: true,
  });

  AiMessage.sync();

  return AiMessage;
};
