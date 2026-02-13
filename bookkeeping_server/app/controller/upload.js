const { Controller } = require('egg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    if (!ctx.request.files || ctx.request.files.length === 0) {
      ctx.throw(400, '未上传文件');
    }

    const file = ctx.request.files[0];
    const ext = path.extname(file.filename).toLowerCase();
    const safeFilename = `${crypto.randomUUID()}${ext}`;
    const targetPath = path.join(this.config.baseDir, 'app/public/uploads', safeFilename);

    const reader = fs.createReadStream(file.filepath);
    const writer = fs.createWriteStream(targetPath);
    reader.pipe(writer);

    ctx.success({ url: `/public/uploads/${safeFilename}` });
  }
}

module.exports = UploadController;
