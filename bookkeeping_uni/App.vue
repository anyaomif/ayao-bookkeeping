<script>
	export default {
		globalData: {
			needAuth: true,
			isLockPageOpen: false
		},
		onLaunch: function() {
			console.log('App Launch')
			this.initializeApp()
			this.handleStartupRoute()
			// #ifdef APP-PLUS
			this.schedulePushIfEnabled()
			// #endif
			// 监听系统主题变化（跟随系统模式）
			uni.onThemeChange && uni.onThemeChange((res) => {
				console.log('[THEME] 系统主题变化:', res.theme)
			})
		},
		onShow: function() {
			console.log('App Show')
			// #ifdef APP-PLUS
			this.checkFingerprintAuth()
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
			// #ifdef APP-PLUS
			const settings = uni.getStorageSync('user_settings')
			const token = uni.getStorageSync('token')
			if (token && settings?.fingerprint_unlock?.enabled) {
				this.globalData.needAuth = true
			}
			// #endif
		},
		methods: {
			handleStartupRoute() {
				const token = uni.getStorageSync('token')
				if (!token) {
					uni.reLaunch({ url: '/pages/login/login' })
					return
				}
				const mode = uni.getStorageSync('app_mode')
				if (mode) {
					if (mode === 'work') {
						uni.reLaunch({ url: '/pages/index/index' })
					}
					// personal 不跳转，已在 dashboard
					return
				}
				// 本地无 mode，从服务端获取
				const http = require('@/utils/request.js').default
				http.get('/user/info').then(res => {
					if (res.success && res.data.app_mode) {
						uni.setStorageSync('app_mode', res.data.app_mode)
						if (res.data.app_mode === 'work') {
							uni.reLaunch({ url: '/pages/index/index' })
						} else {
							uni.reLaunch({ url: '/pages/personal/dashboard' })
						}
					} else {
						uni.reLaunch({ url: '/pages/mode/select' })
					}
				}).catch(() => {
					uni.reLaunch({ url: '/pages/mode/select' })
				})
			},
			schedulePushIfEnabled() {
				const s = uni.getStorageSync('user_settings')
				if (!s?.notification?.enabled) return
				const hour = s.notification.hour ?? 20
				const minute = s.notification.minute ?? 0
				plus.push.clear()
				const now = new Date()
				const target = new Date()
				target.setHours(hour, minute, 0, 0)
				if (target <= now) target.setDate(target.getDate() + 1)
				const delaySec = Math.round((target.getTime() - now.getTime()) / 1000)
				console.log('[NOTIFY] App启动调度, 延迟秒:', delaySec)
				plus.push.createMessage('该记账啦～别忘了今天的开销哦 📝', 'daily_remind', {
					title: '俺要记账',
					delay: delaySec,
					sound: 'system',
					cover: false,
				})
			},
			checkFingerprintAuth() {
				const settings = uni.getStorageSync('user_settings')
				const token = uni.getStorageSync('token')
				if (!token || !settings?.fingerprint_unlock?.enabled || !this.globalData.needAuth) {
					return
				}
				if (this.globalData.isLockPageOpen) return
				// 检查当前页面是否已经是 lock 页
				const pages = getCurrentPages()
				const currentRoute = pages.length ? pages[pages.length - 1].route : ''
				if (currentRoute === 'pages/lock/lock') return
				this.globalData.isLockPageOpen = true
				uni.navigateTo({ url: '/pages/lock/lock' })
			},
			doFingerprintAuth() {
				if (!plus.fingerprint) return
				plus.fingerprint.authenticate(() => {
					this.globalData.needAuth = false
					this.globalData.isLockPageOpen = false
				}, () => {})
			},
			initializeApp() {
				try {
					const isFirstLaunch = !uni.getStorageSync('app_initialized')
					if (isFirstLaunch) {
						const defaultUserSettings = {
							fingerprint_unlock: {
								enabled: false,
								last_updated: null
							},
							amount_display: {
								hide_amount: false,
								show_decimals: true
							},
							notification: {
								enabled: false,
							},
							theme: {
								dark_mode: false,
								color_scheme: 'default'
							}
						}
						uni.setStorageSync('user_settings', defaultUserSettings)
						uni.setStorageSync('app_initialized', true)
						uni.setStorageSync('first_launch_time', new Date().getTime())
					}
				} catch (error) {
					console.error('App initialization failed:', error)
					const basicSettings = {
						fingerprint_unlock: { enabled: false },
						amount_display: { hide_amount: false },
					}
					uni.setStorageSync('user_settings', basicSettings)
				}
			}
		}
	}
