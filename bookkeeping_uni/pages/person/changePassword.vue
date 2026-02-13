<template>
	<view class="change-password-container">
		<view class="content">
			<view class="form-section">
				<view class="form-item">
					<text class="label">当前密码</text>
					<input type="password" v-model="formData.oldPassword" placeholder="请输入当前密码" password />
				</view>

				<view class="form-item">
					<text class="label">新密码</text>
					<input type="password" v-model="formData.newPassword" placeholder="请输入新密码" password />
				</view>

				<view class="form-item">
					<text class="label">确认密码</text>
					<input type="password" v-model="formData.confirmPassword" placeholder="请再次输入新密码" password />
				</view>
			</view>

			<view class="tips">
				<text class="tip-item">* 密码长度为8-20位</text>
				<text class="tip-item">* 必须包含字母和数字</text>
			</view>
		</view>

		<!-- 保存按钮 -->
		<view class="bottom-btn-area">
			<view class="submit-btn" @click="handleSubmit">
				确认修改
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		userApi
	} from '@/api/user.js'

	const formData = ref({
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	})

	// 验证密码格式
	const validatePassword = (password) => {
		const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
		return reg.test(password)
	}

	// 提交修改
	const handleSubmit = async () => {
		const {
			oldPassword,
			newPassword,
			confirmPassword
		} = formData.value

		if (!oldPassword || !newPassword || !confirmPassword) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}

		if (!validatePassword(newPassword)) {
			uni.showToast({
				title: '新密码格式不正确',
				icon: 'none'
			})
			return
		}

		if (newPassword !== confirmPassword) {
			uni.showToast({
				title: '两次输入的密码不一致',
				icon: 'none'
			})
			return
		}

		try {
			const res = await userApi.updatePassword({
				oldPassword,
				newPassword
			})
			console.log(res);
			if (res.success) {
				uni.showToast({
					title: '修改成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.clearStorageSync()
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 1500)
			}
		} catch (error) {
			uni.showToast({
				title: error.message || '修改失败',
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss">
	.change-password-container {
		min-height: 100vh;
		background-color: #f8f9fc;
		position: relative;

		.nav-bar {
			height: 88rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			position: relative;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

			.left {
				position: absolute;
				left: 30rpx;
				height: 88rpx;
				display: flex;
				align-items: center;

				.iconfont {
					font-size: 36rpx;
					color: #333;
				}
			}

			.title {
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
			}
		}

		.content {
			padding: 30rpx;

			.form-section {
				background-color: #fff;
				border-radius: 24rpx;
				padding: 0 30rpx;
				margin-bottom: 30rpx;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);

				.form-item {
					display: flex;
					align-items: center;
					padding: 30rpx 0;
					border-bottom: 2rpx solid #f8f9fc;

					&:last-child {
						border-bottom: none;
					}

					.label {
						width: 140rpx;
						font-size: 30rpx;
						color: #333;
						font-weight: 500;
					}

					input {
						flex: 1;
						font-size: 30rpx;
						color: #333;
					}
				}
			}

			.tips {
				padding: 20rpx 30rpx;

				.tip-item {
					display: block;
					font-size: 24rpx;
					color: #999;
					line-height: 1.8;
				}
			}
		}

		.bottom-btn-area {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 30rpx;
			background-color: #fff;
			box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.03);

			.submit-btn {
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: linear-gradient(to right, #ff6700, #ff8c3f);
				color: #fff;
				border-radius: 44rpx;
				font-size: 32rpx;
				font-weight: 500;
				box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.3);
			}
		}
	}
</style>