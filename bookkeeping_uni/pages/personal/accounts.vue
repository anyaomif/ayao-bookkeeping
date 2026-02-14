<template>
	<view class="accounts-container">
		<!-- 自定义导航栏 -->
		<NavbarWrapper sticky>
			<view class="custom-navbar">
				<view class="nav-left">
					<tn-icon name="left" size="44" color="#1c1c1e" @click="goBack"></tn-icon>
				</view>
				<view class="nav-center">
					<text class="nav-title">账户管理</text>
				</view>
				<view class="nav-right" @click="openAccountPopup()">
					<tn-icon name="add" size="44" color="#1c1c1e"></tn-icon>
				</view>
			</view>
		</NavbarWrapper>

		<!-- 总资产卡片 -->
		<view class="summary-hero">
			<view class="hero-content">
				<text class="hero-label">净资产 (元)</text>
				<view class="hero-amount">
					<text class="amount-value">{{ formatAmount(totalAssets, null) }}</text>
				</view>
			</view>
		</view>

		<!-- 账户列表 -->
		<view class="accounts-list-section">
			<view class="accounts-card">
				<view class="swipe-wrapper" v-for="account in accounts" :key="account.id">
					<view class="swipe-content" :class="{ 'no-transition': isDragging }" :style="{ transform: `translateX(${getSwipeX(account.id)}rpx)` }"
						@touchstart="onSwipeStart($event, account)"
						@touchmove="onSwipeMove($event, account)"
						@touchend="onSwipeEnd(account)">
						<view class="account-item">
							<view class="item-left">
								<view class="icon-wrapper" :style="{ backgroundColor: account.color }">
									<tn-icon :name="account.icon" size="44" color="#fff"></tn-icon>
								</view>
								<view class="item-details">
									<text class="account-name">{{ account.name }}</text>
									<text class="account-balance">余额 ¥{{ formatAmount(account.balance, null) }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="swipe-actions">
						<view class="action-btn edit-btn" @click="openAccountPopup('edit', account)">
							<tn-icon name="edit" size="36" color="#fff"></tn-icon>
						</view>
						<view class="action-btn delete-btn" @click="confirmDelete(account)">
							<tn-icon name="delete" size="36" color="#fff"></tn-icon>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加/编辑账户弹层 -->
		<ay-popup v-model="showPopup" position="bottom" :duration="300" draggable show-drag-handle>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">{{ popupMode === 'add' ? '添加账户' : '编辑账户' }}</text>
				</view>
				<view class="form-section">
					<view class="form-item">
						<text class="form-label">账户名称</text>
						<ay-input v-model="accountForm.name" placeholder="请输入账户名称" border="surround" />
					</view>
					<view class="form-item">
						<text class="form-label">账户余额</text>
						<ay-input v-model="accountForm.balance" placeholder="请输入账户余额" type="digit" border="surround" />
					</view>
					<view class="form-item">
						<text class="form-label">选择图标</text>
						<view class="icon-selector">
							<view class="icon-option" :class="{ active: accountForm.icon === icon }"
								v-for="icon in iconOptions" :key="icon" @click="accountForm.icon = icon">
								<tn-icon :name="icon" size="48"></tn-icon>
							</view>
						</view>
					</view>
					<view class="form-item">
						<text class="form-label">选择颜色</text>
						<view class="color-selector">
							<view class="color-option" :style="{ backgroundColor: color }"
								:class="{ active: accountForm.color === color }" v-for="color in colorOptions"
								:key="color" @click="accountForm.color = color">
								<tn-icon name="check" v-if="accountForm.color === color" color="#fff" size="32"></tn-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-actions">
					<ay-button block round @click="saveAccount">保 存</ay-button>
				</view>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { personalAccountApi } from '@/api/personal_account';

const showPopup = ref(false);
const popupMode = ref('add');

const accountForm = ref({
	id: null, name: '', balance: '', icon: 'bankcard', color: '#ff6700'
});

const iconOptions = ref(['bankcard', 'money', 'shopbag', 'piggy-bank', 'receipt', 'lucky-money']);
const colorOptions = ref(['#ff6700', '#007aff', '#34c759', '#ff9f0a', '#af52de', '#ff3b30', '#5ac8fa', '#8e8e93']);

const accounts = ref([]);

// 滑动手势
const SWIPE_OPEN = -220;
const swipeState = reactive({});
const isDragging = ref(false);
let swipeStartX = 0;
let swipeStartY = 0;
let swipeLocked = false;
let currentSwipeId = null;

const getSwipeX = (id) => swipeState[id] || 0;

const closeAllSwipe = () => {
	Object.keys(swipeState).forEach(k => { swipeState[k] = 0; });
	currentSwipeId = null;
};

const onSwipeStart = (e, item) => {
	swipeStartX = e.touches[0].clientX;
	swipeStartY = e.touches[0].clientY;
	swipeLocked = false;
	isDragging.value = true;
	if (currentSwipeId && currentSwipeId !== item.id) {
		swipeState[currentSwipeId] = 0;
	}
	currentSwipeId = item.id;
};

const onSwipeMove = (e, item) => {
	const dx = e.touches[0].clientX - swipeStartX;
	const dy = e.touches[0].clientY - swipeStartY;
	if (!swipeLocked && Math.abs(dy) > Math.abs(dx)) {
		swipeLocked = true;
	}
	if (swipeLocked) return;
	let x = (swipeState[item.id] || 0) + dx * 2;
	if (x > 0) x = 0;
	if (x < SWIPE_OPEN) x = SWIPE_OPEN;
	swipeState[item.id] = x;
	swipeStartX = e.touches[0].clientX;
	swipeStartY = e.touches[0].clientY;
};

const onSwipeEnd = (item) => {
	isDragging.value = false;
	if (swipeLocked) return;
	const x = swipeState[item.id] || 0;
	swipeState[item.id] = x < SWIPE_OPEN / 2 ? SWIPE_OPEN : 0;
};

const totalAssets = computed(() => accounts.value.reduce((total, acc) => total + Number(acc.balance), 0));

const formatAmount = (num, type = null) => {
	const n = Number(num);
	if (isNaN(n)) return '0.00';
	const formatted = n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (type === 'income') return `+${formatted}`;
	return formatted;
};

const loadAccounts = async () => {
	try {
		const res = await personalAccountApi.getList();
		if (res.success) accounts.value = res.data.list;
	} catch (e) {
		uni.showToast({ title: '获取账户失败', icon: 'none' });
	}
};

const goBack = () => uni.navigateBack();

const openAccountPopup = (mode = 'add', account = null) => {
	closeAllSwipe();
	popupMode.value = mode;
	if (mode === 'add') {
		accountForm.value = { id: null, name: '', balance: '', icon: 'bankcard', color: '#ff6700' };
	} else {
		accountForm.value = { ...account, balance: String(account.balance) };
	}
	showPopup.value = true;
};

const saveAccount = async () => {
	const { id, name, balance, icon, color } = accountForm.value;
	if (!name.trim()) return uni.showToast({ title: '请输入账户名称', icon: 'none' });

	try {
		const payload = { name: name.trim(), balance: Number(balance) || 0, icon, color };
		if (popupMode.value === 'add') {
			await personalAccountApi.create(payload);
		} else {
			await personalAccountApi.update(id, payload);
		}
		uni.showToast({ title: popupMode.value === 'add' ? '添加成功' : '编辑成功', icon: 'none' });
		showPopup.value = false;
		loadAccounts();
	} catch (e) { /* 拦截器处理 */ }
};

const confirmDelete = (account) => {
	closeAllSwipe();
	uni.showModal({
		title: '确认删除',
		content: `确定要删除账户 "${account.name}" 吗？`,
		confirmColor: '#ff3b30',
		success: async (res) => {
			if (res.confirm) {
				try {
					await personalAccountApi.delete(account.id);
					uni.showToast({ title: '删除成功', icon: 'none' });
					loadAccounts();
				} catch (e) { /* 拦截器处理 */ }
			}
		}
	});
};

onShow(() => { loadAccounts(); });
</script>

<style lang="scss" scoped>
.accounts-container {
	background-color: #f6f6f6;
	min-height: 100vh; min-height: 100dvh;
}

.custom-navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 88rpx;
	padding: 0 10rpx;
	background-color: #f6f6f6;

	.nav-left,
	.nav-right {
		width: 88rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #1c1c1e;
	}
}

