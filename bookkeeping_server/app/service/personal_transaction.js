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
    const { page = 1, pageSize = 20, year, month, type, account_id, keyword } = query;
    const where = { user_id: userId };
    const Op = this.app.Sequelize.Op;

    if (year && month) {
      const mm = String(month).padStart(2, '0');
      where.date = { [Op.like]: `${year}-${mm}%` };
    }
    if (type) where.type = type;
    if (account_id) where.account_id = parseInt(account_id);

    // 关联分类表
    const include = [{
      model: this.ctx.model.PersonalCategory,
      as: 'categoryInfo',
      attributes: ['id', 'name', 'icon', 'color'],
      required: false,
    }];

    // 多字段模糊搜索：备注 + 分类名称 + 金额
    if (keyword) {
      const likeVal = `%${keyword}%`;
      where[Op.or] = [
        { remark: { [Op.like]: likeVal } },
        { '$categoryInfo.name$': { [Op.like]: likeVal } },
        this.app.Sequelize.where(
          this.app.Sequelize.cast(this.app.Sequelize.col('personal_transaction.amount'), 'CHAR'),
          { [Op.like]: likeVal }
        ),
      ];
    }

    const { count, rows } = await this.ctx.model.PersonalTransaction.findAndCountAll({
      where,
      include,
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize),
      order: [['date', 'DESC'], ['created_at', 'DESC']],
      subQuery: false,
    });

    const list = rows.map(r => {
      const json = r.toJSON();
      const cat = json.categoryInfo;
      json.category = cat ? { name: cat.name, icon: cat.icon, color: cat.color } : null;
      delete json.categoryInfo;
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

  // 报表统计（周报/月报/年报）
  async getReportStats(type, date, flowType, userId) {
    const Op = this.app.Sequelize.Op;
    const fn = this.app.Sequelize.fn;
    const col = this.app.Sequelize.col;
    const d = new Date(date);

    let startDate, endDate, prevStart, prevEnd, trendData = [];

    if (type === 'week') {
      const day = d.getDay() || 7;
      startDate = new Date(d); startDate.setDate(d.getDate() - day + 1);
      endDate = new Date(startDate); endDate.setDate(startDate.getDate() + 6);
      prevStart = new Date(startDate); prevStart.setDate(prevStart.getDate() - 7);
      prevEnd = new Date(startDate); prevEnd.setDate(prevEnd.getDate() - 1);
    } else if (type === 'month') {
      startDate = new Date(d.getFullYear(), d.getMonth(), 1);
      endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      prevStart = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      prevEnd = new Date(d.getFullYear(), d.getMonth(), 0);
    } else {
      startDate = new Date(d.getFullYear(), 0, 1);
      endDate = new Date(d.getFullYear(), 11, 31);
      prevStart = new Date(d.getFullYear() - 1, 0, 1);
      prevEnd = new Date(d.getFullYear() - 1, 11, 31);
    }

    const fmt = dt => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    const startStr = fmt(startDate), endStr = fmt(endDate);
    const prevStartStr = fmt(prevStart), prevEndStr = fmt(prevEnd);

    const baseWhere = { user_id: userId, type: flowType };

    // 当前周期
    const currentRows = await this.ctx.model.PersonalTransaction.findAll({
      where: { ...baseWhere, date: { [Op.between]: [startStr, endStr] } },
    });
    let totalAmount = 0;
    const categoryMap = new Map();
    const dailyMap = new Map();
    for (const tx of currentRows) {
      const amt = Number(tx.amount);
      totalAmount += amt;
      categoryMap.set(tx.category_id, (categoryMap.get(tx.category_id) || 0) + amt);
      dailyMap.set(tx.date, (dailyMap.get(tx.date) || 0) + amt);
    }

    // 上一周期
    const prevRows = await this.ctx.model.PersonalTransaction.findAll({
      where: { ...baseWhere, date: { [Op.between]: [prevStartStr, prevEndStr] } },
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true,
    });
    const prevTotal = Number(prevRows[0]?.total) || 0;

    // 天数计算
    const dayCount = Math.round((endDate - startDate) / 86400000) + 1;
    const dailyAvg = dayCount > 0 ? totalAmount / dayCount : 0;

    // 收支结余：查当前周期内另一类型的总额
    const otherType = flowType === 'expense' ? 'income' : 'expense';
    const otherRows = await this.ctx.model.PersonalTransaction.findAll({
      where: { user_id: userId, type: otherType, date: { [Op.between]: [startStr, endStr] } },
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true,
    });
    const otherTotal = Number(otherRows[0]?.total) || 0;
    const balance = (flowType === 'expense') ? (otherTotal - totalAmount) : (totalAmount - otherTotal);

    // 趋势数据（最近6个周期 + 当前）
    for (let i = 6; i >= 0; i--) {
      let tStart, tEnd, label;
      if (type === 'week') {
        tStart = new Date(startDate); tStart.setDate(tStart.getDate() - i * 7);
        tEnd = new Date(tStart); tEnd.setDate(tEnd.getDate() + 6);
        label = i === 0 ? '本周' : `${i}周前`;
      } else if (type === 'month') {
        tStart = new Date(d.getFullYear(), d.getMonth() - i, 1);
        tEnd = new Date(d.getFullYear(), d.getMonth() - i + 1, 0);
        label = i === 0 ? '本月' : `${tStart.getMonth() + 1}月`;
      } else {
        tStart = new Date(d.getFullYear() - i, 0, 1);
        tEnd = new Date(d.getFullYear() - i, 11, 31);
        label = `${tStart.getFullYear()}`;
      }
      const tRows = await this.ctx.model.PersonalTransaction.findAll({
        where: { ...baseWhere, date: { [Op.between]: [fmt(tStart), fmt(tEnd)] } },
        attributes: [[fn('SUM', col('amount')), 'total']],
        raw: true,
      });
      trendData.push({ label, amount: Number(Number(tRows[0]?.total || 0).toFixed(2)), start: fmt(tStart), end: fmt(tEnd) });
    }

    // 分类构成
    const categoryIds = [...categoryMap.keys()].filter(Boolean);
    const categories = categoryIds.length > 0
      ? await this.ctx.model.PersonalCategory.findAll({ where: { id: categoryIds }, attributes: ['id', 'name', 'icon', 'color'], raw: true })
      : [];
    const catInfo = new Map(categories.map(c => [c.id, c]));
    const categoryStats = Array.from(categoryMap.entries()).map(([cid, amt]) => {
      const cat = catInfo.get(cid);
      return { category_id: cid, name: cat?.name || '未知', icon: cat?.icon, color: cat?.color, amount: Number(amt.toFixed(2)), percent: totalAmount > 0 ? Number((amt / totalAmount * 100).toFixed(1)) : 0 };
    }).sort((a, b) => b.amount - a.amount);

    return {
      total: Number(totalAmount.toFixed(2)),
      daily_avg: Number(dailyAvg.toFixed(2)),
      prev_total: Number(prevTotal.toFixed(2)),
      balance: Number(balance.toFixed(2)),
      start_date: startStr,
      end_date: endStr,
      trend: trendData,
      categories: categoryStats,
    };
  }

  // 月度统计
  async recentDays(days, userId) {
    const Op = this.app.Sequelize.Op;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    const startStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;

    const rows = await this.ctx.model.PersonalTransaction.findAll({
      where: {
        user_id: userId,
        date: { [Op.gte]: startStr },
      },
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });

    const categoryIds = [...new Set(rows.map(r => r.category_id).filter(Boolean))];
    const categories = categoryIds.length > 0
      ? await this.ctx.model.PersonalCategory.findAll({
        where: { id: categoryIds },
        attributes: ['id', 'name', 'icon', 'color'],
      })
      : [];
    const catMap = new Map(categories.map(c => [c.id, c]));

    return rows.map(r => {
      const json = r.toJSON();
      const cat = catMap.get(json.category_id);
      json.category = cat ? { name: cat.name, icon: cat.icon, color: cat.color } : null;
      return json;
    });
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
  // 用户个人统计（我的页面）
  async getUserStats(userId) {
    const Op = this.app.Sequelize.Op;
    const fn = this.app.Sequelize.fn;
    const col = this.app.Sequelize.col;

    // 总支出/总收入
    const totals = await this.ctx.model.PersonalTransaction.findAll({
      where: { user_id: userId, type: { [Op.in]: ['expense', 'income'] } },
      attributes: ['type', [fn('SUM', col('amount')), 'total']],
      group: ['type'],
      raw: true,
    });
    let totalExpense = 0, totalIncome = 0;
    for (const row of totals) {
      if (row.type === 'expense') totalExpense = Number(row.total) || 0;
      if (row.type === 'income') totalIncome = Number(row.total) || 0;
    }

    // 记账天数（去重日期）
    const days = await this.ctx.model.PersonalTransaction.findAll({
      where: { user_id: userId },
      attributes: [[fn('DISTINCT', col('date')), 'date']],
      raw: true,
    });
    const dateSet = new Set(days.map(d => d.date).filter(Boolean));
    const totalRecordDays = dateSet.length || dateSet.size;

    // 连续记账天数
    const sortedDates = [...dateSet].sort();
    let currentConsecutive = 0, maxConsecutive = 0;
    if (sortedDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // 从今天往前数连续天数
      let checkDate = new Date(today);
      currentConsecutive = 0;
      while (true) {
        const ds = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (dateSet.has(ds)) {
          currentConsecutive++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      // 最大连续天数
      let streak = 1;
      maxConsecutive = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
          if (streak > maxConsecutive) maxConsecutive = streak;
        } else {
          streak = 1;
        }
      }
    }

    return {
      total_record_days: totalRecordDays,
      current_consecutive_days: currentConsecutive,
      max_consecutive_days: maxConsecutive,
      total_expense: Number(totalExpense.toFixed(2)),
      total_income: Number(totalIncome.toFixed(2)),
    };
  }
}

module.exports = PersonalTransactionService;
