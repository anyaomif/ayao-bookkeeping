<template>
  <view class="form-container">
    <!-- 自定义导航栏 -->
    <NavbarWrapper sticky>
      <view class="custom-navbar">
        <view class="nav-left" @click="goBack">
          <tn-icon name="left" size="44" color="#1c1c1e"></tn-icon>
        </view>
        <view class="nav-center">
          <text class="nav-title">{{ isEdit ? '编辑记录' : '记一笔' }}</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </NavbarWrapper>

    <!-- 交易类型选择 -->
    <view class="type-selector">
      <view class="segmented">
        <view class="seg-slider" :style="{ transform: `translateX(${typeIndex * 100}%)` }"></view>
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
      <view class="amount-display">
        <view class="expression-row" v-if="expression">
          <text class="expression-text">{{ expression }}</text>
        </view>
        <view class="amount-row">
          <text class="currency">¥</text>
          <text class="major">{{ majorAmount }}</text>
          <text class="minor">.{{ minorAmount }}</text>
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

        <view class="info-item" @click="accounts.length ? openAccount() : goAddAccount()">
          <view class="item-left">
            <view class="account-icon">
              <tn-icon name="bankcard" size="40" color="#ff6700"></tn-icon>
            </view>
            <view class="item-content">
              <text class="item-title">{{ accounts.length ? selectedAccount.name : '去添加账户' }}</text>
              <text class="item-subtitle" v-if="accounts.length">余额 ¥{{ formatAmount(selectedAccount.balance) }}</text>
              <text class="item-subtitle" v-else>暂无账户，点击添加</text>
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
        <ay-textarea v-model="remark" placeholder="添加备注（可选）" :maxlength="60" rows="3" :border="false" style="border-radius: 24rpx;"></ay-textarea>
      </view>
    </view>

    <!-- 金额键盘（固定底部） -->
    <view class="keyboard-fixed" :class="{ 'kb-hidden': !keyboardVisible }">
      <view class="keyboard-body">
        <view class="keyboard-left">
          <view class="key-row">
            <view class="key" @click="onKeyPress('1')"><text>1</text></view>
            <view class="key" @click="onKeyPress('2')"><text>2</text></view>
            <view class="key" @click="onKeyPress('3')"><text>3</text></view>
          </view>
          <view class="key-row">
            <view class="key" @click="onKeyPress('4')"><text>4</text></view>
            <view class="key" @click="onKeyPress('5')"><text>5</text></view>
            <view class="key" @click="onKeyPress('6')"><text>6</text></view>
          </view>
          <view class="key-row">
            <view class="key" @click="onKeyPress('7')"><text>7</text></view>
            <view class="key" @click="onKeyPress('8')"><text>8</text></view>
            <view class="key" @click="onKeyPress('9')"><text>9</text></view>
          </view>
          <view class="key-row">
            <view class="key" @click="onKeyPress('.')"><text>.</text></view>
            <view class="key" @click="onKeyPress('0')"><text>0</text></view>
            <view class="key" @click="onKeyPress('del')">
              <tn-icon name="delete" size="44" color="#333"></tn-icon>
            </view>
          </view>
        </view>
        <view class="keyboard-right">
          <view class="key key-collapse" @click="collapseKeyboard">
            <tn-icon name="down" size="40" color="#333"></tn-icon>
          </view>
          <view class="key key-func" @click="onKeyPress('+')"><text>+</text></view>
          <view class="key key-func" @click="onKeyPress('-')"><text>−</text></view>
          <view class="key key-submit" @click="onKeyPress('=')">
            <text v-if="hasOperator">=</text>
            <text v-else>{{ isEdit ? '保存' : '记一笔' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 悬浮展开按钮 -->
    <view class="fab-btn" :class="{ 'fab-hidden': keyboardVisible }" @click="expandKeyboard">
      <tn-icon name="edit" size="48" color="#fff"></tn-icon>
    </view>

    <!-- 分类选择弹层 -->
    <ay-popup v-model="showCategory" position="bottom" :duration="300" draggable show-drag-handle>
      <view class="popup-content" style="height: 60vh;">
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
              <view class="sub-item use-parent" @click="selectParentCategory">
                <view class="sub-icon-wrapper" :style="{ backgroundColor: activeMainCategoryData?.color || '#ff9f0a' }">
                  <tn-icon :name="activeMainCategoryData?.icon || 'eat'" size="44" color="#fff"></tn-icon>
                </view>
                <text>{{ activeMainCategory }}(全部)</text>
              </view>
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
                <tn-icon name="bankcard" size="44" color="#ff6700"></tn-icon>
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
          <view class="date-option" @click="openCalendar">
            <view class="option-left">
              <tn-icon name="calendar" size="44" color="#8e8e93"></tn-icon>
              <text class="option-text">更多日期</text>
            </view>
          </view>
        </view>
      </view>
    </ay-popup>

    <!-- 日历弹层 -->
    <ay-popup v-model="showCalendar" position="bottom" :duration="300" draggable show-drag-handle>
      <view class="popup-content">
        <ay-calendar v-if="showCalendar" startDate="2025-01-01" :endDate="todayStr" :showLunar="false" @date-selected="onCalendarSelect"></ay-calendar>
      </view>
    </ay-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { personalCategoryApi } from '@/api/personal_category'
import { personalAccountApi } from '@/api/personal_account'
import { personalTransactionApi } from '@/api/personal_transaction'
import { getParams } from '@/utils/ayao.js'

const editId = ref(null)
const isEdit = computed(() => !!editId.value)

const currentType = ref('expense')
const typeIndex = computed(() => {
  const map = { expense: 0, income: 1, transfer: 2 }
  return map[currentType.value] || 0
})
const amount = ref('0')
const expression = ref('')
const operator = ref('')
const firstOperand = ref('')
const remark = ref('')

const hasOperator = computed(() => !!operator.value)

const selectedCategory = ref({ id: null, name: '请选择', icon: 'eat', color: '#ff9f0a' })
const selectedAccount = ref({ id: null, name: '请选择', balance: 0 })
const currentDate = ref(new Date())

const showCategory = ref(false)
const showAccount = ref(false)
const showDate = ref(false)
const showCalendar = ref(false)
const keyboardVisible = ref(true)
const activeMainCategory = ref('')

const categories = ref({ expense: [], income: [], transfer: [] })
const accounts = ref([])

const activeSubCategories = computed(() => {
  const list = categories.value[currentType.value] || [];
  const main = list.find(c => c.name === activeMainCategory.value);
  return main ? main.subcategories : [];
})

const activeMainCategoryData = computed(() => {
  const list = categories.value[currentType.value] || [];
  return list.find(c => c.name === activeMainCategory.value) || null;
})

const dataLoaded = ref(false)

const loadData = async () => {
  if (dataLoaded.value) return
  try {
    const [catRes, accRes] = await Promise.all([
      personalCategoryApi.getAll(),
      personalAccountApi.getList(),
    ]);
    if (catRes.success) {
      categories.value = catRes.data;
    }
    if (accRes.success) {
      accounts.value = accRes.data.list;
      if (!accounts.value.length) {
        await personalAccountApi.init();
        const retry = await personalAccountApi.getList();
        if (retry.success) accounts.value = retry.data.list;
      }
    }

    if (editId.value) {
      const detailRes = await personalTransactionApi.getDetail(editId.value);
      if (detailRes.success) {
        const d = detailRes.data;
        currentType.value = d.type;
        amount.value = String(parseFloat(d.amount));
        remark.value = d.remark || '';
        if (d.date) {
          const parts = d.date.split('-');
          currentDate.value = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
        if (d.category_id) {
          const cid = Number(d.category_id);
          const mainList = categories.value[d.type] || [];
          for (const main of mainList) {
            if (Number(main.id) === cid) {
              activeMainCategory.value = main.name;
              selectedCategory.value = { id: main.id, name: main.name, icon: main.icon, color: main.color };
              break;
            }
            const sub = (main.subcategories || []).find(s => Number(s.id) === cid);
            if (sub) {
              activeMainCategory.value = main.name;
              selectedCategory.value = sub;
              break;
            }
          }
        }
        const acc = accounts.value.find(a => Number(a.id) === Number(d.account_id));
        if (acc) selectedAccount.value = acc;
      }
    } else {
      const firstMain = categories.value[currentType.value]?.[0];
      if (firstMain) {
        activeMainCategory.value = firstMain.name;
        if (firstMain.subcategories?.length) {
          selectedCategory.value = firstMain.subcategories[0];
        }
      }
      if (accounts.value.length) selectedAccount.value = accounts.value[0];
    }
    dataLoaded.value = true;
  } catch (e) { /* 拦截器处理 */ }
}

onLoad((options) => {
  const params = getParams(options)
  if (params?.id) {
    editId.value = Number(params.id)
    uni.setNavigationBarTitle({ title: '编辑记录' })
  }
  loadData()
})

const majorAmount = computed(() => amount.value.split('.')[0])
const minorAmount = computed(() => (amount.value.split('.')[1] || '00').padEnd(2, '0').slice(0, 2))

const calcResult = () => {
  if (!operator.value || !firstOperand.value) return;
  const a = parseFloat(firstOperand.value) || 0;
  const b = parseFloat(amount.value) || 0;
  let result = operator.value === '+' ? a + b : a - b;
  if (result < 0) result = 0;
  amount.value = String(parseFloat(result.toFixed(2)));
  expression.value = '';
  operator.value = '';
  firstOperand.value = '';
};

const onKeyPress = (key) => {
  if (key === 'del') {
    if (amount.value.length <= 1) amount.value = '0';
    else amount.value = amount.value.slice(0, -1);
    return;
  }
  if (key === '+' || key === '-') {
    if (operator.value) calcResult();
    firstOperand.value = amount.value;
    operator.value = key;
    expression.value = `${amount.value} ${key === '+' ? '+' : '−'} `;
    amount.value = '0';
    return;
  }
  if (key === '=') {
    if (operator.value) { calcResult(); return; }
    submitMock();
    return;
  }
  if (key === '.') {
    if (amount.value.includes('.')) return;
    amount.value += '.';
    return;
  }
  if (amount.value === '0') amount.value = key;
  else {
    const hasDot = amount.value.includes('.');
    if (!hasDot) amount.value += key;
    else {
      const dotIndex = amount.value.indexOf('.');
      if (amount.value.length - dotIndex <= 2) amount.value += key;
    }
  }
};

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
  const firstMainCategory = (categories.value[t] || [])[0];
  if (firstMainCategory) {
    activeMainCategory.value = firstMainCategory.name;
    if (firstMainCategory.subcategories?.length) {
      selectedCategory.value = firstMainCategory.subcategories[0];
    }
  }
}

const goBack = () => {
  uni.navigateBack()
}

const collapseKeyboard = () => { keyboardVisible.value = false; }
const expandKeyboard = () => { keyboardVisible.value = true; }

const openCategory = () => {
  showCategory.value = true
}
const openAccount = () => {
  showAccount.value = true
}
const goAddAccount = () => {
  uni.navigateTo({ url: '/pages/personal/accounts' })
}
const openDate = () => {
  showDate.value = true
}
const openCalendar = () => {
  showDate.value = false
  showCalendar.value = true
}

const selectMainCategory = (mainCategoryName) => {
  activeMainCategory.value = mainCategoryName;
  uni.vibrateShort();
}

const selectSubCategory = (subCategory) => {
  showCategory.value = false;
  setTimeout(() => {
    selectedCategory.value = subCategory;
  }, 50)
}

const selectParentCategory = () => {
  const data = activeMainCategoryData.value;
  if (data) {
    showCategory.value = false;
    setTimeout(() => {
      selectedCategory.value = { id: data.id, name: data.name, icon: data.icon, color: data.color };
    }, 50)
  }
}

const selectAccount = (acc) => {
  showAccount.value = false
  setTimeout(() => {
    selectedAccount.value = acc
  }, 50)
}

const todayStr = computed(() => {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
})

const setDateTo = (type) => {
  const now = new Date()
  if (type === 'today') currentDate.value = now
  else if (type === 'yesterday') {
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    currentDate.value = y
  }
  showDate.value = false
}

const onCalendarSelect = (date) => {
  currentDate.value = date
  showCalendar.value = false
}

const submitting = ref(false)

const submitMock = async () => {
  if (submitting.value) return
  const numAmount = parseFloat(amount.value);
  if (!numAmount || numAmount <= 0) return uni.showToast({ title: '请输入金额', icon: 'none' });
  if (!selectedAccount.value.id) return uni.showToast({ title: '请选择账户', icon: 'none' });

  submitting.value = true
  const d = currentDate.value;
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  try {
    const payload = {
      type: currentType.value,
      amount: numAmount,
      category_id: selectedCategory.value.id || null,
      account_id: selectedAccount.value.id,
      date: dateStr,
      time: timeStr,
      remark: remark.value || '',
    };
    if (editId.value) {
      await personalTransactionApi.update(editId.value, payload);
      uni.showToast({ title: '修改成功', icon: 'success' });
    } else {
      await personalTransactionApi.create(payload);
      uni.showToast({ title: '记录成功', icon: 'success' });
    }
    setTimeout(() => uni.navigateBack(), 800);
  } catch (e) {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  background-color: #f6f6f6;
  min-height: 100vh; min-height: 100dvh;
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
  padding: 10rpx 30rpx 30rpx 30rpx;
  background-color: #f6f6f6;
}

.segmented {
  display: flex;
  position: relative;
  background: #fff;
  padding: 0 8rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.seg-slider {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  width: calc((100% - 16rpx) / 3);
  height: calc(100% - 16rpx);
  background: linear-gradient(135deg, #ff6700 0%, #ff8f3d 100%);
  border-radius: 18rpx;
  box-shadow: 0 8rpx 20rpx rgba(255, 103, 0, 0.25);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.seg-item {
  flex: 1;
  text-align: center;
  padding: 22rpx 24rpx;
  border-radius: 18rpx;
  position: relative;
  z-index: 1;

  text {
    font-size: 30rpx;
    font-weight: 500;
    color: #8e8e93;
    transition: color 0.3s ease, font-weight 0.3s ease;
  }

  &.active text {
    color: #fff;
    font-weight: 600;
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
  padding: 20rpx 28rpx;
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

/* 固定底部键盘 */
.keyboard-fixed {
  position: fixed;
  left: 0; right: 0; bottom: 0; z-index: 100;
  padding: 12rpx 12rpx 0;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #f0f0f0;
  transform-origin: calc(100% - 90rpx) calc(100% - 80rpx);
  transform: scale(1);
  border-radius: 0;
  opacity: 1;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease;
  &.kb-hidden {
    transform: scale(0);
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
  }
}
.keyboard-body { display: flex; gap: 12rpx; }
.keyboard-left { flex: 3; }
.keyboard-right { flex: 1; display: flex; flex-direction: column; }
.key-row { display: flex; gap: 12rpx; }
.key {
  flex: 1; height: 100rpx; background: #fff; border-radius: 18rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: 40rpx; color: #1c1c1e; margin-bottom: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
  &:active { transform: scale(0.96); background: #e8e8e8; }
}
.key-collapse {
  background: #fff;
}
.key-func {
  background: #fff; font-size: 44rpx; font-weight: 600;
}
.key-submit {
  background: #ff6700; color: #fff; font-size: 30rpx; font-weight: 600;
  &:active { background: #e55d00; }
}

/* 悬浮展开按钮 */
.fab-btn {
  position: fixed;
  right: 40rpx; bottom: 60rpx; z-index: 99;
  width: 100rpx; height: 100rpx; border-radius: 50%;
  background: #ff6700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8rpx 30rpx rgba(255,103,0,0.4);
  transform: scale(1);
  opacity: 1;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.15s,
              opacity 0.3s ease 0.15s;
  &:active { transform: scale(0.9); }
  &.fab-hidden {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.2s ease;
  }
}

.expression-row {
  margin-bottom: 8rpx;
}
.expression-text {
  font-size: 28rpx; color: #8e8e93;
}

/* 弹层样式 */
.popup-content {
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
  padding: 24rpx 20rpx;
  background: #f6f6f6;
  border-radius: 20rpx;
  transition: all 0.2s ease;
  &:active { background-color: #f0f0f0; transform: scale(0.98); }
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

</style>
