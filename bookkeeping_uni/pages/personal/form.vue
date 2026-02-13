<template>
  <view class="form-container">
    <!-- 自定义导航栏 -->
    <NavbarWrapper sticky>
      <view class="custom-navbar">
        <view class="nav-left" @click="goBack">
          <tn-icon name="left" size="44" color="#1c1c1e"></tn-icon>
        </view>
        <view class="nav-center">
          <text class="nav-title">记一笔</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </NavbarWrapper>

    <!-- 交易类型选择 -->
    <view class="type-selector">
      <view class="segmented">
        <view class="seg-item" :class="{ active: currentType === 'expense' }" @click="setType('expense')">
          <text>支出</text>
        </view>
        <view class="seg-item" :class="{ active: currentType === 'income' }" @click="setType('income')">
          <text>收入</text>
        </view>
        <view class="seg-item" :class="{ active: currentType === 'transfer' }" @click="setType('transfer')">
          <text>转账</text>
        </view>
      </view>
    </view>

    <!-- 金额显示区 -->
    <view class="amount-section">
      <view class="amount-display" @click="openKeyboard">
        <view class="amount-row">
          <text class="currency">¥</text>
          <text class="major">{{ majorAmount }}</text>
          <text class="minor">.{{ minorAmount }}</text>
        </view>
        <view class="tap-hint">
          <text>点击输入金额</text>
        </view>
      </view>
    </view>

    <!-- 信息选择区 -->
    <view class="info-section">
      <view class="info-card">
        <view class="info-item" @click="openCategory">
          <view class="item-left">
            <view class="category-icon" :style="{ backgroundColor: selectedCategory.color }">
              <tn-icon :name="selectedCategory.icon" size="40" color="#fff"></tn-icon>
            </view>
            <view class="item-content">
              <text class="item-title">{{ selectedCategory.name }}</text>
              <text class="item-subtitle">{{ currentType === 'expense' ? '支出分类' : currentType === 'income' ? '收入分类' :
                '转账分类' }}</text>
            </view>
          </view>
          <tn-icon name="right" size="32" color="#c7c7cc"></tn-icon>
        </view>

        <view class="divider"></view>

        <view class="info-item" @click="openAccount">
          <view class="item-left">
            <view class="account-icon">
              <tn-icon name="wallet" size="40" color="#ff6700"></tn-icon>
            </view>
            <view class="item-content">
              <text class="item-title">{{ selectedAccount.name }}</text>
              <text class="item-subtitle">余额 ¥{{ formatAmount(selectedAccount.balance) }}</text>
            </view>
          </view>
          <tn-icon name="right" size="32" color="#c7c7cc"></tn-icon>
        </view>

        <view class="divider"></view>

        <view class="info-item" @click="openDate">
          <view class="item-left">
            <view class="time-icon">
              <tn-icon name="time" size="40" color="#ff6700"></tn-icon>
            </view>
            <view class="item-content">
              <text class="item-title">{{ formatDisplayTime }}</text>
              <text class="item-subtitle">记录时间</text>
            </view>
          </view>
          <tn-icon name="right" size="32" color="#c7c7cc"></tn-icon>
        </view>
      </view>
    </view>

    <!-- 备注输入 -->
    <view class="remark-section">
      <view class="remark-card">
        <ay-textarea v-model="remark" placeholder="添加备注（可选）" :maxlength="60" rows="3" :border="false"></ay-textarea>
      </view>
    </view>

    <!-- 金额键盘弹层 -->
    <ay-popup v-model="showKeyboard" position="bottom" :duration="250" draggable show-drag-handle>
      <view class="keyboard-popup">
        <view class="toolbar">
          <view class="toolbar-actions">
            <view class="spacer"></view>
            <view class="done" @click="closeKeyboard">完成</view>
          </view>
        </view>
        <view class="key-row" v-for="(row, rIdx) in keypad" :key="rIdx">
          <view class="key" v-for="(key, kIdx) in row" :key="kIdx" :class="key.class" @click="onKeyPress(key)">
            <text v-if="key.type === 'text'">{{ key.label }}</text>
            <tn-icon v-else-if="key.type === 'icon'" :name="key.icon" size="44" color="#333"></tn-icon>
          </view>
        </view>
        <view class="popup-action">
          <ay-button block round @click="submitMock">记一笔</ay-button>
        </view>
      </view>
    </ay-popup>

    <!-- 页面底部按钮（键盘未展开时显示） -->
    <view class="bottom-action" v-show="!showKeyboard">
      <ay-button block round @click="submitMock">记一笔</ay-button>
    </view>

    <!-- 分类选择弹层 -->
    <ay-popup v-model="showCategory" position="bottom" :duration="300" draggable show-drag-handle>
      <view class="popup-content" style="height: 80vh;">
        <view class="popup-header">
          <text class="popup-title">选择支出分类</text>
        </view>
        <view class="category-selector">
          <scroll-view class="main-category" scroll-y>
            <view class="main-item" v-for="mainCate in categories[currentType]" :key="mainCate.name"
              :class="{ active: mainCate.name === activeMainCategory }" @click="selectMainCategory(mainCate.name)">
              <tn-icon :name="mainCate.icon" size="48"></tn-icon>
              <text>{{ mainCate.name }}</text>
            </view>
          </scroll-view>
          <scroll-view class="sub-category" scroll-y>
            <view class="sub-grid">
              <view class="sub-item" v-for="subCate in activeSubCategories" :key="subCate.name"
                @click="selectSubCategory(subCate)">
                <view class="sub-icon-wrapper" :style="{ backgroundColor: subCate.color }">
                  <tn-icon :name="subCate.icon" size="44" color="#fff"></tn-icon>
                </view>
                <text>{{ subCate.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </ay-popup>

    <!-- 账户选择弹层 -->
    <ay-popup v-model="showAccount" position="bottom" :duration="300" draggable show-drag-handle>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择账户</text>
        </view>
        <view class="account-list">
          <view class="account-item" v-for="acc in accounts" :key="acc.id" @click="selectAccount(acc)">
            <view class="account-left">
              <view class="account-icon">
                <tn-icon name="wallet" size="44" color="#ff6700"></tn-icon>
              </view>
              <view class="account-info">
                <text class="account-name">{{ acc.name }}</text>
                <text class="account-balance">余额 ¥{{ formatAmount(acc.balance) }}</text>
              </view>
            </view>
            <tn-icon name="check" size="40" color="#ff6700" v-if="selectedAccount.id === acc.id"></tn-icon>
          </view>
        </view>
      </view>
    </ay-popup>

    <!-- 时间选择弹层 -->
    <ay-popup v-model="showDate" position="bottom" :duration="300" draggable show-drag-handle>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择时间</text>
        </view>
        <view class="date-options">
          <view class="date-option" @click="setDateTo('today')">
            <view class="option-left">
              <tn-icon name="time" size="44" color="#ff6700"></tn-icon>
              <text class="option-text">今天</text>
            </view>
          </view>
          <view class="date-option" @click="setDateTo('yesterday')">
            <view class="option-left">
              <tn-icon name="time" size="44" color="#8e8e93"></tn-icon>
              <text class="option-text">昨天</text>
            </view>
          </view>
          <view class="date-option" @click="setDateTo('custom')">
            <view class="option-left">
              <tn-icon name="calendar" size="44" color="#8e8e93"></tn-icon>
              <text class="option-text">选择其他日期</text>
            </view>
          </view>
        </view>
      </view>
    </ay-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentType = ref('expense') // expense | income | transfer
const amount = ref('0')
const remark = ref('')

const selectedCategory = ref({ name: '餐饮', icon: 'eat', color: '#ff9f0a' })
const selectedAccount = ref({ id: 1, name: '现金', balance: 1200 })
const currentDate = ref(new Date())

const showCategory = ref(false)
const showAccount = ref(false)
const showDate = ref(false)
const showKeyboard = ref(false)
const activeMainCategory = ref('餐饮')

const categories = ref({
  expense: [
    {
      name: '餐饮', icon: 'eat', subcategories: [
        { name: '早餐', icon: 'eat', color: '#ff9f0a' },
        { name: '午餐', icon: 'eat', color: '#ff9f0a' },
        { name: '晚餐', icon: 'eat', color: '#ff9f0a' },
        { name: '夜宵', icon: 'eat', color: '#ff9f0a' },
        { name: '零食', icon: 'eat', color: '#ff9f0a' },
        { name: '水果', icon: 'eat', color: '#ff9f0a' },
        { name: '买菜', icon: 'eat', color: '#ff9f0a' },
      ]
    },
    {
      name: '购物', icon: 'shop', subcategories: [
        { name: '服饰', icon: 'shop', color: '#af52de' },
        { name: '日用', icon: 'shop', color: '#af52de' },
        { name: '数码', icon: 'shop', color: '#af52de' },
        { name: '家居', icon: 'shop', color: '#af52de' },
      ]
    },
    {
      name: '交通', icon: 'car', subcategories: [
        { name: '公交', icon: 'car', color: '#5ac8fa' },
        { name: '地铁', icon: 'car', color: '#5ac8fa' },
        { name: '打车', icon: 'car', color: '#5ac8fa' },
        { name: '加油', icon: 'car', color: '#5ac8fa' },
      ]
    },
  ],
  income: [
    {
      name: '职业', icon: 'fire', subcategories: [
        { name: '工资', icon: 'fire', color: '#34c759' },
        { name: '奖金', icon: 'fire', color: '#34c759' },
        { name: '兼职', icon: 'fire', color: '#34c759' },
      ]
    },
    {
      name: '理财', icon: 'safe', subcategories: [
        { name: '股票', icon: 'safe', color: '#af52de' },
        { name: '基金', icon: 'safe', color: '#af52de' },
      ]
    },
  ],
  transfer: [
    {
      name: '转账', icon: 'arrow-left', subcategories: [
        { name: '转出', icon: 'arrow-left', color: '#ff3b30' },
        { name: '转入', icon: 'arrow-right', color: '#34c759' },
        { name: '取现', icon: 'card', color: '#8e8e93' },
      ]
    },
  ]
})

const activeSubCategories = computed(() => {
  const main = categories.value[currentType.value].find(c => c.name === activeMainCategory.value);
  return main ? main.subcategories : [];
})

const accounts = ref([
  { id: 1, name: '现金', balance: 1200 },
  { id: 2, name: '银行卡', balance: 23580.2 },
  { id: 3, name: '微信钱包', balance: 562.32 },
  { id: 4, name: '支付宝', balance: 1286.07 },
])

const keypad = ref([
  [
    { type: 'text', label: '1' },
    { type: 'text', label: '2' },
    { type: 'text', label: '3' }
  ],
  [
    { type: 'text', label: '4' },
    { type: 'text', label: '5' },
    { type: 'text', label: '6' }
  ],
  [
    { type: 'text', label: '7' },
    { type: 'text', label: '8' },
    { type: 'text', label: '9' }
  ],
  [
    { type: 'text', label: '.' },
    { type: 'text', label: '0' },
    { type: 'icon', icon: 'delete' }
  ]
])

const majorAmount = computed(() => amount.value.split('.')[0])
const minorAmount = computed(() => (amount.value.split('.')[1] || '00').padEnd(2, '0').slice(0, 2))
const displayDate = computed(() => {
  const d = currentDate.value
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd} ${hh}:${mi}`
})

const formatDisplayTime = computed(() => {
  const d = currentDate.value
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) {
    return '今天'
  } else if (d.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${mm}月${dd}日`
  }
})

