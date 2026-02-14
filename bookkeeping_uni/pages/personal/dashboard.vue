<template>
	<view class="dashboard-container">
		<!-- 自定义导航栏 -->
		<NavbarWrapper sticky>
			<view class="custom-navbar">
				<view class="nav-left" @click="showMenu = true">
					<tn-icon name="menu-list" size="44"></tn-icon>
				</view>
				<view class="month-selector" @click="showMonthPicker = true">
					<text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
				</view>
				<view class="action-icons">
					<tn-icon name="search" size="44"></tn-icon>
				</view>
			</view>
		</NavbarWrapper>

		<!-- 核心财务信息 -->
		<ay-skeleton :loading="!pageLoaded">
			<template #skeleton>
				<view style="padding: 20rpx 20rpx;">
					<view class="sk-block sk-card" style="height: 240rpx;"></view>
				</view>
			</template>
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
		</ay-skeleton>

		<!-- 记一笔 按钮 -->
		<view class="add-transaction-btn-wrapper">
			<view class="add-transaction-btn" @click="addTransaction">
				<tn-icon name="add" size="44" color="#fff"></tn-icon>
				<text>记一笔</text>
			</view>
			<view class="ai-btn" @click="aiRecord">
				<text class="beta-tag">Beta</text>
				<tn-icon name="ai-fill" size="40" color="#ff6700"></tn-icon>
				<text class="ai-label">智能记</text>
			</view>
		</view>

		<!-- 近期流水 -->
		<ay-skeleton :loading="!pageLoaded">
			<template #skeleton>
				<view style="padding: 0 20rpx;">
					<view class="sk-block" style="width: 200rpx; height: 32rpx; margin-bottom: 20rpx;"></view>
					<view class="sk-block sk-card" style="height: 128rpx; margin-bottom: 16rpx;" v-for="i in 4" :key="i"></view>
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
							<view class="swipe-tip" v-if="index === 0 && showSwipeTip" @click.stop>
								<text class="tip-text">← 左滑记录可编辑或删除</text>
								<view class="tip-close" @click="dismissSwipeTip">
									<tn-icon name="close" size="28" color="#ff6700"></tn-icon>
								</view>
							</view>
							<view class="group-items">
								<ay-swipe-cell v-for="item in group.items" :key="item.id" :name="item.id" fixed-left group="dashboard">
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
										<view class="action-btn edit-btn" @click="goToEdit(item.id)">
											<tn-icon name="edit" size="36" color="#fff"></tn-icon>
										</view>
										<view class="action-btn delete-btn" @click="confirmDelete(item.id)">
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
		<ay-tabbar :currentTab="0" is-float text-only frosted mode="personal"></ay-tabbar>

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
							:class="{ active: pickerYear === currentYear && m === currentMonth }" @click="selectMonth(m)">
							<text>{{ m }}月</text>
						</view>
					</view>
				</view>
			</view>
		</ay-popup>

		<!-- 管理菜单弹层 -->
		<ay-popup v-model="showMenu" position="bottom" :duration="300" draggable show-drag-handle>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">管理</text>
				</view>
				<view class="menu-list">
					<view class="menu-item" @click="goTo('/pages/personal/accounts')">
						<tn-icon name="bankcard" size="44" color="#ff6700"></tn-icon>
						<text>账户管理</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/personal/categories')">
						<tn-icon name="menu-classify" size="44" color="#ff6700"></tn-icon>
						<text>分类管理</text>
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

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const showMonthPicker = ref(false);
const showMenu = ref(false);
const pickerYear = ref(new Date().getFullYear());

const summaryData = ref({ expense: 0, income: 0, balance: 0 });
const mockTransactions = ref([]);
const pageLoaded = ref(false);

// 左滑提示
const showSwipeTip = ref(false);
const initSwipeTip = () => {
	const dismissCount = uni.getStorageSync('swipe_tip_dismiss_count') || 0;
	if (dismissCount >= 3) {
		showSwipeTip.value = false;
	} else {
		showSwipeTip.value = true;
	}
};
const dismissSwipeTip = () => {
	showSwipeTip.value = false;
	const count = (uni.getStorageSync('swipe_tip_dismiss_count') || 0) + 1;
	uni.setStorageSync('swipe_tip_dismiss_count', count);
};

const loadData = async () => {
	try {
		const [statsRes, listRes] = await Promise.all([
			personalTransactionApi.getStatistics({ year: currentYear.value, month: currentMonth.value }),
			personalTransactionApi.getList({ year: currentYear.value, month: currentMonth.value, pageSize: 50 }),
		]);
		if (statsRes.success) {
			summaryData.value = {
				expense: statsRes.data.total_expense,
				income: statsRes.data.total_income,
				balance: statsRes.data.balance,
			};
		}
		if (listRes.success) {
			mockTransactions.value = listRes.data.list;
		}
		pageLoaded.value = true;
	} catch (e) { pageLoaded.value = true; }
};

