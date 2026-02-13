<template>
	<view class="login-container">
		<!-- Logo区域 -->
		<view class="logo-box">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="title">俺要记账</text>
		</view>

		<!-- 表单区域 -->
		<view class="form-box">
			<view class="input-item">
				<tn-icon name="my" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input type="text" v-model="formData.username" placeholder="请输入用户名" placeholder-class="placeholder" />
			</view>

			<view class="input-item">
				<tn-icon name="lock" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input :type="showPassword ? 'text' : 'password'" v-model="formData.password" placeholder="请输入密码"
					placeholder-class="placeholder" />
				<tn-icon :name="showPassword ? 'eye-close' : 'eye-hide'" class="iconfont" size="48"
					@tap="togglePassword"></tn-icon>
			</view>

			<button class="login-btn" @tap="handleLogin">登 录</button>

			<view class="options">
				<text @tap="goToRegister">注册账号</text>
				<text @tap="goToForget">忘记密码？</text>
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
		reactive
	} from 'vue'
	import {
		userApi
	} from '@/api/user.js'
	
	onLoad(() => {
		const settings = uni.getStorageSync('user_settings')
		const token = uni.getStorageSync('token')
		if (token && settings?.fingerprint_unlock?.enabled) {
			uni.checkIsSupportSoterAuthentication({
				success(res) {
					if (res.supportMode.includes('fingerPrint')) {
						uni.startSoterAuthentication({
							requestAuthModes: ['fingerPrint'],
							challenge: new Date().getTime().toString(),
							authContent: '请用指纹解锁',
							success() {
								uni.switchTab({ url: '/pages/index/index' })
							},
							fail() {}
						})
					}
				}
			})
		}
	})

	// 表单数据
	const formData = reactive({
		username: '',
		password: ''
	})

	// 是否显示密码
	const showPassword = ref(false)

	// 切换密码显示
	const togglePassword = () => {
		showPassword.value = !showPassword.value
	}

	// 处理登录
	const handleLogin = async () => {
		// 表单验证
		if (!formData.username || !formData.password) {
			uni.showToast({
				title: '请输入用户名和密码',
				icon: 'none'
			})
			return
		}

		try {
			// 显示加载
			uni.showLoading({
				title: '登录中...'
			})

			// 调用登录接口
			const res = await userApi.login(formData)

			// 存储token
			uni.setStorageSync('token', res.data.token)

			// 跳转到首页
			uni.switchTab({
				url: '/pages/index/index'
			})

			uni.showToast({
				title: '登录成功',
				icon: 'success'
			})
		} catch (error) {
			console.error('登录失败：', error)
		} finally {
			uni.hideLoading()
		}
	}

	// 跳转注册页
	const goToRegister = () => {
		uni.navigateTo({
			url: '/pages/register/register'
		})
	}

	// 跳转忘记密码页
	const goToForget = () => {
		uni.navigateTo({
			url: '/pages/forget/forget'
		})
	}
</script>

<style lang="scss" scoped>
	.login-container {
		min-height: 100vh;
		padding: 60rpx;
		background-color: #fff;

		.logo-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 100rpx;
			margin-bottom: 80rpx;

			.logo {
				width: 160rpx;
				height: 160rpx;
				border-radius: 40rpx;
				margin-bottom: 20rpx;
				box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.2);
			}

			.title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
		}

		.form-box {
			.input-item {
				position: relative;
				display: flex;
				align-items: center;
				height: 100rpx;
				margin-bottom: 30rpx;
				padding: 0 30rpx;
				background-color: #f8f8f8;
				border-radius: 50rpx;

				.iconfont {
					margin-right: 20rpx;
					font-size: 40rpx;
					color: #999;
				}

				input {
					flex: 1;
					height: 100%;
					font-size: 28rpx;
				}

				.placeholder {
					color: #999;
				}
			}

			.login-btn {
				width: 100%;
				height: 90rpx;
				margin-top: 60rpx;
				background-color: #ff6700;
				border-radius: 45rpx;
				color: #fff;
				font-size: 32rpx;
				font-weight: bold;

				&:active {
					opacity: 0.8;
				}
			}

			.options {
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
				padding: 0 20rpx;

				text {
					font-size: 26rpx;
					color: #666;

					&:active {
						color: #ff6700;
					}
				}
			}
		}
	}
</style>