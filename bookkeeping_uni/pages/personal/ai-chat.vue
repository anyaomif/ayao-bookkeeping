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

		<scroll-view class="chat-body" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
			<view class="chat-list">
				<view v-for="(msg, idx) in messages" :key="idx" :class="['chat-row', msg.role]">
					<template v-if="msg.role === 'ai'">
						<view class="avatar ai-avatar">
							<tn-icon name="alien" size="48" color="#ff6700"></tn-icon>
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
										<text>{{ categoryMap[card.category_id] || '未知分类' }}</text>
										<text>{{ accountMap[card.account_id] || '默认账户' }}</text>
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
								<text v-if="msg.confirmed" class="confirmed-tag">已记账</text>
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
										<text>{{ categoryMap[card.category_id] || '未知分类' }}</text>
										<text>{{ accountMap[card.account_id] || '默认账户' }}</text>
									</view>
									<view class="card-row sub">
										<text>{{ card.date }}</text>
										<text v-if="card.remark">{{ card.remark }}</text>
									</view>
								</view>
							</view>
							<!-- 快捷操作按钮 -->
							<view v-if="msg.quickActions" class="quick-actions">
								<view class="quick-btn" v-for="(qa, qi) in msg.quickActions" :key="qi" @click="handleQuickAction(qa.text)">
									<text>{{ qa.label }}</text>
								</view>
							</view>
							<!-- 分类信息展示 -->
							<view v-if="msg.categoryInfo" class="info-cards">
								<view class="info-group" v-for="(group, gi) in msg.categoryInfo" :key="gi">
									<text class="info-group-title">{{ group.typeName }}</text>
									<view class="info-item" v-for="(cat, ci) in group.list" :key="ci">
										<text class="info-main">{{ cat.name }}</text>
										<text class="info-sub" v-if="cat.subs">{{ cat.subs }}</text>
									</view>
								</view>
							</view>
							<!-- 账户信息展示 -->
							<view v-if="msg.accountInfo" class="info-cards">
								<view class="info-item" v-for="(acc, ai) in msg.accountInfo" :key="ai">
									<view class="acc-icon" :style="{ background: acc.color }">
										<tn-icon :name="acc.icon" size="28" color="#fff"></tn-icon>
									</view>
									<view class="acc-detail">
										<text class="info-main">{{ acc.name }}</text>
										<text class="info-sub">余额：¥{{ acc.balance }}</text>
									</view>
								</view>
							</view>
							<!-- 操作结果 -->
							<view v-if="msg.actionResult" class="action-result">
								<text>{{ msg.actionResult }}</text>
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
						<tn-icon name="alien" size="48" color="#ff6700"></tn-icon>
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
						<tn-icon name="alien" size="48" color="#ff6700"></tn-icon>
					</view>
					<view class="bubble ai">
						<text class="bubble-text">{{ displayText }}<text class="cursor-blink">|</text></text>
					</view>
				</view>
			</view>
			<view class="scroll-bottom-anchor"></view>
		</scroll-view>

		<!-- 录音状态浮层 -->
		<view v-if="recording" class="recording-overlay">
			<view class="recording-modal">
				<view class="recording-header">
					<view class="recording-wave">
						<view class="wave-bar" v-for="i in 5" :key="i"></view>
					</view>
					<text class="recording-time">{{ recordingTime }}s</text>
				</view>
				<view class="stop-record-btn" @click.stop="stopRecording">
					<tn-icon name="stop" size="56" color="#fff"></tn-icon>
				</view>
				<text class="recording-tip">点击停止</text>
			</view>
		</view>

		<!-- 识别中浮层 -->
		<view v-if="recognizing" class="recording-overlay">
			<view class="recording-modal">
				<view class="recognizing-dots">
					<view class="dot"></view>
					<view class="dot"></view>
					<view class="dot"></view>
				</view>
				<text class="recording-tip">语音识别中...</text>
			</view>
		</view>

		<view class="input-bar">
			<view class="voice-btn" :class="{ active: recording }" @click="toggleRecording">
				<tn-icon :name="recording ? 'stop' : 'voice-fill'" size="40" :color="recording ? '#ff3b30' : '#ff6700'"></tn-icon>
			</view>
			<textarea class="chat-input" v-model="inputText" :placeholder="inputPlaceholder" :disabled="loading"
				confirm-type="send" :adjust-position="false" @confirm="sendMessage" auto-height
				cursor-spacing="10"
				:maxlength="-1"></textarea>
			<view class="send-btn" :class="{ disabled: !inputText.trim() || loading }" @click="sendMessage">
				<tn-icon name="send" size="40" color="#fff"></tn-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { aiApi, aiStream, voiceToText } from '@/api/ai';
