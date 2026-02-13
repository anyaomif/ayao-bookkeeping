<template>
	<view class="mode-select-container">
		<!-- 从"我的"页面进入时显示返回按钮 -->
		<view class="back-btn" v-if="fromPerson" @click="goBack">
			<tn-icon name="left" size="44" color="#1c1c1e"></tn-icon>
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
		height: 100vh;
		background-color: #f7f7f8;
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
		background-color: rgba(255, 255, 255, 0.8);
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
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
			color: #1c1c1e;
		}

		.subtitle {
			font-size: 36rpx;
			color: #8e8e93;
			margin-left: 16rpx;
			padding-bottom: 4rpx; // 微调基线对齐
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
		background-color: #ffffff;
		border-radius: 48rpx;
		border: 1rpx solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.04);
		overflow: hidden;
		transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
		opacity: 0;
		animation: element-fade-in 0.5s ease-out forwards;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
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
					// 蓝色图标微调
					transform: translateX(-2rpx);
				}
			}
		}

		.card-title {
			font-size: 42rpx;
			font-weight: 600;
			color: #1c1c1e;
			margin-bottom: 16rpx;
		}

		.card-description {
			font-size: 28rpx;
			color: #8e8e93;
			line-height: 1.5;
		}
	}

	.footer-text {
		position: absolute;
		bottom: 24rpx;
		font-size: 26rpx;
		color: #aeaebe;
		opacity: 0;
		animation: element-fade-in 0.5s ease-out 0.3s forwards;
	}
</style>
