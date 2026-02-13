<template>
	<view class="stats-container">
		<ay-tabbar :currentTab="1" is-float text-only frosted></ay-tabbar>
		<!-- <view class="app-header-box"></view> -->
		<NavbarWrapper sticky>
			<ay-title title="俺要记账" class="ay-title">
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

		<!-- 总收入卡片 -->
		<view class="total-income" @tap="toggleAmountDisplay">
			<text class="income-title">总收入（元）</text>
			<view class="income-amount">¥{{ isAmountHidden ? '********' : formatNumber(totalIncome) }}</view>
			<view class="income-compare">
				较上月
				<text :class="['percent', monthCompare >= 0 ? 'up' : 'down']">
					{{ monthCompare >= 0 ? '+' : '' }}{{ isAmountHidden ? '**' : monthCompare }}%
				</text>
			</view>
		</view>

		<!-- 收入构成 -->
		<view class="chart-section">
			<ay-title title="收入构成" bold padding="0" class="title"></ay-title>
			<view class="composition-chart" style="height: 300rpx;">
				<qiun-data-charts type="pie" canvas2d canvasId="pieChart" :opts="pieOpts" :chartData="pieData"
					@complete="onChartComplete('pie')" />
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
			<ay-title title="收入趋势" bold padding="0" class="title"></ay-title>
			<view class="trend-chart" style="height: 440rpx;">
				<qiun-data-charts type="area" canvas2d canvasId="areaChart" :opts="areaOpts" :chartData="areaData"
					@complete="onChartComplete('area')" />
			</view>
		</view>

		<!-- 工作状态分析 -->
		<view class="chart-section">
			<ay-title title="工作状态分析" bold padding="0" class="title"></ay-title>
			<view class="status-chart" style="height: 400rpx;">
				<qiun-data-charts type="rose" canvas2d canvasId="roseChart" :opts="roseOpts" :chartData="roseData"
					@complete="onChartComplete('rose')" />
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
		onMounted,
		nextTick,
		onUnmounted
	} from 'vue'
	import {
		formatDate,
		formatNumber,
		getNowDate,
		navigateTo
	} from '@/utils/ayao'
	import {
		recordApi
	} from '@/api/record'
	import {
		projectApi
	} from '@/api/project'
	import {
		statisticsApi
	} from '@/api/statistics'

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

	// 饼图配置
	const pieOpts = ref({
		color: ['#ff6700', '#1890ff'],
		padding: [5, 5, 5, 5],
		legend: {
			show: false
		},
		series: [{
			center: ['50%', '50%'],
			radius: ['50%', '65%'],
			labelLine: {
				show: true,
				length: 10,
				length2: 8,
				lineStyle: {
					color: '#999',
					width: 1
				}
			},
			label: {
				show: true,
				formatter: (val) => {
					return `${val.name}\n${val.percent}%`
				},
				color: '#333',
				fontSize: 12,
				lineHeight: 16,
				align: 'center',
				distanceToLabelLine: 5
			},
			itemStyle: {
				borderWidth: 2,
				borderColor: '#fff'
			}
		}]
	})

	// 饼图数据
	const pieData = ref({
		series: [{
			data: []
		}]
	})

	// 修改面积图配置
	const areaOpts = ref({
		color: ['#ff6700', '#1890ff'],
		padding: [15, 0, 0, 0],
		legend: {
			show: true,
			position: 'bottom',
			float: 'center',
			itemGap: 20,
			fontSize: 12,
			padding: 10,
			margin: 5
		},
		xAxis: {
			axisLine: true,
			axisLineColor: '#eee',
			gridType: 'solid',
			gridColor: '#f5f5f5',
			rotateLabel: true,
			marginTop: 10,
			axisLabel: {
				rotate: 45,
				fontSize: 11,
				color: '#666',
				margin: 5,
				format: (val) => {
					return val.split('-').slice(1).join('-')
				}
			}
		},
		yAxis: {
			gridType: 'dash',
			gridColor: '#f5f5f5',
			splitNumber: 4,
			min: 0,
			format: 'yAxisDemo',
			fontSize: 11,
			color: '#666',
			margin: 10
		},
		extra: {
			area: {
				type: 'curve',
				opacity: 0.15,
				gradient: true,
				addLine: true,
				lineWidth: 2,
				activeType: 'hollow'
			},
			tooltip: {
				showBox: true,
				boxPadding: 3,
				boxBorderRadius: 5,
				boxBgColor: '#fff',
				boxBorderColor: '#eee',
				fontSize: 12
			}
		}
	})

	// 面积图数据
	const areaData = ref({
		categories: [],
		series: [{
			name: '点工收入',
			data: []
		}, {
			name: '包工收入',
			data: []
		}]
	})

	// 修改环形图配置
	const roseOpts = ref({
		padding: [5, 5, 5, 5],
		legend: {
			show: true,
			position: 'bottom',
			size: 12,
		},
		extra: {
			rose: {
				type: 'radius',
				offsetAngle: 0,
				labelWidth: 15,
				border: false,
				borderWidth: 2,
				borderColor: "#FFFFFF"
			}
		}
	})

	// 环形图数据
	const roseData = ref({
		series: [{
			data: []
		}]
	})

	// 图表状态管理
	const chartReadyStatus = ref({
		pie: false,
		area: false,
		rose: false
	})

	// 添加临时数据存储
	const tempStatisticsData = ref(null)

	// 添加金额显示控制相关的状态
	const isAmountHidden = ref(true)
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

	// 添加图表完成回调
	const onChartComplete = (type) => {
		chartReadyStatus.value[type] = true

		// 检查所有图表是否都已准备就绪
		if (Object.values(chartReadyStatus.value).every(status => status)) {
			// 如果有待更新的数据，立即更新
			if (tempStatisticsData.value) {
				updateChartData(tempStatisticsData.value)
			}
		}
	}

	// 修改加载统计数据的方法
	const loadStatistics = async () => {
		if (!currentProject.value.id || !startDate.value || !endDate.value) return

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
				// 先保存数据
				tempStatisticsData.value = res.data

				// 更新基础统计数据
				updateBasicStats(res.data)

				// 如果图表都已准备就绪，直接更新图表数据
				if (Object.values(chartReadyStatus.value).every(status => status)) {
					updateChartData(res.data)
				}
			}
		} catch (error) {
			uni.showToast({
				title: '获取统计数据失败',
				icon: 'none'
			})
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

		// 获取本月收入数据
		const currentMonthData = data.statistics.daily_income.reduce((acc, curr) => {
			acc.point += curr.point_income
			acc.contract += curr.contract_income
			return acc
		}, {
			point: 0,
			contract: 0
		})

		monthlyPointIncome.value = currentMonthData.point
		monthlyContractIncome.value = currentMonthData.contract
	}

	const updateChartData = (data) => {
		// 更新饼图数据
		pieData.value = {
			series: [{
				data: [{
					name: '点工收入',
					value: data.statistics.point_income
				}, {
					name: '包工收入',
					value: data.statistics.contract_income
				}]
			}]
		}

		// 更新面积图数据
		const dailyIncome = data.statistics.daily_income
		const dates = []
		const pointIncomes = []
		const contractIncomes = []

		dailyIncome.forEach(item => {
			dates.push(item.date.slice(5))
			pointIncomes.push(item.point_income)
			contractIncomes.push(item.contract_income)
		})

		areaData.value = {
			categories: dates,
			series: [{
				name: '点工收入',
				data: pointIncomes
			}, {
				name: '包工收入',
				data: contractIncomes
			}]
		}

		// 更新环形图数据
		const workStatus = data.statistics.work_status
		roseData.value = {
			series: [{
				data: [{
					name: '正常工作',
					value: workStatus.normal_work_count
				}, {
					name: '休息',
					value: workStatus.rest_count
				}, {
					name: '加班',
					value: workStatus.overtime_count
				}]
			}]
		}

		// 清空临时数据
		tempStatisticsData.value = null
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

	onShow(() => {
		loadUserSettings()
		if (!isLoading.value) {
			initData()
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
	.stats-container {
		min-height: 100vh;
		background-color: #f8f9fc;
		padding-bottom: 140rpx;

		.app-header-box {
			width: 100vw;
			height: var(--status-bar-height);
			background: #fff;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1;
		}

		.ay-title {
			position: sticky;
			top: var(--status-bar-height);
			background: #fff;
			z-index: 1;
		}

		// 时间范围选择器
		.date-range {
			margin: 20rpx;
			background: #fff;
			border-radius: 20rpx;
			padding: 24rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

			.range-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24rpx;

				.title {
					font-size: 30rpx;
					color: #333;
					font-weight: bold;
				}

				.range-tabs {
					display: flex;
					gap: 12rpx;
					background: #f8f9fc;
					padding: 4rpx;
					border-radius: 32rpx;

					.tab-item {
						padding: 12rpx 24rpx;
						font-size: 26rpx;
						color: #666;
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
					background: #f8f9fc;
					padding: 20rpx 24rpx;
					border-radius: 16rpx;
					font-size: 26rpx;
					color: #333;
					text-align: center;
					transition: all 0.3s;

					&:active {
						background: #f5f5f5;
					}
				}

				.separator {
					color: #999;
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
				}
			}

			&:active {
				opacity: 0.9;
			}
		}

		// 收入构成
		.chart-section {
			background: #fff;
			border-radius: 24rpx;
			padding: 30rpx;
			margin: 0 20rpx 30rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

			.title {
				transform: translateX(-20rpx);
			}

			.income-info {
				display: flex;
				justify-content: space-around;
				margin-top: 20rpx;
				padding-top: 20rpx;
				border-top: 2rpx solid #f5f5f5;

				.income-item {
					text-align: center;

					.label {
						font-size: 26rpx;
						color: #666;
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
			background: #fff;
			border-radius: 24rpx;
			padding: 30rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

			.income-header {
				margin-bottom: 30rpx;

				.title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
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
					color: #333;
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
			background: #fff;
			border-radius: 24rpx;
			padding: 30rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

			.details-header {
				margin-bottom: 30rpx;

				.title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}
			}

			.details-grid {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 24rpx;
				margin-top: 30rpx;

				.detail-item {
					background: linear-gradient(135deg, #f8f9fc, #fff);
					padding: 30rpx;
					border-radius: 20rpx;
					border: 2rpx solid #f0f0f0;
					transition: all 0.3s;

					&:hover {
						transform: translateY(-2rpx);
						box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
					}

					.item-label {
						font-size: 26rpx;
						color: #666;
						margin-bottom: 16rpx;
					}

					.item-value {
						font-size: 36rpx;
						background: linear-gradient(135deg, #333, #666);
						-webkit-background-clip: text;
						color: transparent;
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
		background: #fff;
		border-radius: 24rpx;
		padding: 36rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

		.composition-header,
		.income-header,
		.status-header,
		.details-header {
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
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
				background: #f8f9fc;
				border-radius: 20rpx;
				transition: all 0.3s;

				&:hover {
					background: #f5f5f5;
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
					color: #333;
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
				background: linear-gradient(135deg, #f8f9fc, #fff);
				padding: 30rpx;
				border-radius: 20rpx;
				border: 2rpx solid #f0f0f0;
				transition: all 0.3s;

				&:hover {
					transform: translateY(-2rpx);
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
				}

				.item-label {
					font-size: 26rpx;
					color: #666;
					margin-bottom: 16rpx;
				}

				.item-value {
					font-size: 36rpx;
					background: linear-gradient(135deg, #333, #666);
					-webkit-background-clip: text;
					color: transparent;
					font-weight: bold;
				}

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>