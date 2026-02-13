<template>
	<view v-show="show" class="ay-popup" :style="{ zIndex }" @touchmove.stop.prevent>
		<!-- 遮罩层 -->
		<view v-show="overlay" class="ay-popup__overlay" :style="overlayStyle" @click="handleOverlayClick"></view>
		<!-- 内容区 -->
		<view class="ay-popup__content" :class="[
			`ay-popup__content--${position}`,
			{ 'ay-popup__content--show': showContent },
			{ 'ay-popup__content--no-animation': !animation }
		]" :style="contentStyle" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
			<view v-if="showDragHandle && position === 'bottom'" class="ay-popup__drag-handle"></view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ay-popup",
		props: {
			// v-model 值
			modelValue: {
				type: Boolean,
				default: false
			},
			// 弹出位置
			position: {
				type: String,
				default: 'bottom',
				validator: (value) => ['top', 'bottom', 'left', 'right', 'center'].includes(value)
			},
			// 是否显示遮罩层
			overlay: {
				type: Boolean,
				default: true
			},
			// 点击遮罩是否关闭
			closeOnClickOverlay: {
				type: Boolean,
				default: true
			},
			// 是否开启动画
			animation: {
				type: Boolean,
				default: true
			},
			// 弹出层圆角
			borderRadius: {
				type: [String, Number],
				default: '24rpx'
			},
			// z-index 层级
			zIndex: {
				type: Number,
				default: 999
			},
			// 动画时长，单位毫秒
			duration: {
				type: Number,
				default: 300
			},
			// 是否开启拖拽关闭
			draggable: {
				type: Boolean,
				default: false
			},
			// 是否显示拖拽条
			showDragHandle: {
				type: Boolean,
				default: false
			},
			// 拖拽关闭的阈值
			dragThreshold: {
				type: Number,
				default: 80
			}
		},
		data() {
			return {
				show: false,
				showOverlay: false,
				showContent: false,
				isAnimating: false,
				// 拖拽相关
				isDragging: false,
				startY: 0,
				deltaY: 0,
				dragStyle: {}
			}
		},
		computed: {
			// 遮罩层样式
			overlayStyle() {
				return {
					transition: `opacity ${this.duration}ms ease-out`,
					opacity: this.showOverlay ? 1 : 0,
					backgroundColor: 'rgba(0, 0, 0, 0.5)'
				}
			},
			// 内容区样式
			contentStyle() {
				const style = {
					transition: `all ${this.isDragging ? 0 : this.duration}ms ease-out`,
					...this.dragStyle
				}
				
				// 设置圆角
				if (this.position === 'bottom') {
					style.borderRadius = `${this.borderRadius} ${this.borderRadius} 0 0`
				} else if (this.position === 'top') {
					style.borderRadius = `0 0 ${this.borderRadius} ${this.borderRadius}`
				} else if (this.position === 'center') {
					style.borderRadius = this.borderRadius
				}
				
				return style
			}
		},
		watch: {
			modelValue: {
				handler(val) {
					if (val) {
						this.open()
					} else {
						this.close()
					}
				},
				immediate: true
			}
		},
		methods: {
			// 打开弹窗
			open() {
				if (this.isAnimating) return
				this.dragStyle = {} // 强制重置拖拽状态
				this.isAnimating = true
				this.show = true
				// 使用 nextTick 确保 DOM 已更新
				this.$nextTick(() => {
					// 先显示遮罩层
					setTimeout(() => {
						this.showOverlay = true
						// 延迟显示内容，配合动画效果
						setTimeout(() => {
							this.showContent = true
							setTimeout(() => {
								this.isAnimating = false
								if (this._pendingClose) {
									this.close()
								}
							}, this.duration)
						}, 50)
					}, 0)
				})
			},
			// 关闭弹窗
			close(isDrag = false) {
				if (this.isAnimating && !isDrag) {
					// 外部直接改 v-model 时仍需关闭，标记待关闭
					this._pendingClose = true
					return
				}
				this._pendingClose = false
				
				this.isAnimating = true
				
				// 如果是拖拽关闭，直接设置transform
				if (isDrag) {
					this.dragStyle = {
						transform: `translateY(100%)`
					};
				}
				
				this.showContent = false
				// 延迟关闭遮罩层，等待内容动画结束
				setTimeout(() => {
					this.showOverlay = false
					setTimeout(() => {
						this.show = false
						this.$emit('update:modelValue', false)
						this.isAnimating = false
					}, this.duration - 100)
				}, this.duration - 100)
			},
			// 点击遮罩层
			handleOverlayClick() {
				if (this.closeOnClickOverlay) {
					this.close()
				}
			},
			// 拖拽手势
			handleTouchStart(e) {
				if (!this.draggable || this.position !== 'bottom') return;
				this.startY = e.touches[0].clientY;
				this.isDragging = true;
			},
			handleTouchMove(e) {
				if (!this.isDragging) return;
				const currentY = e.touches[0].clientY;
				this.deltaY = currentY - this.startY;
				
				// 向上拖拽时增加阻尼感
				let dragOffset = this.deltaY;
				if (this.deltaY < 0) {
					dragOffset = this.deltaY / 3;
				}

				this.dragStyle = {
					transform: `translateY(${dragOffset}px)`
				};
			},
			handleTouchEnd() {
				if (!this.isDragging) return;
				
				// 如果拖拽距离超过阈值，则关闭
				if (this.deltaY > this.dragThreshold) {
					this.close(true);
				} else {
					// 否则，弹回原位
					this.dragStyle = {
						transform: `translateY(0)`
					};
					uni.vibrateShort();
				}
				
				// 重置状态
				this.isDragging = false;
				this.startY = 0;
				this.deltaY = 0;
			}
		}
	}
</script>

<style lang="scss">
	.ay-popup {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;

		&__overlay {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
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

			// 无动画样式
			&--no-animation {
				transition: none !important;
			}

			// 顶部弹出
			&--top {
				top: 0;
				left: 0;
				width: 100%;
				transform: translateY(-100%);

				&.ay-popup__content--show {
					transform: translateY(0);
				}
			}

			// 底部弹出
			&--bottom {
				bottom: 0;
				left: 0;
				width: 100%;
				transform: translateY(100%);

				&.ay-popup__content--show {
					transform: translateY(0);
				}
			}

			// 左侧弹出
			&--left {
				top: 0;
				left: 0;
				height: 100%;
				transform: translateX(-100%);

				&.ay-popup__content--show {
					transform: translateX(0);
				}
			}

			// 右侧弹出
			&--right {
				top: 0;
				right: 0;
				height: 100%;
				transform: translateX(100%);

				&.ay-popup__content--show {
					transform: translateX(0);
				}
			}

			// 中间弹出
			&--center {
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%) scale(0.8);
				opacity: 0;

				&.ay-popup__content--show {
					transform: translate(-50%, -50%) scale(1);
					opacity: 1;
				}
			}
		}
	}
</style> 