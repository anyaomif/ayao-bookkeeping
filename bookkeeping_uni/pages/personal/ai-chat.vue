<template>
	<view class="ai-chat-page">
		<NavbarWrapper sticky>
			<view class="chat-navbar">
				<view class="nav-back" @click="goBack">
					<tn-icon name="left" size="44"></tn-icon>
				</view>
				<text class="nav-title">小尧 AI 智能记账</text>
				<view class="nav-right"></view>
			</view>
		</NavbarWrapper>

		<scroll-view class="chat-body" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true"
			:style="{ paddingBottom: (keyboardHeight > 0 ? keyboardHeight + 60 : inputBarHeight) + 'px' }">
			<view class="chat-list">
				<view v-for="(msg, idx) in messages" :key="idx" :class="['chat-row', msg.role]">
					<template v-if="msg.role === 'ai'">
						<view class="avatar ai-avatar">
							<tn-icon name="ai-fill" size="40" color="#ff6700"></tn-icon>
						</view>
						<view class="bubble ai">
							<text class="bubble-text">{{ msg.content }}</text>
							<!-- 待确认卡片 -->
							<view v-if="msg.pendingCards && msg.pendingCards.length" class="result-cards">
								<view class="result-card" v-for="(card, ci) in msg.pendingCards" :key="ci">
									<view class="card-row">
										<text class="card-label">{{ card.type === 'expense' ? '支出' : '收入' }}</text>
										<text class="card-amount" :class="card.type">¥{{ card.amount }}</text>
									</view>
									<view class="card-row sub">
										<text>{{ card.date }}</text>
										<text v-if="card.remark">{{ card.remark }}</text>
									</view>
								</view>
								<view v-if="msg.showActions" class="card-actions">
									<view class="action-discard" @click="discardPending(idx)">放弃</view>
									<view class="action-confirm" @click="confirmPending(idx)">确认记账</view>
								</view>
								<text v-if="msg.confirmed" class="confirmed-tag">✅ 已记账</text>
								<text v-if="msg.discarded" class="discarded-tag">已放弃</text>
							</view>
							<!-- 已确认卡片（纯展示） -->
							<view v-if="msg.cards && msg.cards.length" class="result-cards">
								<view class="result-card confirmed" v-for="(card, ci) in msg.cards" :key="ci">
									<view class="card-row">
										<text class="card-label">{{ card.type === 'expense' ? '支出' : '收入' }}</text>
										<text class="card-amount" :class="card.type">¥{{ card.amount }}</text>
									</view>
									<view class="card-row sub">
										<text>{{ card.date }}</text>
										<text v-if="card.remark">{{ card.remark }}</text>
									</view>
								</view>
							</view>
						</view>
					</template>
					<template v-else>
						<view class="bubble user">
							<text class="bubble-text">{{ msg.content }}</text>
						</view>
						<view class="avatar user-avatar">
							<image v-if="userAvatar" class="avatar-img" :src="userAvatar" mode="aspectFill"></image>
							<tn-icon v-else name="my-fill" size="40" color="#fff"></tn-icon>
						</view>
					</template>
				</view>
				<!-- AI 正在思考 -->
				<view v-if="loading && !streamingText" class="chat-row ai">
					<view class="avatar ai-avatar">
						<tn-icon name="ai-fill" size="40" color="#ff6700"></tn-icon>
					</view>
					<view class="bubble ai typing">
						<view class="dot-loading">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
					</view>
				</view>
				<!-- 流式输出中 -->
				<view v-if="streamingText" class="chat-row ai">
					<view class="avatar ai-avatar">
						<tn-icon name="ai-fill" size="40" color="#ff6700"></tn-icon>
					</view>
					<view class="bubble ai">
						<text class="bubble-text">{{ displayText }}<text class="cursor-blink">|</text></text>
					</view>
				</view>
			</view>
			<view class="scroll-bottom-anchor"></view>
		</scroll-view>

		<view class="input-bar" :style="{ bottom: keyboardHeight + 'px' }">
			<input class="chat-input" v-model="inputText" :placeholder="inputPlaceholder" :disabled="loading"
				confirm-type="send" :adjust-position="false" @confirm="sendMessage" />
			<view class="send-btn" :class="{ disabled: !inputText.trim() || loading }" @click="sendMessage">
				<tn-icon name="send" size="40" color="#fff"></tn-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, nextTick, getCurrentInstance } from 'vue';
import { onLoad, onUnload, onReady } from '@dcloudio/uni-app';
import { aiApi, aiStream } from '@/api/ai';
import { userApi } from '@/api/user';
import { baseUrl } from '@/utils/ayao';

