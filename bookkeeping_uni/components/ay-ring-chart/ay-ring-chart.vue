<template>
	<view class="ay-ring-chart">
		<view class="ring-wrap" :style="{ width: size + 'rpx', height: size + 'rpx' }">
			<!-- 饼块用 conic-gradient -->
			<view class="ring-outer" :style="outerStyle"></view>
			<!-- 中心圆 -->
			<view class="ring-center" :style="centerStyle">
				<text class="center-amount">¥{{ formatNum(total) }}</text>
				<text class="center-label">总计</text>
			</view>
		</view>
		<!-- 图例 -->
		<view class="ring-legend">
			<view class="legend-item" v-for="(item, i) in series" :key="i">
				<view class="legend-dot" :style="{ backgroundColor: item.color }"></view>
				<text class="legend-name">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	series: { type: Array, default: () => [] },
	total: { type: Number, default: 0 },
	size: { type: Number, default: 360 },
	ringWidth: { type: Number, default: 60 },
});

const formatNum = (n) => parseFloat(n || 0).toFixed(2);

const outerStyle = computed(() => {
	if (!props.series.length || props.total <= 0) {
		return { background: 'var(--divider, #eee)' };
	}
	const segments = [];
	let acc = 0;
	props.series.forEach((item) => {
		const pct = (item.data / props.total) * 100;
		segments.push(`${item.color} ${acc}% ${acc + pct}%`);
		acc += pct;
	});
	return {
		background: `conic-gradient(${segments.join(', ')})`,
		borderRadius: '50%',
	};
});

const centerStyle = computed(() => {
	const inner = props.size - props.ringWidth * 2;
	return {
		width: inner + 'rpx',
		height: inner + 'rpx',
	};
});
</script>

<style lang="scss" scoped>
.ay-ring-chart {
	display: flex;
	flex-direction: column;
	align-items: center;

	.ring-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		.ring-outer {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}

		.ring-center {
			position: relative;
			border-radius: 50%;
			background: var(--bg-card-solid, #fff);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			z-index: 1;

			.center-amount {
				font-size: 30rpx;
				font-weight: bold;
				color: var(--text-primary, #333);
				line-height: 1.2;
			}

			.center-label {
				font-size: 22rpx;
				color: var(--text-tertiary, #999);
				margin-top: 4rpx;
			}
		}
	}

	.ring-legend {
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
			}

			.legend-name {
				font-size: 24rpx;
				color: var(--text-secondary, #666);
			}
		}
	}
}
</style>
