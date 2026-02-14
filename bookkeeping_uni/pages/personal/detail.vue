<template>
	<view class="detail-container">
		<!-- 自定义导航栏 -->
		<NavbarWrapper sticky>
			<view class="custom-navbar">
				<view class="nav-left" @click="openFilterPopup">
					<tn-icon name="filter" size="44"></tn-icon>
				</view>
				<view class="nav-center" @click="openMonthPicker">
					<view class="month-selector">
						<text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
					</view>
				</view>
				<view class="nav-right">
				</view>
			</view>
		</NavbarWrapper>

		<!-- 统计信息卡片 -->
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
		</ay-skeleton>

		<!-- 底部 TabBar -->
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
						<view class="filter-tag" :class="{ active: filterType === 'expense' }" @click="filterType = 'expense'">支出</view>
						<view class="filter-tag" :class="{ active: filterType === 'income' }" @click="filterType = 'income'">收入</view>
					</view>
				</view>
				<view class="filter-section">
					<text class="filter-label">账户</text>
					<view class="filter-options">
						<view class="filter-tag" :class="{ active: filterAccountId === '' }" @click="filterAccountId = ''">全部</view>
						<view class="filter-tag" v-for="acc in accounts" :key="acc.id"
							:class="{ active: filterAccountId === String(acc.id) }"
							@click="filterAccountId = String(acc.id)">{{ acc.name }}</view>
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
							<tn-icon name="left" size="40" color="#333"></tn-icon>
						</view>
						<text class="year-text">{{ pickerYear }}年</text>
						<view class="year-arrow" @click="pickerYear++">
							<tn-icon name="right" size="40" color="#333"></tn-icon>
						</view>
					</view>
					<view class="month-grid">
						<view class="month-item" v-for="m in 12" :key="m"
							:class="{ active: pickerYear === currentYear && m === currentMonth }"
							@click="selectMonth(m)">
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
import { onShow } from '@dcloudio/uni-app';
import { personalTransactionApi } from '@/api/personal_transaction';
import { personalAccountApi } from '@/api/personal_account';

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const showMonthPicker = ref(false);
const showFilterPopup = ref(false);
const pickerYear = ref(new Date().getFullYear());

const filterType = ref('');
const filterAccountId = ref('');
const accounts = ref([]);

const mockTransactions = ref([]);
const pageLoaded = ref(false);

const loadAccounts = async () => {
	try {
		const res = await personalAccountApi.getList();
		if (res.success) accounts.value = res.data.list;
	} catch (e) { /* 拦截器处理 */ }
};

const loadData = async () => {
	try {
		const params = {
			year: currentYear.value, month: currentMonth.value, pageSize: 100,
		};
		if (filterType.value) params.type = filterType.value;
		if (filterAccountId.value) params.account_id = filterAccountId.value;
		const res = await personalTransactionApi.getList(params);
		if (res.success) mockTransactions.value = res.data.list;
		pageLoaded.value = true;
	} catch (e) { pageLoaded.value = true; }
};

const openMonthPicker = () => {
	pickerYear.value = currentYear.value;
	showMonthPicker.value = true;
};

const selectMonth = (m) => {
	currentYear.value = pickerYear.value;
	currentMonth.value = m;
	showMonthPicker.value = false;
	loadData();
};

const openFilterPopup = () => { showFilterPopup.value = true; };

const resetFilter = () => {
	filterType.value = '';
	filterAccountId.value = '';
};

const applyFilter = () => {
	showFilterPopup.value = false;
	loadData();
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
					loadData();
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

onShow(() => { loadData(); loadAccounts(); });
</script>

<style lang="scss" scoped>
.detail-container {
	background-color: #f6f6f6;
	min-height: 100vh; min-height: 100dvh;
	padding-bottom: 160rpx;
}

.custom-navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 88rpx;
	padding: 0 30rpx;
	background-color: #f6f6f6;
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
	background-color: #ff6700;
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

.stats-card {
	display: flex;
	align-items: center;
	background: #fff;
	margin: 20rpx 30rpx;
	border-radius: 24rpx;
	padding: 30rpx 0;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);
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
	color: #8e8e93;
}

.stats-value {
	font-size: 36rpx;
	font-weight: 600;

	&.expense {
		color: #333;
	}

	&.income {
		color: #34c759;
	}
}

.stats-divider {
	width: 1rpx;
	height: 60rpx;
	background-color: #f0f0f0;
}

.transactions-section {
	padding: 0 30rpx;
	background-color: #f6f6f6;
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
		color: #1c1c1e;
	}

	.summary {
		font-size: 24rpx;
		color: #8e8e93;
	}
}

.group-items {
	background: #fff;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);
	overflow: hidden;
}

.item-fixed-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding-left: 24rpx;
	background: #fff;
}

.icon-wrapper {
	width: 80rpx; height: 80rpx; border-radius: 50%;
	display: flex; justify-content: center; align-items: center;
	flex-shrink: 0;
}

.category-name { font-size: 30rpx; color: #1c1c1e; white-space: nowrap; }

.action-btn-circle {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	&.edit-btn { background-color: #ff6700; }
	&.delete-btn { background-color: #ff3b30; }
	&:active { opacity: 0.8; transform: scale(0.92); }
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
		flex: 1; display: flex; flex-direction: column; gap: 6rpx;
		.notes { font-size: 24rpx; color: #8e8e93; text-align: right; }
	}

	.amount {
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: -1rpx;
		&.expense { color: #1c1c1e; }
		&.income { color: #34c759; }
	}
}

/* 弹层样式 */
.popup-content {
	padding: 12rpx 30rpx 40rpx 30rpx;
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

.popup-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1c1c1e;
}

.filter-section {
	margin-bottom: 40rpx;
}

.filter-label {
	font-size: 28rpx;
	font-weight: 500;
	color: #8e8e93;
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
	background-color: #f6f6f6;
	border-radius: 999rpx;
	font-size: 28rpx;
	color: #1c1c1e;
	transition: all 0.2s ease;

	&.active {
		background-color: #ff6700;
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
		background-color: #f6f6f6;
		color: #1c1c1e;
	}

	&.confirm {
		background-color: #ff6700;
		color: #fff;
	}
}

.month-picker-body {
	padding: 0 10rpx;
}
.year-row {
	display: flex; align-items: center; justify-content: center; gap: 40rpx; margin-bottom: 30rpx;
}
.year-arrow {
	width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center;
	border-radius: 50%; background: #f6f6f6;
	&:active { background: #eee; }
}
.year-text { font-size: 34rpx; font-weight: 600; color: #1c1c1e; }
.month-grid {
	display: grid; grid-template-columns: repeat(4, 1fr); gap: 20rpx;
}
.month-item {
	height: 80rpx; display: flex; align-items: center; justify-content: center;
	border-radius: 16rpx; background: #f6f6f6; font-size: 30rpx; color: #333;
	transition: all 0.2s;
	&:active { transform: scale(0.96); }
	&.active { background: #ff6700; color: #fff; font-weight: 600; }
}
</style>
