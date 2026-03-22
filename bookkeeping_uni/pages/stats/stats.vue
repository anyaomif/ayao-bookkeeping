<template>
	<view class="stats-container" :style="themeVars">
		<ay-tabbar :currentTab="1" is-float text-only frosted></ay-tabbar>
		<!-- <view class="app-header-box"></view> -->
		<NavbarWrapper sticky>
			<ay-title title="俺要记账" class="ay-title" :color="isDark ? '#f5f5f5' : '#333'">
				<template #right>
					<ProjectSelector v-model="currentProject" :projectList="projectList" @change="selectProject" />
				</template>
			</ay-title>
		</NavbarWrapper>

		<!-- 时间范围选择 -->
		<view class="date-range">
			<view class="range-header">
				<text class="title">统计时间</text>
				<view class="range-tabs">
					<view v-for="(item, index) in dateRanges" :key="index"
						:class="['tab-item', { active: currentRange === item.value }]" @tap="selectDateRange(item.value)">
						{{ item.label }}
					</view>
				</view>
			</view>
			<view class="range-picker">
				<view class="date-input" @tap="showDatePicker = true,datePickerType='start'">{{ startDate || '开始日期' }}</view>
				<text class="separator">至</text>
				<view class="date-input" @tap="showDatePicker = true,datePickerType='end'">{{ endDate || '结束日期' }}</view>
			</view>
		</view>

		<!-- 统计加载中 -->
		<view v-if="statsLoading" class="stats-loading-mask">
			<text class="stats-loading-text">加载中...</text>
		</view>

		<!-- 总收入卡片 -->
		<view class="total-income" @tap="toggleAmountDisplay">
			<text class="income-title">总收入（元）</text>
			<view class="income-amount">¥{{ isAmountHidden ? '********' : formatNumber(totalIncome) }}</view>
			<view class="income-compare">
				<template v-if="totalIncome > 0">
					较上期
					<text :class="['percent', monthCompare >= 0 ? 'up' : 'down']" v-if="monthCompare !== -100">
						{{ monthCompare >= 0 ? '+' : '' }}{{ isAmountHidden ? '**' : monthCompare }}%
					</text>
					<text class="percent neutral" v-else>
						暂无对比
					</text>
				</template>
				<text class="percent neutral" v-else>暂无数据</text>
			</view>
		</view>

		<!-- 收入构成 -->
		<view class="chart-section">
			<ay-title title="收入构成" bold padding="0" class="title" :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
			<view class="composition-chart" style="position: relative; min-height: 300rpx;">
				<ay-ring-chart v-if="hasIncomeData" :series="pieSeriesData" :total="totalIncome" :size="300" :ringWidth="50" />
				<view v-else class="empty-chart-overlay">暂无收入数据</view>
			</view>
			<view class="income-info">
				<view class="income-item" @tap="toggleAmountDisplay">
					<text class="label">点工收入</text>
					<text class="value">¥{{isAmountHidden ? '****' : formatNumber(totalPointIncome)}}</text>
				</view>
				<view class="income-item" @tap="toggleAmountDisplay">
					<text class="label">加班收入</text>
					<text class="value">¥{{isAmountHidden ? '****' : formatNumber(overtimeIncome)}}</text>
				</view>
				<view class="income-item" @tap="toggleAmountDisplay">
					<text class="label">包工收入</text>
					<text class="value">¥{{isAmountHidden ? '****' : formatNumber(totalContractIncome)}}</text>
				</view>
			</view>
		</view>

		<!-- 收入趋势 -->
		<view class="chart-section">
			<ay-title title="收入趋势" bold padding="0" class="title" :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
			<view class="trend-chart" style="position: relative; min-height: 400rpx;">
				<ay-area-chart v-if="hasDailyData" :categories="trendCategories" :series="trendSeries"
					:height="400" :stepWidth="100" />
				<view v-else class="empty-chart-overlay">暂无趋势数据</view>
			</view>
		</view>

		<!-- 工作状态分析 -->
		<view class="chart-section">
			<ay-title title="工作状态分析" bold padding="0" class="title" :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
			<view class="status-chart" style="position: relative; min-height: 320rpx;">
				<ay-pie-chart v-if="hasWorkStatusData" :series="workStatusData" :size="320"
					:colors="['#ff6700', '#52c41a', '#1890ff']" />
				<view v-else class="empty-chart-overlay">暂无工作数据</view>
			</view>
		</view>

		<!-- 工作详情 -->
		<view class="work-details">
			<view class="details-header">
				<text class="title">工作详情</text>
			</view>
			<view class="details-grid">
				<view class="detail-item">
					<text class="item-label">工作天数</text>
					<text class="item-value">{{ workDays }}天</text>
				</view>
				<view class="detail-item">
					<text class="item-label">总点工数</text>
					<text class="item-value">{{ workCount }}个</text>
				</view>
				<view class="detail-item">
					<text class="item-label">加班次数</text>
					<br />
					<text class="item-value">{{ overtimeCount }}次</text>
				</view>
				<view class="detail-item" @tap="toggleAmountDisplay">
					<text class="item-label">平均日薪</text>
					<br />
					<text class="item-value">¥{{ isAmountHidden ? '****' : formatNumber(averageDailyWage) }}</text>
				</view>
			</view>
		</view>

		<!-- 日期选择器 -->
		<ay-popup v-model="showDatePicker" position="bottom">
			<view class="calendar-container">
				<ay-calendar v-if="showDatePicker" :start-date="calendarStartDate" :end-date="calendarEndDate"
					@date-selected="handleDateSelect"></ay-calendar>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReady,
		onShow
	} from '@dcloudio/uni-app'
	import {
		ref,
		computed,
		nextTick,
		onUnmounted
	} from 'vue'
	import {
		formatDate,
		formatNumber,
		getNowDate
	} from '@/utils/ayao'
	import {
		projectApi
	} from '@/api/project'
	import {
		statisticsApi
	} from '@/api/statistics'
	import { isDarkMode, getThemeMode, getThemeVars, setPageBgColor } from '@/utils/theme'

	const isDark = ref(false)
	const themeVars = ref({})
	const refreshTheme = () => {
		const mode = getThemeMode()
		isDark.value = mode === 'dark' || (mode === 'system' && isDarkMode())
		themeVars.value = getThemeVars()
		setPageBgColor()
	}

	const isLoading = ref(true)
	// 项目相关
	const projectList = ref([])
	const currentProject = ref({})

	// 日期相关
	const showDatePicker = ref(false)
	const datePickerType = ref('start')
	const startDate = ref('')
	const endDate = ref('')
	const currentRange = ref('month')

	const dateRanges = [{
			label: '本月',
			value: 'month'
		},
		{
			label: '上月',
			value: 'lastMonth'
		},
		{
			label: '本年',
			value: 'year'
		},
		{
			label: '自定义',
			value: 'custom'
		}
	]

	// 统计数据
	const totalIncome = ref(0)
	const monthCompare = ref(0)
	const workDays = ref(0)
	const workCount = ref(0)
	const overtimeCount = ref(0)
	const averageDailyWage = ref(0)

	// 添加新的响应式变量
	const totalPointIncome = ref(0)
	const totalContractIncome = ref(0)
	const overtimeIncome = ref(0)
	const monthlyPointIncome = ref(0)
	const monthlyContractIncome = ref(0)

	// 自定义图表数据
	const pieSeriesData = ref([])
	const trendCategories = ref([])
	const trendSeries = ref([])
	const workStatusData = ref([])

	// 空数据判断
	const hasIncomeData = computed(() => totalPointIncome.value > 0 || totalContractIncome.value > 0)
	const hasDailyData = computed(() => trendCategories.value.length > 0)
	const hasWorkStatusData = computed(() => workStatusData.value.some(item => item.value > 0))

	// 金额显示控制
	const isAmountHidden = ref(false)
	const temporaryShow = ref(false)
	let hideTimeout = null

	// 获取项目列表
	const getProjectList = async () => {
		try {
			const res = await projectApi.getList()
			if (res.success) {
				projectList.value = res.data.list
			}
		} catch (error) {
			uni.showToast({
				title: '获取项目列表失败',
				icon: 'none'
			})
		}
	}

	// 选择项目
	const selectProject = (project) => {
		currentProject.value = project
		uni.setStorageSync('current_project', project)
		loadStatistics()
	}

	// 选择日期范围
	const selectDateRange = (range) => {
		currentRange.value = range
		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth()

		switch (range) {
			case 'month':
				startDate.value = formatDate(new Date(year, month, 1))
				endDate.value = formatDate(now)
				break
			case 'lastMonth':
				startDate.value = formatDate(new Date(year, month - 1, 1))
				endDate.value = formatDate(new Date(year, month, 0))
				break
			case 'year':
				startDate.value = formatDate(new Date(year, 0, 1))
				endDate.value = formatDate(now)
				break
			case 'custom':
				// 保持当前选择的日期范围
				break
		}

		if (range !== 'custom') {
			loadStatistics()
		}
	}

	// 计算日历的开始和结束日期
	const calendarStartDate = computed(() => {
		return '2024-01-01'
	})

	const calendarEndDate = computed(() => {
		return getNowDate()
	})

	// 处理日期选择
	const handleDateSelect = (date) => {
		const formattedDate = formatDate(date)
		if (datePickerType.value === 'start') {
			startDate.value = formattedDate
		} else {
			endDate.value = formattedDate
		}
		showDatePicker.value = false

		if (startDate.value && endDate.value) {
			currentRange.value = 'custom'
			loadStatistics()
		}
	}

	// 加载统计数据
	const statsLoading = ref(false)
	const loadStatistics = async () => {
		if (!currentProject.value.id || !startDate.value || !endDate.value) return
		if (statsLoading.value) return

		statsLoading.value = true
		try {
			const params = {
				project_id: currentProject.value.id,
				type: currentRange.value
			}

			if (currentRange.value === 'custom') {
				params.start_date = startDate.value
				params.end_date = endDate.value
			}

			const res = await statisticsApi.getStatistics(params)
			if (res.success) {
				updateBasicStats(res.data)
				updateChartData(res.data)
			}
		} catch (error) {
			uni.showToast({
				title: '获取统计数据失败',
				icon: 'none'
			})
		} finally {
			statsLoading.value = false
		}
	}

	// 修改 updateBasicStats 函数
	const updateBasicStats = (data) => {
		// 更新基础统计数据
		totalIncome.value = data.statistics.total_amount
		workDays.value = data.statistics.work_status.normal_work_count
		workCount.value = data.statistics.total_work_days
		monthCompare.value = data.statistics.month_compare
		overtimeCount.value = data.statistics.overtime_count
		averageDailyWage.value = data.statistics.average_daily_wage

		// 更新收入数据
		totalPointIncome.value = data.statistics.point_income
		totalContractIncome.value = data.statistics.contract_income
		overtimeIncome.value = data.statistics.overtime_income

		// 直接使用服务端已聚合的总量，无需本地 reduce
		monthlyPointIncome.value = data.statistics.point_income
		monthlyContractIncome.value = data.statistics.contract_income
	}

	// 判断是否需要按月聚合（本年 或 自定义跨度>60天）
	const shouldAggregateByMonth = (range, start, end) => {
		if (range === 'year') return true
		if (range === 'custom' && start && end) {
			const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
			return diff > 60
		}
		return false
	}

	const updateChartData = (data) => {
		const stats = data.statistics

		// 环形图：收入构成
		const seriesItems = []
		if (stats.point_income > 0) seriesItems.push({ name: '点工收入', data: stats.point_income, color: '#ff6700' })
		if (stats.contract_income > 0) seriesItems.push({ name: '包工收入', data: stats.contract_income, color: '#1890ff' })
		if (stats.overtime_income > 0) seriesItems.push({ name: '加班收入', data: stats.overtime_income, color: '#52c41a' })
		pieSeriesData.value = seriesItems

		// 面积图：收入趋势
		const dates = []
		const pointIncomes = []
		const contractIncomes = []
		const totalIncomes = []

		if (stats.daily_income && stats.daily_income.length > 0) {
			const useMonthAgg = shouldAggregateByMonth(currentRange.value, startDate.value, endDate.value)

			if (useMonthAgg) {
				const monthMap = new Map()
				stats.daily_income.forEach(item => {
					const month = item.date.slice(0, 7)
					const existing = monthMap.get(month) || { point_income: 0, contract_income: 0 }
					existing.point_income += item.point_income
					existing.contract_income += item.contract_income
					monthMap.set(month, existing)
				})
				monthMap.forEach((val, key) => {
					dates.push(key.slice(5) + '月')
					pointIncomes.push(val.point_income)
					contractIncomes.push(val.contract_income)
					totalIncomes.push(val.point_income + val.contract_income)
				})
			} else {
				stats.daily_income.forEach(item => {
					dates.push(item.date.slice(5))
					pointIncomes.push(item.point_income)
					contractIncomes.push(item.contract_income)
					totalIncomes.push(item.point_income + item.contract_income)
				})
			}
		}

		trendCategories.value = dates
		trendSeries.value = [
			{ name: '点工收入', data: pointIncomes },
			{ name: '包工收入', data: contractIncomes },
			{ name: '总收入', data: totalIncomes }
		]

		// 饼图：工作状态分析
		workStatusData.value = [
			{ name: '正常工作', value: stats.work_status.normal_work_count, color: '#ff6700' },
			{ name: '休息', value: stats.work_status.rest_count, color: '#52c41a' },
			{ name: '加班', value: stats.work_status.overtime_count, color: '#1890ff' }
		]
	}

	// 从缓存读取设置
	const loadUserSettings = () => {
		try {
			const settings = uni.getStorageSync('user_settings')
			if (settings) {
				isAmountHidden.value = settings.amount_display.hide_amount
			}
		} catch (error) {
			console.error('读取用户设置失败:', error)
		}
	}

	// 切换金额显示状态
	const toggleAmountDisplay = () => {
		if (isAmountHidden.value) {
			// 如果当前是隐藏状态，点击后临时显示3秒
			temporaryShow.value = true
			isAmountHidden.value = false

			// 清除之前的定时器
			if (hideTimeout) {
				clearTimeout(hideTimeout)
			}

			// 3秒后恢复隐藏状态
			hideTimeout = setTimeout(() => {
				if (temporaryShow.value) {
					isAmountHidden.value = true
					temporaryShow.value = false
				}
			}, 3000)
		}
	}

	// 初始化
	const initData = async () => {
		try {
			// 获取缓存中的项目
			const cachedProject = uni.getStorageSync('current_project')

			// 获取项目列表
			await getProjectList()

			if (projectList.value.length === 0) {
				uni.showModal({
					title: '提示',
					content: '你还没有创建账本哦，请前往创建',
					confirmText: '去创建',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/project/form'
							})
						}
					}
				})
				return
			}

			// 设置当前项目
			currentProject.value = cachedProject || projectList.value[0]

			// 默认选择本月
			selectDateRange('month')
		} catch (error) {
			uni.showToast({
				title: '数据加载失败',
				icon: 'none'
			});
		} finally {
			isLoading.value = false;
		}
	}

	onLoad(() => {
		// #ifdef APP
		uni.hideTabBar()
		// #endif
	})

	let lastLoadTime = 0
	const CACHE_TTL = 30 * 1000 // 30秒内不重复请求

	onShow(() => {
		refreshTheme()
		loadUserSettings()
		if (!isLoading.value) {
			const now = Date.now()
			if (now - lastLoadTime > CACHE_TTL) {
				lastLoadTime = now
				loadStatistics()
			}
		}
	})

	onReady(() => {
		nextTick(() => {
			initData()
		})
	})

	// 在组件销毁时清理定时器
	onUnmounted(() => {
		if (hideTimeout) {
			clearTimeout(hideTimeout)
		}
	})
