<template>
	<view class="report-container" :style="themeVars">
		<NavbarWrapper sticky :bgColor="navBgColor">
			<view class="custom-navbar">
				<text class="nav-title">收支报表</text>
			</view>
		</NavbarWrapper>

		<!-- 时间维度切换 -->
		<view class="dimension-tabs">
			<view class="tab-item" :class="{ active: dimension === 'week' }" @click="switchDimension('week')">周报</view>
			<view class="tab-item" :class="{ active: dimension === 'month' }" @click="switchDimension('month')">月报</view>
			<view class="tab-item" :class="{ active: dimension === 'year' }" @click="switchDimension('year')">年报</view>
		</view>

		<!-- 日期区间 + 收支切换 -->
		<view class="date-bar">
			<view class="date-nav">
				<view class="arrow" @click="prevPeriod"><tn-icon name="left" size="32" :color="isDark ? '#ababab' : '#666'"></tn-icon></view>
				<text class="date-text">{{ dateRangeText }}</text>
				<view class="arrow" @click="nextPeriod"><tn-icon name="right" size="32" :color="isDark ? '#ababab' : '#666'"></tn-icon></view>
			</view>
			<view class="flow-tabs">
				<view class="flow-tab" :class="{ active: flowType === 'expense' }" @click="flowType = 'expense'; loadReport()">支出</view>
				<view class="flow-tab" :class="{ active: flowType === 'income' }" @click="flowType = 'income'; loadReport()">收入</view>
			</view>
		</view>

		<!-- 统计概览 -->
		<ay-skeleton :loading="loading">
			<template #skeleton>
				<view style="padding: 20rpx;">
					<view class="sk-block sk-card" style="height: 200rpx;"></view>
				</view>
			</template>
			<view class="stats-overview">
				<view class="stats-grid">
					<view class="stats-cell">
						<text class="label">{{ periodLabel }}{{ flowType === 'expense' ? '支出' : '收入' }}（元）</text>
						<text class="value">{{ formatNum(reportData.total) }}</text>
					</view>
					<view class="stats-cell">
						<text class="label">日均{{ flowType === 'expense' ? '支出' : '收入' }}（元）</text>
						<text class="value">{{ formatNum(reportData.daily_avg) }}</text>
					</view>
					<view class="stats-cell">
						<text class="label">比上{{ periodLabel }}（元）</text>
						<text class="value">{{ formatNum(reportData.prev_total) }}</text>
					</view>
					<view class="stats-cell">
						<text class="label">收支结余（元）</text>
						<text class="value">{{ formatNum(reportData.balance) }}</text>
					</view>
				</view>
			</view>
		</ay-skeleton>

		<!-- 趋势图表 -->
		<ay-skeleton :loading="loading">
			<template #skeleton>
				<view style="margin: 20rpx 30rpx;">
					<view class="sk-block" style="width: 200rpx; height: 32rpx; margin-bottom: 20rpx; border-radius: 8rpx;"></view>
					<view class="sk-block sk-card" style="height: 400rpx;"></view>
				</view>
			</template>
			<view class="chart-section">
				<text class="section-title">{{ flowType === 'expense' ? '支出' : '收入' }}趋势</text>
				<view class="chart-wrap" v-if="chartData.categories.length > 0">
					<ay-bar-chart :categories="chartData.categories" :values="chartData.series[0].data" />
				</view>
				<view class="empty-chart" v-else>
					<text class="empty-text">暂无记录~</text>
				</view>
			</view>
		</ay-skeleton>

		<!-- 分类构成 -->
		<ay-skeleton :loading="loading">
			<template #skeleton>
				<view style="margin: 20rpx 30rpx;">
					<view class="sk-block" style="width: 200rpx; height: 32rpx; margin-bottom: 20rpx; border-radius: 8rpx;"></view>
					<view class="sk-block" style="width: 300rpx; height: 300rpx; border-radius: 50%; margin: 0 auto 30rpx;"></view>
					<view v-for="i in 3" :key="i" style="display: flex; align-items: center; gap: 16rpx; margin-bottom: 20rpx;">
						<view class="sk-block" style="width: 64rpx; height: 64rpx; border-radius: 50%;"></view>
						<view style="flex:1;">
							<view class="sk-block" style="width: 50%; height: 28rpx; border-radius: 8rpx; margin-bottom: 8rpx;"></view>
							<view class="sk-block" style="width: 30%; height: 24rpx; border-radius: 8rpx;"></view>
						</view>
						<view class="sk-block" style="width: 120rpx; height: 28rpx; border-radius: 8rpx;"></view>
					</view>
				</view>
			</template>
			<view class="category-section">
				<text class="section-title">{{ flowType === 'expense' ? '支出' : '收入' }}分类构成</text>
				<view class="ring-chart-wrap" v-if="ringSeriesData.length > 0">
					<ay-ring-chart :series="ringSeriesData" :total="reportData.total" :size="360" :ringWidth="60" />
				</view>
				<view class="category-list" v-if="reportData.categories && reportData.categories.length > 0">
					<view class="category-item" v-for="item in reportData.categories" :key="item.category_id">
						<view class="cat-left">
							<view class="cat-icon" :style="{ backgroundColor: item.color || '#ff9f0a' }">
								<tn-icon :name="item.icon || 'eat'" size="36" color="#fff"></tn-icon>
							</view>
							<view class="cat-info">
								<text class="cat-name">{{ item.name }}</text>
								<text class="cat-percent">{{ item.percent }}%</text>
							</view>
						</view>
						<text class="cat-amount">¥{{ formatNum(item.amount) }}</text>
					</view>
				</view>
				<view class="empty-chart" v-else>
					<text class="empty-text">暂无记录~</text>
				</view>
			</view>
		</ay-skeleton>

		<ay-tabbar :currentTab="2" is-float text-only frosted mode="personal"></ay-tabbar>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShow, onPageScroll } from '@dcloudio/uni-app';
