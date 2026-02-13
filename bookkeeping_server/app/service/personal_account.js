const { Service } = require('egg');

const DEFAULT_ACCOUNTS = [
  { name: '默认账户', icon: 'bankcard', color: '#ff6700', sort_order: 1 },
];

class PersonalAccountService extends Service {
  async initDefaults(userId) {
    const exists = await this.ctx.model.PersonalAccount.count({ where: { user_id: userId } });
    if (exists > 0) return;
    for (const acc of DEFAULT_ACCOUNTS) {
      await this.ctx.model.PersonalAccount.create({ ...acc, user_id: userId });
    }
  }

  async create(data, userId) {
    return await this.ctx.model.PersonalAccount.create({ ...data, user_id: userId });
  }

  async list(userId) {
    return await this.ctx.model.PersonalAccount.findAll({
      where: { user_id: userId },
      order: [['sort_order', 'ASC'], ['created_at', 'ASC']],
    });
  }

  async findOne(id, userId) {
    const account = await this.ctx.model.PersonalAccount.findOne({
      where: { id, user_id: userId },
    });
    if (!account) this.ctx.throw(404, '账户不存在');
    return account;
  }

  async update(id, data, userId) {
    const account = await this.findOne(id, userId);
    await account.update(data);
    return account;
  }

  async destroy(id, userId) {
    const account = await this.findOne(id, userId);
    // 检查是否有关联交易
    const count = await this.ctx.model.PersonalTransaction.count({
      where: { user_id: userId, account_id: id },
    });
    if (count > 0) this.ctx.throw(400, '该账户下有交易记录，无法删除');
    await account.destroy();
  }

  // 调整余额（内部方法，交易创建/删除时调用）
  async adjustBalance(id, userId, amount) {
    const account = await this.findOne(id, userId);
    await account.update({ balance: Number(account.balance) + amount });
  }
}

module.exports = PersonalAccountService;
