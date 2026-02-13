<template>
	<view class="ay-tabs" :style="{ height: height, backgroundColor: bgColor }">
		<scroll-view scroll-x class="ay-tabs__scroll" :scroll-left="scrollLeft" scroll-with-animation>
			<view class="ay-tabs__wrapper" :style="wrapperStyle">
				<view v-for="(item, index) in list" :key="index" class="ay-tabs__item"
					:class="{ 'ay-tabs__item--active': currentValue === index }" :style="itemStyle(index)"
					@click="handleClick(index)">
					<text class="ay-tabs__text">{{ item.title || item.name || item }}</text>
				</view>
				<!-- 滑块 -->
				<view class="ay-tabs__bar" :style="barStyle"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'ay-tabs',
		props: {
			// v-model 值
			modelValue: {
				type: [Number, String],
				default: 0
			},
			// 标签页数据
			list: {
				type: Array,
				default: () => []
			},
			// 组件高度
			height: {
				type: String,
				default: '80rpx'
			},
			// 滑块宽度
			barWidth: {
				type: String,
				default: '40rpx'
			},
			// 滑块颜色
			barColor: {
				type: String,
				default: '#ff6700'
			},
			// 默认文字颜色
			color: {
				type: String,
				default: '#666666'
			},
			// 选中文字颜色
			activeColor: {
				type: String,
				default: '#ff6700'
			},
			// 文字大小
			fontSize: {
				type: String,
				default: '28rpx'
			},
			// 是否固定宽度
			fixed: {
				type: Boolean,
				default: false
			},
			// 固定宽度时每个 tab 的宽度
			itemWidth: {
				type: String,
				default: '25%'
			},
			// 是否开启动画
			animation: {
				type: Boolean,
				default: true
			},
			// 滑块高度
			barHeight: {
				type: String,
				default: '6rpx'
			},
			// 底部边框颜色
			borderColor: {
				type: String,
				default: '#f5f5f5'
			},
			// 是否显示底部边框
			border: {
				type: Boolean,
				default: true
			},
			// 字体粗细
			fontWeight: {
				type: [Number, String],
				default: 400
			},
			// 选中字体粗细
			activeFontWeight: {
				type: [Number, String],
				default: 500
			},
			// 是否允许滚动
			scrollable: {
				type: Boolean,
				default: true
			},
			// 背景颜色
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			// 标签项排列方式
			justify: {
				type: String,
				default: 'start',
				validator: (value) => ['start', 'center', 'space-between', 'space-around'].includes(value)
			}
		},
		data() {
			return {
				currentValue: this.modelValue,
				scrollLeft: 0,
				tabsRect: null,
				tabRects: [],
				isMoving: false
			}
		},
		computed: {
			// 容器样式
			wrapperStyle() {
				const style = {
					borderBottom: this.border ? `2rpx solid ${this.borderColor}` : 'none',
					justifyContent: this.justify
				}
				if (!this.scrollable) {
					style.display = 'flex'
					style.width = '100%'
				}
				return style
			},
			// 滑块样式
			barStyle() {
				if (!this.tabRects[this.currentValue]) return {}
				const rect = this.tabRects[this.currentValue]
				return {
					width: this.barWidth,
					height: this.barHeight,
					background: this.barColor,
					transform: `translateX(${rect.left + rect.width / 2}px) translateX(-50%)`,
					transition: this.animation ? 'transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)' : 'none',
					borderRadius: `${parseInt(this.barHeight) / 2}rpx`,
					bottom: '4rpx'
				}
			}
		},
		watch: {
			modelValue: {
				handler(val) {
					this.currentValue = val
					this.updateTabPosition()
				},
				immediate: true
			},
			list: {
				handler() {
					this.$nextTick(() => {
						this.init()
					})
				},
				immediate: true
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			// 初始化
			async init() {
				await this.$nextTick()
				this.getTabsRect()
			},
			// 获取标签栏尺寸
			getTabsRect() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.ay-tabs__wrapper').boundingClientRect((rect) => {
					this.tabsRect = rect
					this.getTabRects()
				}).exec()
			},
			// 获取所有标签尺寸
			getTabRects() {
				const query = uni.createSelectorQuery().in(this)
				query.selectAll('.ay-tabs__item').boundingClientRect((rects) => {
					// 计算每个标签相对于tabs容器的位置
					this.tabRects = rects.map(rect => ({
						...rect,
						left: rect.left - this.tabsRect.left
					}))
					this.updateTabPosition()
				}).exec()
			},
			// 更新标签位置
			updateTabPosition() {
				if (!this.tabRects[this.currentValue]) return
				const rect = this.tabRects[this.currentValue]
				if (this.scrollable) {
					const scrollLeft = rect.left - (this.tabsRect.width - rect.width) / 2
					this.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft
				}
			},
			// 标签样式
			itemStyle(index) {
				return {
					color: this.currentValue === index ? this.activeColor : this.color,
					fontSize: this.fontSize,
					fontWeight: this.currentValue === index ? 'bold' : this.fontWeight,
					flex: this.fixed ? '0 0 ' + this.itemWidth : '0 0 auto',
					padding: this.fixed ? '0' : '0 30rpx'
				}
			},
			// 点击标签
			handleClick(index) {
				if (this.currentValue !== index) {
					this.currentValue = index
					this.$emit('update:modelValue', index)
					this.$emit('change', index)
				}
			}
		}
	}
</script>

<style lang="scss">
	.ay-tabs {
		width: 100%;
		position: relative;
		overflow: hidden;
		background-color: #fff;
		border-radius: 12rpx;

		&__scroll {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}

		&__wrapper {
			position: relative;
			display: inline-flex;
			align-items: center;
			height: 100%;
			min-width: 100%;
			white-space: nowrap;
			box-sizing: border-box;
			padding: 0 20rpx;
		}

		&__item {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			cursor: pointer;

			&:active {
				opacity: 0.7;
			}

			&--active {
				font-weight: bold;
			}
		}

		&__text {
			text-align: center;
			white-space: nowrap;
			position: relative;
		}

		&__bar {
			position: absolute;
			left: 0;
			pointer-events: none;
			will-change: transform;
		}
	}
</style> 