import { userApi } from '@/api/user';
import { personalCategoryApi } from '@/api/personal_category';
import { personalAccountApi } from '@/api/personal_account';
import { baseUrl } from '@/utils/ayao';

const inputText = ref('');
const loading = ref(false);
const userAvatar = ref('');
const scrollTop = ref(0);
const streamingText = ref('');
const pendingItems = ref(null);
const pendingMsgIdx = ref(-1);
const categoryMap = ref({});
const accountMap = ref({});
const recording = ref(false);
const recognizing = ref(false);
const recordingTime = ref(0);
let recordingTimer = null;
let recorderManager = null;
// #ifdef APP-PLUS || MP
recorderManager = uni.getRecorderManager();
// #endif
// H5端 MediaRecorder
let h5MediaRecorder = null;
let h5AudioChunks = [];

// 键盘监听 + 动态获取input-bar高度
onLoad(() => {

	recorderManager?.onStop((res) => {
		clearInterval(recordingTimer);
		recording.value = false;
		recordingTime.value = 0;
		if (!res.tempFilePath) {
			uni.showToast({ title: '录音失败', icon: 'none' });
			return;
		}
		handleRecordingResult(res.tempFilePath);
	});

	recorderManager?.onError((err) => {
		clearInterval(recordingTimer);
		recording.value = false;
		recordingTime.value = 0;
		console.log('[ASR] 录音错误:', err);
		uni.showToast({ title: '录音出错', icon: 'none' });
	});

	userApi.getUserInfo().then(res => {
		if (res.success && res.data.avatar) {
			userAvatar.value = baseUrl + res.data.avatar;
		} else {
			console.log('[AI-CHAT] 无头像数据');
		}
	}).catch(err => {
		console.log('[AI-CHAT] getUserInfo 失败:', err);
	});

	personalCategoryApi.getAll().then(res => {
		if (res.success && res.data) {
			const map = {};
			Object.values(res.data).forEach(typeList => {
				typeList.forEach(parent => {
					map[parent.id] = parent.name;
					if (parent.subcategories) {
						parent.subcategories.forEach(sub => { map[sub.id] = sub.name; });
					}
				});
			});
			categoryMap.value = map;
		}
	});
	personalAccountApi.getList().then(res => {
		if (res.success && res.data) {
			const list = res.data.list || [];
			list.forEach(a => { accountMap.value[a.id] = a.name; });
		}
	});
});

onUnload(() => {
	clearInterval(recordingTimer);
	// #ifdef H5
	if (h5MediaRecorder && h5MediaRecorder.state !== 'inactive') {
		h5MediaRecorder.stop();
	}
	// #endif
});

const messages = ref([
	{
		role: 'ai',
		content: '你好！我是小尧，你的 AI 记账助手 🤖\n\n我可以帮你：\n· 语音/文字快速记账\n· 查看和管理分类、账户\n· 修改待确认的记录\n\n试试下面的快捷操作，或直接告诉我你的消费吧～',
		quickActions: [
			{ label: '☕ 早餐花了15', text: '早餐花了15' },
			{ label: '📋 查看分类', text: '查看我的分类' },
			{ label: '💳 查看账户', text: '查看我的账户' },
			{ label: '➕ 添加分类', text: '帮我添加一个支出分类叫娱乐' },
		]
	}
]);

const inputPlaceholder = computed(() => {
	if (pendingItems.value) return '可以说"改成20块"或"换成午餐"来修改...';
	return '描述你的消费或收入...';
});

const cleanAiText = (text) => {
	return text.replace(/```json[\s\S]*?```/g, '').replace(/```[\w]*[\s\S]*?```/g, '').replace(/```[\w]*[\s\S]*/g, '').replace(/```/g, '').trim();
};