const inputText = ref('');
const loading = ref(false);
const userAvatar = ref('');
const scrollTop = ref(0);
const streamingText = ref('');
const keyboardHeight = ref(0);
const inputBarHeight = ref(60);
const pendingItems = ref(null);
const pendingMsgIdx = ref(-1);

// 键盘监听 + 动态获取input-bar高度
onLoad(() => {
	// #ifdef APP-PLUS || MP
	uni.onKeyboardHeightChange((res) => {
		keyboardHeight.value = res.height;
		if (res.height > 0) scrollToBottom();
	});
	// #endif
	userApi.getUserInfo().then(res => {
		if (res.success && res.data.avatar) {
			userAvatar.value = baseUrl + res.data.avatar;
		} else {
			console.log('[AI-CHAT] 无头像数据');
		}
	}).catch(err => {
		console.log('[AI-CHAT] getUserInfo 失败:', err);
	});
});

onReady(() => {
	const query = uni.createSelectorQuery().in(getCurrentInstance());
	query.select('.input-bar').boundingClientRect(rect => {
		if (rect) inputBarHeight.value = rect.height;
	}).exec();
});

onUnload(() => {
	// #ifdef APP-PLUS || MP
	uni.offKeyboardHeightChange();
	// #endif
});

const messages = ref([
	{ role: 'ai', content: '你好！我是俺要记账的 AI 助手 🤖\n\n直接告诉我你的消费或收入，我来帮你记账。\n\n例如：\n· 午饭花了18块\n· 昨天打车35\n· 工资到账8000' }
]);

const inputPlaceholder = computed(() => {
	if (pendingItems.value) return '可以说"改成20块"或"换成午餐"来修改...';
	return '描述你的消费或收入...';
});