import { personalTransactionApi } from '@/api/personal_transaction';
import { isDarkMode, getThemeMode, getThemeVars } from '@/utils/theme';

const isDark = ref(false);
const isLight = ref(false);
const themeVars = ref({});
const refreshTheme = () => {
	const mode = getThemeMode();
	isDark.value = mode === 'dark' || (mode === 'system' && isDarkMode());
	isLight.value = mode === 'light';
	themeVars.value = getThemeVars();
};

const dimension = ref('week');
const flowType = ref('expense');
const currentDate = ref(new Date());
const loading = ref(false);
const reportData = ref({ total: 0, daily_avg: 0, prev_total: 0, balance: 0, trend: [], categories: [] });

const navBgColor = ref('transparent');

onPageScroll((e) => {
	const t = Math.min(e.scrollTop / 100, 1);
	const bg = isDark.value ? '28,28,30' : '255,255,255';
	navBgColor.value = t <= 0 ? 'transparent' : `rgba(${bg},${t})`;
});

const periodLabel = computed(() => {
	if (dimension.value === 'week') return '本周';
	if (dimension.value === 'month') return '本月';
	return '本年';
});

const dateRangeText = computed(() => {
	const d = currentDate.value;
	if (dimension.value === 'week') {
		const day = d.getDay() || 7;
		const start = new Date(d); start.setDate(d.getDate() - day + 1);
		const end = new Date(start); end.setDate(start.getDate() + 6);
		return `${fmtShort(start)}~${fmtShort(end)}`;
	}
	if (dimension.value === 'month') {
		return `${d.getFullYear()}年${d.getMonth() + 1}月`;
	}
	return `${d.getFullYear()}年`;
});

const fmtShort = (dt) => `${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`;
const fmtDate = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
const formatNum = (n) => parseFloat(n || 0).toFixed(2);

const switchDimension = (dim) => {
	dimension.value = dim;
	currentDate.value = new Date();
	loadReport();
};

const prevPeriod = () => {
	const d = new Date(currentDate.value);
	if (dimension.value === 'week') d.setDate(d.getDate() - 7);
	else if (dimension.value === 'month') d.setMonth(d.getMonth() - 1);
	else d.setFullYear(d.getFullYear() - 1);
	currentDate.value = d;
	loadReport();
};

const nextPeriod = () => {
	const d = new Date(currentDate.value);
	if (dimension.value === 'week') d.setDate(d.getDate() + 7);
	else if (dimension.value === 'month') d.setMonth(d.getMonth() + 1);
	else d.setFullYear(d.getFullYear() + 1);
	currentDate.value = d;
	loadReport();
};

const chartData = ref({ categories: [], series: [{ name: '', data: [] }] });

const defaultRingColors = ['#ff6700', '#ff9f0a', '#ffcc00', '#34c759', '#5ac8fa', '#007aff', '#af52de', '#ff2d55'];
const ringSeriesData = ref([]);

