<template>
	<view class="ay-area-chart">
		<view class="chart-body">
			<view class="y-axis">
				<text v-for="(tick, i) in yTicks" :key="i" class="y-label"
					:style="{ bottom: (tick / maxVal * 100) + '%' }">{{ formatTick(tick) }}</text>
			</view>
			<scroll-view scroll-x class="plot-scroll" :scroll-left="scrollLeft">
				<view class="plot-area" :style="{ width: plotWidth + 'rpx' }">
					<view class="plot-draw-area">
						<view v-for="(tick, i) in yTicks" :key="'g'+i" class="grid-line"
							:style="{ bottom: (tick / maxVal * 100) + '%' }"></view>
						<view class="svg-wrap">
							<!-- #ifndef MP-WEIXIN -->
							<svg :viewBox="svgViewBox" :width="svgW" :height="svgTotalH" style="display:block;">
								<defs>
									<linearGradient v-for="(_, si) in series" :key="'grad'+si"
										:id="'areaGrad'+si" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" :stop-color="colors[si]" stop-opacity="0.3" />
										<stop offset="100%" :stop-color="colors[si]" stop-opacity="0.02" />
									</linearGradient>
								</defs>
								<template v-for="(_, si) in series" :key="si">
									<path :d="areaPath(si)" :fill="'url(#areaGrad'+si+')'" />
									<polyline :points="linePoints(si)" fill="none" :stroke="colors[si]"
										stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
									<circle v-for="(p, pi) in pointCoords(si)" :key="pi"
										:cx="p.x" :cy="p.y" r="3.5" :fill="colors[si]" stroke="#fff" stroke-width="1.5" />
								</template>
							</svg>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<view v-for="(_, si) in series" :key="'mp'+si" class="mp-area-layer"
								:style="{ height: svgTotalH + 'px', width: svgW + 'px' }">
								<view v-for="(seg, segi) in lineSegments(si)" :key="segi" class="mp-line-seg" :style="seg.style"></view>
							</view>
							<!-- #endif -->
						</view>
						<view class="tap-layer">
							<view v-for="(_, ci) in categories" :key="ci" class="tap-col"
								:style="{ left: xPos(ci) + 'px', width: stepPx + 'px' }"
								@tap.stop="handleTap($event, ci)"></view>
						</view>
					</view>
					<view class="x-labels">
						<text v-for="(cat, i) in categories" :key="i" class="x-label"
							:style="{ left: xPos(i) + 'px', width: stepPx + 'px' }">{{ cat }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="legend">
			<view v-for="(s, i) in series" :key="i" class="legend-item">
				<view class="legend-dot" :style="{ backgroundColor: colors[i] }"></view>
				<text class="legend-name">{{ s.name }}</text>
			</view>
		</view>
		<!-- fixed tooltip -->
		<view v-if="activeIdx >= 0" class="tooltip-mask" @tap="activeIdx = -1">
			<view class="tooltip-box" :style="tooltipPos" @tap.stop>
				<text class="tooltip-title">{{ categories[activeIdx] }}</text>
				<view v-for="(s, si) in series" :key="si" class="tooltip-row">
					<view class="tooltip-dot" :style="{ background: colors[si] }"></view>
					<text class="tooltip-label">{{ s.name }}</text>
					<text class="tooltip-val">{{ formatNumber(s.data[activeIdx] || 0) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	categories: { type: Array, default: () => [] },
	series: { type: Array, default: () => [] },
	colors: { type: Array, default: () => ['#ff6700', '#1890ff', '#52c41a'] },
	height: { type: Number, default: 360 },
	gridCount: { type: Number, default: 4 },
	stepWidth: { type: Number, default: 90 },
});

const scrollLeft = ref(9999);
const xLabelH = 48;
const svgPad = 6;
const activeIdx = ref(-1);
const tooltipPos = ref({});

const allValues = computed(() => {
	const vals = [];
	props.series.forEach(s => s.data.forEach(v => vals.push(v)));
	return vals;
});

const niceMax = computed(() => {
	const raw = Math.max(...allValues.value, 1);
	return niceNum(raw, false);
});

const maxVal = computed(() => {
	const n = niceMax.value || 1;
	return Math.ceil(n * 1.1);
});

const yTicks = computed(() => {
	const step = niceNum(maxVal.value / props.gridCount, true);
	const ticks = [];
	for (let i = 0; i <= props.gridCount; i++) {
		const v = Math.round(step * i);
		if (v <= maxVal.value) ticks.push(v);
	}
	return ticks;
});

function niceNum(range, round) {
	const exp = Math.floor(Math.log10(range));
	const frac = range / Math.pow(10, exp);
	let nice;
	if (round) {
		if (frac < 1.5) nice = 1;
		else if (frac < 3) nice = 2;
		else if (frac < 7) nice = 5;
		else nice = 10;
	} else {
		if (frac <= 1) nice = 1;
		else if (frac <= 2) nice = 2;
		else if (frac <= 5) nice = 5;
		else nice = 10;
	}
	return nice * Math.pow(10, exp);
}

const formatTick = (v) => {
	if (v >= 10000) return (v / 10000).toFixed(1) + 'w';
	if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
	return v;
};

const formatNumber = (v) => {
	if (typeof v !== 'number') return v;
	return v.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
};

const plotWidth = computed(() => Math.max(props.categories.length * props.stepWidth, 600));
const stepPx = computed(() => props.stepWidth * 0.5);
const svgW = computed(() => plotWidth.value * 0.5);
const svgDrawH = computed(() => (props.height - xLabelH) * 0.5);
const svgTotalH = computed(() => svgDrawH.value + svgPad * 2);
const svgViewBox = computed(() => `0 0 ${svgW.value} ${svgTotalH.value}`);

const xPos = (i) => i * stepPx.value;

const pointCoords = (si) => {
	const data = props.series[si]?.data || [];
	return data.map((v, i) => ({
		x: i * stepPx.value + stepPx.value / 2,
		y: svgPad + svgDrawH.value - (v / maxVal.value) * svgDrawH.value,
	}));
};

const linePoints = (si) => pointCoords(si).map(p => `${p.x},${p.y}`).join(' ');

const areaPath = (si) => {
	const pts = pointCoords(si);
	if (pts.length === 0) return '';
	const bottom = svgPad + svgDrawH.value;
	let d = `M ${pts[0].x} ${bottom}`;
	pts.forEach(p => { d += ` L ${p.x} ${p.y}`; });
	d += ` L ${pts[pts.length - 1].x} ${bottom} Z`;
	return d;
};

const lineSegments = (si) => {
	const pts = pointCoords(si);
	const segs = [];
	for (let i = 0; i < pts.length - 1; i++) {
		const dx = pts[i + 1].x - pts[i].x;
		const dy = pts[i + 1].y - pts[i].y;
		const len = Math.sqrt(dx * dx + dy * dy);
		const angle = Math.atan2(dy, dx) * 180 / Math.PI;
		segs.push({ style: {
			position: 'absolute', left: pts[i].x + 'px', top: pts[i].y + 'px',
			width: len + 'px', height: '2px', backgroundColor: props.colors[si],
			transform: `rotate(${angle}deg)`, transformOrigin: '0 0',
		}});
	}
	return segs;
};

// 用触摸坐标定位 tooltip
const handleTap = (e, ci) => {
	if (activeIdx.value === ci) { activeIdx.value = -1; return; }
	activeIdx.value = ci;
	const touch = e.touches?.[0] || e.changedTouches?.[0] || e.detail || {};
	const screenX = touch.clientX ?? touch.pageX ?? 0;
	const screenY = touch.clientY ?? touch.pageY ?? 0;
	const sysInfo = uni.getSystemInfoSync();
	const sw = sysInfo.windowWidth;
	const sh = sysInfo.windowHeight;
	const tooltipW = 180;
	const tooltipH = 100;
	// 水平：优先居中，靠边时偏移
	let left = screenX - tooltipW / 2;
	if (left < 8) left = 8;
	if (left + tooltipW > sw - 8) left = sw - tooltipW - 8;
	// 垂直：优先在点上方，空间不够则下方
	let top = screenY - tooltipH - 16;
	if (top < 8) top = screenY + 16;
	tooltipPos.value = { left: left + 'px', top: top + 'px' };
};
</script>

<style lang="scss" scoped>
.ay-area-chart {
	width: 100%;

	.chart-body {
		display: flex;
		height: v-bind("height + 'rpx'");

		.y-axis {
			width: 70rpx;
			position: relative;
			flex-shrink: 0;
			margin-bottom: 48rpx;
			overflow: visible;

			.y-label {
				position: absolute;
				right: 12rpx;
				transform: translateY(50%);
				font-size: 20rpx;
				color: var(--text-tertiary, #999);
				line-height: 1;
				white-space: nowrap;
			}
		}

		.plot-scroll {
			flex: 1;
			overflow: hidden;

			.plot-area {
				position: relative;
				height: 100%;
				border-left: 2rpx solid var(--divider, #eee);
				display: flex;
				flex-direction: column;

				.plot-draw-area {
					position: relative;
					flex: 1;

					.grid-line {
						position: absolute;
						left: 0; right: 0;
						height: 0;
						border-top: 2rpx dashed var(--divider, #eee);
					}

					.svg-wrap {
						position: absolute;
						top: 0; left: 0; right: 0; bottom: 0;
						svg { display: block; }
						.mp-area-layer { position: absolute; top: 0; left: 0; }
					}

					.tap-layer {
						position: absolute;
						top: 0; left: 0; right: 0; bottom: 0;
						z-index: 2;
						.tap-col { position: absolute; top: 0; bottom: 0; }
					}
				}

				.x-labels {
					height: 48rpx;
					flex-shrink: 0;
					position: relative;
					.x-label {
						position: absolute;
						text-align: center;
						font-size: 20rpx;
						color: var(--text-tertiary, #999);
						line-height: 48rpx;
						margin-top: 12rpx;
					}
				}
			}
		}
	}

	.legend {
		display: flex;
		justify-content: center;
		gap: 24rpx;
		margin-top: 16rpx;
		.legend-item {
			display: flex;
			align-items: center;
			gap: 8rpx;
			.legend-dot { width: 16rpx; height: 16rpx; border-radius: 50%; }
			.legend-name { font-size: 22rpx; color: var(--text-secondary, #666); }
		}
	}

	.tooltip-mask {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		z-index: 999;

		.tooltip-box {
			position: fixed;
			background: var(--bg-card-solid, #fff);
			border-radius: 16rpx;
			padding: 16rpx 20rpx;
			box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
			border: 2rpx solid var(--divider, #eee);
			min-width: 200rpx;

			.tooltip-title {
				font-size: 24rpx;
				color: var(--text-secondary, #666);
				margin-bottom: 8rpx;
				display: block;
				font-weight: 500;
			}

			.tooltip-row {
				display: flex;
				align-items: center;
				gap: 8rpx;
				margin-top: 6rpx;

				.tooltip-dot {
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					flex-shrink: 0;
				}

				.tooltip-label {
					font-size: 22rpx;
					color: var(--text-tertiary, #999);
				}

				.tooltip-val {
					font-size: 24rpx;
					color: var(--text-primary, #333);
					font-weight: 600;
					margin-left: auto;
					padding-left: 20rpx;
				}
			}
		}
	}
}
</style>
