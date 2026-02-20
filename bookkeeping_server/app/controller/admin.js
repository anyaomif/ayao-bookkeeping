const { Controller } = require('egg');
const path = require('path');
const fs = require('fs');

class AdminController extends Controller {
  getCredentials() {
    return {
      username: process.env.ADMIN_USER || 'admin',
      password: process.env.ADMIN_PASS || '123456',
    };
  }

  async page() {
    const { ctx } = this;
    const html = fs.readFileSync(path.join(this.app.baseDir, 'app/public/admin.html'), 'utf-8');
    ctx.set('Content-Type', 'text/html');
    ctx.body = html;
  }

  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const cred = this.getCredentials();
    if (username !== cred.username || password !== cred.password) {
      ctx.fail('账号或密码错误', 401);
      return;
    }
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ role: 'admin' }, this.app.config.jwt.secret, { expiresIn: '24h' });
    ctx.success({ token });
  }

  async changePassword() {
    const { ctx } = this;
    const { oldPassword, newPassword, newUsername } = ctx.request.body;
    const cred = this.getCredentials();
    if (oldPassword !== cred.password) {
      ctx.fail('原密码错误');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      ctx.fail('新密码至少4位');
      return;
    }
    // 更新 .env 文件
    const envPath = path.join(this.app.baseDir, '.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');
    if (newUsername && newUsername.trim()) {
      envContent = envContent.replace(/^ADMIN_USER=.*/m, `ADMIN_USER=${newUsername.trim()}`);
      process.env.ADMIN_USER = newUsername.trim();
    }
    envContent = envContent.replace(/^ADMIN_PASS=.*/m, `ADMIN_PASS=${newPassword}`);
    fs.writeFileSync(envPath, envContent, 'utf-8');
    process.env.ADMIN_PASS = newPassword;
    ctx.success(null);
  }

  async listVersions() {
    const { ctx } = this;
    const list = await ctx.model.AppVersion.findAll({ order: [['publish_time', 'DESC']] });
    ctx.success(list);
  }

  async createVersion() {
    const { ctx } = this;
    const data = ctx.request.body;
    data.publish_time = data.publish_time || new Date();
    const version = await ctx.model.AppVersion.create(data);
    ctx.success(version);
  }

  async updateVersion() {
    const { ctx } = this;
    const { id } = ctx.params;
    const row = await ctx.model.AppVersion.findByPk(id);
    if (!row) { ctx.fail('版本不存在', 404); return; }
    await row.update(ctx.request.body);
    ctx.success(row);
  }

  async deleteVersion() {
    const { ctx } = this;
    const { id } = ctx.params;
    const row = await ctx.model.AppVersion.findByPk(id);
    if (!row) { ctx.fail('版本不存在', 404); return; }
    await row.destroy();
    ctx.success(null);
  }

  async dashboard() {
    const { ctx, app } = this;
    const { Op, fn, col, literal } = app.Sequelize;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 基础统计
    const [userCount, txCount, projectCount, recordCount, todayUsers, todayTx] = await Promise.all([
      ctx.model.User.count(),
      ctx.model.PersonalTransaction.count(),
      ctx.model.Project.count(),
      ctx.model.Record.count(),
      ctx.model.User.count({ where: { created_at: { [Op.gte]: todayStart } } }),
      ctx.model.PersonalTransaction.count({ where: { date: todayStr } }),
    ]);

    // 最近7天每日记账数
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }
    const dailyTx = await ctx.model.PersonalTransaction.findAll({
      attributes: ['date', [fn('COUNT', col('id')), 'count']],
      where: { date: { [Op.in]: days } },
      group: ['date'],
      raw: true,
    });
    const dailyMap = {};
    dailyTx.forEach(r => { dailyMap[r.date] = parseInt(r.count); });
    const dailyChart = days.map(d => ({ date: d, count: dailyMap[d] || 0 }));

    // 最近注册的用户
    const recentUsers = await ctx.model.User.findAll({
      attributes: ['id', 'username', 'nickname', 'app_mode', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 10,
      raw: true,
    });

    ctx.success({
      userCount, txCount, projectCount, recordCount,
      todayUsers, todayTx,
      dailyChart, recentUsers,
    });
  }
}

module.exports = AdminController;
