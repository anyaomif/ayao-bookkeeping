const { Service } = require('egg');

class RecordService extends Service {
  // 构建记录数据，处理点工/包工字段默认值
  _buildRecordData(data, userId) {
    const recordData = {
      ...data,
      user_id: userId,
      image_list: data.image_list || [],
    };

    if (data.type === '点工') {
      recordData.work_days = data.work_days || 0;
      recordData.overtime_amount = data.has_overtime ? (data.overtime_amount || 0) : 0;
      recordData.point_income = data.work_option !== 2 ? data.point_income || 0 : 0;
      recordData.contract_option = null;
      recordData.contract_content = null;
      recordData.amount = null;
    }

    if (data.type === '包工') {
      recordData.amount = data.amount || 0;
      recordData.point_income = null;
      recordData.work_option = null;
      recordData.work_days = null;
      recordData.has_overtime = false;
      recordData.overtime_amount = null;
    }

    return recordData;
  }

  async create(data, userId) {
    return await this.ctx.model.Record.create(this._buildRecordData(data, userId));
  }

  async list(query, userId) {
    const { page = 1, pageSize = 10, date, project, type } = query;
    const where = { user_id: userId };
    if (date) where.date = date;
    if (project) where.project = parseInt(project);
    if (type) where.type = type;

    const { count, rows } = await this.ctx.model.Record.findAndCountAll({
      where,
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize),
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });

