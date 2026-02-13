const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async checkUpdate() {
    const { ctx } = this;
    const { version, platform } = ctx.request.body;

    if (!['android', 'ios'].includes(platform.toLowerCase())) {
      ctx.throw(400, '不支持的平台类型');
    }

    const latestVersion = await ctx.model.AppVersion.findOne({
      where: { platform: platform.toLowerCase() },
      order: [['publish_time', 'DESC']],
    });

    if (!latestVersion) ctx.throw(404, '未找到版本信息');

    const needUpdate = this.compareVersions(version, latestVersion.version) < 0;
    const forceUpdate = needUpdate && this.compareVersions(version, latestVersion.min_version) < 0;

    ctx.success({
      has_update: needUpdate,
      force_update: forceUpdate || latestVersion.force_update,
      latest_version: latestVersion.version,
      download_url: latestVersion.download_url,
      change_log: latestVersion.change_log,
      publish_time: latestVersion.publish_time,
      package_size: Number(latestVersion.package_size),
    });
  }

  compareVersions(v1, v2) {
    const a = v1.split('.').map(Number);
    const b = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const n1 = a[i] || 0, n2 = b[i] || 0;
      if (n1 < n2) return -1;
      if (n1 > n2) return 1;
    }
    return 0;
  }
}

module.exports = HomeController;
