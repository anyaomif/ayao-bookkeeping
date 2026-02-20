<template>
	<!-- #ifdef APP-PLUS -->
	<view v-if="visible" class="auth-overlay" :style="themeVars" @touchmove.stop.prevent @click.stop>
		<view class="auth-content">
			<image class="auth-logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="auth-title">俺要记账</text>
			<view class="auth-icon">
				<tn-icon name="fingerprint" size="120" color="#ff6700"></tn-icon>
			</view>
			<text class="auth-tip">请验证指纹以解锁</text>
			<view class="auth-retry" @click="retry">
				<text>重新验证</text>
			</view>
		</view>
	</view>
	<!-- #endif -->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { isDarkMode, getThemeVars } from '@/utils/theme';

const visible = ref(false);
const themeVars = ref(getThemeVars());

const syncState = () => {
	const app = getApp();
	if (app) visible.value = !!app.globalData.showAuthOverlay;
};

const retry = () => {
	const app = getApp();
	if (app?.doFingerprintAuth) app.doFingerprintAuth();
};

let timer = null;
onMounted(() => {
	syncState();
	uni.$on('authOverlayChange', (val) => { visible.value = val; if (val) themeVars.value = getThemeVars(); });
	timer = setInterval(syncState, 500);
});
onUnmounted(() => {
	uni.$off('authOverlayChange');
	clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.auth-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 99999;
	background-color: var(--bg-page, #ffffff);
	display: flex;
	align-items: center;
	justify-content: center;
}
.auth-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32rpx;
}
.auth-logo {
	width: 120rpx;
	height: 120rpx;
	border-radius: 30rpx;
}
.auth-title {
	font-size: 36rpx;
	font-weight: 600;
	color: var(--text-primary, #333);
}
.auth-icon { margin: 40rpx 0; }
.auth-tip {
	font-size: 28rpx;
	color: var(--text-tertiary, #999);
}
.auth-retry {
	margin-top: 40rpx;
	padding: 20rpx 60rpx;
	background: #ff6700;
	border-radius: 40rpx;
	text { color: #fff; font-size: 28rpx; }
	&:active { opacity: 0.8; }
}
</style>
