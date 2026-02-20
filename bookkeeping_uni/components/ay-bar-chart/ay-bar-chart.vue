<template>
	<view class="ay-bar-chart">
		<view class="chart-body">
			<view class="y-axis">
				<text v-for="(tick, i) in yTicks" :key="i" class="y-label" :style="{ bottom: (tick / maxVal * 100) + '%' }">
					{{ formatTick(tick) }}
				</text>
			</view>
			<view class="plot-area">
				<view v-for="(tick, i) in yTicks" :key="'g'+i" class="grid-line"
					:style="{ bottom: (tick / maxVal * 100) + '%' }"></view>
				<view class="bars-row">
					<view v-for="(val, i) in values" :key="i" class="bar-col" @tap="onTap(i)">
						<view class="bar" :class="{ 'bar--active': activeIndex === i }"
							:style="{ height: barHeight(val), transitionDelay: (i * 50) + 'ms' }">
							<view v-if="activeIndex === i && val > 0" class="bar-tooltip">
								<text>¥{{ formatNum(val) }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- X 轴标签独立一行 -->
		<view class="x-axis">
			<view class="x-axis-spacer"></view>
			<view class="x-labels">
				<text v-for="(cat, i) in categories" :key="i" class="x-label">{{ cat }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
	categories: { type: Array, default: () => [] },
	values: { type: Array, default: () => [] },
	barColor: { type: String, default: '#ff6700' },
	gridCount: { type: Number, default: 4 },
});

const activeIndex = ref(-1);
const onTap = (i) => { activeIndex.value = activeIndex.value === i ? -1 : i; };
const formatNum = (n) => parseFloat(n || 0).toFixed(2);

const maxVal = computed(() => {
	const max = Math.max(...props.values, 1);
	const mag = Math.pow(10, Math.floor(Math.log10(max)));
	return Math.ceil(max / mag) * mag || 1;
});

const yTicks = computed(() => {
	const ticks = [];
	for (let i = 0; i <= props.gridCount; i++) {
		ticks.push(Math.round(maxVal.value / props.gridCount * i));
	}
	return ticks;
});

const formatTick = (v) => {
	if (v >= 10000) return (v / 10000).toFixed(1) + 'w';
	if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
	return v;
};

const barHeight = (val) => {
	if (!val || maxVal.value <= 0) return '0%';
	return Math.max((val / maxVal.value) * 100, 2) + '%';
};
</script>

<style lang="scss" scoped>
.ay-bar-chart {
	width: 100%;
	padding: 20rpx 0;

	.chart-body {
		display: flex;
		height: 360rpx;

		.y-axis {
			width: 70rpx;
			position: relative;
			flex-shrink: 0;

			.y-label {
				position: absolute;
				right: 12rpx;
				transform: translateY(50%);
				font-size: 20rpx;
				color: var(--text-tertiary, #999);
				line-height: 1;
			}
		}

		.plot-area {
			flex: 1;
			position: relative;
			border-left: 2rpx solid var(--divider, #eee);

			.grid-line {
				position: absolute;
				left: 0;
				right: 0;
				height: 0;
				border-top: 2rpx dashed var(--divider, #eee);
			}

			.bars-row {
				display: flex;
				align-items: flex-end;
				height: 100%;
				padding: 0 8rpx;

				.bar-col {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: flex-end;
					height: 100%;

					.bar {
						width: 60%;
						max-width: 48rpx;
						min-width: 16rpx;
						border-radius: 8rpx 8rpx 0 0;
						background: linear-gradient(180deg, #ff6700, #ff9f0a);
						transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
						position: relative;

						&--active {
							background: linear-gradient(180deg, #ff5500, #ff6700);
							box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.35);
							transform: scaleX(1.1);
						}

						.bar-tooltip {
							position: absolute;
							top: -56rpx;
							left: 50%;
							transform: translateX(-50%);
							background: var(--bg-card-solid, #fff);
							border: 2rpx solid var(--divider, #eee);
							border-radius: 12rpx;
							padding: 6rpx 14rpx;
							white-space: nowrap;
							box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);

							text {
								font-size: 20rpx;
								color: #ff6700;
								font-weight: bold;
							}

							&::after {
								content: '';
								position: absolute;
								bottom: -8rpx;
								left: 50%;
								transform: translateX(-50%) rotate(45deg);
								width: 12rpx;
								height: 12rpx;
								background: var(--bg-card-solid, #fff);
								border-right: 2rpx solid var(--divider, #eee);
								border-bottom: 2rpx solid var(--divider, #eee);
							}
						}
					}
				}
			}
		}
	}

	.x-axis {
		display: flex;

		.x-axis-spacer {
			width: 70rpx;
			flex-shrink: 0;
		}

		.x-labels {
			flex: 1;
			display: flex;
			padding: 0 8rpx;

			.x-label {
				flex: 1;
				text-align: center;
				font-size: 20rpx;
				color: var(--text-tertiary, #999);
				margin-top: 16rpx;
				line-height: 1;
			}
		}
	}
}
</style>
