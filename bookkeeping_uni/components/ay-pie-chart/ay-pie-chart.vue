<template>
	<view class="ay-pie-chart">
		<view class="pie-wrap" :style="{ width: size + 'rpx', height: size + 'rpx' }">
			<view class="pie-outer" :style="outerStyle"></view>
			<!-- 标签 -->
			<view v-for="(item, i) in labelPositions" :key="i" class="pie-label"
				:style="{ top: item.top, left: item.left, transform: item.transform }">
				<text class="pie-label-text">{{ item.name }}</text>
				<text class="pie-label-value">{{ item.percent }}%</text>
			</view>
		</view>
		<view class="pie-legend">
			<view class="legend-item" v-for="(item, i) in series" :key="i">
				<view class="legend-dot" :style="{ backgroundColor: item.color || colors[i % colors.length] }"></view>
				<text class="legend-name">{{ item.name }}</text>
				<text class="legend-val">{{ item.value }}</text>
				<text class="legend-pct">{{ total > 0 ? ((item.value / total) * 100).toFixed(1) : 0 }}%</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	series: { type: Array, default: () => [] },
	size: { type: Number, default: 360 },
	colors: { type: Array, default: () => ['#ff6700', '#1890ff', '#52c41a', '#ff9f0a', '#af52de'] },
});

const total = computed(() => props.series.reduce((s, item) => s + (item.value || 0), 0));

const outerStyle = computed(() => {
	if (!props.series.length || total.value <= 0) {
		return { background: 'var(--divider, #eee)', borderRadius: '50%' };
	}
	const segments = [];
	let acc = 0;
	props.series.forEach((item, i) => {
		const pct = (item.value / total.value) * 100;
		const color = item.color || props.colors[i % props.colors.length];
		segments.push(`${color} ${acc}% ${acc + pct}%`);
		acc += pct;
	});
	return { background: `conic-gradient(${segments.join(', ')})`, borderRadius: '50%' };
});

const labelPositions = computed(() => {
	if (!props.series.length || total.value <= 0) return [];
	const items = props.series.filter(item => item.value > 0);
	if (items.length === 1) {
		return [{
			name: items[0].name,
			percent: '100.0',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		}];
	}
	let acc = 0;
	return items.map((item) => {
		const pct = (item.value / total.value) * 100;
		const midAngle = acc + pct / 2;
		acc += pct;
		// 小扇区不在图上显示标签，避免溢出
		if (pct < 10) return null;
		const rad = (midAngle / 100) * 2 * Math.PI - Math.PI / 2;
		const r = pct < 25 ? 42 : 35;
		const x = 50 + r * Math.cos(rad);
		const y = 50 + r * Math.sin(rad);
		return {
			name: item.name,
			percent: pct.toFixed(1),
			top: y + '%',
			left: x + '%',
			transform: 'translate(-50%, -50%)',
		};
	}).filter(Boolean);
});
</script>

<style lang="scss" scoped>
.ay-pie-chart {
	display: flex;
	flex-direction: column;
	align-items: center;

	.pie-wrap {
		position: relative;
		overflow: visible;
		margin: 30rpx 0;

		.pie-outer {
			width: 100%;
			height: 100%;
		}

		.pie-label {
			position: absolute;
			display: flex;
			flex-direction: column;
			align-items: center;
			pointer-events: none;

			.pie-label-text {
				font-size: 22rpx;
				color: #fff;
				font-weight: 600;
				text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4);
			}

			.pie-label-value {
				font-size: 20rpx;
				color: rgba(255, 255, 255, 0.9);
				text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4);
			}
		}
	}

	.pie-legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 24rpx;
		margin-top: 24rpx;

		.legend-item {
			display: flex;
			align-items: center;
			gap: 8rpx;

			.legend-dot {
				width: 16rpx;
				height: 16rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.legend-name {
				font-size: 22rpx;
				color: var(--text-secondary, #666);
			}

			.legend-val {
				font-size: 22rpx;
				color: var(--text-tertiary, #999);
			}

			.legend-pct {
				font-size: 20rpx;
				color: var(--text-tertiary, #999);
			}
		}
	}
}
</style>
