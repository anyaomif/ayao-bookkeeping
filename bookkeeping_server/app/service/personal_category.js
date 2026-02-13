const { Service } = require('egg');

// 注册时初始化的默认分类
const DEFAULT_CATEGORIES = [
  { type: 'expense', parent_id: 0, name: '餐饮', icon: 'eat', color: '#ff9f0a', sort_order: 1, subs: [
    { name: '早餐', icon: 'eat', color: '#ff9f0a' },
    { name: '午餐', icon: 'eat', color: '#ff9f0a' },
    { name: '晚餐', icon: 'eat', color: '#ff9f0a' },
    { name: '夜宵', icon: 'eat', color: '#ff9f0a' },
    { name: '零食', icon: 'eat', color: '#ff9f0a' },
    { name: '水果', icon: 'eat', color: '#ff9f0a' },
    { name: '买菜', icon: 'eat', color: '#ff9f0a' },
  ] },
  { type: 'expense', parent_id: 0, name: '购物', icon: 'shop', color: '#af52de', sort_order: 2, subs: [
    { name: '服饰', icon: 'shop', color: '#af52de' },
    { name: '日用', icon: 'shop', color: '#af52de' },
    { name: '数码', icon: 'shop', color: '#af52de' },
    { name: '家居', icon: 'shop', color: '#af52de' },
  ] },
  { type: 'expense', parent_id: 0, name: '交通', icon: 'taxi', color: '#5ac8fa', sort_order: 3, subs: [
    { name: '公交', icon: 'taxi', color: '#5ac8fa' },
    { name: '地铁', icon: 'taxi', color: '#5ac8fa' },
    { name: '打车', icon: 'taxi', color: '#5ac8fa' },
    { name: '加油', icon: 'taxi', color: '#5ac8fa' },
  ] },
  { type: 'income', parent_id: 0, name: '职业', icon: 'fire', color: '#34c759', sort_order: 1, subs: [
    { name: '工资', icon: 'fire', color: '#34c759' },
    { name: '奖金', icon: 'fire', color: '#34c759' },
    { name: '兼职', icon: 'fire', color: '#34c759' },
  ] },
  { type: 'income', parent_id: 0, name: '理财', icon: 'safe', color: '#af52de', sort_order: 2, subs: [
    { name: '股票', icon: 'safe', color: '#af52de' },
    { name: '基金', icon: 'safe', color: '#af52de' },
  ] },
  { type: 'transfer', parent_id: 0, name: '转账', icon: 'refresh', color: '#8e8e93', sort_order: 1, subs: [
    { name: '转出', icon: 'left-arrow', color: '#ff3b30' },
    { name: '转入', icon: 'right-arrow', color: '#34c759' },
    { name: '取现', icon: 'bankcard', color: '#8e8e93' },
  ] },
];

class PersonalCategoryService extends Service {
  // 为新用户初始化默认分类
  async initDefaults(userId) {
    const exists = await this.ctx.model.PersonalCategory.count({ where: { user_id: userId } });
    if (exists > 0) return;

    for (const main of DEFAULT_CATEGORIES) {
      const parent = await this.ctx.model.PersonalCategory.create({
        user_id: userId, type: main.type, parent_id: 0,
        name: main.name, icon: main.icon, color: main.color,
        sort_order: main.sort_order, is_default: true,
      });
      if (main.subs) {
        let subOrder = 1;
        for (const sub of main.subs) {
          await this.ctx.model.PersonalCategory.create({
            user_id: userId, type: main.type, parent_id: parent.id,
            name: sub.name, icon: sub.icon, color: sub.color,
            sort_order: subOrder++, is_default: true,
          });
        }
      }
    }
  }

  // 获取分类树（按类型）
  async listByType(userId, type) {
    const all = await this.ctx.model.PersonalCategory.findAll({
      where: { user_id: userId, type },
      order: [['sort_order', 'ASC'], ['created_at', 'ASC']],
    });
    // 组装树结构
    const parents = all.filter(c => c.parent_id === 0);
    return parents.map(p => ({
      ...p.toJSON(),
      subcategories: all.filter(c => c.parent_id === p.id),
    }));
  }

  // 获取全部分类（按类型分组的树）
  async listAll(userId) {
    const [expense, income, transfer] = await Promise.all([
      this.listByType(userId, 'expense'),
      this.listByType(userId, 'income'),
      this.listByType(userId, 'transfer'),
    ]);
    return { expense, income, transfer };
  }

  async create(data, userId) {
    return await this.ctx.model.PersonalCategory.create({
      ...data, user_id: userId, is_default: false,
    });
  }

  async findOne(id, userId) {
    const category = await this.ctx.model.PersonalCategory.findOne({
      where: { id, user_id: userId },
    });
    if (!category) this.ctx.throw(404, '分类不存在');
    return category;
  }

  async update(id, data, userId) {
    const category = await this.findOne(id, userId);
    await category.update(data);
    return category;
  }

  async destroy(id, userId) {
    const category = await this.findOne(id, userId);
    // 如果是主分类，级联删除子分类
    if (category.parent_id === 0) {
      // 检查子分类下是否有交易
      const subIds = (await this.ctx.model.PersonalCategory.findAll({
        where: { parent_id: id, user_id: userId },
        attributes: ['id'],
      })).map(c => c.id);

      if (subIds.length > 0) {
        const txCount = await this.ctx.model.PersonalTransaction.count({
          where: { user_id: userId, category_id: subIds },
        });
        if (txCount > 0) this.ctx.throw(400, '该分类下有交易记录，无法删除');
      }
      await this.ctx.model.PersonalCategory.destroy({ where: { parent_id: id, user_id: userId } });
    } else {
      // 子分类：检查是否有交易
      const txCount = await this.ctx.model.PersonalTransaction.count({
        where: { user_id: userId, category_id: id },
      });
      if (txCount > 0) this.ctx.throw(400, '该分类下有交易记录，无法删除');
    }
    await category.destroy();
  }
}

module.exports = PersonalCategoryService;