    return { list: rows, total: count, page: parseInt(page), pageSize: parseInt(pageSize) };
  }

  async findOne(id, userId) {
    const record = await this.ctx.model.Record.findOne({
      where: { id, user_id: userId },
    });
    if (!record) this.ctx.throw(404, '记录不存在');
    return record;
  }

  async update(id, data, userId) {
    const record = await this.findOne(id, userId);
    const updateData = { ...data, image_list: data.image_list || [] };

    if (data.type === '点工') {
      updateData.work_days = data.work_days || 0;
      updateData.overtime_amount = data.has_overtime ? (data.overtime_amount || 0) : 0;
      updateData.contract_option = null;
      updateData.contract_content = null;
      updateData.amount = null;
    }

    if (data.type === '包工') {
      updateData.amount = data.amount || 0;
      updateData.work_option = null;
      updateData.work_days = null;
      updateData.has_overtime = false;
      updateData.overtime_amount = null;
    }

    await record.update(updateData);
    return await this.findOne(id, userId);
  }

  async destroy(id, userId) {
    const record = await this.findOne(id, userId);
    await record.destroy();
  }

  async getProjectRecords(projectId, userId) {
    const project = await this.ctx.model.Project.findOne({
      where: { id: projectId, user_id: userId },
    });
    if (!project) this.ctx.throw(404, '项目不存在');

    const records = await this.ctx.model.Record.findAll({
      where: { user_id: userId, project: projectId },
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });

    const statistics = { total_work_days: 0, total_amount: 0, total_overtime_amount: 0 };
    records.forEach(record => {
      if (record.type === '点工') {
        statistics.total_work_days += Number(record.work_days) || 0;
        statistics.total_overtime_amount += Number(record.overtime_amount) || 0;
      }
      if (record.type === '包工') {
        statistics.total_amount += Number(record.amount) || 0;
      }
    });

    return { list: records, total: records.length, statistics };
  }

  // 计算统计日期范围
  // 本地日期格式化，避免 toISOString 的时区偏移
  _formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  _calcDateRange(type, startDate, endDate) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    switch (type) {
      case 'month':
        return {
          start: `${year}-${String(month).padStart(2, '0')}-01`,
          end: this._formatDate(new Date(year, month, 0)),
        };
      case 'lastMonth': {
        const lm = month === 1 ? 12 : month - 1;
        const ly = month === 1 ? year - 1 : year;
        return {
          start: `${ly}-${String(lm).padStart(2, '0')}-01`,
          end: this._formatDate(new Date(ly, lm, 0)),
        };
      }
      case 'year':
        return { start: `${year}-01-01`, end: `${year}-12-31` };
      case 'custom':
        return {
          start: this._formatDate(new Date(startDate)),
          end: this._formatDate(new Date(endDate)),
        };
      default:
        return { start: startDate, end: endDate };
    }
  }

  // 计算单条记录收入
  _calcRecordIncome(record) {
    if (record.type === '点工') {
      return (Number(record.point_income) || 0) + (Number(record.overtime_amount) || 0);
    }
    return Number(record.amount) || 0;
  }

  // 汇总统计数据
  _aggregate(records) {
    let pointIncome = 0, overtimeIncome = 0, contractIncome = 0;
    let totalWorkDays = 0, overtimeCount = 0, normalWorkCount = 0, restCount = 0;
    const dailyIncomeMap = new Map();

    records.forEach(record => {
      let dayPoint = 0, dayOvertime = 0, dayContract = 0;

      if (record.type === '点工') {
        dayPoint = Number(record.point_income) || 0;
        dayOvertime = Number(record.overtime_amount) || 0;
        pointIncome += dayPoint;
        overtimeIncome += dayOvertime;
        totalWorkDays += Number(record.work_days) || 0;
        if (record.has_overtime) overtimeCount++;
        if (record.work_option === 2) restCount++;
        if (record.work_option !== 2) normalWorkCount++;
      } else {
        dayContract = Number(record.amount) || 0;
        contractIncome += dayContract;
        normalWorkCount++;
      }

      const dateKey = record.date;
      const existing = dailyIncomeMap.get(dateKey) || {
        date: dateKey, point_income: 0, overtime_income: 0, contract_income: 0, total: 0,
      };
      existing.point_income += dayPoint;
      existing.overtime_income += dayOvertime;
      existing.contract_income += dayContract;
      existing.total = existing.point_income + existing.overtime_income + existing.contract_income;
      dailyIncomeMap.set(dateKey, existing);
    });

    const totalAmount = pointIncome + overtimeIncome + contractIncome;
    return {
      pointIncome, overtimeIncome, contractIncome, totalAmount,
      totalWorkDays, overtimeCount, normalWorkCount, restCount,
      dailyIncomeMap,
    };
  }

  async getStatistics(body, userId) {
    const { project_id, start_date, end_date, type } = body;

    const project = await this.ctx.model.Project.findOne({
      where: { id: project_id, user_id: userId },
    });
    if (!project) this.ctx.throw(404, '项目不存在');

    const range = this._calcDateRange(type, start_date, end_date);
    const Op = this.app.Sequelize.Op;

    // 计算上一周期范围
    const periodStart = new Date(range.start);
    const periodEnd = new Date(range.end);
    const daysDiff = Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24));
    const prevStart = new Date(periodStart);
    const prevEnd = new Date(periodEnd);
    prevStart.setDate(prevStart.getDate() - daysDiff - 1);
    prevEnd.setDate(prevEnd.getDate() - daysDiff - 1);
    const prevStartStr = this._formatDate(prevStart);
    const prevEndStr = this._formatDate(prevEnd);

    // 一次查询涵盖当前周期和上一周期
    const allRecords = await this.ctx.model.Record.findAll({
      where: {
        user_id: userId,
        project: project_id,
        date: { [Op.between]: [prevStartStr, range.end] },
      },
      order: [['date', 'ASC']],
    });

    const records = allRecords.filter(r => r.date >= range.start && r.date <= range.end);
    const prevRecords = allRecords.filter(r => r.date >= prevStartStr && r.date <= prevEndStr);

    let prevAmount = 0;
    prevRecords.forEach(r => { prevAmount += this._calcRecordIncome(r); });

    const agg = this._aggregate(records);

    let monthCompare = 0;
    if (prevAmount === 0 && agg.totalAmount === 0) monthCompare = 0;
    else if (prevAmount === 0) monthCompare = 100;
    else monthCompare = ((agg.totalAmount - prevAmount) / prevAmount * 100).toFixed(2);

    const averageDailyWage = agg.normalWorkCount === 0
      ? 0 : (agg.totalAmount / agg.normalWorkCount).toFixed(2);

    return {
      total_amount: Number(agg.totalAmount.toFixed(2)),
      point_income: Number(agg.pointIncome.toFixed(2)),
      overtime_income: Number(agg.overtimeIncome.toFixed(2)),
      contract_income: Number(agg.contractIncome.toFixed(2)),
      month_compare: Number(monthCompare),
      total_work_days: agg.totalWorkDays,
      overtime_count: agg.overtimeCount,
      average_daily_wage: Number(averageDailyWage),
      work_status: {
        normal_work_count: agg.normalWorkCount,
        rest_count: agg.restCount,
        overtime_count: agg.overtimeCount,
      },
      daily_income: Array.from(agg.dailyIncomeMap.values())
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }

  async getUserWorkStats(userId) {
    const { Sequelize } = this.app;
    const Op = Sequelize.Op;

    // 用 DB 聚合查询总收入和总记录数，避免全表加载到内存
    const [pointRow] = await this.ctx.model.Record.findAll({
      where: { user_id: userId, type: '点工' },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('point_income')), 'sum_point'],
        [Sequelize.fn('SUM', Sequelize.col('overtime_amount')), 'sum_overtime'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cnt'],
      ],
      raw: true,
    });
    const [contractRow] = await this.ctx.model.Record.findAll({
      where: { user_id: userId, type: '包工' },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'sum_amount'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cnt'],
      ],
      raw: true,
    });

    const totalIncome = (Number(pointRow?.sum_point) || 0)
      + (Number(pointRow?.sum_overtime) || 0)
      + (Number(contractRow?.sum_amount) || 0);
    const totalRecordDays = (Number(pointRow?.cnt) || 0) + (Number(contractRow?.cnt) || 0);

    // 连续打卡天数只需查最近 90 天的日期，避免全表
    const since = this._formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
    const recentDates = await this.ctx.model.Record.findAll({
      where: { user_id: userId, date: { [Op.gte]: since } },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('date')), 'date']],
      order: [['date', 'ASC']],
      raw: true,
    });

    const uniqueDates = recentDates.map(r => r.date).sort();
    let consecutiveDays = 0, maxConsecutiveDays = 0, lastWorkDate = null;
    uniqueDates.forEach(date => {
      const current = new Date(date);
      if (lastWorkDate) {
        const diff = Math.floor((current - lastWorkDate) / (1000 * 60 * 60 * 24));
        consecutiveDays = diff === 1 ? consecutiveDays + 1 : 1;
      } else {
        consecutiveDays = 1;
      }
      maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
      lastWorkDate = current;
    });

    return {
      total_record_days: totalRecordDays,
      total_income: Number(totalIncome.toFixed(2)),
      current_consecutive_days: consecutiveDays,
      max_consecutive_days: maxConsecutiveDays,
      average_daily_wage: totalRecordDays === 0 ? 0 : Number((totalIncome / totalRecordDays).toFixed(2)),
      last_work_date: lastWorkDate ? lastWorkDate.toISOString().split('T')[0] : null,
    };
  }
  async getMultiStatistics(body, userId) {
    const { project_ids, type, start_date, end_date } = body;
    const Op = this.app.Sequelize.Op;

    // 查询用户所有项目
    const allProjects = await this.ctx.model.Project.findAll({
      where: { user_id: userId },
      attributes: [ 'id', 'name' ],
    });
    if (!allProjects.length) return { total: { total_amount: 0, total_work_days: 0, average_daily_wage: 0 }, projects: [] };

    // 确定目标项目
    const targetProjects = (project_ids && project_ids.length)
      ? allProjects.filter(p => project_ids.includes(p.id))
      : allProjects;

    const range = this._calcDateRange(type, start_date, end_date);
    const targetIds = targetProjects.map(p => p.id);

    const records = await this.ctx.model.Record.findAll({
      where: {
        user_id: userId,
        project: { [Op.in]: targetIds },
        date: { [Op.between]: [range.start, range.end] },
      },
      order: [['date', 'ASC']],
    });

    // 按项目分组聚合
    const projectMap = new Map();
    targetProjects.forEach(p => {
      projectMap.set(p.id, {
        project_id: p.id,
        project_name: p.name,
        total_amount: 0,
        point_income: 0,
        overtime_income: 0,
        contract_income: 0,
        total_work_days: 0,
      });
    });

    records.forEach(r => {
      const item = projectMap.get(r.project);
      if (!item) return;
      if (r.type === '点工') {
        const pt = Number(r.point_income) || 0;
        const ot = Number(r.overtime_amount) || 0;
        item.point_income += pt;
        item.overtime_income += ot;
        item.total_amount += pt + ot;
        item.total_work_days += Number(r.work_days) || 0;
      } else {
        const ct = Number(r.amount) || 0;
        item.contract_income += ct;
        item.total_amount += ct;
      }
    });

    const projects = Array.from(projectMap.values())
      .map(p => ({
        ...p,
        total_amount: Number(p.total_amount.toFixed(2)),
        point_income: Number(p.point_income.toFixed(2)),
        overtime_income: Number(p.overtime_income.toFixed(2)),
        contract_income: Number(p.contract_income.toFixed(2)),
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    const totalAmount = projects.reduce((s, p) => s + p.total_amount, 0);
    const totalWorkDays = projects.reduce((s, p) => s + p.total_work_days, 0);

    // 按日期聚合所有项目的收入
    const dailyMap = new Map();
    records.forEach(r => {
      const date = r.date;
      const income = r.type === '点工'
        ? (Number(r.point_income) || 0) + (Number(r.overtime_amount) || 0)
        : (Number(r.amount) || 0);
      dailyMap.set(date, (dailyMap.get(date) || 0) + income);
    });
    const daily_income = Array.from(dailyMap.entries())
      .map(([date, total_income]) => ({ date, total_income: Number(total_income.toFixed(2)) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total: {
        total_amount: Number(totalAmount.toFixed(2)),
        total_work_days: totalWorkDays,
        average_daily_wage: totalWorkDays === 0 ? 0 : Number((totalAmount / totalWorkDays).toFixed(2)),
      },
      projects,
      daily_income,
    };
  }
}

module.exports = RecordService;

module.exports = RecordService;
