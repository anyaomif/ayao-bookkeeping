<template>
	<view class="mode-select-container">
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
			<text>随时可以在 "我的" -> "设置" 中切换模式</text>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted
	} from 'vue';

	const selectMode = (mode) => {
		// 模拟震动反馈，提升交互体验
		uni.vibrateShort();

		// 此处为静态演示，后续将替换为真实逻辑
		uni.showToast({
			title: `已选择: ${mode === 'work' ? '工地记工' : '个人记账'}`,
			icon: 'none'
		});

		// 假设 personal/dashboard 页面已创建
		const url = mode === 'work' ? '/pages/index/index' : '/pages/personal/dashboard';

		// 使用 reLaunch 跳转到对应的主页
		setTimeout(() => {
			uni.reLaunch({
				url: url
			});
		}, 800); // 延迟跳转，让用户能看到点击效果
	};

	onMounted(() => {
		// 可以在这里触发页面的入场动画
	});
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
