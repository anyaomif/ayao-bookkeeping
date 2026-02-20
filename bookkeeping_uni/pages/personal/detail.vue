<template>
	<view class="detail-container" :style="themeVars">
		<!-- 自定义导航栏 -->
		<NavbarWrapper sticky :bgColor="navBgColor">
			<view class="custom-navbar" v-if="!showSearch">
				<view class="nav-left" @click="openSearch">
					<tn-icon name="search" size="44" :color="isDark ? '#f5f5f5' : '#1c1c1e'"></tn-icon>
				</view>
				<view class="nav-center" @click="openMonthPicker">
					<view class="month-selector">
						<text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
					</view>
				</view>
				<view class="nav-right" @click="openFilterPopup">
					<tn-icon name="filter" size="44" :color="isDark ? '#f5f5f5' : '#1c1c1e'"></tn-icon>
				</view>
			</view>
			<view class="search-navbar" v-else>
				<view class="search-input-wrap">
					<tn-icon name="search" size="32" :color="isDark ? '#8e8e93' : '#999'"></tn-icon>
					<input class="search-input" v-model="keyword" placeholder="搜索备注、分类、金额" confirm-type="search"
						@confirm="doSearch" :focus="showSearch" />
					<view class="search-clear" v-if="keyword" @click="keyword = ''; doSearch()">
						<tn-icon name="close-circle-fill" size="32" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
					</view>
				</view>
				<text class="search-cancel" @click="cancelSearch">取消</text>
			</view>
		</NavbarWrapper>

		<!-- 统计信息卡片 -->
		<ay-skeleton :loading="!pageLoaded">
			<template #skeleton>
				<view style="margin: 20rpx 30rpx;">
					<view class="sk-block sk-card" style="height: 140rpx;"></view>
				</view>
			</template>
			<view class="stats-card">
				<view class="stats-item">
					<text class="stats-label">总支出</text>
					<text class="stats-value expense">¥{{ formatAmount(summary.expense, null) }}</text>
				</view>
				<view class="stats-divider"></view>
				<view class="stats-item">
					<text class="stats-label">总收入</text>
					<text class="stats-value income">¥{{ formatAmount(summary.income, null) }}</text>
				</view>
			</view>
		</ay-skeleton>

		<!-- 交易流水 -->
		<ay-skeleton :loading="!pageLoaded">
			<template #skeleton>
				<view style="padding: 0 30rpx;">
					<view class="sk-block" style="width: 200rpx; height: 32rpx; margin-bottom: 20rpx;"></view>
					<view class="sk-block sk-card" style="height: 128rpx; margin-bottom: 16rpx;" v-for="i in 5" :key="i"></view>
				</view>
			</template>
			<view class="transactions-section">
				<view class="transactions-list">
					<template v-for="(group, index) in groupedTransactions" :key="index">
						<view class="date-group">
							<view class="group-header">
								<text class="date-label">{{ group.date }}</text>
								<text class="summary">支出: ¥{{ formatAmount(group.summary.expense) }} 收入: ¥{{
									formatAmount(group.summary.income) }}</text>
							</view>
							<view class="group-items">
								<ay-swipe-cell v-for="item in group.items" :key="item.id" :name="item.id" fixed-left group="detail">
									<template #left>
										<view class="item-fixed-left">
											<view class="icon-wrapper" :style="{ backgroundColor: item.category.color }">
												<tn-icon :name="item.category.icon" size="40" color="#fff"></tn-icon>
											</view>
											<text class="category-name">{{ item.category.name }}</text>
										</view>
									</template>
									<view class="transaction-item">
										<view class="item-details">
											<text class="notes" v-if="item.notes">{{ item.notes }}</text>
										</view>
										<text class="amount" :class="item.type">{{ formatAmount(item.amount, item.type) }}</text>
									</view>
									<template #actions>
										<view class="action-btn-circle edit-btn" @click="goToEdit(item.id)">
											<tn-icon name="edit" size="36" color="#fff"></tn-icon>
										</view>
										<view class="action-btn-circle delete-btn" @click="confirmDelete(item.id)">
											<tn-icon name="delete" size="36" color="#fff"></tn-icon>
										</view>
									</template>
								</ay-swipe-cell>
							</view>
						</view>
					</template>
				</view>
			</view>
			<view class="load-more" v-if="pageLoaded">
				<text class="load-more-text" v-if="loadingMore">加载中...</text>
				<text class="load-more-text" v-else-if="noMore">没有更多了</text>
			</view>
		</ay-skeleton>
		<ay-tabbar :currentTab="1" is-float text-only frosted mode="personal"></ay-tabbar>

		<!-- 筛选弹层 -->
		<ay-popup v-model="showFilterPopup" position="bottom" :duration="300" draggable show-drag-handle>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">筛选</text>
				</view>
				<view class="filter-section">
					<text class="filter-label">类型</text>
					<view class="filter-options">
						<view class="filter-tag" :class="{ active: filterType === '' }" @click="filterType = ''">全部</view>
						<view class="filter-tag" :class="{ active: filterType === 'expense' }" @click="filterType = 'expense'">支出
						</view>
						<view class="filter-tag" :class="{ active: filterType === 'income' }" @click="filterType = 'income'">收入
						</view>
					</view>
				</view>
				<view class="filter-section">
					<text class="filter-label">账户</text>
					<view class="filter-options">
						<view class="filter-tag" :class="{ active: filterAccountId === '' }" @click="filterAccountId = ''">全部</view>
						<view class="filter-tag" v-for="acc in accounts" :key="acc.id"
							:class="{ active: filterAccountId === String(acc.id) }" @click="filterAccountId = String(acc.id)">{{
								acc.name
							}}</view>
					</view>
				</view>
				<view class="popup-actions">
					<view class="action-btn reset" @click="resetFilter">重置</view>
					<view class="action-btn confirm" @click="applyFilter">确认</view>
				</view>
			</view>
		</ay-popup>

		<!-- 月份选择弹层 -->
		<ay-popup v-model="showMonthPicker" position="bottom" :duration="300" draggable show-drag-handle>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">选择月份</text>
				</view>
				<view class="month-picker-body">
					<view class="year-row">
						<view class="year-arrow" @click="pickerYear--">
							<tn-icon name="left" size="40" :color="isDark ? '#f5f5f5' : '#333'"></tn-icon>
						</view>
						<text class="year-text">{{ pickerYear }}年</text>
						<view class="year-arrow" @click="pickerYear++">
							<tn-icon name="right" size="40" :color="isDark ? '#f5f5f5' : '#333'"></tn-icon>
						</view>
					</view>
					<view class="month-grid">
						<view class="month-item" v-for="m in 12" :key="m"
							:class="{ active: pickerYear === currentYear && m === currentMonth }" @click="selectMonth(m)">
							<text>{{ m }}月</text>
						</view>
					</view>
				</view>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShow, onPageScroll, onReachBottom } from '@dcloudio/uni-app';
