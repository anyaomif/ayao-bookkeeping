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

	::v-deep .uni-tabbar {
	    display: none;
	}
	
	::v-deep .uni-app--showtabbar uni-page-wrapper::after {
	    display: none;
	}
</style>