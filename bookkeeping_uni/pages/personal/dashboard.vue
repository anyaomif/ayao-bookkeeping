<template>
	<view class="dashboard-container">
		<!-- 自定义导航栏 -->
		<NavbarWrapper sticky>
			<view class="custom-navbar">
				<view class.left>
					<tn-icon name="list" size="44"></tn-icon>
				</view>
				<view class="month-selector" @click="showMonthPicker = true">
					<text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
					<tn-icon name="down" size="32" color="#333"></tn-icon>
				</view>
				<view class="action-icons">
					<tn-icon name="search" size="44"></tn-icon>
				</view>
			</view>
		</NavbarWrapper>

		<!-- 核心财务信息 -->
		<view class="summary-hero">
			<view class="hero-content">
				<text class="hero-label">本月支出 (元)</text>
				<view class="hero-amount">
					<text class="amount-symbol">¥</text>
					<text class="amount-value">{{ formatAmount(summaryData.expense).split('.')[0] }}</text>
					<text class="amount-decimal">.{{ formatAmount(summaryData.expense).split('.')[1] }}</text>
				</view>
				<view class="hero-sub-info">
					<text>本月收入 ¥{{ formatAmount(summaryData.income) }}</text>
					<view class="divider"></view>
					<text>结余 ¥{{ formatAmount(summaryData.balance) }}</text>
				</view>
			</view>
		</view>

		<!-- 记一笔 按钮 -->
		<view class="add-transaction-btn-wrapper">
			<view class="add-transaction-btn" @click="addTransaction">
				<tn-icon name="add" size="44" color="#333"></tn-icon>
				<text>记一笔</text>
			</view>
		</view>

		<!-- 近期流水 -->
		<view class="transactions-section">
			<view class="transactions-list">
				<template v-for="(group, index) in groupedTransactions" :key="index">
					<view class="date-group">
						<view class="group-header">
							<text class="date-label">{{ group.date }}</text>
							<text class="summary">支出: ¥{{ formatAmount(group.summary.expense) }} 收入: ¥{{ formatAmount(group.summary.income) }}</text>
						</view>
						<view class="group-items">
							<view class="transaction-item" v-for="item in group.items" :key="item.id">
								<view class="icon-wrapper" :style="{ backgroundColor: item.category.color }">
									<tn-icon :name="item.category.icon" size="40" color="#fff"></tn-icon>
								</view>
								<view class="item-details">
									<text class="category-name">{{ item.category.name }}</text>
									<text class="notes" v-if="item.notes">{{ item.notes }}</text>
								</view>
								<text class="amount" :class="item.type">{{ formatAmount(item.amount, item.type) }}</text>
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		
		<!-- 底部 TabBar -->
		<ay-tabbar :currentTab="0" is-float text-only frosted></ay-tabbar>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';

	const currentYear = ref(new Date().getFullYear());
	const currentMonth = ref(new Date().getMonth() + 1);
	const showMonthPicker = ref(false);

	// 静态数据
	const summaryData = ref({
		expense: 6170.50,
		income: 12000.00,
		balance: 5829.50,
	});

	const mockTransactions = ref([
        { id: 1, type: 'expense', amount: 59.00, category: { name: '晚餐', icon: 'eat', color: '#5ac8fa' }, notes: '海底捞', date: '2023-10-27' },
		{ id: 2, type: 'expense', amount: 12.00, category: { name: '午餐', icon: 'shop', color: '#ff9500' }, notes: '公司食堂', date: '2023-10-27' },
		{ id: 3, type: 'expense', amount: 5999.00, category: { name: '手机数码', icon: 'mobile', color: '#af52de' }, notes: 'iPhone 15 Pro', date: '2023-10-26' },
		{ id: 5, type: 'expense', amount: 100.00, category: { name: '加油', icon: 'science', color: '#ff2d55' }, notes: '', date: '2023-09-05' },
    ]);

	// 格式化金额
	const formatAmount = (num, type = null) => {
		const formatted = parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		if (type === 'income') return `+${formatted}`;
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
		
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
		
		if (date.toDateString() === today.toDateString()) return `今天 ${dayOfWeek}`;
		if (date.toDateString() === yesterday.toDateString()) return `昨天 ${dayOfWeek}`;
		
		return `${month}月${day}日 ${dayOfWeek}`;
	};

	const addTransaction = () => {
		uni.navigateTo({ url: '/pages/personal/form' })
	};
</script>

<style lang="scss" scoped>
	.dashboard-container {
		background-color: #F8F8F8;
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
		background-color: #F8F8F8;
	}

	.month-selector {
		display: flex; align-items: center; font-size: 32rpx;
		font-weight: 500; color: #333;
		.month-text { margin-right: 8rpx; }
	}

	.action-icons { display: flex; gap: 40rpx; }
	
	.summary-hero {
		padding: 20rpx 20rpx;
		background-color: #F8F8F8;
		
		.hero-content {
			background: #fff;
			border-radius: 24rpx;
			padding: 40rpx;
			box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
			text-align: center;
		}
		
		.hero-label {
			font-size: 28rpx;
			color: #666;
		}
		
		.hero-amount {
			display: flex;
			justify-content: center;
			align-items: baseline;
			margin: 10rpx 0;
			
			.amount-symbol {
				font-size: 40rpx;
				font-weight: 500;
				color: #ff6700;
				margin-right: 4rpx;
			}
			
			.amount-value {
				font-size: 72rpx;
				font-weight: bold;
				color: #ff6700;
			}
			.amount-decimal {
				font-size: 40rpx;
				font-weight: bold;
				color: #ff6700;
				margin-left: 4rpx;
			}
		}
		
		.hero-sub-info {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 30rpx;
			font-size: 26rpx;
			color: #888;
			
			.divider {
				width: 1rpx;
				height: 20rpx;
				background-color: #e0e0e0;
			}
		}
	}
	
	.add-transaction-btn-wrapper {
		padding: 0 20rpx 20rpx 20rpx;
		background-color: #F8F8F8;
	}
	
	.add-transaction-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		height: 96rpx;
		background-color: #fff2e8;
		border-radius: 24rpx;
		font-size: 32rpx;
		color: #ff6700;
		font-weight: 500;
		transition: all 0.2s ease-out;
		
		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}
	}
	
	.transactions-section {
		padding: 0 20rpx;
		background-color: #F8F8F8;
	}

	.date-group:not(:last-child) { margin-bottom: 20rpx; }
	
	.group-header {
		display: flex; justify-content: space-between; align-items: center;
		padding: 30rpx 0;
		.date-label { font-size: 30rpx; font-weight: 500; color: #333; }
		.summary { font-size: 26rpx; color: #8e8e93; }
	}
	
	.group-items {
		background: #fff;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
		overflow: hidden;
	}
	
	.transaction-item {
		display: flex; align-items: center;
		padding: 24rpx;
		&:not(:last-child) { border-bottom: 1rpx solid #f5f5f5; }

		.icon-wrapper {
			width: 80rpx; height: 80rpx; border-radius: 50%;
			display: flex; justify-content: center; align-items: center;
			margin-right: 24rpx;
		}

		.item-details {
			flex: 1; display: flex; flex-direction: column; gap: 4rpx;
			.category-name { font-size: 30rpx; color: #333; }
			.notes { font-size: 24rpx; color: #8e8e93; }
		}

		.amount {
			font-size: 32rpx; font-weight: 500;
			&.expense { color: #333; }
			&.income { color: #34c759; }
		}
	}
</style>
