<template>
	<view class="about-container">
		<!-- 应用信息 -->
		<view class="app-info">
			<image class="app-logo" src="/static/logo.png" mode="aspectFill"></image>
			<text class="app-name">俺要记账</text>
			<text class="app-version">v1.0.0</text>
		</view>

		<!-- 产品介绍 -->
		<view class="product-intro">
			<text class="intro-text">俺要(安尧)记账是一款简单易用的记账工具，旨在帮助用户轻松记录日常收入和支出，提供清晰的财务统计，助力用户更好地管理个人财务。</text>
		</view>

		<!-- 功能介绍 -->
		<view class="feature-section">
			<ay-title title="主要功能" bold></ay-title>
			<view class="feature-list">
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="calendar" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">日常记账</text>
					<text class="feature-desc">轻松记录每日工作收入</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="refund" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">收入统计</text>
					<text class="feature-desc">清晰掌握收入情况</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="bookmark" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">项目管理</text>
					<text class="feature-desc">多项目分类管理</text>
				</view>
				<view class="feature-item">
					<view class="icon-box">
						<tn-icon name="time" size="48" color="#ff6700"></tn-icon>
					</view>
					<text class="feature-name">工时记录</text>
					<text class="feature-desc">准确记录工作时间</text>
				</view>
			</view>
		</view>

		<!-- 联系我们 -->
		<view class="contact-section">
			<ay-title title="联系我们" bold></ay-title>
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
			<text>Copyright © 2025 smallAnYao</text>
			<text>All Rights Reserved</text>
		</view>
	</view>
</template>

<script setup>
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
		background-color: #f8f9fc;
		padding: 20rpx;
		padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);

		.app-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 60rpx 0;
			background-color: #fff;
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

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
				color: #333;
				margin-bottom: 10rpx;
			}

			.app-version {
				font-size: 24rpx;
				color: #999;
			}
		}

		.product-intro {
			padding: 20rpx;
			background-color: #fff;
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
			display: flex;
			justify-content: center;

			.intro-text {
				font-size: 28rpx;
				color: #666;
				text-indent: 2em;
			}
		}

		.feature-section {
			background-color: #fff;
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
			overflow: hidden;

			.feature-list {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 20rpx;
				padding: 0 30rpx 30rpx;

				.feature-item {
					background-color: #f8f9fc;
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
						color: #333;
						margin-bottom: 8rpx;
					}

					.feature-desc {
						font-size: 24rpx;
						color: #999;
						text-align: center;
					}
				}
			}
		}

		.contact-section {
			background-color: #fff;
			border-radius: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
			overflow: hidden;

			.contact-list {
				padding: 0 30rpx;

				.contact-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx 0;
					border-bottom: 2rpx solid #f5f5f5;

					&:last-child {
						border-bottom: none;
					}

					.label {
						font-size: 28rpx;
						color: #333;
					}

					.value {
						font-size: 28rpx;
						color: #666;
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
				color: #999;
				line-height: 1.8;
			}
		}
	}
</style>