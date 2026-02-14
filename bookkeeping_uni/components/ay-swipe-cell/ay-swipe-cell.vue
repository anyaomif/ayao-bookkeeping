<template>
	<view class="ay-swipe-cell" :class="{ 'has-border': border }">
		<view v-if="fixedLeft && $slots.left" class="cell-fixed-left">
			<slot name="left"></slot>
		</view>
		<view class="cell-content" :class="{ 'no-transition': dragging }"
			:style="{ transform: `translateX(${offsetX}rpx)` }"
			@touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
			<slot></slot>
		</view>
		<view class="cell-actions" :style="{ width: `${actionWidth}rpx` }">
			<slot name="actions"></slot>
		</view>
	</view>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

// 同组互斥：同一 group 内只允许一个打开
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
let startX = 0, startY = 0, locked = false;

const THRESHOLD = 0.5;

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

const onTouchStart = (e) => {
	if (props.disabled) return;
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
	locked = false;
	dragging.value = true;
	closeOthersInGroup(props.group, self);
};

const onTouchMove = (e) => {
	if (props.disabled || locked) return;
	const dx = e.touches[0].clientX - startX;
	const dy = e.touches[0].clientY - startY;
	if (Math.abs(dy) > Math.abs(dx)) { locked = true; return; }
	let x = offsetX.value + dx * 2;
	if (x > 0) x = 0;
	if (x < -props.actionWidth) x = -props.actionWidth;
	offsetX.value = x;
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
};

const onTouchEnd = () => {
	dragging.value = false;
	if (locked) return;
	offsetX.value < -props.actionWidth * THRESHOLD ? open() : close();
};

defineExpose({ open, close, closeAll });
</script>

<style lang="scss" scoped>
.ay-swipe-cell {
	position: relative;
	overflow: hidden;
	&.has-border { border-bottom: 1rpx solid #f5f5f5; }
	&:last-child.has-border { border-bottom: none; }
}
.cell-fixed-left {
	position: absolute; left: 0; top: 0; bottom: 0; z-index: 2;
	display: flex; align-items: center;
}
.cell-content {
	position: relative; z-index: 1; background: #fff;
	transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	&.no-transition { transition: none; }
}
.cell-actions {
	position: absolute; right: 0; top: 0; bottom: 0; z-index: 0;
	display: flex; align-items: center; justify-content: center; gap: 20rpx;
	background-color: #f2f2f2;
}
</style>
