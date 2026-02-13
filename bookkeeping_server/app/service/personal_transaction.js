const { Service } = require('egg');

class PersonalTransactionService extends Service {
  async create(data, userId) {
    const { type, amount, account_id, target_account_id } = data;
    const numAmount = Number(amount);

    const transaction = await this.ctx.model.PersonalTransaction.create({
      ...data, user_id: userId,
    });

    // 联动账户余额
    if (type === 'expense') {
      await this.ctx.service.personalAccount.adjustBalance(account_id, userId, -numAmount);
    } else if (type === 'income') {
      await this.ctx.service.personalAccount.adjustBalance(account_id, userId, numAmount);
    } else if (type === 'transfer') {
      await this.ctx.service.personalAccount.adjustBalance(account_id, userId, -numAmount);
      if (target_account_id) {
        await this.ctx.service.personalAccount.adjustBalance(target_account_id, userId, numAmount);
      }
    }

    return transaction;
  }

  async list(query, userId) {
    const { page = 1, pageSize = 20, year, month, type, account_id } = query;
    const where = { user_id: userId };
    const Op = this.app.Sequelize.Op;

    if (year && month) {
      const mm = String(month).padStart(2, '0');
      where.date = { [Op.like]: `${year}-${mm}%` };
    }
    if (type) where.type = type;
    if (account_id) where.account_id = parseInt(account_id);

    const { count, rows } = await this.ctx.model.PersonalTransaction.findAndCountAll({
      where,
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize),
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });

    // 关联分类信息
    const categoryIds = [...new Set(rows.map(r => r.category_id).filter(Boolean))];
    const categories = categoryIds.length > 0
      ? await this.ctx.model.PersonalCategory.findAll({
        where: { id: categoryIds },
        attributes: ['id', 'name', 'icon', 'color'],
      })
      : [];
    const catMap = new Map(categories.map(c => [c.id, c]));

    const list = rows.map(r => {
      const json = r.toJSON();
      const cat = catMap.get(json.category_id);
      json.category = cat ? { name: cat.name, icon: cat.icon, color: cat.color } : null;
      return json;
    });

    return { list, total: count, page: parseInt(page), pageSize: parseInt(pageSize) };
  }

  async findOne(id, userId) {
    const tx = await this.ctx.model.PersonalTransaction.findOne({
      where: { id, user_id: userId },
    });
    if (!tx) this.ctx.throw(404, '交易记录不存在');
    return tx;
  }

  async update(id, data, userId) {
    const oldTx = await this.findOne(id, userId);

    // 回滚旧余额
    await this._reverseBalance(oldTx, userId);

    await oldTx.update(data);

    // 应用新余额
    const updatedTx = await this.findOne(id, userId);
    await this._applyBalance(updatedTx, userId);

    return updatedTx;
  }

  async destroy(id, userId) {
    const tx = await this.findOne(id, userId);
    // 回滚余额
    await this._reverseBalance(tx, userId);
    await tx.destroy();
  }

  // 回滚交易对余额的影响
  async _reverseBalance(tx, userId) {
    const amount = Number(tx.amount);
    if (tx.type === 'expense') {
      await this.ctx.service.personalAccount.adjustBalance(tx.account_id, userId, amount);
    } else if (tx.type === 'income') {
      await this.ctx.service.personalAccount.adjustBalance(tx.account_id, userId, -amount);
    } else if (tx.type === 'transfer') {
      await this.ctx.service.personalAccount.adjustBalance(tx.account_id, userId, amount);
      if (tx.target_account_id) {
        await this.ctx.service.personalAccount.adjustBalance(tx.target_account_id, userId, -amount);
      }
    }
  }

  // 应用交易对余额的影响
  async _applyBalance(tx, userId) {
    const amount = Number(tx.amount);
    if (tx.type === 'expense') {
      await this.ctx.service.personalAccount.adjustBalance(tx.account_id, userId, -amount);
    } else if (tx.type === 'income') {
      await this.ctx.service.personalAccount.adjustBalance(tx.account_id, userId, amount);
    } else if (tx.type === 'transfer') {
      await this.ctx.service.personalAccount.adjustBalance(tx.account_id, userId, -amount);
      if (tx.target_account_id) {
        await this.ctx.service.personalAccount.adjustBalance(tx.target_account_id, userId, amount);
      }
    }
  }

  // 月度统计
  async getMonthlyStats(year, month, userId) {
    const Op = this.app.Sequelize.Op;
    const mm = String(month).padStart(2, '0');
    const datePrefix = `${year}-${mm}`;

    const transactions = await this.ctx.model.PersonalTransaction.findAll({
      where: {
        user_id: userId,
        date: { [Op.like]: `${datePrefix}%` },
        type: { [Op.in]: ['expense', 'income'] },
      },
      order: [['date', 'ASC']],
    });

    let totalExpense = 0, totalIncome = 0;
    const dailyMap = new Map();
    const categoryExpenseMap = new Map();
    const categoryIncomeMap = new Map();

    for (const tx of transactions) {
      const amount = Number(tx.amount);
      if (tx.type === 'expense') {
        totalExpense += amount;
        categoryExpenseMap.set(tx.category_id, (categoryExpenseMap.get(tx.category_id) || 0) + amount);
      } else {
        totalIncome += amount;
        categoryIncomeMap.set(tx.category_id, (categoryIncomeMap.get(tx.category_id) || 0) + amount);
      }

      const day = tx.date;
      if (!dailyMap.has(day)) dailyMap.set(day, { date: day, expense: 0, income: 0 });
      const d = dailyMap.get(day);
      if (tx.type === 'expense') d.expense += amount;
      else d.income += amount;
    }

    // 查分类名称
    const allCategoryIds = [...new Set([...categoryExpenseMap.keys(), ...categoryIncomeMap.keys()])];
    const categories = allCategoryIds.length > 0
      ? await this.ctx.model.PersonalCategory.findAll({
        where: { id: allCategoryIds },
        attributes: ['id', 'name', 'icon', 'color', 'parent_id'],
      })
      : [];
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const buildCategoryStats = (map) => {
      return Array.from(map.entries()).map(([cid, amount]) => {
        const cat = categoryMap.get(cid);
        return { category_id: cid, name: cat?.name || '未知', icon: cat?.icon, color: cat?.color, amount: Number(amount.toFixed(2)) };
      }).sort((a, b) => b.amount - a.amount);
    };

    return {
      total_expense: Number(totalExpense.toFixed(2)),
      total_income: Number(totalIncome.toFixed(2)),
      balance: Number((totalIncome - totalExpense).toFixed(2)),
      expense_categories: buildCategoryStats(categoryExpenseMap),
      income_categories: buildCategoryStats(categoryIncomeMap),
      daily: Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
    };
  }
}

module.exports = PersonalTransactionService;
