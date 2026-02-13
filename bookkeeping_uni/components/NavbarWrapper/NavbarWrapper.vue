<template>
	<view class="navbar-wrapper" :class="[
		`navbar-wrapper--${mode}`,
		{
			'navbar-wrapper--shadow': shadow,
			'navbar-wrapper--frosted': frosted
		}
	]" :style="wrapperStyle">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'NavbarWrapper',
		props: {
			// 导航栏模式
			mode: {
				type: String,
				default: 'default',
				validator: (value) => ['default', 'transparent', 'custom'].includes(value)
			},
			// 背景颜色
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			// 是否显示阴影
			shadow: {
				type: Boolean,
				default: false
			},
			// 是否启用毛玻璃效果
			frosted: {
				type: Boolean,
				default: false
			},
			// 自定义导航栏高度(不包括状态栏)
			height: {
				type: [String, Number],
				default: '44px'
			},
			// 是否需要右侧胶囊按钮的安全距离
			needCapsule: {
				type: Boolean,
				default: true
			},
			// z-index 层级
			zIndex: {
				type: Number,
				default: 100
			},
			// 是否固定在顶部
			sticky: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				menuButtonInfo: null,
				rightSafeArea: 0
			}
		},
		computed: {
			// 包装器样式
			wrapperStyle() {
				const style = {
					paddingTop: this.statusBarHeight + 'px',
					backgroundColor: this.mode === 'transparent' ? 'transparent' : this.bgColor,
					zIndex: this.zIndex
				}

				// 设置右侧安全距离
				if (this.needCapsule) {
					style.paddingRight = this.rightSafeArea + 'px'
				}

				// 设置导航栏高度
				if (this.height) {
					style.height = `calc(${this.height} + ${this.statusBarHeight}px)`
				}
				
				// 设置固定在顶部
				if (this.sticky) {
					style.position = 'sticky'
					style.top = 0
				}

				return style
			}
		},
		created() {
			this.initNavBarInfo()
		},
		methods: {
			// 初始化导航栏信息
			initNavBarInfo() {
				try {
					// #ifdef MP-WEIXIN
					// 获取系统信息
					const systemInfo = wx.getWindowInfo() // 获取窗口信息
					
					// 获取状态栏高度
					this.statusBarHeight = systemInfo.statusBarHeight
					
					// 获取胶囊按钮信息
					const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
					this.menuButtonInfo = menuButtonInfo
					this.rightSafeArea = systemInfo.windowWidth - menuButtonInfo.left
					// #endif

					// #ifdef APP-PLUS
					// APP端的处理
					const systemInfo = uni.getSystemInfoSync()
					this.statusBarHeight = systemInfo.statusBarHeight
					this.rightSafeArea = 0
					// #endif

					// #ifdef H5
					// H5端的处理
					this.statusBarHeight = 0
					this.rightSafeArea = 0
					// #endif

					// 发送导航栏信息事件
					this.$emit('init', {
						statusBarHeight: this.statusBarHeight,
						menuButtonInfo: this.menuButtonInfo,
						rightSafeArea: this.rightSafeArea
					})
				} catch (error) {
					console.error('获取导航栏信息失败:', error)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar-wrapper {
		position: relative;
		width: 100%;
		box-sizing: border-box;
		transition: all 0.3s;
		overflow: hidden;

		// 默认模式
		&--default {
			background-color: #ffffff;
		}

		// 透明模式
		&--transparent {
			background-color: transparent;
		}

		// 阴影效果
		&--shadow {
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		}

		// 毛玻璃效果
		&--frosted {
			background-color: rgba(255, 255, 255, 0.8) !important;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}
	}
</style>