const formatAmount = (num, type = null) => {
	const formatted = parseFloat(num || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
		// 适配后端字段：用 category_id 关联的分类信息可能不在 item 上，做兼容
		const txItem = {
			id: item.id,
			type: item.type,
			amount: Number(item.amount),
			notes: item.remark || '',
			category: item.category || { name: item.type === 'expense' ? '支出' : '收入', icon: 'eat', color: '#ff9f0a' },
		};
		groups[dateKey].items.push(txItem);
		if (item.type === 'expense') groups[dateKey].summary.expense += txItem.amount;
		else if (item.type === 'income') groups[dateKey].summary.income += txItem.amount;
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

const aiRecord = () => {
	uni.navigateTo({ url: '/pages/personal/ai-chat' })
};

const goToEdit = (id) => {
	uni.navigateTo({ url: `/pages/personal/form?params=${encodeURIComponent(JSON.stringify({ id }))}` })
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

const selectMonth = (m) => {
	currentYear.value = pickerYear.value;
	currentMonth.value = m;
	showMonthPicker.value = false;
	loadData();
};

const goTo = (url) => {
	showMenu.value = false;
	uni.navigateTo({ url });
};

onShow(() => { loadData(); initSwipeTip(); });
</script>

<style lang="scss" scoped>
.dashboard-container {
	background-color: #F8F8F8;
	min-height: 100vh;
	min-height: 100dvh;
	padding-bottom: 160rpx;
	box-sizing: border-box;
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
	display: flex;
	align-items: center;
	background-color: #ff6700;
	border-radius: 32rpx;
	padding: 8rpx 28rpx;

	.month-text {
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
	}
}

.action-icons {
	display: flex;
	gap: 40rpx;
}

.summary-hero {
	padding: 20rpx 20rpx;
	background-color: #F8F8F8;

	.hero-content {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
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
	display: flex;
	gap: 16rpx;
}

.add-transaction-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	height: 96rpx;
	background-color: #ff6700;
	border-radius: 24rpx;
	font-size: 32rpx;
	color: #fff;
	font-weight: 500;
	transition: all 0.2s ease-out;

	&:active {
		transform: scale(0.98);
		opacity: 0.9;
	}
}

.ai-btn {
	width: 96rpx;
	height: 96rpx;
	border-radius: 24rpx;
	background: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
	flex-shrink: 0;
	gap: 2rpx;
	position: relative;
	overflow: hidden;

	&:active {
		transform: scale(0.92);
		opacity: 0.8;
	}

	.ai-label {
		font-size: 18rpx;
		color: #ff6700;
		line-height: 1;
	}

	.beta-tag {
		position: absolute;
		top: 0;
		right: 0;
		background: #ff3b30;
		color: #fff;
		font-size: 14rpx;
		padding: 4rpx 10rpx;
		line-height: 1.4;
		border-bottom-left-radius: 24rpx;
	}
}

.transactions-section {
	padding: 0 20rpx;
	background-color: #F8F8F8;
}

.date-group:not(:last-child) {
	margin-bottom: 20rpx;
}

.group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;

	.date-label {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
	}

	.summary {
		font-size: 26rpx;
		color: #8e8e93;
	}
}

.swipe-tip {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff2e8;
	border-radius: 16rpx;
	padding: 8rpx 20rpx;
	margin-bottom: 16rpx;

	.tip-text {
		font-size: 24rpx;
		color: #ff6700;
	}

	.tip-close {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(255, 103, 0, 0.1);
		flex-shrink: 0;

		&:active {
			background: rgba(255, 103, 0, 0.2);
		}
	}
}

.group-items {
	background: #fff;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
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
	color: #333;
	white-space: nowrap;
}

.action-btn {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;

	&.edit-btn {
		background-color: #ff6700;
	}

	&.delete-btn {
		background-color: #ff3b30;
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
		gap: 4rpx;

		.notes {
			font-size: 24rpx;
			color: #8e8e93;
			text-align: right;
		}
	}

	.amount {
		font-size: 32rpx;
		font-weight: 500;

		&.expense {
			color: #333;
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
}

.popup-header {
	display: flex;
	justify-content: center;
	padding: 0 0 32rpx 0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1c1c1e;
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
	background: #f6f6f6;

	&:active {
		background: #eee;
	}
}

.year-text {
	font-size: 34rpx;
	font-weight: 600;
	color: #1c1c1e;
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
	background: #f6f6f6;
	font-size: 30rpx;
	color: #333;
	transition: all 0.2s;

	&:active {
		transform: scale(0.96);
	}

	&.active {
		background: #ff6700;
		color: #fff;
		font-weight: 600;
	}
}

.menu-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 24rpx 20rpx;
	background: #f6f6f6;
	border-radius: 20rpx;
	font-size: 30rpx;
	color: #1c1c1e;

	&:active {
		background: #eee;
	}
}
</style>