const displayText = computed(() => {
	return cleanAiText(streamingText.value);
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
		async (result) => {
			const cleanText = cleanAiText(fullText);
			const msg = { role: 'ai', content: cleanText || '已处理' };

			if (result.success && result.action) {
				await handleAction(result.action, result.data, msg);
			} else if (result.success && result.items?.length) {
				msg.pendingCards = result.items;
				msg.showActions = true;
				messages.value.push(msg);
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
				messages.value.push({ role: 'ai', content: cleanAiText(fullText) || '处理完成' });
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

const toggleRecording = () => {
	if (loading.value || recognizing.value) return;
	if (recording.value) {
		stopRecording();
	} else {
		startRecording();
	}
};

const startRecording = () => {
	recording.value = true;
	recordingTime.value = 0;
	recordingTimer = setInterval(() => {
		recordingTime.value++;
		if (recordingTime.value >= 60) stopRecording();
	}, 1000);
	// #ifdef APP-PLUS || MP
	recorderManager?.start({
		format: 'mp3',
		sampleRate: 16000,
		numberOfChannels: 1,
		encodeBitRate: 96000,
	});
	// #endif
	// #ifdef H5
	h5AudioChunks = [];
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		clearInterval(recordingTimer);
		recording.value = false;
		recordingTime.value = 0;
		uni.showToast({ title: '请使用HTTPS访问以启用录音', icon: 'none' });
		return;
	}
	navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
		h5MediaRecorder = new MediaRecorder(stream);
		h5MediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) h5AudioChunks.push(e.data);
		};
		h5MediaRecorder.onstop = () => {
			stream.getTracks().forEach(t => t.stop());
			const blob = new Blob(h5AudioChunks, { type: 'audio/ogg' });
			handleRecordingResult(blob);
		};
		h5MediaRecorder.onerror = () => {
			stream.getTracks().forEach(t => t.stop());
			clearInterval(recordingTimer);
			recording.value = false;
			recordingTime.value = 0;
			uni.showToast({ title: '录音出错', icon: 'none' });
		};
		h5MediaRecorder.start();
	}).catch(() => {
		clearInterval(recordingTimer);
		recording.value = false;
		recordingTime.value = 0;
		uni.showToast({ title: '无法获取麦克风权限', icon: 'none' });
	});
	// #endif
};

const stopRecording = () => {
	if (!recording.value) return;
	clearInterval(recordingTimer);
	// #ifdef APP-PLUS || MP
	recorderManager?.stop();
	// #endif
	// #ifdef H5
	if (h5MediaRecorder && h5MediaRecorder.state !== 'inactive') {
		h5MediaRecorder.stop();
	}
	recording.value = false;
	recordingTime.value = 0;
	// #endif
};

const handleRecordingResult = (fileOrBlob) => {
	recognizing.value = true;
	voiceToText(fileOrBlob).then(text => {
		recognizing.value = false;
		if (text && text.trim()) {
			inputText.value = text.trim();
		} else {
			uni.showToast({ title: '未识别到内容', icon: 'none' });
		}
	}).catch(err => {
		recognizing.value = false;
		console.log('[ASR] 识别失败:', err);
		uni.showToast({ title: '语音识别失败', icon: 'none' });
	});
};

const goBack = () => { uni.navigateBack(); };

const refreshCategoryMap = async () => {
	const res = await personalCategoryApi.getAll();
	if (res.success && res.data) {
		const map = {};
		Object.values(res.data).forEach(typeList => {
			typeList.forEach(parent => {
				map[parent.id] = parent.name;
				if (parent.subcategories) {
					parent.subcategories.forEach(sub => { map[sub.id] = sub.name; });
				}
			});
		});
		categoryMap.value = map;
	}
};

const refreshAccountMap = async () => {
	const res = await personalAccountApi.getList();
	if (res.success && res.data) {
		const map = {};
		const list = res.data.list || [];
		list.forEach(a => { map[a.id] = a.name; });
		accountMap.value = map;
	}
};

const handleAction = async (action, data, msg) => {
	const typeNameMap = { expense: '支出', income: '收入', transfer: '转账' };
	try {
		if (action === 'query_categories') {
			const res = await personalCategoryApi.getAll();
			if (res.success && res.data) {
				msg.categoryInfo = Object.entries(res.data).map(([type, list]) => ({
					typeName: typeNameMap[type] || type,
					list: list.map(p => ({
						name: p.name,
						subs: p.subcategories?.length ? p.subcategories.map(s => s.name).join('、') : '',
					})),
				})).filter(g => g.list.length > 0);
			}
			messages.value.push(msg);
		} else if (action === 'query_accounts') {
			const res = await personalAccountApi.getList();
			if (res.success && res.data) {
				const list = res.data.list || [];
				msg.accountInfo = list.map(a => ({
					name: a.name,
					balance: Number(a.balance || 0).toFixed(2),
					icon: a.icon || 'wallet',
					color: a.color || '#ff6700',
				}));
			}
			messages.value.push(msg);
		} else if (action === 'add_category') {
			const res = await personalCategoryApi.create(data);
			if (res.success) {
				msg.actionResult = `分类「${data.name}」添加成功`;
				await refreshCategoryMap();
			} else {
				msg.actionResult = `添加失败：${res.message || '未知错误'}`;
			}
			messages.value.push(msg);
		} else if (action === 'delete_category') {
			const res = await personalCategoryApi.delete(data.id);
			if (res.success) {
				msg.actionResult = `分类删除成功`;
				await refreshCategoryMap();
			} else {
				msg.actionResult = `删除失败：${res.message || '未知错误'}`;
			}
			messages.value.push(msg);
		} else if (action === 'add_account') {
			const res = await personalAccountApi.create(data);
			if (res.success) {
				msg.actionResult = `账户「${data.name}」添加成功`;
				await refreshAccountMap();
			} else {
				msg.actionResult = `添加失败：${res.message || '未知错误'}`;
			}
			messages.value.push(msg);
		} else if (action === 'delete_account') {
			const res = await personalAccountApi.delete(data.id);
			if (res.success) {
				msg.actionResult = `账户删除成功`;
				await refreshAccountMap();
			} else {
				msg.actionResult = `删除失败：${res.message || '未知错误'}`;
			}
			messages.value.push(msg);
		} else {
			messages.value.push(msg);
		}
	} catch (e) {
		msg.actionResult = `操作失败：${e.message || '网络异常'}`;
		messages.value.push(msg);
	}
};

