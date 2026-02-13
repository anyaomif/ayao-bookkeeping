<template>
	<view class="ay-swiper-wrap">
		<swiper class="ay-swiper" :autoplay="autoPlay" :interval="interval" :duration="duration" :circular="circular"
			:style="swiperStyle" :current="current" @change="changeSwiper">
			<slot></slot>
		</swiper>

		<view class="ay-swiper-indicator" v-if="indicator && mode=='dot'">
			<view class="ay-indicator-item-dot" :style="{
					background: x === currentIndex ? indicatorActiveColor : indicatorColor
				}" v-for="(i,x) in 2" :key="x"></view>
		</view>
		<view class="ay-swiper-indicator" v-if="indicator && mode=='round'">
			<view class="ay-indicator-item-round" :class="x == currentIndex ? 'ay-indicator-item-round-active' : ''" :style="{
					background: x === currentIndex ? indicatorActiveColor : indicatorColor
				}" v-for="(i,x) in 2" :key="x"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ay-swiper",
		props: {
			autoHight: {
				type: Boolean,
				default: false
			},
			autoPlay: {
				type: Boolean,
				default: false
			},
			interval: {
				type: Number,
				default: 3000
			},
			duration: {
				type: Number,
				default: 500
			},
			circular: {
				type: Boolean,
				default: false
			},
			mode: {
				type: String,
				default: 'dot'
			},
			indicator: {
				type: Boolean,
				default: true
			},
			indicatorColor: {
				type: String,
				default: 'rgba(0, 0, 0, 0.2)'
			},
			indicatorActiveColor: {
				type: String,
				default: 'rgba(0, 0, 0, 0.8)'
			},
			current: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				currentIndex: this.current,
				swiperHeight: 0,
				indicatorLength: 0
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getSwiperHeight()
			})
		},
		computed: {
			swiperStyle() {
				return this.autoHight ? `height:${this.swiperHeight}px;` : ''
			}
		},
		methods: {
			getSwiperHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.selectAll('.ay-swiper-item').boundingClientRect(data => {
					this.indicatorLength = data.length
					this.swiperHeight = data[this.currentIndex]?.height || 100
				}).exec()
			},
			changeSwiper(e) {
				let current = e.detail.current
				this.currentIndex = current
				this.getSwiperHeight()
				this.$emit("change", current)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ay-swiper-wrap {
		position: relative;

		.ay-swiper {
			transition: height 0.3s ease;
		}
	}

	.ay-swiper-indicator {
		position: absolute;
		bottom: 12rpx;
		height: 20rpx;
		width: 100%;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;

		.ay-indicator-item-dot {
			width: 14rpx;
			height: 14rpx;
			margin: 0 6rpx;
			border-radius: 20rpx;
			transition: all 0.5s;
		}

		.ay-indicator-item-round {
			width: 14rpx;
			height: 14rpx;
			margin: 0 6rpx;
			border-radius: 20rpx;
			transition: all 0.5s;
			background-color: rgba(0, 0, 0, 0.2);
		}

		.ay-indicator-item-round-active {
			width: 34rpx;
		}
	}
</style>