import { personalTransactionApi } from '@/api/personal_transaction';
import { personalAccountApi } from '@/api/personal_account';
import { isDarkMode, getThemeMode, getThemeVars, setPageBgColor } from '@/utils/theme';

const isDark = ref(false);
const isLight = ref(false);
const themeVars = ref({});
const refreshTheme = () => {
	const mode = getThemeMode();
	isDark.value = mode === 'dark' || (mode === 'system' && isDarkMode());
	isLight.value = mode === 'light';
	themeVars.value = getThemeVars();
	setPageBgColor();
};

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const showMonthPicker = ref(false);
const showFilterPopup = ref(false);
const pickerYear = ref(new Date().getFullYear());

const navBgColor = ref('transparent');
onPageScroll((e) => {
	const t = Math.min(e.scrollTop / 100, 1);
	const bg = isDark.value ? '28,28,30' : '255,255,255';
	navBgColor.value = t <= 0 ? 'transparent' : `rgba(${bg},${t})`;
});

const filterType = ref('');
const filterAccountId = ref('');
const accounts = ref([]);

const mockTransactions = ref([]);
const pageLoaded = ref(false);

// 搜索相关
const showSearch = ref(false);
const keyword = ref('');

const openSearch = () => { showSearch.value = true; };
const cancelSearch = () => {
	showSearch.value = false;
	if (keyword.value) { keyword.value = ''; resetAndLoad(); }
};
const doSearch = () => { resetAndLoad(); };

// 分页相关
const currentPage = ref(1);
const pageSize = 20;
const loadingMore = ref(false);
const noMore = ref(false);

const resetAndLoad = () => {
	currentPage.value = 1;
	mockTransactions.value = [];
	noMore.value = false;
	loadData();
};

const loadAccounts = async () => {
	try {
		const res = await personalAccountApi.getList();
		if (res.success) accounts.value = res.data.list;
	} catch (e) { /* 拦截器处理 */ }
};

