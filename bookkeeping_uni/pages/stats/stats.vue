<template>
	<view class="stats-container" :style="themeVars">
		<ay-tabbar :currentTab="1" is-float text-only frosted></ay-tabbar>
		<!-- <view class="app-header-box"></view> -->
		<NavbarWrapper sticky>
			<ay-title title="俺要记账" class="ay-title" :color="isDark ? '#f5f5f5' : '#333'">
				<template #right>
					<ProjectSelector v-model="selectedProjects" :projectList="projectList" @change="onProjectChange" />
				</template>
			</ay-title>
		</NavbarWrapper>

		<!-- 时间范围选择 -->
		<view class="date-range" v-show="isSingleMode">
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

		<!-- 骨架屏 -->
		<view v-if="statsLoading" class="skeleton-wrap">
			<!-- 总收入卡片骨架 -->
			<view class="skeleton-income-card">
				<view class="sk-line sk-line--short"></view>
				<view class="sk-line sk-line--amount"></view>
				<view class="sk-line sk-line--thin"></view>
			</view>

			<!-- section 骨架：收入构成 -->
			<view class="skeleton-section">
				<view class="sk-line sk-line--title"></view>
				<view class="sk-chart-row">
					<view class="sk-donut"></view>
					<view class="sk-legend">
						<view class="sk-line sk-line--med"></view>
						<view class="sk-line sk-line--med"></view>
						<view class="sk-line sk-line--med"></view>
					</view>
				</view>
			</view>

			<!-- section 骨架：趋势图 -->
			<view class="skeleton-section">
				<view class="sk-line sk-line--title"></view>
				<view class="sk-chart-block"></view>
			</view>

			<!-- section 骨架：工作状态 -->
			<view class="skeleton-section">
				<view class="sk-line sk-line--title"></view>
				<view class="sk-chart-block sk-chart-block--sm"></view>
			</view>

			<!-- 工作详情 2x2 grid 骨架 -->
			<view class="skeleton-section">
				<view class="sk-line sk-line--title"></view>
				<view class="sk-grid">
					<view class="sk-grid-item" v-for="i in 4" :key="i">
						<view class="sk-line sk-line--thin"></view>
						<view class="sk-line sk-line--value"></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 单项目模式 -->
		<view v-if="isSingleMode" class="content-fade" :class="{ 'content-visible': !statsLoading }">
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
						<text class="percent neutral" v-else>暂无对比</text>
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
						<text class="value">¥{{ isAmountHidden ? '****' : formatNumber(totalPointIncome) }}</text>
					</view>
					<view class="income-item" @tap="toggleAmountDisplay">
						<text class="label">加班收入</text>
						<text class="value">¥{{ isAmountHidden ? '****' : formatNumber(overtimeIncome) }}</text>
					</view>
					<view class="income-item" @tap="toggleAmountDisplay">
						<text class="label">包工收入</text>
						<text class="value">¥{{ isAmountHidden ? '****' : formatNumber(totalContractIncome) }}</text>
					</view>
				</view>
			</view>

			<!-- 收入趋势 -->
			<view class="chart-section">
				<ay-title title="收入趋势" bold padding="0" class="title" :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
				<view class="trend-chart" style="position: relative; min-height: 400rpx;">
					<ay-area-chart v-if="hasDailyData" :categories="trendCategories" :series="trendSeries" :height="400" :stepWidth="100" />
					<view v-else class="empty-chart-overlay">暂无趋势数据</view>
				</view>
			</view>

			<!-- 工作状态分析 -->
			<view class="chart-section">
				<ay-title title="工作状态分析" bold padding="0" class="title" :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
				<view class="status-chart" style="position: relative; min-height: 320rpx;">
					<ay-pie-chart v-if="hasWorkStatusData" :series="workStatusData" :size="320" :colors="['#ff6700', '#52c41a', '#1890ff']" />
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
						<text class="item-label">打卡次数</text>
						<text class="item-value">{{ workCount }}次</text>
					</view>
					<view class="detail-item" @tap="toggleAmountDisplay">
						<text class="item-label">平均日薪</text>
						<text class="item-value">{{ isAmountHidden ? '****' : '¥' + formatNumber(averageDailyWage) }}</text>
					</view>
					<view class="detail-item">
						<text class="item-label">加班次数</text>
						<text class="item-value">{{ overtimeCount }}次</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 多项目模式 -->
		<view v-else class="content-fade" :class="{ 'content-visible': !statsLoading }">
			<!-- 多项目汇总 -->
			<view class="multi-summary">
				<view class="summary-item" @tap="toggleAmountDisplay">
					<text class="s-label">总收入</text>
					<text class="s-value">{{ isAmountHidden ? '****' : '¥' + formatNumber(multiTotal.total_amount) }}</text>
				</view>
				<view class="summary-item">
					<text class="s-label">总工天</text>
					<text class="s-value">{{ multiTotal.total_work_days }}天</text>
				</view>
				<view class="summary-item" @tap="toggleAmountDisplay">
					<text class="s-label">平均日薪</text>
					<text class="s-value">{{ isAmountHidden ? '****' : '¥' + formatNumber(multiTotal.average_daily_wage) }}</text>
				</view>
			</view>

			<!-- 收益日历 -->
			<view class="chart-section income-calendar">
				<!-- 视图切换 tab -->
				<view class="cal-view-tabs">
					<view v-for="v in calendarViews" :key="v.value"
						:class="['cal-view-tab', { active: calendarView === v.value }]"
						@tap="calendarView = v.value">
						{{ v.label }}
					</view>
				</view>

				<!-- 导航栏（日/周/月视图有切换，年视图无需切换） -->
				<view class="calendar-nav" v-if="calendarView !== 'year'">
					<tn-icon name="left" size="32" :color="isDark ? '#f5f5f5' : '#333'" @tap="switchCalendarNav(-1)"></tn-icon>
					<text class="calendar-nav-title">{{ calendarNavTitle }}</text>
					<tn-icon name="right" size="32" :color="calendarNavCanNext ? (isDark ? '#f5f5f5' : '#333') : (isDark ? '#444' : '#ccc')" @tap="switchCalendarNav(1)"></tn-icon>
				</view>

				<!-- 日视图：月历热力图 -->
				<template v-if="calendarView === 'day'">
					<view class="calendar-weekdays">
						<text v-for="w in ['一','二','三','四','五','六','日']" :key="w" class="weekday-label">{{ w }}</text>
					</view>
					<view class="calendar-grid">
						<view v-for="(cell, idx) in calendarDays" :key="idx"
							:class="['cal-cell', { 'cal-cell--empty': cell.empty, 'cal-cell--today': cell.isToday, ['cal-cell--lv' + cell.level]: !cell.empty }]">
							<template v-if="!cell.empty">
								<text class="cal-day">{{ cell.day }}</text>
								<text v-if="cell.income > 0" class="cal-income">{{ isAmountHidden ? '**' : formatNumber(cell.income) }}</text>
							</template>
						</view>
					</view>
					<view class="calendar-legend">
						<text class="legend-label">少</text>
						<view class="legend-block lv1"></view>
						<view class="legend-block lv2"></view>
						<view class="legend-block lv3"></view>
						<view class="legend-block lv4"></view>
						<text class="legend-label">多</text>
					</view>
				</template>

				<!-- 周视图：3列卡片网格 -->
				<template v-else-if="calendarView === 'week'">
					<view class="week-grid">
						<view v-if="weekRows.length === 0" class="empty-tip">暂无数据</view>
						<view v-for="(row, idx) in weekRows" :key="idx"
							:class="['week-cell', 'cal-cell--lv' + row.level]">
							<text class="week-range">{{ row.label }}</text>
							<text class="week-income">{{ row.income === 0 ? '—' : (isAmountHidden ? '**' : formatNumber(row.income)) }}</text>
						</view>
					</view>
				</template>

				<!-- 月视图：网格 -->
				<template v-else-if="calendarView === 'month'">
					<view class="month-grid">
						<view v-if="monthRows.length === 0" class="empty-tip">暂无数据</view>
						<view v-for="(row, idx) in monthRows" :key="idx"
							:class="['month-cell', 'cal-cell--lv' + row.level]">
							<text class="month-label">{{ row.label }}</text>
							<text class="month-income">{{ row.income === 0 ? '—' : (isAmountHidden ? '**' : formatNumber(row.income)) }}</text>
						</view>
					</view>
				</template>

				<!-- 年视图：网格 -->
				<template v-else-if="calendarView === 'year'">
					<text class="calendar-nav-title year-subtitle">记账以来</text>
					<view class="year-grid">
						<view v-if="yearRows.length === 0" class="empty-tip">暂无数据</view>
						<view v-for="(row, idx) in yearRows" :key="idx"
							:class="['year-cell', 'cal-cell--lv' + row.level]">
							<text class="year-label">{{ row.label }}</text>
							<text class="year-income">{{ row.income === 0 ? '—' : (isAmountHidden ? '**' : formatNumber(row.income)) }}</text>
						</view>
					</view>
				</template>
			</view>

			<!-- 项目收入排行 -->
			<view class="chart-section">
				<ay-title title="项目收入排行" bold padding="0" class="title" :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
				<view v-if="multiProjects.length > 0" class="project-rank-list">
					<view v-for="(item, idx) in multiProjects" :key="item.project_id" class="rank-item">
						<view class="rank-header">
							<view class="rank-name-row">
								<text class="rank-no">{{ idx + 1 }}</text>
								<text class="rank-name">{{ item.project_name }}</text>
							</view>
							<text class="rank-amount" @tap="toggleAmountDisplay">{{ isAmountHidden ? '****' : '¥' + formatNumber(item.total_amount) }}</text>
						</view>
						<view class="rank-bar-wrap">
							<view class="rank-bar-point" :style="{ width: getBarWidth(item.point_income) }"></view>
							<view class="rank-bar-overtime" :style="{ width: getBarWidth(item.overtime_income) }"></view>
							<view class="rank-bar-contract" :style="{ width: getBarWidth(item.contract_income) }"></view>
						</view>
						<view class="rank-legend">
							<text class="legend-item point">点工 {{ isAmountHidden ? '***' : '¥' + formatNumber(item.point_income) }}</text>
							<text class="legend-item overtime">加班 {{ isAmountHidden ? '***' : '¥' + formatNumber(item.overtime_income) }}</text>
							<text class="legend-item contract">包工 {{ isAmountHidden ? '***' : '¥' + formatNumber(item.contract_income) }}</text>
						</view>
					</view>
				</view>
				<view v-else class="empty-chart-overlay">暂无数据</view>
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
	const selectedProjects = ref([])
	const multiTotal = ref({ total_amount: 0, total_work_days: 0, average_daily_wage: 0 })
	const multiProjects = ref([])
	const multiDailyIncome = ref([])

	// 收益日历
	const calendarMonth = ref('')  // 'YYYY-MM'，日视图用
	const calendarMonthOffset = ref(0) // 月视图偏移（相对起始年）

	const calendarView = ref('day')
	const calendarViews = [
		{ label: '日', value: 'day' },
		{ label: '周', value: 'week' },
		{ label: '月', value: 'month' },
		{ label: '年', value: 'year' },
	]

	// 日视图导航标题
	const calendarNavTitle = computed(() => {
		if (calendarView.value === 'day' || calendarView.value === 'week') {
			if (!calendarMonth.value) return ''
			const [y, m] = calendarMonth.value.split('-')
			return `${y}年${parseInt(m)}月`
		}
		if (calendarView.value === 'month') {
			if (!multiDailyIncome.value.length) return ''
			const dates = multiDailyIncome.value.map(i => i.date).sort()
			const baseYear = parseInt(dates[0].slice(0, 4)) + calendarMonthOffset.value
			return `${baseYear}年`
		}
		return ''
	})

	const calendarNavCanNext = computed(() => {
		const now = new Date()
		if (calendarView.value === 'day' || calendarView.value === 'week') {
			if (!calendarMonth.value) return false
			const [y, m] = calendarMonth.value.split('-').map(Number)
			return y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1)
		}
		if (calendarView.value === 'month') {
			if (!multiDailyIncome.value.length) return false
			const dates = multiDailyIncome.value.map(i => i.date).sort()
			const baseYear = parseInt(dates[0].slice(0, 4)) + calendarMonthOffset.value
			return baseYear < now.getFullYear()
		}
		return false
	})

	const switchCalendarNav = (delta) => {
		if (delta > 0 && !calendarNavCanNext.value) return
		if (calendarView.value === 'day' || calendarView.value === 'week') {
			const [y, m] = calendarMonth.value.split('-').map(Number)
			const d = new Date(y, m - 1 + delta, 1)
			calendarMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
		} else if (calendarView.value === 'month') {
			calendarMonthOffset.value += delta
		}
	}

	// 周视图：基于 calendarMonth，从该月1号向前对齐到周一，到今天（或月末）的所有周
	const weekRows = computed(() => {
		if (!calendarMonth.value) return []
		const incomeMap = {}
		multiDailyIncome.value.forEach(item => { incomeMap[item.date] = item.total_income })

		const [y, m] = calendarMonth.value.split('-').map(Number)
		const monthStart = new Date(y, m - 1, 1)
		const monthEnd = new Date(y, m, 0) // 月末
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const endD = monthEnd < today ? monthEnd : today

		// 从月1号向前对齐到周一
		const dow = monthStart.getDay()
		const mondayOffset = dow === 0 ? -6 : 1 - dow
		const firstMonday = new Date(monthStart)
		firstMonday.setDate(firstMonday.getDate() + mondayOffset)

		const fmt = d => `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
		const toKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

		const allIncomes = Object.values(incomeMap)
		const maxIncome = allIncomes.length ? Math.max(...allIncomes, 1) : 1

		const weeks = []
		let cur = new Date(firstMonday)
		while (cur <= endD) {
			const wStart = new Date(cur)
			const wEnd = new Date(cur)
			wEnd.setDate(wEnd.getDate() + 6)
			let income = 0
			for (let d = new Date(wStart); d <= wEnd; d.setDate(d.getDate() + 1)) {
				income += incomeMap[toKey(d)] || 0
			}
			income = Number(income.toFixed(2))
			const ratio = income > 0 ? income / maxIncome : 0
			let level = 0
			if (ratio > 0.75) level = 4
			else if (ratio > 0.5) level = 3
			else if (ratio > 0.25) level = 2
			else if (ratio > 0) level = 1
			weeks.push({ label: `${fmt(wStart)}-${fmt(wEnd)}`, income, level })
			cur.setDate(cur.getDate() + 7)
		}
		return weeks
	})

	// 月视图：按自然月聚合，每页显示12个月，按年偏移翻页
	const monthRows = computed(() => {
		if (!multiDailyIncome.value.length) return []
		const monthMap = {}
		multiDailyIncome.value.forEach(item => {
			const ym = item.date.slice(0, 7)
			monthMap[ym] = (monthMap[ym] || 0) + item.total_income
		})
		const months = Object.keys(monthMap).sort()
		const baseYear = parseInt(months[0].slice(0, 4)) + calendarMonthOffset.value
		const rows = []
		for (let m = 1; m <= 12; m++) {
			const key = `${baseYear}-${String(m).padStart(2, '0')}`
			const income = Number((monthMap[key] || 0).toFixed(2))
			const maxIncome = Math.max(...Object.values(monthMap), 1)
			const ratio = income / maxIncome
			let level = 0
			if (ratio > 0.75) level = 4
			else if (ratio > 0.5) level = 3
			else if (ratio > 0.25) level = 2
			else if (ratio > 0) level = 1
			rows.push({ label: `${m}月`, income, level })
		}
		return rows
	})

	// 年视图：按年聚合
	const yearRows = computed(() => {
		if (!multiDailyIncome.value.length) return []
		const yearMap = {}
		multiDailyIncome.value.forEach(item => {
			const y = item.date.slice(0, 4)
			yearMap[y] = (yearMap[y] || 0) + item.total_income
		})
		const maxIncome = Math.max(...Object.values(yearMap), 1)
		return Object.keys(yearMap).sort().map(y => {
			const income = Number(yearMap[y].toFixed(2))
			const ratio = income / maxIncome
			let level = 0
			if (ratio > 0.75) level = 4
			else if (ratio > 0.5) level = 3
			else if (ratio > 0.25) level = 2
			else if (ratio > 0) level = 1
			return { label: y + '年', income, level }
		})
	})

	const calendarDays = computed(() => {
		if (!calendarMonth.value) return []
		const [y, m] = calendarMonth.value.split('-').map(Number)
		const firstDay = new Date(y, m - 1, 1)
		const totalDays = new Date(y, m, 0).getDate()
		// 周一为第一列，0=周日转为6
		let startWeekday = firstDay.getDay()
		startWeekday = startWeekday === 0 ? 6 : startWeekday - 1

		const incomeMap = {}
		multiDailyIncome.value.forEach(item => {
			if (item.date.startsWith(calendarMonth.value)) {
				incomeMap[item.date] = item.total_income
			}
		})

		const maxIncome = Math.max(...Object.values(incomeMap), 1)
		const today = new Date().toISOString().slice(0, 10)

		const cells = []
		// 前置空格
		for (let i = 0; i < startWeekday; i++) cells.push({ empty: true })
		for (let d = 1; d <= totalDays; d++) {
			const dateStr = `${calendarMonth.value}-${String(d).padStart(2, '0')}`
			const income = incomeMap[dateStr] || 0
			const ratio = income > 0 ? income / maxIncome : 0
			let level = 0
			if (ratio > 0.75) level = 4
			else if (ratio > 0.5) level = 3
			else if (ratio > 0.25) level = 2
			else if (ratio > 0) level = 1
			cells.push({ empty: false, day: d, date: dateStr, income, level, isToday: dateStr === today })
		}
		return cells
	})
	const isSingleMode = computed(() => selectedProjects.value.length === 1)

	// 单项目统计数据
	const totalIncome = ref(0)
	const monthCompare = ref(0)
	const workDays = ref(0)
	const workCount = ref(0)
	const overtimeCount = ref(0)
	const averageDailyWage = ref(0)
	const totalPointIncome = ref(0)
	const totalContractIncome = ref(0)
	const overtimeIncome = ref(0)
	const pieSeriesData = ref([])
	const trendCategories = ref([])
	const trendSeries = ref([])
	const workStatusData = ref([])
	const hasIncomeData = computed(() => totalPointIncome.value > 0 || totalContractIncome.value > 0)
	const hasDailyData = computed(() => trendCategories.value.length > 0)
	const hasWorkStatusData = computed(() => workStatusData.value.some(item => item.value > 0))

	const getBarWidth = (income) => {
		const max = multiProjects.value[0]?.total_amount || 1
		return Math.round((income / max) * 100) + '%'
	}

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

	// 选择项目（确认后触发）
	const selectProject = (projects) => {
		selectedProjects.value = projects
		uni.setStorageSync('stats_selected_projects', projects.map(p => p.id))
		loadStatistics()
	}
	const onProjectChange = selectProject

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
		if (!startDate.value || !endDate.value) return
		if (statsLoading.value) return
		statsLoading.value = true
		try {
			if (isSingleMode.value) {
				// 单项目模式：调用单项目接口
				const params = {
					project_id: selectedProjects.value[0].id,
					type: currentRange.value,
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
			} else {
				// 多项目模式
				const params = {
					project_ids: selectedProjects.value.map(p => p.id),
					type: currentRange.value,
				}
				if (currentRange.value === 'custom') {
					params.start_date = startDate.value
					params.end_date = endDate.value
				}
				const res = await statisticsApi.getMultiStatistics(params)
				if (res.success) {
					multiTotal.value = res.data.total
					multiProjects.value = res.data.projects
					multiDailyIncome.value = res.data.daily_income || []
					// 初始化日历月份：优先用结束日期所在月
					if (!calendarMonth.value) {
						calendarMonth.value = (endDate.value || new Date().toISOString().slice(0, 10)).slice(0, 7)
					}
				}
			}
		} catch (error) {
			uni.showToast({ title: '获取统计数据失败', icon: 'none' })
		} finally {
			statsLoading.value = false
		}
	}

	const updateBasicStats = (data) => {
		const stats = data.statistics
		totalIncome.value = stats.total_amount
		workDays.value = stats.work_status.normal_work_count
		workCount.value = stats.total_work_days
		monthCompare.value = stats.month_compare
		overtimeCount.value = stats.overtime_count
		averageDailyWage.value = stats.average_daily_wage
		totalPointIncome.value = stats.point_income
		totalContractIncome.value = stats.contract_income
		overtimeIncome.value = stats.overtime_income
	}

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
		const seriesItems = []
		if (stats.point_income > 0) seriesItems.push({ name: '点工收入', data: stats.point_income, color: '#ff6700' })
		if (stats.contract_income > 0) seriesItems.push({ name: '包工收入', data: stats.contract_income, color: '#1890ff' })
		if (stats.overtime_income > 0) seriesItems.push({ name: '加班收入', data: stats.overtime_income, color: '#52c41a' })
		pieSeriesData.value = seriesItems

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

			// 恢复上次选择的项目，否则默认全选
			try {
				const cachedIds = uni.getStorageSync('stats_selected_projects')
				if (cachedIds && cachedIds.length > 0) {
					const restored = projectList.value.filter(p => cachedIds.includes(p.id))
					selectedProjects.value = restored.length > 0 ? restored : [...projectList.value]
				} else {
					selectedProjects.value = [...projectList.value]
				}
			} catch {
				selectedProjects.value = [...projectList.value]
			}

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
	.multi-summary {
		display: flex;
		margin: 20rpx;
		gap: 20rpx;
		.summary-item {
			flex: 1;
			background: var(--bg-card-solid);
			border-radius: 20rpx;
			padding: 24rpx 16rpx;
			box-shadow: var(--shadow-card);
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10rpx;
			.s-label {
				font-size: 24rpx;
				color: var(--text-secondary);
			}
			.s-value {
				font-size: 32rpx;
				font-weight: bold;
				color: #ff6700;
			}
		}
	}

	.project-rank-list {
		margin-top: 20rpx;
		.rank-item {
			background: var(--bg-input);
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 20rpx;
			.rank-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;
				.rank-name-row {
					display: flex;
					align-items: center;
					gap: 12rpx;
					.rank-no {
						width: 40rpx;
						height: 40rpx;
						line-height: 40rpx;
						text-align: center;
						background: #ff6700;
						color: #fff;
						border-radius: 50%;
						font-size: 22rpx;
						font-weight: bold;
					}
					.rank-name {
						font-size: 28rpx;
						color: var(--text-primary);
						font-weight: bold;
					}
				}
				.rank-amount {
					font-size: 32rpx;
					color: #ff6700;
					font-weight: bold;
				}
			}
			.rank-bar-wrap {
				display: flex;
				height: 20rpx;
				border-radius: 10rpx;
				overflow: hidden;
				background: var(--divider);
				margin-bottom: 16rpx;
				.rank-bar-point { height: 100%; background: #ff6700; transition: width 0.3s; }
				.rank-bar-overtime { height: 100%; background: #52c41a; transition: width 0.3s; }
				.rank-bar-contract { height: 100%; background: #1890ff; transition: width 0.3s; }
			}
			.rank-legend {
				display: flex;
				gap: 16rpx;
				.legend-item {
					font-size: 22rpx;
					&.point { color: #ff6700; }
					&.overtime { color: #52c41a; }
					&.contract { color: #1890ff; }
				}
			}
		}
	}

	// 骨架屏
	@keyframes skeleton-shimmer {
		0% { background-position: -750rpx 0; }
		100% { background-position: 750rpx 0; }
	}

	.content-fade {
		opacity: 0;
		transition: opacity 0.25s ease;
		&.content-visible {
			opacity: 1;
		}
	}

	.skeleton-wrap {
		padding-bottom: 40rpx;
	}

	.sk-line,
	.sk-donut,
	.sk-chart-block,
	.sk-grid-item {
		border-radius: 12rpx;
		background: linear-gradient(
			90deg,
			var(--bg-input) 25%,
			var(--divider) 50%,
			var(--bg-input) 75%
		);
		background-size: 1500rpx 100%;
		animation: skeleton-shimmer 1.4s infinite linear;
	}

	.sk-line {
		height: 28rpx;
		margin-bottom: 16rpx;
		&--short { width: 40%; }
		&--thin { width: 60%; height: 22rpx; }
		&--med { width: 70%; margin-bottom: 20rpx; }
		&--title { width: 35%; height: 32rpx; margin-bottom: 24rpx; }
		&--amount { width: 55%; height: 56rpx; margin-bottom: 20rpx; border-radius: 16rpx; }
		&--value { width: 50%; height: 40rpx; border-radius: 10rpx; }
	}

	.skeleton-income-card {
		margin: 20rpx;
		background: var(--bg-input);
		border-radius: 24rpx;
		padding: 36rpx;
		box-shadow: var(--shadow-card);
	}

	.skeleton-section {
		background: var(--bg-card-solid);
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 20rpx 30rpx;
		box-shadow: var(--shadow-card);
	}

	.sk-chart-row {
		display: flex;
		align-items: center;
		gap: 30rpx;
		margin-top: 16rpx;
	}

	.sk-donut {
		width: 240rpx;
		height: 240rpx;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.sk-legend {
		flex: 1;
	}

	.sk-chart-block {
		width: 100%;
		height: 400rpx;
		margin-top: 16rpx;
		border-radius: 16rpx;
		&--sm { height: 320rpx; }
	}

	.sk-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24rpx;
		margin-top: 16rpx;
	}

	.sk-grid-item {
		background: var(--bg-input);
		padding: 30rpx;
		border-radius: 20rpx;
		border: 2rpx solid var(--divider);
		// 覆盖子元素，让 grid-item 本身不做 shimmer，子 sk-line 做
		background: none;
		animation: none;
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

		.title-right-slot {
			display: flex;
			align-items: center;
			gap: 4rpx;
		}

		.double-arrow {
			display: flex;
			align-items: center;
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

	.income-calendar {
		.calendar-nav {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 24rpx;

			.calendar-nav-title {
				font-size: 30rpx;
				font-weight: bold;
				color: var(--text-primary);
			}
		}

		.year-subtitle {
			display: block;
			text-align: center;
			margin-bottom: 16rpx;
			color: var(--text-secondary);
			font-weight: bold;
			font-size: 26rpx;
		}

		.calendar-weekdays {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			margin-bottom: 8rpx;

			.weekday-label {
				text-align: center;
				font-size: 22rpx;
				color: var(--text-tertiary);
				padding: 8rpx 0;
			}
		}

		.calendar-grid {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			gap: 6rpx;
		}

		.cal-cell {
			aspect-ratio: 1;
			border-radius: 12rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: var(--bg-input);
			position: relative;
			padding: 4rpx 0;

			&--empty {
				background: transparent;
			}

			&--today {
				border: 2rpx solid #ff6700;
			}

			&--lv0 { background: var(--bg-input); }
			&--lv1 { background: rgba(255, 103, 0, 0.18); }
			&--lv2 { background: rgba(255, 103, 0, 0.38); }
			&--lv3 { background: rgba(255, 103, 0, 0.62); }
			&--lv4 { background: rgba(255, 103, 0, 0.88); }

			.cal-day {
				font-size: 24rpx;
				color: var(--text-primary);
				line-height: 1.2;
			}

			.cal-income {
				font-size: 18rpx;
				color: var(--text-primary);
				line-height: 1.2;
				opacity: 0.85;
				max-width: 90%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			&--lv3, &--lv4 {
				.cal-day, .cal-income { color: #fff; }
			}
		}

		.calendar-legend {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 8rpx;
			margin-top: 20rpx;

			.legend-label {
				font-size: 22rpx;
				color: var(--text-tertiary);
			}

			.legend-block {
				width: 28rpx;
				height: 28rpx;
				border-radius: 6rpx;
				&.lv1 { background: rgba(255, 103, 0, 0.18); }
				&.lv2 { background: rgba(255, 103, 0, 0.38); }
				&.lv3 { background: rgba(255, 103, 0, 0.62); }
				&.lv4 { background: rgba(255, 103, 0, 0.88); }
			}
		}

		// 视图切换 tab
		.cal-view-tabs {
			display: flex;
			gap: 0;
			background: var(--bg-input);
			border-radius: 16rpx;
			padding: 4rpx;
			margin-bottom: 24rpx;

			.cal-view-tab {
				flex: 1;
				text-align: center;
				padding: 10rpx 0;
				font-size: 26rpx;
				color: var(--text-secondary);
				border-radius: 12rpx;
				transition: all 0.2s;

				&.active {
					background: var(--bg-card-solid);
					color: #ff6700;
					font-weight: bold;
					box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
				}
			}
		}

		// 周视图
		.week-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 12rpx;
			margin-top: 8rpx;

			.week-cell {
				border-radius: 16rpx;
				padding: 20rpx 8rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 8rpx;
				background: var(--bg-input);

				.week-range {
					font-size: 20rpx;
					color: var(--text-primary);
					text-align: center;
					line-height: 1.4;
				}

				.week-income {
					font-size: 24rpx;
					color: var(--text-secondary);
				}

					&.cal-cell--lv1 { background: rgba(255, 103, 0, 0.18); }
				&.cal-cell--lv2 { background: rgba(255, 103, 0, 0.38); }
				&.cal-cell--lv3 { background: rgba(255, 103, 0, 0.62); }
				&.cal-cell--lv4 { background: rgba(255, 103, 0, 0.88); }
				&.cal-cell--lv3, &.cal-cell--lv4 {
					.week-range, .week-income { color: #fff; }
				}
			}
		}

		// 月视图
		.month-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 12rpx;
			margin-top: 8rpx;

			.month-cell {
				border-radius: 16rpx;
				padding: 20rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 8rpx;
				background: var(--bg-input);

				.month-label {
					font-size: 26rpx;
					color: var(--text-primary);
				}

				.month-income {
					font-size: 22rpx;
					color: var(--text-secondary);
				}

				&.cal-cell--lv1 { background: rgba(255, 103, 0, 0.18); }
				&.cal-cell--lv2 { background: rgba(255, 103, 0, 0.38); }
				&.cal-cell--lv3 { background: rgba(255, 103, 0, 0.62); }
				&.cal-cell--lv4 { background: rgba(255, 103, 0, 0.88); }
				&.cal-cell--lv3, &.cal-cell--lv4 {
					.month-label, .month-income { color: #fff; }
				}
			}
		}

		// 年视图
		.year-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 12rpx;
			margin-top: 8rpx;

			.year-cell {
				border-radius: 16rpx;
				padding: 24rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10rpx;
				background: var(--bg-input);

				.year-label {
					font-size: 28rpx;
					font-weight: bold;
					color: var(--text-primary);
				}

				.year-income {
					font-size: 24rpx;
					color: var(--text-secondary);
				}

				&.cal-cell--lv1 { background: rgba(255, 103, 0, 0.18); }
				&.cal-cell--lv2 { background: rgba(255, 103, 0, 0.38); }
				&.cal-cell--lv3 { background: rgba(255, 103, 0, 0.62); }
				&.cal-cell--lv4 { background: rgba(255, 103, 0, 0.88); }
				&.cal-cell--lv3, &.cal-cell--lv4 {
					.year-label, .year-income { color: #fff; }
				}
			}
		}

		.empty-tip {
			text-align: center;
			padding: 40rpx 0;
			font-size: 26rpx;
			color: var(--text-tertiary);
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