.summary-hero {
	padding: 20rpx 30rpx;
	background-color: #f6f6f6;

	.hero-content {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
		text-align: center;
	}

	.hero-label {
		font-size: 28rpx;
		color: #666;
	}

	.hero-amount {
		margin: 10rpx 0;
		font-size: 64rpx;
		font-weight: 700;
		color: #1c1c1e;
		letter-spacing: -2rpx;
	}
}

.accounts-list-section {
	padding: 0 30rpx;
	background-color: #f6f6f6;
}

.accounts-card {
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
	background: #fff;
}

.swipe-wrapper {
	position: relative;
	overflow: hidden;
	&:not(:last-child) { border-bottom: 1rpx solid #f5f5f5; }
}

.swipe-content {
	position: relative;
	z-index: 1;
	background: #fff;
	transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	&.no-transition { transition: none; }
}

.swipe-actions {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	width: 220rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	z-index: 0;
}

.action-btn {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	&.edit-btn { background-color: #ff6700; }
	&.delete-btn { background-color: #ff3b30; }
	&:active { opacity: 0.8; transform: scale(0.92); }
}

.account-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 24rpx;
	background-color: #fff;
	transition: background-color 0.2s ease;

	&:active {
		background-color: #f8f8f8;
	}

	.item-left {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}

	.icon-wrapper {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.item-details {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.account-name {
		font-size: 30rpx;
		font-weight: 500;
		color: #1c1c1e;
	}

	.account-balance {
		font-size: 26rpx;
		color: #8e8e93;
	}
}

/* 弹层样式 */
.popup-content {
	padding: 12rpx 30rpx 40rpx 30rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	background-color: #fff;
}

.popup-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 0 32rpx 0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1c1c1e;
}

.form-section {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.form-item {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.form-label {
	font-size: 28rpx;
	font-weight: 500;
	color: #1c1c1e;
}

.icon-selector,
.color-selector {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.icon-option,
.color-option {
	width: 96rpx;
	height: 96rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f6f6f6;
	transition: all 0.2s ease;

	&.active {
		background-color: #ff6700;
		color: #fff;
		transform: scale(1.1);
	}
}

.color-option {
	&.active {
		box-shadow: 0 0 0 4rpx rgba(255, 103, 0, 0.3);
	}
}

.popup-actions {
	margin-top: 50rpx;
}
</style>
