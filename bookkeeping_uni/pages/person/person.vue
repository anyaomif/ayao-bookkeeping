<template>
	<view class="person-container" :style="themeVars">
		<ay-tabbar :currentTab="3" is-float text-only frosted :mode="appMode"></ay-tabbar>
		<!-- #ifndef H5, APP -->
		<NavbarWrapper mode="transparent"></NavbarWrapper>
		<!-- #endif -->
		<!-- 顶部个人信息卡片 -->
		<view class="user-card">
			<view class="user-info" @click="goToProfile">
				<image class="avatar" :src="baseUrl+userInfo.avatar || '/static/tx.jpg'" mode="aspectFill"></image>
				<view class="info-right">
					<text class="username">{{userInfo.nickname || '未登录'}}</text>
					<text class="signature">{{userInfo.signature || '开始记录美好生活'}}</text>
				</view>
				<tn-icon name="right" size="36" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
			</view>

			<ay-skeleton :loading="!pageLoaded">
				<template #skeleton>
					<view style="padding-top: 20rpx;">
						<view style="display: flex; justify-content: space-around; margin-bottom: 20rpx;">
							<view style="text-align: center;" v-for="i in 3" :key="i">
								<view class="sk-block" style="width: 80rpx; height: 40rpx; margin: 0 auto 12rpx; background: rgba(255,255,255,0.2); border-radius: 8rpx;"></view>
								<view class="sk-block" style="width: 120rpx; height: 24rpx; background: rgba(255,255,255,0.15); border-radius: 8rpx;"></view>
							</view>
						</view>
					</view>
				</template>
				<view class="statistics-grid">
					<view class="stat-card">
						<text class="number">{{statistics.totalRecordDays || 0}}<text class="unit">天</text></text>
						<text class="label">记账天数</text>
					</view>
					<view class="stat-card">
						<text class="number">{{statistics.currentConsecutiveDays || 0}}<text class="unit">天</text></text>
						<text class="label">连续记账</text>
					</view>
					<view class="stat-card">
						<text class="number">{{statistics.maxConsecutiveDays || 0}}<text class="unit">天</text></text>
						<text class="label">最长连续</text>
					</view>
				</view>
				<view class="statistics-row">
					<template v-if="appMode === 'personal'">
						<view class="stat-card wide" @tap="toggleAmountDisplay">
							<text class="number">¥{{isAmountHidden ? '****' : formatNumber(statistics.totalExpense || 0)}}</text>
							<text class="label">总支出</text>
						</view>
						<view class="stat-card wide" @tap="toggleAmountDisplay">
							<text class="number">¥{{isAmountHidden ? '****' : formatNumber(statistics.totalIncome || 0)}}</text>
							<text class="label">总收入</text>
						</view>
					</template>
					<template v-else>
						<view class="stat-card wide" @tap="toggleAmountDisplay">
							<text class="number">¥{{isAmountHidden ? '****' : formatNumber(statistics.totalIncome || 0)}}</text>
							<text class="label">总收入</text>
						</view>
						<view class="stat-card wide" @tap="toggleAmountDisplay">
							<text class="number">¥{{isAmountHidden ? '****' : formatNumber(statistics.averageDailyWage || 0)}}</text>
							<text class="label">平均日薪</text>
						</view>
					</template>
				</view>
			</ay-skeleton>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-item" @click="goToModeSelect">
				<view class="left">
					<view class="icon-bg"><tn-icon name="right-double" size="36" color="#ff6700"></tn-icon></view>
					<text>模式切换</text>
				</view>
				<tn-icon name="right" size="32" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
			</view>
			<view class="menu-item" @click="goToProject" v-if="appMode === 'work'">
				<view class="left">
					<view class="icon-bg"><tn-icon name="order" size="36" color="#ff6700"></tn-icon></view>
					<text>账本管理</text>
				</view>
				<tn-icon name="right" size="32" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
			</view>
			<view class="menu-item" @click="goToAccountSettings">
				<view class="left">
					<view class="icon-bg"><tn-icon name="set" size="36" color="#ff6700"></tn-icon></view>
					<text>用户设置</text>
				</view>
				<tn-icon name="right" size="32" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
			</view>
			<view class="menu-item" @click="goToAbout">
				<view class="left">
					<view class="icon-bg"><tn-icon name="at-sign" size="36" color="#ff6700"></tn-icon></view>
					<text>关于我们</text>
				</view>
				<tn-icon name="right" size="32" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import {
		ref,
		onUnmounted
	} from 'vue'
	import {
		userApi
	} from '@/api/user.js'
	import {
		personalTransactionApi
	} from '@/api/personal_transaction.js'
	import {
		baseUrl,
		formatNumber
	} from '@/utils/ayao.js'
	import { isDarkMode, getThemeMode, getThemeVars, setPageBgColor } from '@/utils/theme'

	const isDark = ref(false)
	const isLight = ref(false)
	const themeVars = ref({})
	const refreshTheme = () => {
		const mode = getThemeMode()
		isDark.value = mode === 'dark' || (mode === 'system' && isDarkMode())
		isLight.value = mode === 'light'
		themeVars.value = getThemeVars()
		setPageBgColor()
	}

	const userInfo = ref({
		avatar: '',
		username: '',
		signature: ''
	})

	const statistics = ref({
		totalRecordDays: 0,
		currentConsecutiveDays: 0,
		maxConsecutiveDays: 0,
		averageDailyWage: 0,
		totalIncome: 0,
		totalExpense: 0
	})

	const pageLoaded = ref(false)

	// 添加金额显示控制相关的状态
	const isAmountHidden = ref(true)
	const temporaryShow = ref(false)
	const appMode = ref('work')
	let hideTimeout = null

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

	// 获取统计数据（根据模式）
	const getStats = async () => {
		try {
			if (appMode.value === 'personal') {
				const res = await personalTransactionApi.getUserStats()
				if (res.success) {
					statistics.value = {
						totalRecordDays: res.data.total_record_days || 0,
						currentConsecutiveDays: res.data.current_consecutive_days || 0,
						maxConsecutiveDays: res.data.max_consecutive_days || 0,
						totalExpense: res.data.total_expense || 0,
						totalIncome: res.data.total_income || 0,
						averageDailyWage: 0,
					}
				}
			} else {
				const res = await userApi.getWorkStats()
				if (res.success) {
					statistics.value = {
						totalRecordDays: res.data.total_record_days || 0,
						currentConsecutiveDays: res.data.current_consecutive_days || 0,
						maxConsecutiveDays: res.data.max_consecutive_days || 0,
						totalExpense: 0,
						totalIncome: res.data.total_income || 0,
						averageDailyWage: res.data.average_daily_wage || 0,
					}
				}
			}
			pageLoaded.value = true
		} catch (error) {
			pageLoaded.value = true
			console.error('获取统计数据失败:', error)
		}
	}

	const goToModeSelect = () => {
		uni.navigateTo({ url: '/pages/mode/select?from=person' })
	}

	const goToProject = () => {
		uni.navigateTo({ url: '/pages/project/list' })
	}

	const goToAccounts = () => {
		uni.navigateTo({ url: '/pages/personal/accounts' })
	}

	// 获取用户信息
	const getUserInfo = async () => {
		try {
			const res = await userApi.getUserInfo()
			if (res.success) {
				userInfo.value = res.data
			}
		} catch (error) {
			console.error('获取用户信息失败:', error)
			uni.showToast({
				title: '获取用户信息失败',
				icon: 'none'
			})
		}
	}

	// 跳转到个人信息页
	const goToProfile = () => {
		uni.navigateTo({
			url: '/pages/person/profile'
		})
	}

	// 跳转到账户设置
	const goToAccountSettings = () => {
		uni.navigateTo({
			url: '/pages/person/accountSettings'
		})
	}

	// 跳转到关于我们
	const goToAbout = () => {
		uni.navigateTo({
			url: '/pages/person/about'
		})
	}

	onLoad(() => {
		// #ifdef APP
		uni.hideTabBar()
		// #endif
	})

	onShow(() => {
		refreshTheme()
		appMode.value = uni.getStorageSync('app_mode') || 'work';
		loadUserSettings()
		getUserInfo()
		getStats()
	})

	// 在组件销毁时清理定时器
	onUnmounted(() => {
		if (hideTimeout) {
			clearTimeout(hideTimeout)
		}
	})
