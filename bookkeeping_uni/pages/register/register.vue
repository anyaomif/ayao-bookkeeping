<template>
	<view class="register-container">
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

			<view class="input-item">
				<tn-icon name="phone" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input type="number" v-model="formData.phone" placeholder="请输入手机号" placeholder-class="placeholder" maxlength="11" />
			</view>

			<view class="input-item">
				<tn-icon name="identity" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input type="text" v-model="formData.nickname" placeholder="请输入昵称" placeholder-class="placeholder" />
			</view>

			<view class="input-item">
				<tn-icon name="safe" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input type="text" v-model="formData.captcha" placeholder="请输入验证码" placeholder-class="placeholder"
					maxlength="4" />
				<view class="captcha-box" @tap="refreshCaptcha">
					<view class="captcha-wrap">
						<text v-for="(num, index) in captchaCode" :key="index" class="captcha-digit" :style="getRandomStyle()">
							{{ num }}
						</text>
						<!-- 添加干扰线 -->
						<view class="interference-line" v-for="n in 3" :key="n" :style="getRandomLine()">
						</view>
						<!-- 添加干扰点 -->
						<view class="interference-dot" v-for="n in 12" :key="n + 'dot'" :style="getRandomDot()">
						</view>
					</view>
				</view>
			</view>

			<button class="submit-btn" @tap="handleRegister">注 册</button>
		</view>

		<!-- 添加底部登录提示 -->
		<view class="login-tip">
			已有账号？<text class="login-link" @tap="goToLogin">立即登录</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import {
		userApi
	} from '@/api/user.js'

	const formData = reactive({
		username: '',
		password: '',
		phone: '',
		nickname: '',
		captcha: ''
	})

	const showPassword = ref(false)

	const captchaCode = ref('')

	const generateCaptcha = () => {
		let code = ''
		for (let i = 0; i < 4; i++) {
			code += Math.floor(Math.random() * 10)
		}
		captchaCode.value = code
	}

	const refreshCaptcha = () => {
		generateCaptcha()
		formData.captcha = ''
	}

	const togglePassword = () => {
		showPassword.value = !showPassword.value
	}

	const isSubmitting = ref(false)

	const handleRegister = async () => {
		if (isSubmitting.value) return

		if (!formData.username || !formData.password || !formData.phone || !formData.nickname || !formData.captcha) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}

		if (formData.captcha !== captchaCode.value) {
			uni.showToast({
				title: '验证码错误',
				icon: 'none'
			})
			refreshCaptcha()
			return
		}

		if (formData.password.length < 6) {
			uni.showToast({
				title: '密码至少6位',
				icon: 'none'
			})
			return
		}

		if (!/^1\d{10}$/.test(formData.phone)) {
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			})
			return
		}

		isSubmitting.value = true

		try {
			uni.showLoading({
				title: '注册中...'
			})
			await userApi.register(formData)
			uni.showToast({
				title: '注册成功',
				icon: 'success'
			})
			setTimeout(() => {
				goBack()
			}, 1500)
		} catch (error) {
			console.error('注册失败：', error)
			refreshCaptcha()
		} finally {
			uni.hideLoading()
			setTimeout(() => {
				isSubmitting.value = false
			}, 2000)
		}
	}

	const goBack = () => {
		uni.navigateBack()
	}

	// 跳转到登录页
	const goToLogin = () => {
		uni.redirectTo({
			url: '/pages/login/login'
		})
	}

	// 生成随机样式
	const getRandomStyle = () => {
		const rotate = Math.random() * 30 - 15 // -15度到15度随机旋转
		const fontSize = Math.random() * 8 + 28 // 28rpx到36rpx随机字体大小
		const translateY = Math.random() * 10 - 5 // -5rpx到5rpx随机上下偏移

		return {
			transform: `rotate(${rotate}deg) translateY(${translateY}rpx)`,
			fontSize: `${fontSize}rpx`,
			fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
			fontFamily: Math.random() > 0.5 ? 'Arial' : 'Verdana',
			opacity: Math.random() * 0.3 + 0.7 // 0.7到1的随机透明度
		}
	}

	// 生成随机干扰线样式
	const getRandomLine = () => {
		const startX = Math.random() * 100
		const startY = Math.random() * 60
		const endX = Math.random() * 100
		const endY = Math.random() * 60

		return {
			left: startX + '%',
			top: startY + '%',
			width: Math.random() * 40 + 20 + 'rpx',
			transform: `rotate(${Math.random() * 360}deg)`,
			opacity: Math.random() * 0.3 + 0.1
		}
	}

	// 生成随机干扰点样式
	const getRandomDot = () => {
		return {
			left: Math.random() * 100 + '%',
			top: Math.random() * 100 + '%',
			opacity: Math.random() * 0.5 + 0.1
		}
	}

	onMounted(() => {
		generateCaptcha()
	})
</script>

<style lang="scss" scoped>
	.register-container {
		min-height: 100vh;
		padding: 0 60rpx;
		background-color: #fff;

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

				.captcha-box {
					min-width: 120rpx;
					height: 60rpx;
					margin-left: 20rpx;
					background: linear-gradient(135deg, #ff6700, #ff8c3f);
					border-radius: 30rpx;
					padding: 0 20rpx;
					position: relative;
					overflow: hidden;

					&:active {
						opacity: 0.8;
					}

					.captcha-wrap {
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;

						.captcha-digit {
							color: #fff;
							margin: 0 2rpx;
							text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.2);
							position: relative;
							z-index: 2;
						}

						.interference-line {
							position: absolute;
							height: 2rpx;
							background-color: rgba(255, 255, 255, 0.6);
							z-index: 1;
						}

						.interference-dot {
							position: absolute;
							width: 4rpx;
							height: 4rpx;
							background-color: rgba(255, 255, 255, 0.8);
							border-radius: 50%;
							z-index: 1;
						}
					}

					// 添加网格背景
					&::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-image:
							linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
							linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
							linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%),
							linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%);
						background-size: 8rpx 8rpx;
						background-position: 0 0, 0 4rpx, 4rpx -4rpx, -4rpx 0px;
						opacity: 0.3;
					}
				}
			}

			.submit-btn {
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
		}

		.login-tip {
			margin-top: 40rpx;
			text-align: center;
			font-size: 26rpx;
			color: #666;

			.login-link {
				color: #ff6700;

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>