const handleQuickAction = (text) => {
	inputText.value = text;
	sendMessage();
};
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

.action-result {
	margin-top: 16rpx;
	padding: 12rpx 16rpx;
	background: #f0faf4;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #34c759;
	line-height: 1.6;
}

.discarded-tag {
	font-size: 24rpx;
	color: #999;
	margin-top: 12rpx;
}

.quick-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-top: 16rpx;
}

.quick-btn {
	padding: 12rpx 24rpx;
	background: #fff2e8;
	border-radius: 24rpx;
	font-size: 24rpx;
	color: #ff6700;

	&:active {
		opacity: 0.7;
		background: #ffe0c0;
	}
}

.info-cards {
	margin-top: 16rpx;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.info-group {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.info-group-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #ff6700;
	padding: 4rpx 0;
}

.info-item {
	background: #fafafa;
	border-radius: 12rpx;
	padding: 12rpx 16rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.info-main {
	font-size: 26rpx;
	color: #333;
}

.info-sub {
	font-size: 22rpx;
	color: #999;
	flex: 1;
}

.acc-icon {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.acc-detail {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
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
	flex-shrink: 0;
	z-index: 10;
	display: flex;
	align-items: flex-end;
	gap: 16rpx;
	padding: 16rpx 20rpx;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	background: #fff;
	border-top: 1rpx solid #eee;
}

.chat-input {
	flex: 1;
	min-height: 80rpx;
	max-height: 200rpx;
	background: #f5f5f5;
	border-radius: 40rpx;
	padding: 20rpx 32rpx;
	font-size: 28rpx;
	line-height: 1.5;
	box-sizing: border-box;
	overflow-y: auto;
}

.voice-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #fff2e8;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	&:active {
		opacity: 0.8;
		transform: scale(0.92);
	}

	&.active {
		background: #ffe5e5;
	}
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

.recording-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
}

.recording-modal {
	background: #fff;
	border-radius: 32rpx;
	padding: 60rpx 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
}

.recording-header {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.recording-time {
	font-size: 48rpx;
	font-weight: 600;
	color: #ff3b30;
}

.recording-tip {
	font-size: 26rpx;
	color: #999;
}

.stop-record-btn {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: #ff3b30;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		opacity: 0.7;
		transform: scale(0.9);
	}
}

.recording-wave {
	display: flex;
	align-items: center;
	gap: 8rpx;
	height: 60rpx;
}

.wave-bar {
	width: 8rpx;
	height: 20rpx;
	background: #ff6700;
	border-radius: 4rpx;
	animation: waveAnim 1s ease-in-out infinite;

	&:nth-child(1) { animation-delay: 0s; }
	&:nth-child(2) { animation-delay: 0.15s; }
	&:nth-child(3) { animation-delay: 0.3s; }
	&:nth-child(4) { animation-delay: 0.45s; }
	&:nth-child(5) { animation-delay: 0.6s; }
}

@keyframes waveAnim {
	0%, 100% { height: 20rpx; }
	50% { height: 56rpx; }
}

.recognizing-dots {
	display: flex;
	gap: 12rpx;
	align-items: center;

	.dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background: #ff6700;
		animation: dotBounce 1.4s infinite ease-in-out both;

		&:nth-child(1) { animation-delay: 0s; }
		&:nth-child(2) { animation-delay: 0.2s; }
		&:nth-child(3) { animation-delay: 0.4s; }
	}
}
</style>