</script>

<style lang="scss" scoped>
	.person-container {
		min-height: 100vh; min-height: 100dvh;
		background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid1) 15%, var(--bg-gradient-mid2) 35%, var(--bg-gradient-mid3) 60%, var(--bg-gradient-end) 85%);
		/* #ifdef APP */
		padding-top: var(--status-bar-height);
		/* #endif */
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	}

	.user-card {
		background: var(--bg-card);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1rpx solid var(--bg-card-border);
		border-radius: 24rpx;
		padding: 40rpx 30rpx 30rpx;
		margin: 0 20rpx 20rpx;
		box-shadow: var(--shadow-card);
		position: relative;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			left: 0; right: 0; bottom: 0;
			height: 45%;
			background: linear-gradient(180deg, transparent 0%, rgba(255, 160, 80, 0.1) 100%);
			pointer-events: none;
		}

		.user-info {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			.avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 60rpx;
				margin-right: 20rpx;
				box-shadow: 1rpx 1rpx 20rpx 1rpx var(--color-brand);
			}

			.info-right {
				display: flex;
				flex-direction: column;
				flex: 1;

				.username {
					font-size: 36rpx;
					font-weight: bold;
					color: var(--text-primary);
					margin-bottom: 8rpx;
				}

				.signature {
					font-size: 26rpx;
					color: var(--text-tertiary);
				}
			}
		}
	}

	.statistics-grid {
		display: flex;
		justify-content: space-between;
		gap: 16rpx;
		margin-bottom: 16rpx;
	}

	.statistics-row {
		display: flex;
		justify-content: space-between;
		gap: 16rpx;
	}

	.stat-card {
		flex: 1;
		background: var(--bg-card);
		border-radius: 16rpx;
		padding: 14rpx 12rpx;
		text-align: center;
		position: relative;
		z-index: 1;

		&.wide {
			padding: 16rpx 12rpx;
		}

		&:active {
			opacity: 0.8;
		}

		.number {
			display: block;
			font-size: 32rpx;
			color: var(--color-brand);
			font-weight: bold;
			margin-bottom: 4rpx;
		}

		.unit {
			font-size: 20rpx;
			font-weight: normal;
		}

		.label {
			font-size: 20rpx;
			color: var(--text-tertiary);
		}
	}

	.menu-list {
		background: var(--bg-card);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1rpx solid var(--bg-card-border);
		border-radius: 24rpx;
		padding: 0 30rpx;
		margin: 0 20rpx;
		box-shadow: var(--shadow-card);

		.menu-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 110rpx;
			border-bottom: 1rpx solid var(--divider);

			&:last-child {
				border-bottom: none;
			}

			.left {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.icon-bg {
					width: 64rpx;
					height: 64rpx;
					border-radius: 16rpx;
					background: var(--bg-input);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				text {
					font-size: 30rpx;
					color: var(--text-primary);
				}
			}
		}
	}
</style>