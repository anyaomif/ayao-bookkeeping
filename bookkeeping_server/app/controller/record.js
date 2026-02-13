const { Controller } = require('egg');

class RecordController extends Controller {
  // 创建记录
  async create() {
    const { ctx } = this;
    const data = ctx.request.body;
    const user_id = ctx.state.user.id;

    try {
      // 处理图片列表
      const image_list = data.image_list || [];

      // 处理数值字段的默认值
      const recordData = {
        ...data,
        user_id,
        image_list: JSON.stringify(image_list),
      };

      // 点工字段默认值处理
      if (data.type === '点工') {
        recordData.work_days = data.work_days || 0;
        recordData.overtime_amount = data.has_overtime ? (data.overtime_amount || 0) : 0;
        recordData.point_income = data.work_option !== 2 ? data.point_income || 0 : 0;
        // 清空包工相关字段
        recordData.contract_option = null;
        recordData.contract_content = null;
        recordData.amount = null;
      }

      // 包工字段默认值处理
      if (data.type === '包工') {
        recordData.amount = data.amount || 0;
        // 清空点工相关字段
        recordData.point_income = null;
        recordData.work_option = null;
        recordData.work_days = null;
        recordData.has_overtime = false;
        recordData.overtime_amount = null;
      }

      // 创建记录
      const record = await ctx.model.Record.create(recordData);

      // 处理返回数据
      const responseData = record.get({ plain: true });
      responseData.image_list = JSON.parse(responseData.image_list || '[]');

      ctx.body = {
        success: true,
        data: responseData,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 获取记录列表
  async index() {
    const { ctx } = this;
    const { page = 1, pageSize = 10, date, project, type } = ctx.query;
    const user_id = ctx.state.user.id;

    try {
      const where = {
        user_id,
      };
      if (date) where.date = date;
      if (project) where.project = parseInt(project);
      if (type) where.type = type;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const { count, rows } = await ctx.model.Record.findAndCountAll({
        where,
        offset,
        limit,
        order: [[ 'date', 'DESC' ], [ 'created_at', 'DESC' ]],
      });

      // 处理返回数据
      const records = rows.map(record => {
        const plainRecord = record.get({ plain: true });
        plainRecord.image_list = JSON.parse(plainRecord.image_list || '[]');
        return plainRecord;
      });

      ctx.body = {
        success: true,
        data: {
          list: records,
          total: count,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 获取单条记录
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const user_id = ctx.state.user.id;

    try {
      const record = await ctx.model.Record.findOne({
        where: {
          id,
          user_id,
        },
      });

      if (!record) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '记录不存在',
        };
        return;
      }

      const plainRecord = record.get({ plain: true });
      plainRecord.image_list = JSON.parse(plainRecord.image_list || '[]');

      ctx.body = {
        success: true,
        data: plainRecord,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 更新记录
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = ctx.request.body;
    const user_id = ctx.state.user.id;

    try {
      const record = await ctx.model.Record.findOne({
        where: {
          id,
          user_id,
        },
      });

      if (!record) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '记录不存在',
        };
        return;
      }

      // 处理图片列表
      const image_list = data.image_list || [];

      // 处理数值字段的默认值
      const updateData = {
        ...data,
        image_list: JSON.stringify(image_list),
      };

      // 点工字段默认值处理
      if (data.type === '点工') {
        updateData.work_days = data.work_days || 0;
        updateData.overtime_amount = data.has_overtime ? (data.overtime_amount || 0) : 0;
        // 清空包工相关字段
        updateData.contract_option = null;
        updateData.contract_content = null;
        updateData.amount = null;
      }

      // 包工字段默认值处理
      if (data.type === '包工') {
        updateData.amount = data.amount || 0;
        // 清空点工相关字段
        updateData.work_option = null;
        updateData.work_days = null;
        updateData.has_overtime = false;
        updateData.overtime_amount = null;
      }

      await record.update(updateData);

      const updatedRecord = await ctx.model.Record.findOne({
        where: {
          id,
          user_id,
        },
      });

      const plainRecord = updatedRecord.get({ plain: true });
      plainRecord.image_list = JSON.parse(plainRecord.image_list || '[]');

      ctx.body = {
        success: true,
        data: plainRecord,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 删除记录
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const user_id = ctx.state.user.id;

    try {
      const record = await ctx.model.Record.findOne({
        where: {
          id,
          user_id,
        },
      });

      if (!record) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '记录不存在',
        };
        return;
      }

      await record.destroy();

      ctx.body = {
        success: true,
        message: '删除成功',
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 获取项目的所有记录
  async getProjectRecords() {
    const { ctx } = this;
    const { project_id } = ctx.params;
    const user_id = ctx.state.user.id;

    try {
      // 先验证项目是否存在且属于当前用户
      const project = await ctx.model.Project.findOne({
        where: {
          id: project_id,
          user_id,
        },
      });

      if (!project) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '项目不存在',
        };
        return;
      }

      const records = await ctx.model.Record.findAll({
        where: {
          user_id,
          project: project_id,
        },
        order: [[ 'date', 'DESC' ], [ 'created_at', 'DESC' ]],
      });

      // 处理返回数据
      const formattedRecords = records.map(record => {
        const plainRecord = record.get({ plain: true });
        plainRecord.image_list = JSON.parse(plainRecord.image_list || '[]');
        return plainRecord;
      });

      // 计算统计数据
      const statistics = {
        total_work_days: 0,
        total_amount: 0,
        total_overtime_amount: 0,
      };

      formattedRecords.forEach(record => {
        if (record.type === '点工') {
          statistics.total_work_days += Number(record.work_days) || 0;
          statistics.total_overtime_amount += Number(record.overtime_amount) || 0;
        }
        if (record.type === '包工') {
          statistics.total_amount += Number(record.amount) || 0;
        }
      });

      ctx.body = {
        success: true,
        data: {
          list: formattedRecords,
          total: formattedRecords.length,
          statistics,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 获取统计数据
  async getStatistics() {
    const { ctx } = this;
    const { project_id, start_date, end_date, type } = ctx.request.body;
    const user_id = ctx.state.user.id;

    try {
      // 验证项目是否存在且属于当前用户
      const project = await ctx.model.Project.findOne({
        where: {
          id: project_id,
          user_id,
        },
      });

      if (!project) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '项目不存在',
        };
        return;
      }

      // 根据统计类型计算日期范围
      let queryStartDate = start_date;
      let queryEndDate = end_date;
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      // 在 switch 外部声明变量
      let lastMonth;
      let lastMonthYear;

      switch (type) {
        case 'month':
          queryStartDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
          // 获取当月最后一天
          queryEndDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
          break;
        case 'lastMonth':
          lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
          queryStartDate = `${lastMonthYear}-${String(lastMonth).padStart(2, '0')}-01`;
          // 获取上月最后一天
          queryEndDate = new Date(lastMonthYear, lastMonth, 0).toISOString().split('T')[0];
          break;
        case 'year':
          queryStartDate = `${currentYear}-01-01`;
          queryEndDate = `${currentYear}-12-31`;
          break;
        case 'custom':
          // 使用传入的日期范围，确保日期格式正确
          queryStartDate = new Date(start_date).toISOString().split('T')[0];
          queryEndDate = new Date(end_date).toISOString().split('T')[0];
          break;
        default:
          break;
      }

      // 获取当前时间范围的记录
      const records = await ctx.model.Record.findAll({
        where: {
          user_id,
          project: project_id,
          date: {
            [ctx.app.Sequelize.Op.between]: [ queryStartDate, queryEndDate ],
          },
        },
        order: [[ 'date', 'ASC' ]],
      });

      // 获取上一个时间段的记录（用于计算环比）
      const prevPeriodStart = new Date(queryStartDate);
      const prevPeriodEnd = new Date(queryEndDate);
      const daysDiff = Math.ceil((prevPeriodEnd - prevPeriodStart) / (1000 * 60 * 60 * 24));

      prevPeriodStart.setDate(prevPeriodStart.getDate() - daysDiff - 1);
      prevPeriodEnd.setDate(prevPeriodEnd.getDate() - daysDiff - 1);

      const prevPeriodRecords = await ctx.model.Record.findAll({
        where: {
          user_id,
          project: project_id,
          date: {
            [ctx.app.Sequelize.Op.between]: [
              prevPeriodStart.toISOString().split('T')[0],
              prevPeriodEnd.toISOString().split('T')[0],
            ],
          },
        },
      });

      // 计算基础统计数据
      let totalAmount = 0;
      let pointIncome = 0;
      let overtimeIncome = 0; // 新增：加班总收入
      let contractIncome = 0;
      let totalWorkDays = 0;
      let overtimeCount = 0;
      let normalWorkCount = 0;
      let restCount = 0;

      // 计算上一时间段收入（用于环比）
      let prevPeriodAmount = 0;
      prevPeriodRecords.forEach(record => {
        if (record.type === '点工') {
          const recordOvertimeAmount = Number(record.overtime_amount) || 0;
          const recordPointIncome = Number(record.point_income) || 0;
          prevPeriodAmount += recordPointIncome + recordOvertimeAmount;
        } else {
          prevPeriodAmount += Number(record.amount) || 0;
        }
      });

      // 按日期统计收入
      const dailyIncomeMap = new Map();

      records.forEach(record => {
        // 计算当日收入
        let dayPointIncome = 0;
        let dayOvertimeIncome = 0; // 新增：日加班收入
        let dayContractIncome = 0;

        if (record.type === '点工') {
          dayPointIncome = Number(record.point_income) || 0;
          dayOvertimeIncome = Number(record.overtime_amount) || 0; // 获取加班收入
          pointIncome += dayPointIncome;
          overtimeIncome += dayOvertimeIncome; // 累加加班收入
          totalWorkDays += Number(record.work_days) || 0;

          if (record.has_overtime) overtimeCount++;
          if (record.work_option === 2) restCount++;
          if (record.work_option !== 2) normalWorkCount++;
        } else {
          dayContractIncome = Number(record.amount) || 0;
          contractIncome += dayContractIncome;
          normalWorkCount++;
        }

        // 更新日期收入数据
        const dateKey = record.date;
        const existingData = dailyIncomeMap.get(dateKey) || {
          date: dateKey,
          point_income: 0,
          overtime_income: 0,
          contract_income: 0,
          total: 0,
        };

        existingData.point_income += dayPointIncome;
        existingData.overtime_income += dayOvertimeIncome;
        existingData.contract_income += dayContractIncome;
        // 修改 total 计算逻辑：点工时计算点工收入+加班收入，包工时只计算包工收入
        if (record.type === '点工') {
          existingData.total = existingData.point_income + existingData.overtime_income;
        } else {
          existingData.total = existingData.contract_income;
        }
        dailyIncomeMap.set(dateKey, existingData);
      });

      // 修改总收入计算逻辑
      // 点工总收入 = 点工收入 + 加班收入
      const pointTotalIncome = pointIncome + overtimeIncome;
      // 总收入 = 点工总收入 + 包工收入
      totalAmount = pointTotalIncome + contractIncome;

      // 计算环比增长率（修正负增长的情况）
      let monthCompare = 0;
      if (prevPeriodAmount === 0 && totalAmount === 0) {
        monthCompare = 0;
      } else if (prevPeriodAmount === 0) {
        monthCompare = 100;
      } else {
        monthCompare = ((totalAmount - prevPeriodAmount) / prevPeriodAmount * 100).toFixed(2);
      }

      // 计算平均日薪
      const averageDailyWage = normalWorkCount === 0
        ? 0
        : (totalAmount / normalWorkCount).toFixed(2);

      ctx.body = {
        success: true,
        data: {
          statistics: {
            // 基础统计数据
            total_amount: Number(totalAmount.toFixed(2)),
            point_income: Number(pointIncome.toFixed(2)),
            overtime_income: Number(overtimeIncome.toFixed(2)), // 新增：加班收入
            contract_income: Number(contractIncome.toFixed(2)),
            month_compare: Number(monthCompare),
            total_work_days: totalWorkDays,
            overtime_count: overtimeCount,
            average_daily_wage: Number(averageDailyWage),

            // 工作状态统计
            work_status: {
              normal_work_count: normalWorkCount,
              rest_count: restCount,
              overtime_count: overtimeCount,
            },

            // 收入趋势数据
            daily_income: Array.from(dailyIncomeMap.values())
              .sort((a, b) => a.date.localeCompare(b.date)),
          },
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 获取用户所有记工统计数据
  async getUserWorkStats() {
    const { ctx } = this;
    const user_id = ctx.state.user.id;

    try {
      // 获取所有记工记录（包括点工和包工）
      const records = await ctx.model.Record.findAll({
        where: {
          user_id,
        },
        order: [[ 'date', 'ASC' ]],
      });

      const totalRecordDays = records.length; // 总记账天数
      let totalIncome = 0; // 总收入

      // 计算总收入
      records.forEach(record => {
        if (record.type === '点工') {
          totalIncome += Number(record.point_income) || 0;
          totalIncome += Number(record.overtime_amount) || 0;
        } else {
          totalIncome += Number(record.amount) || 0;
        }
      });

      // 获取唯一日期数组
      const uniqueDates = [ ...new Set(records.map(record => record.date)) ]
        .sort((a, b) => new Date(a) - new Date(b));

      let consecutiveDays = 0; // 当前连续记工天数
      let maxConsecutiveDays = 0; // 最长连续记工天数
      let lastWorkDate = null; // 上一个记工日期

      // 计算连续天数
      uniqueDates.forEach(date => {
        const currentDate = new Date(date);
        if (lastWorkDate) {
          const dayDiff = Math.floor((currentDate - lastWorkDate) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            consecutiveDays++;
          } else {
            maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
            consecutiveDays = 1;
          }
        } else {
          consecutiveDays = 1;
        }
        lastWorkDate = currentDate;
      });

      // 最后一次检查最长连续记工天数
      maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);

      // 计算平均日薪
      const averageDailyWage = totalRecordDays === 0
        ? 0
        : Number((totalIncome / totalRecordDays).toFixed(2));

      ctx.body = {
        success: true,
        data: {
          total_record_days: totalRecordDays, // 总记账天数
          total_income: Number(totalIncome.toFixed(2)), // 总收入
          current_consecutive_days: consecutiveDays, // 当前连续记工天数
          max_consecutive_days: maxConsecutiveDays, // 最长连续记工天数
          average_daily_wage: averageDailyWage, // 平均日薪
          last_work_date: lastWorkDate ? lastWorkDate.toISOString().split('T')[0] : null, // 上一个记工日期
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = RecordController;