</script>

<style>
	@import '@/uni_modules/tuniaoui-vue3/index.css';

	:root {
		--bg-page: #f5f5f5;
		--bg-gradient-start: #fff4ec;
		--bg-gradient-mid1: #fff0e5;
		--bg-gradient-mid2: #ffeedd;
		--bg-gradient-mid3: #f8f0ea;
		--bg-gradient-end: #f5f5f5;
		--bg-card: rgba(255, 255, 255, 0.45);
		--bg-card-solid: #fff;
		--bg-card-border: rgba(255, 255, 255, 0.6);
		--bg-input: #f5f5f5;
		--bg-keyboard: rgba(245, 240, 235, 0.85);
		--bg-key: rgba(255, 255, 255, 0.6);
		--text-primary: #333;
		--text-secondary: #666;
		--text-tertiary: #999;
		--text-placeholder: #ccc;
		--color-brand: #ff6700;
		--color-income: #34c759;
		--color-danger: #ff3b30;
		--divider: rgba(0, 0, 0, 0.05);
		--shadow-card: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
	}

	@media (prefers-color-scheme: dark) {
		:root:not(.theme-light) {
			--bg-page: #1c1c1e;
			--bg-gradient-start: #2c2520;
			--bg-gradient-mid1: #252220;
			--bg-gradient-mid2: #222020;
			--bg-gradient-mid3: #1e1e1e;
			--bg-gradient-end: #1c1c1e;
			--bg-card: rgba(44, 44, 46, 0.65);
			--bg-card-solid: #2c2c2e;
			--bg-card-border: rgba(255, 255, 255, 0.08);
			--bg-input: #3a3a3c;
			--bg-keyboard: rgba(44, 44, 46, 0.9);
			--bg-key: rgba(58, 58, 60, 0.8);
			--text-primary: #f5f5f5;
			--text-secondary: #ababab;
			--text-tertiary: #8e8e93;
			--text-placeholder: #636366;
			--color-brand: #ff8533;
			--color-income: #30d158;
			--color-danger: #ff453a;
			--divider: rgba(255, 255, 255, 0.08);
			--shadow-card: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
		}
	}

	.theme-dark {
		--bg-page: #1c1c1e;
		--bg-gradient-start: #2c2520;
		--bg-gradient-mid1: #252220;
		--bg-gradient-mid2: #222020;
		--bg-gradient-mid3: #1e1e1e;
		--bg-gradient-end: #1c1c1e;
		--bg-card: rgba(44, 44, 46, 0.65);
		--bg-card-solid: #2c2c2e;
		--bg-card-border: rgba(255, 255, 255, 0.08);
		--bg-input: #3a3a3c;
		--bg-keyboard: rgba(44, 44, 46, 0.9);
		--bg-key: rgba(58, 58, 60, 0.8);
		--text-primary: #f5f5f5;
		--text-secondary: #ababab;
		--text-tertiary: #8e8e93;
		--text-placeholder: #636366;
		--color-brand: #ff8533;
		--color-income: #30d158;
		--color-danger: #ff453a;
		--divider: rgba(255, 255, 255, 0.08);
		--shadow-card: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
	}

	page {
		background-color: var(--bg-page);
	}

	::v-deep .uni-tabbar {
	    display: none;
	}
	
	::v-deep .uni-app--showtabbar uni-page-wrapper::after {
	    display: none;
	}
</style>