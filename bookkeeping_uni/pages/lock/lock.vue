<template>
	<view class="lock-page" :style="themeVars" @touchmove.stop.prevent>
		<view class="lock-content">
			<image class="lock-logo" src="/static/logo.png" mode="aspectFit"></image>
			<view class="lock-icon">
				<tn-icon name="fingerprint" size="120" color="#ff6700"></tn-icon>
			</view>
			<text class="lock-tip">请验证指纹以解锁</text>
			<view class="lock-retry" @click="doAuth">
				<text>重新验证</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onBackPress } from '@dcloudio/uni-app';
import { getThemeVars, setPageBgColor } from '@/utils/theme';

const themeVars = ref(getThemeVars());
setPageBgColor();

onBackPress(() => true);

const doAuth = () => {
	console.log('[LOCK] doAuth 开始');
	const fingerprint = plus.fingerprint;
	if (!fingerprint) {
		console.log('[LOCK] plus.fingerprint 不存在');
		uni.showToast({ title: '设备不支持指纹', icon: 'none' });
		return;
	}
	fingerprint.authenticate(() => {
		console.log('[LOCK] 指纹验证成功');
		const app = getApp();
		if (app) {
			app.globalData.needAuth = false;
			app.globalData.isLockPageOpen = false;
		}
		// 清空整个页面栈回首页，避免多层 lock 页面残留
		setTimeout(() => {
			const mode = uni.getStorageSync('app_mode');
			if (mode === 'work') {
				uni.reLaunch({ url: '/pages/index/index' });
			} else {
				uni.reLaunch({ url: '/pages/personal/dashboard' });
			}
		}, 100);
	}, (err) => {
		console.log('[LOCK] 指纹验证失败:', err.code, err.message);
	});
};

onLoad(() => {
	setTimeout(() => { doAuth(); }, 300);
});
</script>

<style lang="scss" scoped>
.lock-page {
	width: 100vw;
	height: 100vh;
	background-color: var(--bg-page);
	display: flex;
	align-items: center;
	justify-content: center;
}
.lock-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32rpx;
}
.lock-logo {
	width: 180rpx;
	height: 180rpx;
	border-radius: 30rpx;
}
.lock-title {
	font-size: 36rpx;
	font-weight: 600;
	color: var(--text-primary);
}
.lock-icon { margin: 40rpx 0; }
.lock-tip {
	font-size: 28rpx;
	color: var(--text-tertiary);
}
.lock-retry {
	margin-top: 40rpx;
	padding: 20rpx 60rpx;
	background: #ff6700;
	border-radius: 40rpx;
	text { color: #fff; font-size: 28rpx; }
	&:active { opacity: 0.8; }
}
</style>