const loadData = async (append = false) => {
	if (loadingMore.value) return;
	if (append) loadingMore.value = true;
	try {
		const params = {
			year: currentYear.value, month: currentMonth.value,
			page: currentPage.value, pageSize,
		};
		if (filterType.value) params.type = filterType.value;
		if (filterAccountId.value) params.account_id = filterAccountId.value;
		if (keyword.value) params.keyword = keyword.value;
		const res = await personalTransactionApi.getList(params);
		if (res.success) {
			const list = res.data.list;
			if (append) {
				mockTransactions.value = [...mockTransactions.value, ...list];
			} else {
				mockTransactions.value = list;
			}
			noMore.value = list.length < pageSize;
		}
		pageLoaded.value = true;
	} catch (e) { pageLoaded.value = true; }
	loadingMore.value = false;
};

onReachBottom(() => {
	if (noMore.value || loadingMore.value) return;
	currentPage.value++;
	loadData(true);
});

const openMonthPicker = () => {
	pickerYear.value = currentYear.value;
	showMonthPicker.value = true;
};

const selectMonth = (m) => {
	currentYear.value = pickerYear.value;
	currentMonth.value = m;
	showMonthPicker.value = false;
	resetAndLoad();
};

const openFilterPopup = () => { showFilterPopup.value = true; };

const resetFilter = () => {
	filterType.value = '';
	filterAccountId.value = '';
};

const applyFilter = () => {
	showFilterPopup.value = false;
	resetAndLoad();
};

const goToEdit = (id) => {
	uni.navigateTo({ url: `/pages/personal/form?params=${encodeURIComponent(JSON.stringify({ id }))}` });
};

const confirmDelete = (id) => {
	uni.showModal({
		title: '确认删除',
		content: '删除后无法恢复，确定要删除这条记录吗？',
		confirmColor: '#ff3b30',
		success: async (res) => {
			if (res.confirm) {
				try {
					await personalTransactionApi.delete(id);
					uni.showToast({ title: '删除成功', icon: 'success' });
					resetAndLoad();
				} catch (e) { /* 拦截器处理 */ }
			}
		}
	});
};

const summary = computed(() => {
	return mockTransactions.value.reduce((acc, item) => {
		const amt = Number(item.amount);
		if (item.type === 'income') acc.income += amt;
		else if (item.type === 'expense') acc.expense += amt;
		return acc;
	}, { income: 0, expense: 0 });
});

const formatAmount = (num, type = null) => {
	const formatted = parseFloat(num || 0).toFixed(2);
	if (type === 'income') return `+${formatted}`;
	if (type === 'expense') return `-${formatted}`;
	return formatted;
};

const groupedTransactions = computed(() => {
	const groups = {};
	mockTransactions.value.forEach(item => {
		const dateKey = item.date;
		if (!groups[dateKey]) {
			groups[dateKey] = { date: formatDateLabel(dateKey), items: [], summary: { expense: 0, income: 0 } };
		}
		const txItem = {
			id: item.id, type: item.type, amount: Number(item.amount),
			notes: item.remark || '',
			category: item.category || { name: item.type === 'expense' ? '支出' : '收入', icon: 'eat', color: '#ff9f0a' },
		};
		groups[dateKey].items.push(txItem);
		if (item.type === 'expense') groups[dateKey].summary.expense += txItem.amount;
		else groups[dateKey].summary.income += txItem.amount;
	});
	return Object.values(groups);
});

const formatDateLabel = (dateString) => {
	const date = new Date(dateString);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
	if (date.toDateString() === today.toDateString()) return `今天 ${month}月${day}日 ${dayOfWeek}`;
	if (date.toDateString() === yesterday.toDateString()) return `昨天 ${month}月${day}日 ${dayOfWeek}`;
	return `${month}月${day}日 ${dayOfWeek}`;
};

onShow(() => {
	refreshTheme();
	resetAndLoad(); loadAccounts();
});
</script>

<style lang="scss" scoped>
.detail-container {
	background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid1) 15%, var(--bg-gradient-mid2) 35%, var(--bg-gradient-mid3) 60%, var(--bg-gradient-end) 85%);
	min-height: 100vh;
	min-height: 100dvh;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.custom-navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 88rpx;
	padding: 0 30rpx;
	background-color: transparent;
}

.nav-left,
.nav-right {
	width: 88rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.month-selector {
	background-color: var(--color-brand);
	border-radius: 32rpx;
	padding: 8rpx 28rpx;
}

.month-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #fff;
}

.nav-right {
	&:active {
		opacity: 0.7;
	}
}

.search-navbar {
	display: flex;
	align-items: center;
	height: 88rpx;
	padding: 0 30rpx;
	gap: 20rpx;
}

.search-input-wrap {
	flex: 1;
	display: flex;
	align-items: center;
	background: var(--bg-input);
	border-radius: 32rpx;
	padding: 0 24rpx;
	height: 64rpx;
	gap: 12rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: var(--text-primary);
	height: 64rpx;
}

