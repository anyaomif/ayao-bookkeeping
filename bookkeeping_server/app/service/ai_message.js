const { Service } = require('egg');

class AiMessageService extends Service {
  async save(userId, role, content, extra = null) {
    return this.ctx.model.AiMessage.create({
      user_id: userId, role, content, extra,
    });
  }

  async getHistory(userId, page = 1, pageSize = 50) {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await this.ctx.model.AiMessage.findAndCountAll({
      where: { user_id: userId },
      order: [['id', 'ASC']],
      offset,
      limit: pageSize,
    });
    return { total: count, list: rows };
  }

  // 更新指定 AI 消息的 extra（用于 confirm/discard）
  async updateExtra(id, userId, extraPatch) {
    const msg = await this.ctx.model.AiMessage.findOne({ where: { id, user_id: userId } });
    if (!msg) return null;
    msg.extra = { ...(msg.extra || {}), ...extraPatch };
    await msg.save();
    return msg;
  }

  async clear(userId) {
    return this.ctx.model.AiMessage.destroy({ where: { user_id: userId } });
  }
}

module.exports = AiMessageService;
