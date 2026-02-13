<template>
	<view class="detail-container">
		<!-- 自定义导航栏 -->
		<NavbarWrapper sticky>
			<view class="custom-navbar">
				<view class="nav-left">
				</view>
				<view class="nav-center" @click="showMonthPicker = true">
					<text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
					<tn-icon name="down" size="32" color="#333"></tn-icon>
				</view>
				<view class="nav-right" @click="openFilterPopup">
					<tn-icon name="filter" size="44"></tn-icon>
				</view>
			</view>
		</NavbarWrapper>

		<!-- 统计信息卡片 -->
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

		<!-- 交易流水 -->
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
							<view class="swipe-wrapper" v-for="item in group.items" :key="item.id">
								<view class="item-fixed-left">
									<view class="icon-wrapper" :style="{ backgroundColor: item.category.color }">
										<tn-icon :name="item.category.icon" size="40" color="#fff"></tn-icon>
									</view>
									<text class="category-name">{{ item.category.name }}</text>
								</view>
								<view class="swipe-content" :class="{ 'no-transition': isDragging }" :style="{ transform: `translateX(${getSwipeX(item.id)}rpx)` }"
									@touchstart="onSwipeStart($event, item)"
									@touchmove="onSwipeMove($event, item)"
									@touchend="onSwipeEnd(item)">
									<view class="transaction-item">
										<view class="item-details">
											<text class="notes" v-if="item.notes">{{ item.notes }}</text>
										</view>
										<text class="amount" :class="item.type">{{ formatAmount(item.amount, item.type) }}</text>
									</view>
								</view>
								<view class="swipe-actions">
									<view class="action-btn-circle edit-btn" @click="goToEdit(item.id)">
										<tn-icon name="edit" size="36" color="#fff"></tn-icon>
									</view>
									<view class="action-btn-circle delete-btn" @click="confirmDelete(item.id)">
										<tn-icon name="delete" size="36" color="#fff"></tn-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>

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
						<view class="filter-tag active">全部</view>
						<view class="filter-tag">支出</view>
						<view class="filter-tag">收入</view>
					</view>
				</view>
				<view class="filter-section">
					<text class="filter-label">账户</text>
					<view class="filter-options">
						<view class="filter-tag active">全部</view>
						<view class="filter-tag">现金</view>
						<view class="filter-tag">银行卡</view>
						<view class="filter-tag">微信钱包</view>
						<view class="filter-tag">支付宝</view>
					</view>
				</view>

				<view class="popup-actions">
					<view class="action-btn reset">重置</view>
					<view class="action-btn confirm">确认</view>
				</view>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { personalTransactionApi } from '@/api/personal_transaction';

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const showMonthPicker = ref(false);
const showFilterPopup = ref(false);

const mockTransactions = ref([]);

// 滑动手势
const SWIPE_OPEN = -220;
const swipeState = reactive({});
const isDragging = ref(false);
let swipeStartX = 0;
let swipeStartY = 0;
let swipeLocked = false;
let currentSwipeId = null;

const getSwipeX = (id) => swipeState[id] || 0;

const closeAllSwipe = () => {
	Object.keys(swipeState).forEach(k => { swipeState[k] = 0; });
	currentSwipeId = null;
};

const onSwipeStart = (e, item) => {
	swipeStartX = e.touches[0].clientX;
	swipeStartY = e.touches[0].clientY;
	swipeLocked = false;
	isDragging.value = true;
	if (currentSwipeId && currentSwipeId !== item.id) {
		swipeState[currentSwipeId] = 0;
	}
	currentSwipeId = item.id;
};

const onSwipeMove = (e, item) => {
	const dx = e.touches[0].clientX - swipeStartX;
	const dy = e.touches[0].clientY - swipeStartY;
	if (!swipeLocked && Math.abs(dy) > Math.abs(dx)) {
		swipeLocked = true;
	}
	if (swipeLocked) return;
	let x = (swipeState[item.id] || 0) + dx * 2;
	if (x > 0) x = 0;
	if (x < SWIPE_OPEN) x = SWIPE_OPEN;
	swipeState[item.id] = x;
	swipeStartX = e.touches[0].clientX;
	swipeStartY = e.touches[0].clientY;
};

const onSwipeEnd = (item) => {
	isDragging.value = false;
	if (swipeLocked) return;
	const x = swipeState[item.id] || 0;
	swipeState[item.id] = x < SWIPE_OPEN / 2 ? SWIPE_OPEN : 0;
};

const loadData = async () => {
	try {
		const res = await personalTransactionApi.getList({
			year: currentYear.value, month: currentMonth.value, pageSize: 100,
		});
		if (res.success) mockTransactions.value = res.data.list;
	} catch (e) { /* 拦截器处理 */ }
};

const openFilterPopup = () => { showFilterPopup.value = true; };

const goToEdit = (id) => {
	closeAllSwipe();
	uni.navigateTo({ url: `/pages/personal/form?params=${encodeURIComponent(JSON.stringify({ id }))}` });
};

const confirmDelete = (id) => {
	closeAllSwipe();
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

onShow(() => { loadData(); });
</script>

<style lang="scss" scoped>
.detail-container {
	background-color: #f6f6f6;
	min-height: 100vh;
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
	font-size: 32rpx;
	font-weight: 500;
	color: #1c1c1e;

	.month-text {
		margin-right: 8rpx;
	}
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

.swipe-wrapper {
	position: relative;
	overflow: hidden;
	display: flex;
	align-items: center;
	min-height: 128rpx;
	&:not(:last-child) { border-bottom: 1rpx solid #f5f5f5; }
}

.item-fixed-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding-left: 24rpx;
	position: relative;
	z-index: 2;
	flex-shrink: 0;

	.icon-wrapper {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.category-name { font-size: 30rpx; color: #1c1c1e; white-space: nowrap; }
}

.swipe-content {
	flex: 1;
	position: relative;
	z-index: 1;
	background: #fff;
	transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	&.no-transition { transition: none; }
}

.swipe-actions {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	width: 220rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	z-index: 0;
}

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
	padding: 28rpx 24rpx 28rpx 16rpx;

	.item-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6rpx;

		.notes {
			font-size: 24rpx;
			color: #8e8e93;
		}
	}

	.amount {
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: -1rpx;

		&.expense {
			color: #1c1c1e;
		}

		&.income {
			color: #34c759;
		}
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
</style>