.search-clear {
	padding: 4rpx;
}

.search-cancel {
	font-size: 28rpx;
	color: var(--color-brand);
	white-space: nowrap;
}

.stats-card {
	display: flex;
	align-items: center;
	background: var(--bg-card);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1rpx solid var(--bg-card-border);
	margin: 20rpx 30rpx;
	border-radius: 24rpx;
	padding: 30rpx 0;
	box-shadow: var(--shadow-card);
}

.stats-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.stats-label {
	font-size: 26rpx;
	color: var(--text-tertiary);
}

.stats-value {
	font-size: 36rpx;
	font-weight: 600;

	&.expense {
		color: var(--text-primary);
	}

	&.income {
		color: var(--color-income);
	}
}

.stats-divider {
	width: 1rpx;
	height: 60rpx;
	background-color: var(--bg-card-border);
}

.transactions-section {
	padding: 0 30rpx;
}

.date-group:not(:last-child) {
	margin-bottom: 20rpx;
}

.group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0 20rpx 0;

	.date-label {
		font-size: 28rpx;
		font-weight: 500;
		color: var(--text-primary);
	}

	.summary {
		font-size: 24rpx;
		color: var(--text-tertiary);
	}
}

.group-items {
	background: var(--bg-card);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1rpx solid var(--bg-card-border);
	border-radius: 24rpx;
	box-shadow: var(--shadow-card);
	overflow: hidden;
}

.item-fixed-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding-left: 24rpx;
	background: transparent;
	padding-right: 10rpx;
	box-sizing: border-box;
}

.icon-wrapper {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
}

.category-name {
	font-size: 30rpx;
	color: var(--text-primary);
	white-space: nowrap;
}

.action-btn-circle {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;

	&.edit-btn {
		background-color: var(--color-brand);
	}

	&.delete-btn {
		background-color: var(--color-danger);
	}

	&:active {
		opacity: 0.8;
		transform: scale(0.92);
	}
}

.transaction-item {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 24rpx 24rpx 24rpx 220rpx;
	min-height: 128rpx;
	box-sizing: border-box;
	gap: 16rpx;

	.item-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6rpx;

		.notes {
			font-size: 24rpx;
			color: var(--text-tertiary);
			text-align: right;
		}
	}

	.amount {
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: -1rpx;

		&.expense {
			color: var(--text-primary);
		}

		&.income {
			color: var(--color-income);
		}
	}
}

/* 弹层样式 */
.popup-content {
	padding: 12rpx 30rpx 40rpx 30rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	background-color: var(--bg-card-solid);
}

.popup-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 0 32rpx 0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: 600;
	color: var(--text-primary);
}

.filter-section {
	margin-bottom: 40rpx;
}

.filter-label {
	font-size: 28rpx;
	font-weight: 500;
	color: var(--text-tertiary);
	margin-bottom: 20rpx;
	display: block;
}

.filter-options {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.filter-tag {
	padding: 16rpx 32rpx;
	background-color: var(--bg-input);
	border-radius: 999rpx;
	font-size: 28rpx;
	color: var(--text-primary);
	transition: all 0.2s ease;

	&.active {
		background-color: var(--color-brand);
		color: #fff;
		font-weight: 500;
	}
}

.popup-actions {
	display: flex;
	gap: 20rpx;
	margin-top: 50rpx;
}

.action-btn {
	flex: 1;
	height: 96rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	font-weight: 500;
	transition: opacity 0.2s ease;

	&:active {
		opacity: 0.8;
	}

	&.reset {
		background-color: var(--bg-input);
		color: var(--text-primary);
	}

	&.confirm {
		background-color: var(--color-brand);
		color: #fff;
	}
}

.month-picker-body {
	padding: 0 10rpx;
}

.year-row {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 40rpx;
	margin-bottom: 30rpx;
}

.year-arrow {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: var(--bg-input);

	&:active {
		background: var(--divider);
	}
}

.year-text {
	font-size: 34rpx;
	font-weight: 600;
	color: var(--text-primary);
}

.month-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx;
}

.month-item {
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 16rpx;
	background: var(--bg-input);
	font-size: 30rpx;
	color: var(--text-primary);
	transition: all 0.2s;

	&:active {
		transform: scale(0.96);
	}

	&.active {
		background: var(--color-brand);
		color: #fff;
		font-weight: 600;
	}
}

.load-more {
	display: flex;
	justify-content: center;
	padding: 30rpx 0 20rpx;
}

.load-more-text {
	font-size: 26rpx;
	color: var(--text-placeholder);
}
</style>
