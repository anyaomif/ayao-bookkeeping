<template>
	<view class="person-container">
		<ay-tabbar :currentTab="2" is-float text-only frosted :mode="appMode"></ay-tabbar>
		<!-- <view class="app-header-box"></view> -->
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
			</view>

			<ay-skeleton :loading="!pageLoaded">
				<template #skeleton>
					<view style="padding-top: 20rpx; border-top: 1rpx solid #f0f0f0;">
						<view style="display: flex; justify-content: space-around; margin-bottom: 30rpx;">
							<view style="text-align: center;" v-for="i in 3" :key="i">
								<view class="sk-block" style="width: 80rpx; height: 40rpx; margin: 0 auto 12rpx;"></view>
								<view class="sk-block" style="width: 120rpx; height: 24rpx;"></view>
							</view>
						</view>
						<view style="display: flex; justify-content: space-around;">
							<view style="text-align: center;" v-for="i in 2" :key="i">
								<view class="sk-block" style="width: 120rpx; height: 40rpx; margin: 0 auto 12rpx;"></view>
								<view class="sk-block" style="width: 100rpx; height: 24rpx;"></view>
							</view>
						</view>
					</view>
				</template>
				<view>
			<view class="statistics">
				<view class="stat-item">
					<text class="number">
						{{statistics.totalRecordDays || 0}}
						<text class="unit">天</text>
					</text>
					<text class="label">记账天数</text>
				</view>
				<view class="stat-item">
					<text class="number">
						{{statistics.currentConsecutiveDays || 0}}
						<text class="unit">天</text>
					</text>
					<text class="label">当前连续记账</text>
				</view>
				<view class="stat-item">
					<text class="number">
						{{statistics.maxConsecutiveDays || 0}}
						<text class="unit">天</text>
					</text>
					<text class="label">最大连续记账</text>
				</view>
			</view>
			<view class="statistics" style="border: none;">
				<view class="stat-item" @tap="toggleAmountDisplay">
					<text class="number">¥{{isAmountHidden ? '****' : formatNumber(statistics.totalIncome || 0)}}</text>
					<text class="label">总收入</text>
				</view>
				<view class="stat-item" @tap="toggleAmountDisplay">
					<text class="number">¥{{isAmountHidden ? '****' : formatNumber(statistics.averageDailyWage || 0)}}</text>
					<text class="label">平均日薪</text>
				</view>
			</view>
				</view>
			</ay-skeleton>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-item" @click="goToModeSelect">
				<view class="left">
					<tn-icon name="right-double" class="iconfont" color="#ff6700"></tn-icon>
					<text>模式切换</text>
				</view>
				<text class="iconfont icon-right"></text>
			</view>
			<view class="menu-item" @click="goToProject" v-if="appMode === 'work'">
				<view class="left">
					<tn-icon name="order" class="iconfont" color="#ff6700"></tn-icon>
					<text>账本管理</text>
				</view>
				<text class="iconfont icon-right"></text>
			</view>
			<view class="menu-item" @click="goToAccountSettings">
				<view class="left">
					<tn-icon name="set" class="iconfont" color="#ff6700"></tn-icon>
					<text>用户设置</text>
				</view>
				<text class="iconfont icon-right"></text>
			</view>
			<view class="menu-item" @click="goToAbout">
				<view class="left">
					<tn-icon name="at-sign" class="iconfont" color="#ff6700"></tn-icon>
					<text>关于我们</text>
				</view>
				<text class="iconfont icon-right"></text>
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
		baseUrl,
		formatNumber
	} from '@/utils/ayao.js'

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
		totalIncome: 0
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

	// 获取工作统计数据
	const getWorkStats = async () => {
		try {
			const res = await userApi.getWorkStats()
			if (res.success) {
				statistics.value = {
					totalRecordDays: res.data.total_record_days || 0,
					currentConsecutiveDays: res.data.current_consecutive_days || 0,
					maxConsecutiveDays: res.data.max_consecutive_days || 0,
					averageDailyWage: res.data.average_daily_wage || 0,
					totalIncome: res.data.total_income || 0
				}
				pageLoaded.value = true
			}
		} catch (error) {
			pageLoaded.value = true
			console.error('获取工作统计数据失败:', error)
			uni.showToast({
				title: '获取统计数据失败',
				icon: 'none'
			})
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
		appMode.value = uni.getStorageSync('app_mode') || 'work';
		loadUserSettings()
		getUserInfo()
		getWorkStats()
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
		background-color: #f5f5f5;
		/* #ifdef APP */
		padding-top: var(--status-bar-height);
		/* #endif */
	}

	.app-header-box {
		width: calc(100vw - 40rpx);
		height: 20rpx;
	}

	.user-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin: 0 20rpx 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.user-info {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			.avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 60rpx;
				margin-right: 20rpx;
				box-shadow: 1rpx 1rpx 20rpx 1rpx #ff6700;
			}

			.info-right {
				display: flex;
				flex-direction: column;
				flex: 1;

				.username {
					font-size: 36rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
				}

				.signature {
					font-size: 26rpx;
					color: #999;
				}
			}
		}

		.statistics {
			display: flex;
			justify-content: space-around;
			padding-top: 20rpx;
			border-top: 1rpx solid #f0f0f0;

			.stat-item {
				text-align: center;
				transition: all 0.3s;

				&:active {
					opacity: 0.8;
				}

				.number {
					display: block;
					font-size: 36rpx;
					color: #ff6700;
					font-weight: bold;
					margin-bottom: 8rpx;
				}

				.label {
					font-size: 24rpx;
					color: #666;
				}

				.unit {
					font-size: 24rpx;
				}
			}
		}
	}

	.menu-list {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 0 20rpx;
		margin: 0 20rpx;

		.menu-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			border-bottom: 1rpx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}

			.left {
				display: flex;
				align-items: center;

				.iconfont {
					font-size: 40rpx;
					color: #ff6700;
					margin-right: 20rpx;
				}

				text {
					font-size: 28rpx;
					color: #333;
				}
			}

			.icon-right {
				color: #999;
				font-size: 32rpx;
			}
		}
	}
</style>