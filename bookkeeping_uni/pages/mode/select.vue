<template>
	<view class="mode-select-container" :style="themeVars">
		<!-- 从"我的"页面进入时显示返回按钮 -->
		<view class="back-btn" v-if="fromPerson" @click="goBack">
			<tn-icon name="left" size="44" :color="isDark ? '#f5f5f5' : '#1c1c1e'"></tn-icon>
		</view>

		<view class="title-section">
			<text class="main-title">欢迎使用</text>
			<text class="subtitle">请选择您的记账方式</text>
		</view>

		<view class="card-container">
			<!-- 工地记工模式卡片 -->
			<view class="mode-card work-card" @click="selectMode('work')">
				<view class="card-content">
					<view class="icon-wrapper">
						<tn-icon name="trusty" size="80" color="#ff6700"></tn-icon>
					</view>
					<text class="card-title">工地记工</text>
					<text class="card-description">适用于点工、包工和工程收入</text>
				</view>
			</view>

			<!-- 个人记账模式卡片 -->
			<view class="mode-card personal-card" @click="selectMode('personal')">
				<view class="card-content">
					<view class="icon-wrapper">
						<tn-icon name="trusty-fill" size="80" color="#007AFF"></tn-icon>
					</view>
					<text class="card-title">个人记账</text>
					<text class="card-description">记录日常开销，管理个人财务</text>
				</view>
			</view>
		</view>

		<view class="footer-text">
			<text>随时可以在 "我的" -> "模式切换" 中切换</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { personalCategoryApi } from '@/api/personal_category';
	import { personalAccountApi } from '@/api/personal_account';
	import { userApi } from '@/api/user';
	import { isDarkMode, getThemeVars, setPageBgColor } from '@/utils/theme';

	const isDark = ref(isDarkMode());
	const themeVars = ref(getThemeVars());
	setPageBgColor();
	const fromPerson = ref(false);

	onLoad((options) => {
		if (options.from === 'person') fromPerson.value = true;
	});

	const goBack = () => {
		uni.navigateBack();
	};

	const selectMode = (mode) => {
		uni.vibrateShort();
		uni.setStorageSync('app_mode', mode);
		// 同步到服务端
		userApi.updateMode(mode).catch(() => {});

		uni.showToast({
			title: `已选择: ${mode === 'work' ? '工地记工' : '个人记账'}`,
			icon: 'none'
		});

		const url = mode === 'work' ? '/pages/index/index' : '/pages/personal/dashboard';

		// 个人记账模式首次进入时初始化默认分类
		if (mode === 'personal') {
			Promise.all([
				personalCategoryApi.init(),
				personalAccountApi.init(),
			]).catch(() => {});
		}

		setTimeout(() => {
			uni.reLaunch({
				url: url
			});
		}, 800);
	};
</script>

<style lang="scss" scoped>
	@keyframes element-fade-in {
		from {
			opacity: 0;
			transform: translateY(20rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.mode-select-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh; height: 100dvh;
		background-color: var(--bg-page);
		padding: 40rpx;
		box-sizing: border-box;
		position: relative;
	}

	.back-btn {
		position: absolute;
		top: calc(40rpx + var(--status-bar-height, 0px));
		left: 30rpx;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: var(--bg-card);
		box-shadow: var(--shadow-card);
	}

	.title-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 60rpx;
		animation: element-fade-in 0.5s ease-out forwards;

		.main-title {
			font-size: 56rpx;
			font-weight: 600;
			color: var(--text-primary);
		}

		.subtitle {
			font-size: 36rpx;
			color: var(--text-tertiary);
			margin-left: 16rpx;
			padding-bottom: 4rpx;
		}
	}

	.card-container {
		display: flex;
		flex-direction: column;
		gap: 50rpx;
		width: 100%;
		max-width: 680rpx;
	}

	.mode-card {
		width: 100%;
		background-color: var(--bg-card-solid);
		border-radius: 48rpx;
		border: 1rpx solid var(--bg-card-border);
		box-shadow: var(--shadow-card);
		overflow: hidden;
		transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
		opacity: 0;
		animation: element-fade-in 0.5s ease-out forwards;

		&:active {
			transform: scale(0.98);
		}

		.card-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 70rpx 40rpx;
			text-align: center;
		}

		.icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 140rpx;
			height: 140rpx;
			margin-bottom: 40rpx;
			border-radius: 50%;
		}

		&.work-card {
			animation-delay: 0.1s;
			.icon-wrapper {
				background: linear-gradient(135deg, #fff2e8, #ffe8d8);
			}
		}

		&.personal-card {
			animation-delay: 0.2s;
			.icon-wrapper {
				background: linear-gradient(135deg, #e6f7ff, #d6eeff);
				.tn-icon {
					transform: translateX(-2rpx);
				}
			}
		}

		.card-title {
			font-size: 42rpx;
			font-weight: 600;
			color: var(--text-primary);
			margin-bottom: 16rpx;
		}

		.card-description {
			font-size: 28rpx;
			color: var(--text-tertiary);
			line-height: 1.5;
		}
	}

	.footer-text {
		position: absolute;
		bottom: 24rpx;
		font-size: 26rpx;
		color: var(--text-placeholder);
		opacity: 0;
		animation: element-fade-in 0.5s ease-out 0.3s forwards;
	}
</style>