const buildRingData = (cats, total) => {
	ringSeriesData.value = cats.map((c, i) => ({
		name: c.name,
		data: c.amount,
		color: c.color || defaultRingColors[i % defaultRingColors.length],
	}));
};

const loadReport = async () => {
	loading.value = true;
	try {
		const res = await personalTransactionApi.getReport({
			type: dimension.value,
			date: fmtDate(currentDate.value),
			flow_type: flowType.value,
		});
		if (res.success) {
			reportData.value = res.data;
			chartData.value = {
				categories: res.data.trend.map(t => t.label),
				series: [{ name: flowType.value === 'expense' ? '支出' : '收入', data: res.data.trend.map(t => t.amount) }],
			};
			buildRingData(res.data.categories || [], res.data.total);
		}
	} catch (e) { /* 拦截器处理 */ }
	loading.value = false;
};

onShow(() => { refreshTheme(); loadReport(); });
</script>

<style lang="scss" scoped>
.report-container {
	background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid1) 15%, var(--bg-gradient-mid2) 35%, var(--bg-gradient-mid3) 60%, var(--bg-gradient-end) 85%);
	min-height: 100vh; min-height: 100dvh;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.custom-navbar {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 88rpx;
	padding: 0 30rpx;

	.nav-title {
		font-size: 34rpx;
		font-weight: 600;
		color: var(--text-primary);
	}
}

.dimension-tabs {
	display: flex;
	justify-content: center;
	gap: 0;
	margin: 20rpx 30rpx 0;
	background: var(--bg-card);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1rpx solid var(--bg-card-border);
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: var(--shadow-card);

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: var(--text-secondary);
		transition: all 0.2s;

		&.active {
			background: var(--color-brand);
			color: #fff;
			font-weight: 500;
		}
	}
}

.date-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;

	.date-nav {
		display: flex;
		align-items: center;
		gap: 16rpx;

		.arrow {
			width: 48rpx; height: 48rpx;
			display: flex; align-items: center; justify-content: center;
			border-radius: 50%;
			background: var(--bg-card);
			box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
			&:active { background: var(--divider); }
		}

		.date-text { font-size: 28rpx; color: var(--text-primary); font-weight: 500; }
	}

	.flow-tabs {
		display: flex;
		background: var(--bg-card);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1rpx solid var(--bg-card-border);
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);

		.flow-tab {
			padding: 12rpx 28rpx;
			font-size: 26rpx;
			color: var(--text-secondary);

			&.active {
				background: var(--color-brand);
				color: #fff;
				font-weight: 500;
			}
		}
	}
}

.stats-overview {
	padding: 0 30rpx;

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16rpx;
		background: var(--bg-card);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1rpx solid var(--bg-card-border);
		border-radius: 24rpx;
		padding: 30rpx;
		box-shadow: var(--shadow-card);
	}

	.stats-cell {
		.label {
			font-size: 24rpx;
			color: var(--text-tertiary);
			display: block;
			margin-bottom: 8rpx;

			&::before {
				content: '';
				display: inline-block;
				width: 6rpx; height: 24rpx;
				background: var(--color-brand);
				border-radius: 3rpx;
				margin-right: 8rpx;
				vertical-align: middle;
			}
		}

		.value {
			font-size: 40rpx;
			font-weight: bold;
			color: var(--text-primary);
		}
	}
}

.chart-section, .category-section {
	margin: 20rpx 30rpx;
	background: var(--bg-card);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1rpx solid var(--bg-card-border);
	border-radius: 24rpx;
	padding: 30rpx;
	box-shadow: var(--shadow-card);
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: var(--text-primary);
	margin-bottom: 20rpx;
}

.chart-wrap {
	height: 400rpx;
}

.ring-chart-wrap {
	height: 420rpx;
	margin-bottom: 20rpx;
}

.empty-chart {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 300rpx;

	.empty-text { font-size: 28rpx; color: var(--text-placeholder); }
}

.category-list {
	.category-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid var(--divider);

		&:last-child { border-bottom: none; }
	}

	.cat-left {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.cat-icon {
		width: 64rpx; height: 64rpx;
		border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
	}

	.cat-info {
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}

	.cat-name { font-size: 28rpx; color: var(--text-primary); }
	.cat-percent { font-size: 22rpx; color: var(--text-tertiary); }
	.cat-amount { font-size: 30rpx; font-weight: 600; color: var(--text-primary); }
}
</style>