const displayText = computed(() => {
	return streamingText.value.replace(/```json[\s\S]*?```/g, '').replace(/```json[\s\S]*/g, '').trim();
});

const scrollToBottom = () => {
	nextTick(() => { scrollTop.value = scrollTop.value === 99999 ? 99998 : 99999; });
};

const sendMessage = () => {
	const text = inputText.value.trim();
	if (!text || loading.value) return;

	messages.value.push({ role: 'user', content: text });
	inputText.value = '';
	loading.value = true;
	streamingText.value = '';
	scrollToBottom();

	// 如果有待确认记录，传全部给后端让AI修改
	const pending = pendingItems.value ? [...pendingItems.value] : null;
	// 保留旧卡片显示（隐藏操作按钮），等新结果回来再处理
	const oldMsgIdx = pendingMsgIdx.value;
	if (oldMsgIdx >= 0 && messages.value[oldMsgIdx]) {
		messages.value[oldMsgIdx].showActions = false;
	}
	pendingItems.value = null;
	pendingMsgIdx.value = -1;

	let fullText = '';

	aiStream(text, pending,
		(chunk) => {
			fullText += chunk;
			streamingText.value = fullText;
			scrollToBottom();
		},
		(result) => {
			const cleanText = fullText.replace(/```json[\s\S]*?```/g, '').trim();
			const msg = { role: 'ai', content: cleanText || '已处理' };

			if (result.success && result.items?.length) {
				msg.pendingCards = result.items;
				msg.showActions = true;
				messages.value.push(msg);
				// 如果是修改场景，标记旧卡片为已替换
				if (oldMsgIdx >= 0 && messages.value[oldMsgIdx]) {
					messages.value[oldMsgIdx].discarded = true;
				}
				pendingItems.value = result.items;
				pendingMsgIdx.value = messages.value.length - 1;
			} else {
				messages.value.push(msg);
			}

			streamingText.value = '';
			loading.value = false;
			scrollToBottom();
		},
		(err) => {
			if (fullText) {
				messages.value.push({ role: 'ai', content: fullText.replace(/```json[\s\S]*?```/g, '').trim() || '处理完成' });
			} else {
				messages.value.push({ role: 'ai', content: '网络异常，请稍后再试 😅' });
			}
			streamingText.value = '';
			loading.value = false;
			scrollToBottom();
		}
	);
};

const confirmPending = async (msgIdx) => {
	const msg = messages.value[msgIdx];
	if (!msg?.pendingCards?.length) return;

	try {
		await aiApi.confirm(msg.pendingCards);
		msg.showActions = false;
		msg.confirmed = true;
		pendingItems.value = null;
		pendingMsgIdx.value = -1;
		uni.showToast({ title: '记账成功', icon: 'success' });
	} catch (e) {
		uni.showToast({ title: '记账失败', icon: 'none' });
	}
};

const discardPending = (msgIdx) => {
	const msg = messages.value[msgIdx];
	if (!msg) return;
	msg.showActions = false;
	msg.discarded = true;
	pendingItems.value = null;
	pendingMsgIdx.value = -1;
};

const goBack = () => { uni.navigateBack(); };
</script>

<style lang="scss" scoped>
.ai-chat-page {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
	overflow: hidden;
}

.chat-navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 30rpx;
	background: #fff;
	flex-shrink: 0;

	.nav-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1c1c1e;
	}

	.nav-right {
		width: 44rpx;
	}
}

.chat-body {
	flex: 1;
	padding: 0 20rpx;
	box-sizing: border-box;
	overflow: hidden;
}

.chat-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	padding: 20rpx 0;
}

.chat-row {
	display: flex;
	align-items: flex-start;
	gap: 16rpx;

	&.user {
		justify-content: flex-end;
	}
}

.avatar {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.ai-avatar {
	background: #fff2e8;
}

.user-avatar {
	background: #ff6700;

	.avatar-img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}

.bubble {
	max-width: 70%;
	padding: 24rpx;
	border-radius: 24rpx;
	font-size: 28rpx;
	line-height: 1.6;
	word-break: break-all;

	&.ai {
		background: #fff;
		color: #333;
		border-top-left-radius: 8rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
	}

	&.user {
		background: #ff6700;
		color: #fff;
		border-top-right-radius: 8rpx;
	}
}

.bubble-text {
	white-space: pre-wrap;
}

.cursor-blink {
	color: #ff6700;
	font-weight: bold;
	animation: blink 0.8s infinite;
}

@keyframes blink {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0;
	}
}

.result-cards {
	margin-top: 16rpx;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.result-card {
	background: #fef7f0;
	border-radius: 16rpx;
	padding: 16rpx 20rpx;
	border-left: 6rpx solid #ff6700;

	&.confirmed {
		border-left-color: #34c759;
		background: #f0faf4;
	}
}

.card-row {
	display: flex;
	justify-content: space-between;
	align-items: center;

	&.sub {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #999;
		gap: 16rpx;
	}
}

.card-label {
	font-size: 26rpx;
	color: #666;
}

.card-amount {
	font-size: 32rpx;
	font-weight: 600;

	&.expense {
		color: #ff3b30;
	}

	&.income {
		color: #34c759;
	}
}

.card-actions {
	display: flex;
	gap: 16rpx;
	margin-top: 16rpx;
}

.action-confirm {
	flex: 1;
	height: 64rpx;
	border-radius: 32rpx;
	background: #ff6700;
	color: #fff;
	font-size: 26rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		opacity: 0.8;
	}
}

.action-discard {
	height: 64rpx;
	padding: 0 32rpx;
	border-radius: 32rpx;
	background: #f5f5f5;
	color: #999;
	font-size: 26rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		background: #eee;
	}
}

.confirmed-tag {
	font-size: 24rpx;
	color: #34c759;
	margin-top: 12rpx;
}

.discarded-tag {
	font-size: 24rpx;
	color: #999;
	margin-top: 12rpx;
}

.typing {
	padding: 20rpx 28rpx;
}

.dot-loading {
	display: flex;
	gap: 8rpx;
	align-items: center;
}

.dot {
	width: 14rpx;
	height: 14rpx;
	border-radius: 50%;
	background: #ccc;
	animation: dotBounce 1.4s infinite ease-in-out both;

	&:nth-child(1) {
		animation-delay: 0s;
	}

	&:nth-child(2) {
		animation-delay: 0.2s;
	}

	&:nth-child(3) {
		animation-delay: 0.4s;
	}
}

@keyframes dotBounce {

	0%,
	80%,
	100% {
		transform: scale(0.6);
		opacity: 0.4;
	}

	40% {
		transform: scale(1);
		opacity: 1;
	}
}

.input-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 16rpx 20rpx;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	background: #fff;
	border-top: 1rpx solid #eee;
	transition: bottom 0.25s;
}

.chat-input {
	flex: 1;
	height: 80rpx;
	background: #f5f5f5;
	border-radius: 40rpx;
	padding: 0 32rpx;
	font-size: 28rpx;
}

.send-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #ff6700;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	&:active {
		opacity: 0.8;
		transform: scale(0.92);
	}

	&.disabled {
		opacity: 0.4;
	}
}

.scroll-bottom-anchor {
	height: 2rpx;
}
</style>