const formatAmount = (num) => {
  return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const setType = (t) => {
  currentType.value = t
  // 切换类型时重置分类为该组第一个
  const firstMainCategory = categories.value[t][0];
  activeMainCategory.value = firstMainCategory.name;
  selectedCategory.value = firstMainCategory.subcategories[0];
}

const openKeyboard = () => {
  showKeyboard.value = true
}

const closeKeyboard = () => {
  showKeyboard.value = false
}

const goBack = () => {
  uni.navigateBack()
}

const onKeyPress = (key) => {
  if (key.type === 'icon') {
    // 删除
    if (amount.value.length <= 1) amount.value = '0'
    else amount.value = amount.value.slice(0, -1)
    return
  }
  const val = key.label
  if (val === '.') {
    if (amount.value.includes('.')) return
    amount.value += '.'
    return
  }
  if (amount.value === '0') amount.value = val
  else {
    // 最多保留两位小数
    const hasDot = amount.value.includes('.')
    if (!hasDot) amount.value += val
    else {
      const dotIndex = amount.value.indexOf('.')
      if (amount.value.length - dotIndex <= 2) amount.value += val
    }
  }
}

const openCategory = () => {
  showKeyboard.value = false
  showCategory.value = true
}
const openAccount = () => {
  showKeyboard.value = false
  showAccount.value = true
}
const openDate = () => {
  showKeyboard.value = false
  showDate.value = true
}

const selectMainCategory = (mainCategoryName) => {
  activeMainCategory.value = mainCategoryName;
  uni.vibrateShort();
}

const selectSubCategory = (subCategory) => {
  selectedCategory.value = subCategory;
  showCategory.value = false;
  uni.vibrateShort();
}

const selectAccount = (acc) => {
  selectedAccount.value = acc
  showAccount.value = false
  uni.vibrateShort();
}

const setDateTo = (type) => {
  const now = new Date()
  if (type === 'today') currentDate.value = now
  else if (type === 'yesterday') {
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    currentDate.value = y
  } else {
    // 静态阶段，直接提示
    uni.showToast({ title: '日期选择器暂未接入', icon: 'none' })
  }
  showDate.value = false
  uni.vibrateShort();
}

const submitMock = () => {
  uni.showToast({ title: '静态原型：记一笔', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.form-container {
  background-color: #f6f6f6;
  min-height: 100vh;
  padding-bottom: 200rpx;
}

.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 88rpx;
  padding: 0 10rpx;
  background-color: #f6f6f6;

  .nav-left {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-right {
    width: 88rpx;
    height: 88rpx;
  }
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1c1c1e;
}

.type-selector {
  padding: 0 30rpx 20rpx 30rpx;
  background-color: #f6f6f6;
}

.segmented {
  display: flex;
  background: #fff;
  padding: 6rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  gap: 4rpx;
}

.seg-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 24rpx;
  border-radius: 20rpx;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);

  text {
    font-size: 30rpx;
    font-weight: 500;
    color: #8e8e93;
    transition: color 0.25s ease;
  }

  &.active {
    background: linear-gradient(135deg, #ff6700 0%, #ff8f3d 100%);
    box-shadow: 0 8rpx 20rpx rgba(255, 103, 0, 0.25);

    text {
      color: #fff;
      font-weight: 600;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

.amount-section {
  padding: 0 30rpx 30rpx 30rpx;
  background-color: #f6f6f6;
}

.amount-display {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  padding: 30rpx 20rpx;
  text-align: center;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

.amount-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8rpx;
  margin-bottom: 16rpx;

  .currency {
    font-size: 48rpx;
    color: #ff6700;
    font-weight: 600;
  }

  .major {
    font-size: 96rpx;
    color: #ff6700;
    font-weight: 700;
    letter-spacing: -4rpx;
  }

  .minor {
    font-size: 52rpx;
    color: #ff6700;
    font-weight: 700;
  }
}

.tap-hint {
  text {
    font-size: 26rpx;
    color: #8e8e93;
  }
}

.info-section {
  padding: 0 30rpx 30rpx 30rpx;
  background-color: #f6f6f6;
}

.info-card {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 28rpx;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #f8f8f8;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.category-icon,
.account-icon,
.time-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-icon,
.time-icon {
  background-color: #f6f6f6;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.item-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1c1c1e;
}

.item-subtitle {
  font-size: 26rpx;
  color: #8e8e93;
}

.divider {
  height: 1rpx;
  background: #f5f5f5;
  margin: 0 28rpx;
}

.remark-section {
  padding: 0 30rpx 30rpx 30rpx;
  background-color: #f6f6f6;
}

.remark-card {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  padding: 4rpx;
}

/* 旧固定键盘样式废弃，改为弹层 */

.key-row {
  display: flex;
  gap: 12rpx;
}

.key {
  flex: 1;
  height: 108rpx;
  background: #fff;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #1c1c1e;
  margin-bottom: 12rpx;
  transition: transform .08s ease, background .2s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.bottom-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20rpx;
  padding: 0 30rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 弹层样式 */
.popup-content {
  padding: 12rpx 0 40rpx 0;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  background-color: #fff;
}

.popup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 32rpx 0;
}

.popup-drag {
  width: 80rpx;
  height: 8rpx;
  background: #e5e5e5;
  border-radius: 999rpx;
  margin-bottom: 24rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1c1c1e;
}

/* 分类网格 */
.category-selector {
  display: flex;
  height: 100%;
}

.main-category {
  width: 180rpx;
  background-color: #f6f6f6;
  height: 100%;
}

.main-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 24rpx 0;
  font-size: 26rpx;
  color: #8e8e93;
  transition: all 0.2s ease;

  &.active {
    background-color: #fff;
    color: #ff6700;
    font-weight: 600;
  }
}

.sub-category {
  flex: 1;
  padding: 20rpx;
  height: 100%;
}

.sub-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32rpx;
}

.sub-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;

  text {
    font-size: 26rpx;
    color: #1c1c1e;
  }
}

.sub-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 账户列表 */
.account-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 0 30rpx;
}

.account-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  background: #f6f6f6;
  border-radius: 20rpx;
  transition: all 0.2s ease;

  &:active {
    background-color: #f0f0f0;
    transform: scale(0.98);
  }
}

.account-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.account-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background-color: rgba(255, 103, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.account-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #1c1c1e;
}

.account-balance {
  font-size: 26rpx;
  color: #8e8e93;
}

/* 时间选项 */
.date-options {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 0 30rpx;
}

.date-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  background: #f6f6f6;
  border-radius: 20rpx;
  transition: all 0.2s ease;

  &:active {
    background-color: #f0f0f0;
    transform: scale(0.98);
  }
}

.option-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.option-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #1c1c1e;
}

/* 键盘弹层样式 */
.keyboard-popup { 
	padding: 12rpx; 
	padding-bottom: env(safe-area-inset-bottom);
	background-color: #f6f6f6;
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
}
.toolbar {
	padding: 8rpx 8rpx 0 8rpx;
}
.drag-bar {
	width: 80rpx;
	height: 8rpx;
	background-color: #dcdcdc;
	border-radius: 4rpx;
	margin: 0 auto 16rpx auto;
}
.toolbar-actions {
	display: flex;
}
.toolbar .spacer { flex: 1; }
.toolbar .done {
	font-size: 30rpx;
	font-weight: 500;
	color: #ff6700;
	padding: 12rpx 16rpx;
}

.key-row { display: flex; gap: 12rpx; }
.key { flex: 1; height: 108rpx; background: #fff; border-radius: 18rpx; display: flex; align-items: center; justify-content: center; font-size: 40rpx; color: #1c1c1e; margin-bottom: 12rpx; transition: transform .08s ease, background .2s ease; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06); }
.key:active { transform: scale(0.98); background: #f1f1f1; }

.popup-action {
  padding: 8rpx 8rpx 20rpx 8rpx;
}
</style>
