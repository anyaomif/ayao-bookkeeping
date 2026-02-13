<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.initializeApp()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			initializeApp() {
				try {
					// 检查是否是首次启动
					const isFirstLaunch = !uni.getStorageSync('app_initialized')

					if (isFirstLaunch) {
						// 初始化用户设置
						const defaultUserSettings = {
							fingerprint_unlock: {
								enabled: false, // 指纹解锁开关
								last_updated: null // 最后更新时间
							},
							amount_display: {
								hide_amount: false, // 是否隐藏金额
								show_decimals: true // 是否显示小数点
							},
							notification: {
								enabled: false, // 通知开关
							},
							theme: {
								dark_mode: false, // 深色模式
								color_scheme: 'default' // 配色方案
							}
						}

						// 存储用户设置
						uni.setStorageSync('user_settings', defaultUserSettings)

						// 标记应用已初始化
						uni.setStorageSync('app_initialized', true)

						// 记录首次启动时间
						uni.setStorageSync('first_launch_time', new Date().getTime())

						console.log('App initialized with default settings')
					} else {
						// 非首次启动，可以进行其他初始化操作
					}
				} catch (error) {
					console.error('App initialization failed:', error)

					// 初始化失败时，确保有基本设置可用
					const basicSettings = {
						fingerprint_unlock: {
							enabled: false
						},
						amount_display: {
							hide_amount: false
						},
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