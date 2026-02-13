const { Controller } = require('egg');

class ProjectController extends Controller {
  // 创建项目
  async create() {
    const { ctx } = this;
    const data = ctx.request.body;

    try {
      // 验证日期格式
      const startDate = new Date(data.start_date);
      const endDate = data.end_date ? new Date(data.end_date) : null;

      if (isNaN(startDate.getTime())) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '无效的开始日期格式',
        };
        return;
      }

      if (data.end_date && isNaN(endDate.getTime())) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '无效的结束日期格式',
        };
        return;
      }

      const project = await ctx.model.Project.create({
        ...data,
        user_id: ctx.state.user.id,
        start_date: startDate,
        end_date: endDate,
      });

      ctx.body = {
        success: true,
        data: project,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 获取项目列表
  async index() {
    const { ctx } = this;
    const { page = 1, pageSize = 10, status, keyword } = ctx.query;

    try {
      const where = {
        user_id: ctx.state.user.id,
      };

      if (status) {
        where.status = parseInt(status);
      }

      if (keyword) {
        where.name = {
          [ctx.app.Sequelize.Op.like]: `%${keyword}%`,
        };
      }

      const { count, rows } = await ctx.model.Project.findAndCountAll({
        where,
        offset: (parseInt(page) - 1) * parseInt(pageSize),
        limit: parseInt(pageSize),
        order: [[ 'created_at', 'DESC' ]],
      });

      ctx.body = {
        success: true,
        data: {
          list: rows,
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

  // 获取项目详情
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;

    try {
      const project = await ctx.model.Project.findOne({
        where: {
          id,
          user_id: ctx.state.user.id,
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

      ctx.body = {
        success: true,
        data: project,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 更新项目
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = ctx.request.body;

    try {
      const project = await ctx.model.Project.findOne({
        where: {
          id,
          user_id: ctx.state.user.id,
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

      await project.update(data);

      ctx.body = {
        success: true,
        data: project,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  // 删除项目
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;

    try {
      const project = await ctx.model.Project.findOne({
        where: {
          id,
          user_id: ctx.state.user.id,
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

      await project.destroy();

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
}

module.exports = ProjectController;
