<template>
	<view v-show="show" class="ay-popup" :style="{ zIndex }" @touchmove.stop.prevent>
		<view v-show="overlay" class="ay-popup__overlay" :style="overlayStyle" @click="handleOverlayClick"></view>
		<view class="ay-popup__content" :class="[
			`ay-popup__content--${position}`,
			{ 'ay-popup__content--no-animation': !animation }
		]" :style="contentStyle" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
			<view v-if="showDragHandle && position === 'bottom'" class="ay-popup__drag-handle"></view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	// transform 全部由内联 style 驱动，避免 class 切换在小程序端 transition 不生效
	const TRANSFORM_MAP = {
		top:    { hide: 'translateY(-100%)', show: 'translateY(0)' },
		bottom: { hide: 'translateY(100%)',  show: 'translateY(0)' },
		left:   { hide: 'translateX(-100%)', show: 'translateX(0)' },
		right:  { hide: 'translateX(100%)',  show: 'translateX(0)' },
		center: { hide: 'translate(-50%, -50%) scale(0.8)', show: 'translate(-50%, -50%) scale(1)' }
	}

	export default {
		name: "ay-popup",
		props: {
			modelValue:          { type: Boolean, default: false },
			position:            { type: String,  default: 'bottom', validator: v => ['top','bottom','left','right','center'].includes(v) },
			overlay:             { type: Boolean, default: true },
			closeOnClickOverlay: { type: Boolean, default: true },
			animation:           { type: Boolean, default: true },
			borderRadius:        { type: [String, Number], default: '24rpx' },
			zIndex:              { type: Number,  default: 999 },
			duration:            { type: Number,  default: 300 },
			draggable:           { type: Boolean, default: false },
			showDragHandle:      { type: Boolean, default: false },
			dragThreshold:       { type: Number,  default: 80 }
		},
		data() {
			return {
				show: false,
				showOverlay: false,
				showContent: false,
				isDragging: false,
				startY: 0,
				deltaY: 0,
				dragOffset: null
			}
		},
		computed: {
			overlayStyle() {
				return {
					transition: `opacity ${this.duration}ms ease-out`,
					opacity: this.showOverlay ? 1 : 0,
					backgroundColor: 'rgba(0, 0, 0, 0.5)'
				}
			},
			contentStyle() {
				const pos = this.position
				const tf = TRANSFORM_MAP[pos] || TRANSFORM_MAP.bottom
				const style = {
					transition: this.isDragging ? 'none' : `transform ${this.duration}ms ease-out, opacity ${this.duration}ms ease-out`
				}

				// 拖拽中由 dragOffset 控制
				if (this.dragOffset !== null) {
					style.transform = `translateY(${this.dragOffset}px)`
				} else {
					style.transform = this.showContent ? tf.show : tf.hide
				}

				if (pos === 'center') {
					style.opacity = this.showContent ? 1 : 0
				}

				if (pos === 'bottom') {
					style.borderRadius = `${this.borderRadius} ${this.borderRadius} 0 0`
				} else if (pos === 'top') {
					style.borderRadius = `0 0 ${this.borderRadius} ${this.borderRadius}`
				} else if (pos === 'center') {
					style.borderRadius = this.borderRadius
				}

				return style
			}
		},
		watch: {
			modelValue: {
				handler(val) {
					val ? this.open() : this.close()
				},
				immediate: true
			}
		},
		methods: {
			_clearTimers() {
				(this._timers || []).forEach(t => clearTimeout(t))
				this._timers = []
			},
			open() {
				this._clearTimers()
				this._closing = false
				this.dragOffset = null
				this.show = true
				this.showOverlay = true
				this.$nextTick(() => {
					setTimeout(() => {
						if (this._closing) return
						this.showContent = true
					}, 30)
				})
			},
			close(isDrag = false) {
				this._clearTimers()
				this._closing = true

				if (!this.showContent && !this.show) {
					this.$emit('update:modelValue', false)
					return
				}
				if (!this.showContent) {
					this.showOverlay = false
					this.show = false
					this.$emit('update:modelValue', false)
					return
				}

				if (isDrag) {
					// 拖拽关闭：先切回 transition 模式再滑出
					this.dragOffset = null
				}

				this.showContent = false
				this.showOverlay = false
				const t = setTimeout(() => {
					this.show = false
					this.dragOffset = null
					this.$emit('update:modelValue', false)
				}, this.duration + 50)
				this._timers.push(t)
			},
			handleOverlayClick() {
				if (this.closeOnClickOverlay) this.close()
			},
			handleTouchStart(e) {
				if (!this.draggable || this.position !== 'bottom') return
				this.startY = e.touches[0].clientY
				this.isDragging = true
			},
			handleTouchMove(e) {
				if (!this.isDragging) return
				const dy = e.touches[0].clientY - this.startY
				this.deltaY = dy
				this.dragOffset = dy < 0 ? dy / 3 : dy
			},
			handleTouchEnd() {
				if (!this.isDragging) return
				this.isDragging = false
				if (this.deltaY > this.dragThreshold) {
					this.close(true)
				} else {
					this.dragOffset = null
				}
				this.startY = 0
				this.deltaY = 0
			}
		}
	}
</script>

<style lang="scss">
	.ay-popup {
		position: fixed;
		top: 0; right: 0; bottom: 0; left: 0;

		&__overlay {
			position: absolute;
			top: 0; right: 0; bottom: 0; left: 0;
		}

		&__drag-handle {
			width: 80rpx;
			height: 8rpx;
			background-color: #dcdcdc;
			border-radius: 4rpx;
			margin: 16rpx auto;
		}

		&__content {
			position: absolute;
			background-color: #fff;
			overflow: hidden;

			&--no-animation { transition: none !important; }
			&--top    { top: 0; left: 0; width: 100%; }
			&--bottom { bottom: 0; left: 0; width: 100%; }
			&--left   { top: 0; left: 0; height: 100%; }
			&--right  { top: 0; right: 0; height: 100%; }
			&--center { top: 50%; left: 50%; }
		}
	}
</style>