</script>

<style lang="scss" scoped>
	.stats-loading-mask {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		.stats-loading-text {
			font-size: 28rpx;
			color: var(--text-secondary);
		}
	}

	.stats-container {
		min-height: 100vh; min-height: 100dvh;
		background-color: var(--bg-page);
		padding-bottom: 140rpx;

		.app-header-box {
			width: 100vw;
			height: var(--status-bar-height);
			background: var(--bg-card-solid);
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1;
		}

		.ay-title {
			position: sticky;
			top: var(--status-bar-height);
			background: var(--bg-card-solid);
			z-index: 1;
		}

		// 时间范围选择器
		.date-range {
			margin: 20rpx;
			background: var(--bg-card-solid);
			border-radius: 20rpx;
			padding: 24rpx;
			box-shadow: var(--shadow-card);

			.range-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24rpx;

				.title {
					font-size: 30rpx;
					color: var(--text-primary);
					font-weight: bold;
				}

				.range-tabs {
					display: flex;
					gap: 12rpx;
					background: var(--bg-input);
					padding: 4rpx;
					border-radius: 32rpx;

					.tab-item {
						padding: 12rpx 24rpx;
						font-size: 26rpx;
						color: var(--text-secondary);
						background: transparent;
						border-radius: 24rpx;
						transition: all 0.3s;

						&.active {
							color: #fff;
							background: linear-gradient(135deg, #ff6700, #ff8c3f);
							box-shadow: 0 4rpx 12rpx rgba(255, 103, 0, 0.2);
						}
					}
				}
			}

			.range-picker {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.date-input {
					flex: 1;
					background: var(--bg-input);
					padding: 20rpx 24rpx;
					border-radius: 16rpx;
					font-size: 26rpx;
					color: var(--text-primary);
					text-align: center;
					transition: all 0.3s;

					&:active {
						background: var(--divider);
					}
				}

				.separator {
					color: var(--text-tertiary);
					font-size: 26rpx;
				}
			}
		}

		// 总收入卡片
		.total-income {
			margin: 20rpx;
			background: linear-gradient(135deg, #ff6700, #ff8c3f);
			border-radius: 24rpx;
			padding: 36rpx;
			color: #fff;
			box-shadow: 0 8rpx 24rpx rgba(255, 103, 0, 0.2);
			position: relative;
			overflow: hidden;

			&::after {
				content: '';
				position: absolute;
				right: -10%;
				bottom: -30%;
				width: 60%;
				height: 200%;
				background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
				transform: rotate(-35deg);
			}

			.income-title {
				font-size: 28rpx;
				opacity: 0.9;
				margin-bottom: 16rpx;
				position: relative;
				z-index: 1;
			}

			.income-amount {
				font-size: 56rpx;
				font-weight: bold;
				margin-bottom: 24rpx;
				position: relative;
				z-index: 1;
			}

			.income-compare {
				font-size: 24rpx;
				opacity: 0.9;
				position: relative;
				z-index: 1;

				.percent {
					margin-left: 8rpx;
					font-weight: 500;
					padding: 4rpx 12rpx;
					border-radius: 20rpx;

					&.up {
						background: rgba(174, 255, 177, 0.5);
						color: #00ef00;
					}

					&.down {
						background: rgba(255, 35, 49, 0.5);
						color: #fff;
					}

					&.neutral {
						background: rgba(255, 255, 255, 0.2);
						color: #fff;
					}
				}
			}

			&:active {
				opacity: 0.9;
			}
		}

		// 收入构成
		.chart-section {
			background: var(--bg-card-solid);
			border-radius: 24rpx;
			padding: 30rpx;
			margin: 0 20rpx 30rpx;
			box-shadow: var(--shadow-card);

			.title {
				transform: translateX(-20rpx);
			}

			.empty-chart-overlay {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--text-placeholder);
				font-size: 28rpx;
				background: var(--bg-card-solid);
				z-index: 1;
			}

			.income-info {
				display: flex;
				justify-content: space-around;
				margin-top: 20rpx;
				padding-top: 20rpx;
				border-top: 2rpx solid var(--divider);

				.income-item {
					text-align: center;

					.label {
						font-size: 26rpx;
						color: var(--text-secondary);
						margin-bottom: 8rpx;
						display: block;
					}

					.value {
						font-size: 32rpx;
						color: #ff6700;
						font-weight: bold;
					}

					&:active {
						opacity: 0.8;
					}
				}
			}
		}

		// 每日收入趋势
		.daily-income {
			margin: 20rpx;
			background: var(--bg-card-solid);
			border-radius: 24rpx;
			padding: 30rpx;
			box-shadow: var(--shadow-card);

			.income-header {
				margin-bottom: 30rpx;

				.title {
					font-size: 32rpx;
					font-weight: bold;
					color: var(--text-primary);
				}
			}

			.income-chart {
				height: 440rpx;
				width: 100%;
				margin-top: 30rpx;
			}
		}

		// 工作状态分析
		.work-status {
			.status-header {
				margin-bottom: 30rpx;

				.title {
					font-size: 32rpx;
					font-weight: bold;
					color: var(--text-primary);
				}
			}

			.status-chart {
				height: 440rpx;
				width: 100%;
				margin-top: 30rpx;
			}
		}

		// 工作详情
		.work-details {
			margin: 20rpx;
			background: var(--bg-card-solid);
			border-radius: 24rpx;
			padding: 30rpx;
			box-shadow: var(--shadow-card);

			.details-header {
				margin-bottom: 30rpx;

				.title {
					font-size: 32rpx;
					font-weight: bold;
					color: var(--text-primary);
				}
			}

			.details-grid {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 24rpx;
				margin-top: 30rpx;

				.detail-item {
					background: var(--bg-input);
					padding: 30rpx;
					border-radius: 20rpx;
					border: 2rpx solid var(--divider);
					transition: all 0.3s;

					&:hover {
						transform: translateY(-2rpx);
						box-shadow: var(--shadow-card);
					}

					.item-label {
						font-size: 26rpx;
						color: var(--text-secondary);
						margin-bottom: 16rpx;
					}

					.item-value {
						font-size: 36rpx;
						color: var(--text-primary);
						font-weight: bold;
					}

					&:active {
						opacity: 0.8;
					}
				}
			}
		}

	}

	.card-shadow {
		margin: 20rpx;
		background: var(--bg-card-solid);
		border-radius: 24rpx;
		padding: 36rpx;
		box-shadow: var(--shadow-card);

		.composition-header,
		.income-header,
		.status-header,
		.details-header {
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: var(--text-primary);
				position: relative;
				padding-left: 24rpx;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 8rpx;
					height: 32rpx;
					background: linear-gradient(to bottom, #ff6700, #ff8c3f);
					border-radius: 4rpx;
				}
			}
		}

		.composition-chart,
		.income-chart,
		.status-chart {
			height: 440rpx;
			width: 100%;
			margin: 20rpx 0;
		}

		.composition-legend {
			display: flex;
			justify-content: center;
			gap: 40rpx;
			margin-top: 20rpx;

			.legend-item {
				display: flex;
				align-items: center;
				gap: 12rpx;
				padding: 8rpx 20rpx;
				background: var(--bg-input);
				border-radius: 20rpx;
				transition: all 0.3s;

				&:hover {
					background: var(--divider);
				}

				.dot {
					width: 16rpx;
					height: 16rpx;
					border-radius: 8rpx;

					&.point {
						background: linear-gradient(135deg, #ff6700, #ff8c3f);
					}

					&.contract {
						background: linear-gradient(135deg, #1890ff, #40a9ff);
					}
				}

				.label {
					font-size: 26rpx;
					color: var(--text-primary);
				}
			}
		}
	}

	.work-details {
		.details-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 24rpx;
			margin-top: 30rpx;

			.detail-item {
				background: var(--bg-input);
				padding: 30rpx;
				border-radius: 20rpx;
				border: 2rpx solid var(--divider);
				transition: all 0.3s;

				&:hover {
					transform: translateY(-2rpx);
					box-shadow: var(--shadow-card);
				}

				.item-label {
					font-size: 26rpx;
					color: var(--text-secondary);
					margin-bottom: 16rpx;
				}

				.item-value {
					font-size: 36rpx;
					color: var(--text-primary);
					font-weight: bold;
				}

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>