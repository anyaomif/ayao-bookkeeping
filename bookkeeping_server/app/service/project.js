const { Service } = require('egg');

class ProjectService extends Service {
  async create(data, userId) {
    const startDate = new Date(data.start_date);
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (isNaN(startDate.getTime())) {
      this.ctx.throw(400, '无效的开始日期格式');
    }
    if (data.end_date && isNaN(endDate.getTime())) {
      this.ctx.throw(400, '无效的结束日期格式');
    }

    return await this.ctx.model.Project.create({
      ...data,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    });
  }

  async list(query, userId) {
    const { page = 1, pageSize = 10, status, keyword } = query;
    const where = { user_id: userId };

    if (status) where.status = parseInt(status);
    if (keyword) {
      where.name = { [this.app.Sequelize.Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await this.ctx.model.Project.findAndCountAll({
      where,
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize),
      order: [['created_at', 'DESC']],
    });

    return { list: rows, total: count, page: parseInt(page), pageSize: parseInt(pageSize) };
  }

  async findOne(id, userId) {
    const project = await this.ctx.model.Project.findOne({
      where: { id, user_id: userId },
    });
    if (!project) this.ctx.throw(404, '项目不存在');
    return project;
  }

  async update(id, data, userId) {
    const project = await this.findOne(id, userId);
    await project.update(data);
    return project;
  }

  async destroy(id, userId) {
    const project = await this.findOne(id, userId);
    // 级联删除关联记录，防止孤儿数据
    await this.ctx.model.Record.destroy({
      where: { project: parseInt(id), user_id: userId },
    });
    await project.destroy();
  }
}

module.exports = ProjectService;
