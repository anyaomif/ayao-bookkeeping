const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  // 检查更新接口
  async checkUpdate() {
    const { ctx } = this;
    const { version, platform } = ctx.request.body;

    try {
      // 验证平台类型
      if (![ 'android', 'ios' ].includes(platform.toLowerCase())) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '不支持的平台类型',
        };
        return;
      }

      // 获取最新版本信息
      const latestVersion = await ctx.model.AppVersion.findOne({
        where: {
          platform: platform.toLowerCase(),
        },
        order: [[ 'publish_time', 'DESC' ]],
      });

      if (!latestVersion) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '未找到版本信息',
        };
        return;
      }

      // 比较版本号
      const needUpdate = this.compareVersions(version, latestVersion.version) < 0;
      const forceUpdate = needUpdate && this.compareVersions(version, latestVersion.min_version) < 0;

      ctx.body = {
        success: true,
        data: {
          has_update: needUpdate,
          force_update: forceUpdate || latestVersion.force_update,
          latest_version: latestVersion.version,
          download_url: latestVersion.download_url,
          change_log: latestVersion.change_log,
          publish_time: latestVersion.publish_time,
          package_size: Number(latestVersion.package_size), // 添加包大小信息
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

  // 版本号比较方法
  compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      if (num1 < num2) return -1;
      if (num1 > num2) return 1;
    }
    return 0;
  }
}

module.exports = HomeController;
