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
							<tn-swipe-action>
								<tn-swipe-action-item v-for="item in group.items" :key="item.id" :options="swipeOptions"
									@click="handleSwipeClick($event, item.id)">
									<view class="transaction-item">
										<view class="icon-wrapper" :style="{ backgroundColor: item.category.color }">
											<tn-icon :name="item.category.icon" size="40" color="#fff"></tn-icon>
										</view>
										<view class="item-details">
											<text class="category-name">{{ item.category.name }}</text>
											<text class="notes" v-if="item.notes">{{ item.notes }}</text>
										</view>
										<text class="amount" :class="item.type">{{ formatAmount(item.amount, item.type)
										}}</text>
									</view>
								</tn-swipe-action-item>
							</tn-swipe-action>
						</view>
					</view>
				</template>
			</view>
		</view>

		<!-- 底部 TabBar -->
		<ay-tabbar :currentTab="1" is-float text-only frosted></ay-tabbar>

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
import { ref, computed } from 'vue';

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const showMonthPicker = ref(false);
const showFilterPopup = ref(false);

const swipeOptions = ref([
	{
		text: '编辑',
		style: {
			backgroundColor: '#007aff',
		}
	},
	{
		text: '删除',
		style: {
			backgroundColor: '#ff3b30',
		}
	}
]);

// 扩展后的静态数据
const mockTransactions = ref([
	{ id: 1, type: 'expense', amount: 28.00, category: { name: '午餐', icon: 'eat', color: '#ff9f0a' }, notes: '公司楼下简餐', date: '2023-10-28' },
	{ id: 2, type: 'expense', amount: 15.00, category: { name: '地铁', icon: 'car', color: '#5ac8fa' }, notes: '', date: '2023-10-28' },
	{ id: 3, type: 'income', amount: 500.00, category: { name: '兼职', icon: 'fire', color: '#34c759' }, notes: '设计稿件', date: '2023-10-28' },
	{ id: 4, type: 'expense', amount: 188.00, category: { name: '晚餐', icon: 'eat', color: '#ff9f0a' }, notes: '家庭聚餐', date: '2023-10-27' },
	{ id: 5, type: 'expense', amount: 79.00, category: { name: '日用品', icon: 'shop', color: '#af52de' }, notes: '超市购物', date: '2023-10-27' },
	{ id: 6, type: 'expense', amount: 5999.00, category: { name: '手机数码', icon: 'mobile', color: '#ff3b30' }, notes: 'iPhone 15 Pro', date: '2023-10-26' },
	{ id: 7, type: 'income', amount: 12000.00, category: { name: '工资', icon: 'fire', color: '#34c759' }, notes: '', date: '2023-10-25' },
	{ id: 8, type: 'expense', amount: 250.00, category: { name: '加油', icon: 'science', color: '#ff2d55' }, notes: '', date: '2023-10-22' },
	{ id: 9, type: 'expense', amount: 35.00, category: { name: '电影', icon: 'ticket', color: '#007aff' }, notes: '《坚如磐石》', date: '2023-10-22' },
]);

const openFilterPopup = () => {
	showFilterPopup.value = true;
};

const handleSwipeClick = (event, id) => {
	const { index } = event;
	const action = index === 0 ? '编辑' : '删除';
	uni.showToast({
		title: `${action}了ID为 ${id} 的记录`,
		icon: 'none'
	});
};

// 计算总收入和总支出
const summary = computed(() => {
	return mockTransactions.value.reduce((acc, item) => {
		if (item.type === 'income') {
			acc.income += item.amount;
		} else {
			acc.expense += item.amount;
		}
		return acc;
	}, { income: 0, expense: 0 });
});

// 格式化金额
const formatAmount = (num, type = null) => {
	const formatted = parseFloat(num).toFixed(2);
	if (type === 'income') return `+${formatted}`;
	// 支出默认不带负号，颜色区分
	if (type === 'expense') return `-${formatted}`;
	return formatted;
};

// 按日期分组交易
const groupedTransactions = computed(() => {
	const groups = {};
	mockTransactions.value.forEach(item => {
		if (!groups[item.date]) {
			groups[item.date] = { date: formatDateLabel(item.date), items: [], summary: { expense: 0, income: 0 } };
		}
		groups[item.date].items.push(item);
		if (item.type === 'expense') {
			groups[item.date].summary.expense += item.amount;
		} else {
			groups[item.date].summary.income += item.amount;
		}
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

::v-deep .tn-swipe-action-item__right__button {
	padding: 0 40rpx !important;
}

.transaction-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	transition: background-color 0.2s ease;

	&:active {
		background-color: #f8f8f8;
	}

	.icon-wrapper {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 24rpx;
	}

	.item-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6rpx;

		.category-name {
			font-size: 30rpx;
			color: #1c1c1e;
		}

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
