<template>
	<view class="forget-container" :style="themeVars">
		<view class="form-box">
			<view class="input-item">
				<tn-icon name="phone" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input type="number" v-model="formData.phone" placeholder="请输入手机号" :placeholder-style="isDark ? 'color:#636366' : 'color:#999'" />
			</view>

			<view class="input-item">
				<tn-icon name="safe" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input type="number" v-model="formData.code" placeholder="请输入验证码" :placeholder-style="isDark ? 'color:#636366' : 'color:#999'" />
				<text class="verify-btn" :class="{ disabled: counting }"
					@tap="sendCode">{{ counting ? `${counter}s` : '获取验证码' }}</text>
			</view>

			<view class="input-item">
				<tn-icon name="lock" class="iconfont" size="48" color="#ff6700"></tn-icon>
				<input :type="showPassword ? 'text' : 'password'" v-model="formData.password" placeholder="请输入新密码"
					:placeholder-style="isDark ? 'color:#636366' : 'color:#999'" />
				<tn-icon :name="showPassword ? 'eye-close' : 'eye-hide'" class="iconfont" size="48"
					:color="isDark ? '#8e8e93' : '#999'" @tap="togglePassword"></tn-icon>
			</view>

			<button class="submit-btn" @tap="handleReset">重置密码</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		userApi
	} from '@/api/user.js'
	import { onShow } from '@dcloudio/uni-app'
	import { isDarkMode, getThemeVars, setNavBarTheme } from '@/utils/theme'

	const isDark = ref(isDarkMode())
	const themeVars = ref(getThemeVars())

	onShow(() => {
		isDark.value = isDarkMode()
		themeVars.value = getThemeVars()
		setNavBarTheme()
	})

	const formData = reactive({
		phone: '',
		code: '',
		password: ''
	})

	const showPassword = ref(false)
	const counting = ref(false)
	const counter = ref(60)

	const togglePassword = () => {
		showPassword.value = !showPassword.value
	}

	const sendCode = async () => {
		if (counting.value) return
		if (!formData.phone) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}

		try {
			await userApi.sendCode({
				phone: formData.phone
			})
			counting.value = true
			const timer = setInterval(() => {
				counter.value--
				if (counter.value <= 0) {
					clearInterval(timer)
					counting.value = false
					counter.value = 60
				}
			}, 1000)
		} catch (error) {
			console.error('发送验证码失败：', error)
			uni.showToast({
				title: '发送验证码失败\n请联系微信ayao110100',
				icon: 'none'
			})
		}
	}

	const handleReset = async () => {
		if (!formData.phone || !formData.code || !formData.password) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}

		try {
			uni.showLoading({
				title: '提交中...'
			})
			await userApi.resetPassword(formData)
			uni.showToast({
				title: '重置成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		} catch (error) {
			console.error('重置失败：', error)
		} finally {
			uni.hideLoading()
		}
	}

	const goBack = () => {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.forget-container {
		min-height: 100vh; min-height: 100dvh;
		padding: 0 60rpx;
		background-color: var(--bg-page);

		.form-box {
			.input-item {
				position: relative;
				display: flex;
				align-items: center;
				height: 100rpx;
				margin-bottom: 30rpx;
				padding: 0 30rpx;
				background-color: var(--bg-input);
				border-radius: 50rpx;

				.iconfont {
					margin-right: 20rpx;
					font-size: 40rpx;
				}

				input {
					flex: 1;
					height: 100%;
					font-size: 28rpx;
					color: var(--text-primary);
				}

				.verify-btn {
					padding: 0 20rpx;
					font-size: 26rpx;
					color: #ff6700;

					&.disabled {
						color: var(--text-tertiary);
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
	}
</style>