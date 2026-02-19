<template>
	<view class="ay-swipe-cell" :class="{ 'has-border': border }">
		<view v-if="fixedLeft && $slots.left" class="cell-fixed-left">
			<slot name="left"></slot>
		</view>
		<view class="cell-content" :class="{ 'no-transition': dragging }"
			:style="{ transform: `translateX(${offsetX}rpx)` }" @touchstart="onTouchStart" @touchmove="onTouchMove"
			@touchend="onTouchEnd">
			<slot></slot>
		</view>
		<view class="cell-actions" :style="{ width: `${actionWidth}rpx` }">
			<slot name="actions"></slot>
		</view>
	</view>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

const groupMap = {};
const registerToGroup = (group, instance) => {
	if (!group) return;
	if (!groupMap[group]) groupMap[group] = new Set();
	groupMap[group].add(instance);
};
const unregisterFromGroup = (group, instance) => {
	if (groupMap[group]) groupMap[group].delete(instance);
};
const closeOthersInGroup = (group, self) => {
	if (!groupMap[group]) return;
	groupMap[group].forEach(inst => { if (inst !== self) inst.close(); });
};

const props = defineProps({
	fixedLeft: { type: Boolean, default: false },
	actionWidth: { type: Number, default: 220 },
	disabled: { type: Boolean, default: false },
	border: { type: Boolean, default: true },
	name: { type: [String, Number], default: '' },
	group: { type: String, default: 'default' },
});

const emit = defineEmits(['open', 'close']);

const offsetX = ref(0);
const dragging = ref(false);
let startX = 0, startY = 0, startOffset = 0;
let directionLocked = '';
// 速度追踪：保留最近100ms内的触摸点
let trackPoints = [];
const TRACK_DURATION = 100; // ms

const self = { close: () => close() };
registerToGroup(props.group, self);
onBeforeUnmount(() => unregisterFromGroup(props.group, self));

const open = () => {
	offsetX.value = -props.actionWidth;
	emit('open', props.name);
};

const close = () => {
	offsetX.value = 0;
	emit('close', props.name);
};

const closeAll = () => {
	if (groupMap[props.group]) groupMap[props.group].forEach(inst => inst.close());
};

const getPxRatio = () => 750 / uni.getSystemInfoSync().windowWidth;

// 计算最近 TRACK_DURATION 内的平均速度（px/ms）
const getVelocity = () => {
	const now = Date.now();
	const recent = trackPoints.filter(p => now - p.t < TRACK_DURATION);
	if (recent.length < 2) return 0;
	const first = recent[0];
	const last = recent[recent.length - 1];
	const dt = last.t - first.t;
	if (dt === 0) return 0;
	return (last.x - first.x) / dt;
};

const onTouchStart = (e) => {
	if (props.disabled) return;
	const touch = e.touches[0];
	startX = touch.clientX;
	startY = touch.clientY;
	startOffset = offsetX.value;
	directionLocked = '';
	trackPoints = [{ x: touch.clientX, t: Date.now() }];
	dragging.value = true;
	closeOthersInGroup(props.group, self);
};

const onTouchMove = (e) => {
	if (props.disabled) return;
	const touch = e.touches[0];
	const dx = touch.clientX - startX;
	const dy = touch.clientY - startY;

	if (!directionLocked) {
		if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
		directionLocked = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
	}
	if (directionLocked === 'v') return;

	e.preventDefault && e.preventDefault();
	e.stopPropagation && e.stopPropagation();

	// 记录触摸点用于速度计算
	const now = Date.now();
	trackPoints.push({ x: touch.clientX, t: now });
	// 只保留最近的点
	trackPoints = trackPoints.filter(p => now - p.t < TRACK_DURATION * 2);

	const ratio = getPxRatio();
	let x = startOffset + dx * ratio;
	x = Math.max(-props.actionWidth, Math.min(0, x));
	offsetX.value = x;
};

const onTouchEnd = (e) => {
	dragging.value = false;
	if (directionLocked === 'v') return;

	const isOpen = startOffset < 0;
	const endX = e.changedTouches[0].clientX;
	const totalDx = endX - startX;

	// 点击行为：没有有效滑动
	if (directionLocked === '') {
		if (isOpen) close();
		return;
	}

	const velocity = getVelocity(); // px/ms，正=右滑，负=左滑

	// 核心判断：综合方向意图 + 速度 + 位置
	// 1. 快速滑动（速度优先）
	if (Math.abs(velocity) > 0.15) {
		velocity > 0 ? close() : open();
		return;
	}

	// 2. 慢速滑动：根据总位移方向决定
	//    已打开状态：任何右滑意图都关闭
	//    已关闭状态：左滑超过 25% 就打开
	if (isOpen) {
		totalDx > 0 ? close() : open();
	} else {
		offsetX.value < -props.actionWidth * 0.25 ? open() : close();
	}
};

defineExpose({ open, close, closeAll });
</script>

<style lang="scss" scoped>
.ay-swipe-cell {
	position: relative;
	overflow: hidden;

	&.has-border {
		border-bottom: 1rpx solid #f5f5f5;
	}

	&:last-child.has-border {
		border-bottom: none;
	}
}

.cell-fixed-left {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	z-index: 2;
	display: flex;
	align-items: stretch;
}

.cell-content {
	position: relative;
	z-index: 1;
	background: #fff;
	transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

	&.no-transition {
		transition: none;
	}
}

.cell-actions {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	background-color: #f2f2f2;
}
</style>
