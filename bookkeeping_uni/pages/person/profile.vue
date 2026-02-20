<template>
	<view class="profile-container" :style="themeVars">
		<view class="content">
			<!-- 头像部分 -->
			<view class="avatar-section" @click="chooseAvatar">
				<view class="left">
					<text class="label">头像</text>
				</view>
				<view class="right">
					<image class="avatar" :src="baseUrl + userInfo.avatar || '/static/tx.jpg'" mode="aspectFill"></image>
					<tn-icon name="right" size="32" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
				</view>
			</view>

			<!-- 信息表单 -->
			<view class="info-section">
				<view class="info-item">
					<text class="label">昵称</text>
					<input type="text" v-model="userInfo.nickname" placeholder="请输入昵称" maxlength="12" :placeholder-style="isDark ? 'color:#636366' : 'color:#ccc'" />
				</view>

				<view class="info-item">
					<text class="label">账号</text>
					<text class="value">{{userInfo.username || '-'}}</text>
				</view>
			</view>

			<!-- 修改密码按钮 -->
			<view class="password-section" @click="goToChangePassword">
				<text class="label">修改密码</text>
				<tn-icon name="right" size="32" :color="isDark ? '#636366' : '#ccc'"></tn-icon>
			</view>
		</view>

		<!-- 保存按钮 -->
		<view class="bottom-btn-area">
			<view class="submit-btn" @click="handleSubmit">
				保存
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import {
		userApi
	} from '@/api/user.js'
	import {
		uploadApi
	} from '@/api/upload.js'
	import {
		baseUrl
	} from '@/utils/ayao.js'
	import { isDarkMode, getThemeMode, getThemeVars, setNavBarTheme } from '@/utils/theme'

	const isDark = ref(false)
	const themeVars = ref({})
	const refreshTheme = () => {
		const mode = getThemeMode()
		isDark.value = mode === 'dark' || (mode === 'system' && isDarkMode())
		themeVars.value = getThemeVars()
		setNavBarTheme()
	}

	const userInfo = ref({
		avatar: '',
		nickname: '',
		username: ''
	})

	// 获取用户信息
	const getUserInfo = async () => {
		try {
			const res = await userApi.getUserInfo()
			if (res.success) {
				userInfo.value = res.data
			}
		} catch (error) {
			uni.showToast({
				title: '获取用户信息失败',
				icon: 'none'
			})
		}
	}

	// 选择头像
	const chooseAvatar = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				try {
					uni.showLoading({
						title: '上传中...',
						mask: true
					})

					const uploadRes = await uploadApi.uploadImage(res.tempFilePaths[0])
					userInfo.value.avatar = uploadRes.url

					// 更新用户信息
					await handleSubmit()

				} catch (error) {
					console.error('上传失败:', error)
				} finally {
					uni.hideLoading()
				}
			}
		})
	}

	// 提交修改
	const handleSubmit = async () => {
		if (!userInfo.value.nickname.trim()) {
			uni.showToast({
				title: '昵称不能为空',
				icon: 'none'
			})
			return
		}

		try {
			const res = await userApi.updateUserInfo({
				nickname: userInfo.value.nickname,
				avatar: userInfo.value.avatar
			})
			if (res.success) {
				uni.showToast({
					title: '修改成功',
					icon: 'success'
				})
				setTimeout(() => {
					goBack()
				}, 1500)
			}
		} catch (error) {
			uni.showToast({
				title: '修改失败',
				icon: 'none'
			})
		}
	}

	// 跳转到修改密码页面
	const goToChangePassword = () => {
		uni.navigateTo({
			url: '/pages/person/changePassword'
		})
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	onMounted(() => {
		getUserInfo()
		refreshTheme()
	})

	onShow(() => {
		refreshTheme()
	})
</script>

<style lang="scss">
	.profile-container {
		min-height: 100vh; min-height: 100dvh;
		background-color: var(--bg-page);
		position: relative;

		.nav-bar {
			height: 88rpx;
			background-color: var(--bg-card-solid);
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			position: relative;
			box-shadow: var(--shadow-card);

			.left {
				position: absolute;
				left: 30rpx;
				height: 88rpx;
				display: flex;
				align-items: center;

				.iconfont {
					font-size: 36rpx;
					color: var(--text-primary);
				}
			}

			.title {
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: var(--text-primary);
			}
		}

		.content {
			padding: 30rpx;

			.avatar-section {
				background-color: var(--bg-card-solid);
				border-radius: 24rpx;
				padding: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30rpx;
				box-shadow: var(--shadow-card);

				.left {
					.label {
						font-size: 30rpx;
						color: var(--text-primary);
						font-weight: 500;
					}
				}

				.right {
					display: flex;
					align-items: center;

					.avatar {
						width: 120rpx;
						height: 120rpx;
						border-radius: 60rpx;
						margin-right: 20rpx;
						border: 4rpx solid var(--divider);
					}

					.iconfont {
						color: var(--text-tertiary);
						font-size: 32rpx;
					}
				}
			}

			.info-section {
				background-color: var(--bg-card-solid);
				border-radius: 24rpx;
				padding: 0 30rpx;
				margin-bottom: 30rpx;
				box-shadow: var(--shadow-card);

				.info-item {
					display: flex;
					align-items: center;
					padding: 30rpx 0;
					border-bottom: 2rpx solid var(--divider);

					&:last-child {
						border-bottom: none;
					}

					.label {
						width: 140rpx;
						font-size: 30rpx;
						color: var(--text-primary);
						font-weight: 500;
					}

					input {
						flex: 1;
						font-size: 30rpx;
						color: var(--text-primary);
					}

					.value {
						flex: 1;
						font-size: 30rpx;
						color: var(--text-secondary);
					}
				}
			}

			.password-section {
				background-color: var(--bg-card-solid);
				border-radius: 24rpx;
				padding: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: var(--shadow-card);

				.label {
					font-size: 30rpx;
					color: var(--text-primary);
					font-weight: 500;
				}

				.iconfont {
					color: var(--text-tertiary);
					font-size: 32rpx;
				}
			}
		}

		.bottom-btn-area {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 30rpx;
			background-color: var(--bg-card-solid);
			box-shadow: var(--shadow-card);

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