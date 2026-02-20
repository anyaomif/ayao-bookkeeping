<template>
	<view class="about-container" :style="themeVars">
		<!-- 应用信息 -->
		<view class="app-info">
			<image class="app-logo" src="/static/logo.png" mode="aspectFill"></image>
			<text class="app-name">俺要记账</text>
			<text class="app-version">v1.1.0</text>
		</view>

		<!-- 产品介绍 -->
		<view class="product-intro">
			<text class="intro-text">俺要(安尧)记账是一款智能记账工具，支持语音/文字AI智能记账、多账户管理、分类统计等功能，帮助你轻松掌控个人财务。</text>
		</view>

		<!-- 功能介绍 -->
		<view class="feature-section">
			<ay-title title="主要功能" bold :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
			<view class="feature-list">
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="ai-fill" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">AI 智能记账</text>
					<text class="feature-desc">语音/文字一句话快速记账</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="refund" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">收支统计</text>
					<text class="feature-desc">清晰掌握收支情况</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="bankcard" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">多账户管理</text>
					<text class="feature-desc">银行卡、现金、支付宝等</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="menu-classify" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">分类管理</text>
					<text class="feature-desc">自定义收支分类</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="lock" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">隐私保护</text>
					<text class="feature-desc">指纹解锁、金额隐藏</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="calendar" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">明细查询</text>
					<text class="feature-desc">按月查看收支明细</text>
				</view>
			</view>
		</view>

		<!-- 联系我们 -->
		<view class="contact-section">
			<ay-title title="联系我们" bold :color="isDark ? '#f5f5f5' : '#333'"></ay-title>
			<view class="contact-list">
				<view class="contact-item" @click="copyEmail">
					<text class="label">邮箱</text>
					<text class="value">206788568@qq.com</text>
				</view>
				<view class="contact-item" @click="copyWechat">
					<text class="label">微信</text>
					<text class="value">ayao110100</text>
				</view>
			</view>
		</view>

		<!-- 版权信息 -->
		<view class="copyright">
			<text>Copyright © 2025-2026 smallAnYao</text>
			<text>All Rights Reserved</text>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { isDarkMode, getThemeVars, setNavBarTheme } from '@/utils/theme'

	const isDark = ref(false)
	const themeVars = ref({})

	onShow(() => {
		isDark.value = isDarkMode()
		themeVars.value = getThemeVars()
		setNavBarTheme()
	})

	const copyEmail = () => {
		uni.setClipboardData({
			data: '206788568@qq.com'
		})
	}

	const copyWechat = () => {
		uni.setClipboardData({
			data: 'ayao110100'
		})
	}
</script>

<style lang="scss">
	.about-container {
		min-height: 100vh; min-height: 100dvh;
		background-color: var(--bg-page);
		padding: 20rpx;
		padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);

		.app-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 60rpx 0;
			background-color: var(--bg-card-solid);
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: var(--shadow-card);

			.app-logo {
				width: 160rpx;
				height: 160rpx;
				border-radius: 40rpx;
				margin-bottom: 20rpx;
				box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.2);
			}

			.app-name {
				font-size: 36rpx;
				font-weight: bold;
				color: var(--text-primary);
				margin-bottom: 10rpx;
			}

			.app-version {
				font-size: 24rpx;
				color: var(--text-tertiary);
			}
		}

		.product-intro {
			padding: 20rpx;
			background-color: var(--bg-card-solid);
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: var(--shadow-card);
			display: flex;
			justify-content: center;

			.intro-text {
				font-size: 28rpx;
				color: var(--text-secondary);
				text-indent: 2em;
			}
		}

		.feature-section {
			background-color: var(--bg-card-solid);
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: var(--shadow-card);
			overflow: hidden;

			.feature-list {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 20rpx;
				padding: 0 30rpx 30rpx;

				.feature-item {
					background-color: var(--bg-input);
					border-radius: 16rpx;
					padding: 30rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					transition: all 0.3s;

					&:active {
						transform: scale(0.98);
						opacity: 0.9;
					}

					.icon-box {
						width: 96rpx;
						height: 96rpx;
						background: rgba(255, 103, 0, 0.1);
						border-radius: 48rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 20rpx;
					}

					.feature-name {
						font-size: 28rpx;
						font-weight: bold;
						color: var(--text-primary);
						margin-bottom: 8rpx;
					}

					.feature-desc {
						font-size: 24rpx;
						color: var(--text-tertiary);
						text-align: center;
					}
				}
			}
		}

		.contact-section {
			background-color: var(--bg-card-solid);
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: var(--shadow-card);
			overflow: hidden;

			.contact-list {
				padding: 0 30rpx;

				.contact-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx 0;
					border-bottom: 2rpx solid var(--divider);

					&:last-child {
						border-bottom: none;
					}

					.label {
						font-size: 28rpx;
						color: var(--text-primary);
					}

					.value {
						font-size: 28rpx;
						color: var(--text-secondary);
					}

					&:active {
						opacity: 0.7;
					}
				}
			}
		}

		.copyright {
			text-align: center;
			padding: 40rpx 0;

			text {
				display: block;
				font-size: 24rpx;
				color: var(--text-tertiary);
				line-height: 1.8;
			}
		}
	}
</style>