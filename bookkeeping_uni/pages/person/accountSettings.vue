<template>
	<view class="settings-container">
		<!-- 通知设置 -->
		<view class="settings-section">
			<ay-title title="通知设置" bold></ay-title>
			<view class="settings-item">
				<view class="item-left">
					<text class="label">每日提醒</text>
					<text class="desc">每天提醒你记账</text>
				</view>
				<ay-switch v-model="settings.dailyReminder" active-color="#ff6700"></ay-switch>
			</view>
			<!-- <view class="settings-item">
				<view class="item-left">
					<text class="label">工资到账提醒</text>
					<text class="desc">工资到账时通知你</text>
				</view>
				<ay-switch v-model="settings.salaryReminder" active-color="#ff6700"></ay-switch>
			</view> -->
		</view>

		<!-- 隐私设置 -->
		<view class="settings-section">
			<ay-title title="隐私设置" bold></ay-title>
			<view class="settings-item">
				<view class="item-left">
					<text class="label">金额显示</text>
					<text class="desc">在首页显示具体金额</text>
				</view>
				<ay-switch v-model="settings.showAmount" active-color="#ff6700"></ay-switch>
			</view>
			<view class="settings-item">
				<view class="item-left">
					<text class="label">指纹解锁</text>
					<text class="desc">使用指纹快速进入应用</text>
				</view>
				<ay-switch v-model="settings.fingerprintLock" active-color="#ff6700"></ay-switch>
			</view>
		</view>

		<!-- 其他设置 -->
		<view class="settings-section">
			<ay-title title="其他设置" bold></ay-title>
			<view class="settings-item" @click="clearCache">
				<view class="item-left">
					<text class="label">清除缓存</text>
					<text class="desc">{{ cacheSize }}</text>
				</view>
				<tn-icon name="right"></tn-icon>
			</view>
			<!-- #ifdef APP -->
			<view class="settings-item" @click="checkUpdate">
				<view class="item-left">
					<text class="label">检查更新</text>
					<text class="desc">当前版本 {{ version }}</text>
				</view>
				<tn-icon name="right"></tn-icon>
			</view>
			<!-- #endif -->
		</view>

		<!-- 退出登录按钮 -->
		<view class="logout-btn" @click="handleLogout">
			退出登录
		</view>

		<!-- 下载进度弹窗 -->
		<view class="download-progress" v-if="showProgress">
			<view class="progress-box">
				<view class="progress-title">正在下载新版本</view>
				<view class="progress-bar">
					<view class="progress-inner" :style="{ width: `${downloadProgress}%` }">
						<text class="progress-text">{{ downloadProgress }}%</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref,
		onMounted,
		watch
	} from 'vue'

	// 导入用户API
	import {
		userApi
	} from '@/api/user'

	// 设置数据
	const settings = ref({
		dailyReminder: true,
		salaryReminder: true,
		showAmount: true,
		fingerprintLock: false
	})

	// 缓存大小
	const cacheSize = ref('0.0MB')
	// 版本号
	const version = ref('1.0.0')

	// 添加进度相关的响应式变量
	const showProgress = ref(false)
	const downloadProgress = ref(0)

	// 从缓存加载用户设置
	const loadUserSettings = () => {
		try {
			const userSettings = uni.getStorageSync('user_settings')
			if (userSettings) {
				settings.value = {
					dailyReminder: userSettings.notification?.enabled ?? true,
					showAmount: !userSettings.amount_display?.hide_amount ?? true,
					fingerprintLock: userSettings.fingerprint_unlock?.enabled ?? false
				}
			}
		} catch (error) {
			console.error('加载用户设置失败:', error)
		}
	}

	// 监听设置变化并保存
	const saveUserSettings = () => {
		try {
			const userSettings = uni.getStorageSync('user_settings') || {}

			// 更新设置
			userSettings.notification = {
				...userSettings.notification,
				enabled: settings.value.dailyReminder
			}

			userSettings.amount_display = {
				...userSettings.amount_display,
				hide_amount: !settings.value.showAmount
			}

			userSettings.fingerprint_unlock = {
				...userSettings.fingerprint_unlock,
				enabled: settings.value.fingerprintLock,
				last_updated: new Date().getTime()
			}

			// 保存到缓存
			uni.setStorageSync('user_settings', userSettings)
		} catch (error) {
			console.error('保存用户设置失败:', error)
			uni.showToast({
				title: '设置保存失败',
				icon: 'error'
			})
		}
	}

	// 监听设置开关变化
	watch(settings, () => {
		saveUserSettings()
	}, {
		deep: true
	})

	// 获取缓存大小
	const getCacheSize = async () => {
		// #ifdef APP-PLUS
		try {
			const size = await new Promise((resolve, reject) => {
				plus.cache.calculate((size) => {
					// size 单位为 byte，需要转换为合适的单位
					const formatSize = (size) => {
						if (size < 1024) return size + 'B'
						if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB'
						return (size / 1024 / 1024).toFixed(2) + 'MB'
					}
					resolve(formatSize(size))
				}, (e) => {
					reject(e)
				})
			})
			cacheSize.value = size
		} catch (error) {
			console.error('获取缓存大小失败:', error)
			cacheSize.value = '0B'
		}
		// #endif

		// #ifdef H5
		try {
			const res = uni.getStorageInfoSync()
			const size = res.currentSize // 单位为 KB
			if (size < 1024) {
				cacheSize.value = size.toFixed(2) + 'KB'
			} else {
				cacheSize.value = (size / 1024).toFixed(2) + 'MB'
			}
		} catch (error) {
			console.error('获取缓存大小失败:', error)
			cacheSize.value = '0B'
		}
		// #endif
	}

	// 清除缓存
	const clearCache = () => {
		uni.showModal({
			title: '提示',
			content: '确定要清除缓存吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						// #ifdef APP-PLUS
						await new Promise((resolve, reject) => {
							plus.cache.clear(() => {
								resolve()
							}, (e) => {
								reject(e)
							})
						})
						// #endif

						// #ifdef H5
						// 保存token
						const token = uni.getStorageSync('token')
						const user_settings = uni.getStorageSync('user_settings')
						const app_initialized = uni.getStorageSync('app_initialized')
						// 清除storage但保留token和user_settings
						uni.clearStorageSync()
						if (token) uni.setStorageSync('token', token)
						if (user_settings) uni.setStorageSync('user_settings', user_settings)
						if (app_initialized) uni.setStorageSync('app_initialized', app_initialized)

						// 清除indexedDB
						const databases = await window.indexedDB.databases()
						databases.forEach(db => {
							// 可以根据需要跳过特定的数据库
							if (db.name !== 'your-important-db') {
								window.indexedDB.deleteDatabase(db.name)
							}
						})
						// #endif

						uni.showToast({
							title: '清除成功',
							icon: 'success'
						})
						getCacheSize() // 重新获取缓存大小
					} catch (error) {
						console.error('清除缓存失败:', error)
						uni.showToast({
							title: '清除失败',
							icon: 'error'
						})
					}
				}
			}
		})
	}

	// 检查更新
	const checkUpdate = async () => {
		uni.showLoading({
			title: '检查中...'
		})

		try {
			const platform = plus.os.name.toLowerCase() // 获取当前平台 android/ios
			const currentVersion = plus.runtime.version // 获取当前版本号
			console.log('当前版本号：', currentVersion);

			const res = await userApi.getUpdate({
				version: currentVersion,
				platform: platform
			})

			uni.hideLoading()

			if (!res.success) {
				throw new Error('获取更新信息失败')
			}

			const updateInfo = res.data

			if (updateInfo.has_update) {
				uni.showModal({
					title: '发现新版本 ' + updateInfo.latest_version,
					content: `更新内容：\n${updateInfo.change_log}\n\n安装包大小：${updateInfo.package_size}MB`,
					confirmText: updateInfo.force_update ? '立即更新' : '更新',
					cancelText: '稍后再说',
					showCancel: !updateInfo.force_update,
					success: (result) => {
						if (result.confirm) {
							// 显示进度条
							showProgress.value = true
							downloadProgress.value = 0

							const dtask = plus.downloader.createDownload(updateInfo.download_url, {
								filename: '_doc/update/'
							}, (d, status) => {
								if (status == 200) {
									// 下载完成，隐藏进度条
									showProgress.value = false

									uni.showModal({
										title: '下载完成',
										content: '新版本已下载完成，是否立即安装？',
										confirmText: '立即安装',
										success: (res) => {
											if (res.confirm) {
												plus.runtime.install(d.filename, {
													force: false
												}, () => {
													if (updateInfo.force_update) {
														plus.runtime.restart()
													}
												}, (e) => {
													uni.showToast({
														title: '安装失败',
														icon: 'error'
													})
												})
											}
										}
									})
								} else {
									showProgress.value = false
									uni.showToast({
										title: '下载失败',
										icon: 'error'
									})
								}
							})

							let lastProgressValue = 0
							dtask.addEventListener('statechanged', (task, status) => {
								if (task.state === 3) {
									const progress = parseInt((task.downloadedSize / task.totalSize) * 100)
									// 更新进度条
									downloadProgress.value = progress
								}
							})

							dtask.start()
						}
					}
				})
			} else {
				uni.showToast({
					title: '已是最新版本',
					icon: 'none'
				})
			}
		} catch (error) {
			console.error('检查更新失败:', error)
			uni.hideLoading()
			uni.showToast({
				title: '检查更新失败',
				icon: 'error'
			})
		}
	}

	// 退出登录
	const handleLogout = () => {
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗？',
			success: (res) => {
				if (res.confirm) {
					uni.clearStorageSync()
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			}
		})
	}

	// 在组件挂载时获取缓存大小
	onLoad(() => {
		loadUserSettings()
		getCacheSize()
	})
