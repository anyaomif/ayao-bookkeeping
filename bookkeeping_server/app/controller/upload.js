const { Controller } = require('egg');
const fs = require('fs');
const path = require('path');

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    try {
      if (!ctx.request.files || ctx.request.files.length === 0) {
        ctx.body = {
          code: 400,
          message: 'No file uploaded',
          data: null,
        };
        return;
      }
      const file = ctx.request.files[0];
      const filename = path.basename(file.filename);
      const targetPath = path.join(this.config.baseDir, 'app/public/uploads', filename);

      const reader = fs.createReadStream(file.filepath);
      const writer = fs.createWriteStream(targetPath);
      reader.pipe(writer);

      ctx.body = {
        code: 200,
        message: 'File uploaded successfully',
        data: {
          url: `/public/uploads/${filename}`,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: 'Internal server error',
        data: null,
      };
      ctx.logger.error(error);
    }
  }
}

module.exports = UploadController;
