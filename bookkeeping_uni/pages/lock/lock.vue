<template>
	<view class="lock-page" :style="themeVars" @touchmove.stop.prevent>
		<view class="lock-content">
			<image class="lock-logo" src="/static/logo.png" mode="aspectFit"></image>
			<view class="lock-icon">
				<tn-icon :name="authIcon" size="120" color="#ff6700"></tn-icon>
			</view>
			<text class="lock-tip">{{ authTip }}</text>
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

const authType = ref('fingerPrint');
const authIcon = ref('fingerprint');
const authTip = ref('请验证以解锁');

const onSuccess = () => {
	const app = getApp();
	if (app) {
		app.globalData.needAuth = false;
		app.globalData.isLockPageOpen = false;
	}
	setTimeout(() => {
		const mode = uni.getStorageSync('app_mode');
		uni.reLaunch({
			url: mode === 'work' ? '/pages/index/index' : '/pages/personal/dashboard'
		});
	}, 100);
};

const doAuth = () => {
	uni.startSoterAuthentication({
		requestAuthModes: [authType.value],
		challenge: String(Date.now()),
		authContent: '请验证身份以解锁应用',
		success() {
			onSuccess();
		},
		fail(err) {
			console.log('[LOCK] 认证失败:', err.errCode, err.errMsg);
		}
	});
};

const checkSupport = () => {
	uni.checkIsSupportSoterAuthentication({
		success(res) {
			const modes = res.supportMode || [];
			if (modes.includes('facial')) {
				authType.value = 'facial';
				authIcon.value = 'scan';
				authTip.value = '请验证面容以解锁';
			} else if (modes.includes('fingerPrint')) {
				authType.value = 'fingerPrint';
				authIcon.value = 'fingerprint';
				authTip.value = '请验证指纹以解锁';
			} else {
				authTip.value = '设备不支持生物认证';
				return;
			}
			setTimeout(() => doAuth(), 300);
		},
		fail() {
			authTip.value = '设备不支持生物认证';
		}
	});
};

onLoad(() => { checkSupport(); });
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