</script>

<style lang="scss">
	.settings-container {
		min-height: 100vh;
		background-color: #f8f9fc;
		padding: 20rpx;
		padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);

		.settings-section {
			background-color: #fff;
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
			overflow: hidden;

			.settings-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				border-bottom: 2rpx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.item-left {
					.label {
						font-size: 28rpx;
						color: #333;
						margin-bottom: 8rpx;
						display: block;
					}

					.desc {
						font-size: 24rpx;
						color: #999;
					}
				}

				.iconfont {
					color: #999;
					font-size: 32rpx;
				}
			}
		}

		.logout-btn {
			margin: 60rpx 30rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background: #fff;
			border-radius: 44rpx;
			color: #ff4d4f;
			font-size: 32rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

			&:active {
				opacity: 0.8;
			}
		}

		.download-progress {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.6);
			z-index: 9999;
			display: flex;
			align-items: center;
			justify-content: center;

			.progress-box {
				width: 80%;
				background-color: #fff;
				border-radius: 24rpx;
				padding: 40rpx;

				.progress-title {
					font-size: 32rpx;
					color: #333;
					text-align: center;
					margin-bottom: 30rpx;
				}

				.progress-bar {
					height: 40rpx;
					background-color: #f5f5f5;
					border-radius: 20rpx;
					overflow: hidden;
					position: relative;

					.progress-inner {
						position: absolute;
						left: 0;
						top: 0;
						height: 100%;
						background: linear-gradient(90deg, #ff6700, #ff8c3f);
						border-radius: 20rpx;
						transition: width 0.3s ease;
						display: flex;
						align-items: center;
						justify-content: center;
						min-width: 60rpx; // 确保有足够空间显示文字

						.progress-text {
							color: #fff;
							font-size: 24rpx;
							font-weight: bold;
						}
					}
				}
			}
		}
	}
</style>