<template>
	<view class="sliding-panel-container" @touchstart.stop="handleTouchStart" @touchmove.stop="handleTouchMove"
		@touchend.stop="handleTouchEnd">
		<view class="sliding-panel" :style="panelStyles" ref="panelRef">
			<view class="content-wrapper" ref="contentRef">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ay-slidingPanel',
		props: {
			minHeightRatio: {
				type: Number,
				default: 0.2
			},
			customMinHeight: {
				type: Number,
				default: null
			},
			threshold: {
				type: Number,
				default: 75
			},
			animationDuration: {
				type: Number,
				default: 900
			},
			updateDelay: {
				type: Number,
				default: 100
			},
			observeInterval: {
				type: Number,
				default: 200
			}
		},
		data() {
			return {
				currentHeight: 0,
				isAnimating: false,
				startY: 0,
				startX: 0,
				totalDistance: 0,
				isVerticalMove: false,
				isMoveStarted: false,
				contentHeight: 0,
				windowHeight: 0,
				intersectionObserver: null,
				heightObserverTimer: null,
				lastContentHeight: 0,
				updateTimer: null,
				updateAttempts: 0,
				maxAttempts: 10
			}
		},
		computed: {
			minHeight() {
				if (this.customMinHeight !== null) {
					return this.customMinHeight
				}
				return this.contentHeight * this.minHeightRatio
			},
			maxHeight() {
				return this.contentHeight
			},
			panelStyles() {
				return {
					height: `${this.currentHeight}vh`,
					transition: this.isAnimating ?
						`height ${this.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1)` : 'none'
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.initializeHeightDetection()
				this.startHeightObserver()
			})
		},
		beforeUnmount() {
			this.cleanup()
		},
		methods: {
			initializeHeightDetection() {
				this.updateAttempts = 0
				this.attemptUpdateHeight()
			},
			cleanup() {
				if (this.intersectionObserver) {
					this.intersectionObserver.disconnect()
				}
				if (this.heightObserverTimer) {
					clearInterval(this.heightObserverTimer)
				}
				if (this.updateTimer) {
					clearTimeout(this.updateTimer)
				}
			},
			startHeightObserver() {
				// 使用定时器定期检查内容高度
				this.heightObserverTimer = setInterval(() => {
					this.checkContentHeight()
				}, this.observeInterval)
			},
			checkContentHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.content-wrapper').boundingClientRect(data => {
					if (data && data.height > 0 && data.height !== this.lastContentHeight) {
						this.lastContentHeight = data.height
						this.updateContentHeight()
					}
				}).exec()
			},
			attemptUpdateHeight() {
				this.updateContentHeight((success) => {
					if (!success && this.updateAttempts < this.maxAttempts) {
						this.updateAttempts++
						this.updateTimer = setTimeout(() => {
							this.attemptUpdateHeight()
						}, this.updateDelay)
					} else if (success) {
						this.setupIntersectionObserver()
					}
				})
			},
			updateContentHeight(callback) {
				const query = uni.createSelectorQuery().in(this)
				query.select('.content-wrapper').boundingClientRect(data => {
					console.log(data);
					if (data && data.height > 0) {
						const systemInfo = uni.getSystemInfoSync()
						this.windowHeight = systemInfo.screenHeight
						const contentVh = (data.height / (this.windowHeight-94)) * 100
						this.contentHeight = contentVh

						// 确保当前高度在有效范围内
						if (this.currentHeight < this.minHeight || this.currentHeight > this.maxHeight) {
							this.currentHeight = this.maxHeight
						}

						callback && callback(true)
					} else {
						callback && callback(false)
					}
				}).exec()
			},
			setupIntersectionObserver() {
				if (this.intersectionObserver) {
					this.intersectionObserver.disconnect()
				}

				this.intersectionObserver = uni.createIntersectionObserver(this, {
					observeAll: true
				})

				this.intersectionObserver.relativeTo('.content-wrapper').observe('.content-wrapper', (res) => {
					if (res.intersectionRatio > 0) {
						this.updateContentHeight()
					}
				})
			},
			handleTouchStart(event) {
				this.startY = event.touches[0].clientY
				this.startX = event.touches[0].clientX
				this.totalDistance = 0
				this.isAnimating = false
				this.isVerticalMove = false
				this.isMoveStarted = false
			},
			handleTouchMove(event) {
				const currentY = event.touches[0].clientY
				const currentX = event.touches[0].clientX
				const deltaY = currentY - this.startY
				const deltaX = currentX - this.startX

				if (!this.isMoveStarted) {
					if (Math.abs(deltaY) > Math.abs(deltaX)) {
						this.isVerticalMove = true
					}
					this.isMoveStarted = true
				}

				if (this.isVerticalMove) {
					this.totalDistance = Math.abs(deltaY)
					const isExpanding = deltaY > 0
					if (this.totalDistance < this.threshold) {
						const newHeight = isExpanding ?
							this.minHeight + ((this.totalDistance / this.threshold) * (this.maxHeight - this.minHeight) * 0.5) :
							this.maxHeight - ((this.totalDistance / this.threshold) * (this.maxHeight - this.minHeight) * 0.5)
						this.currentHeight = Math.max(this.minHeight, Math.min(this.maxHeight, newHeight))
					}
				}
			},
			handleTouchEnd(event) {
				if (this.isVerticalMove) {
					this.isAnimating = true
					const finalY = event.changedTouches[0].clientY
					const isExpanding = finalY > this.startY
					if (this.totalDistance > this.threshold) {
						this.currentHeight = isExpanding ? this.maxHeight : this.minHeight
					} else {
						this.currentHeight = isExpanding ? this.minHeight : this.maxHeight
					}

					setTimeout(() => {
						this.isAnimating = false
						this.totalDistance = 0
					}, this.animationDuration)
				}
			}
		}
	}
</script>

<style scoped>
	.sliding-panel-container {
		width: 100%;
		touch-action: none;
	}

	.sliding-panel {
		width: 100%;
		will-change: height;
		overflow: hidden;
	}

	.content-wrapper {
		width: 100%;
	}
</style>