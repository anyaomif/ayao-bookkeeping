<template>
	<button class="ay-button" :class="[
      `ay-button--${type}`,
      {
        'is-plain': plain,
        'is-round': round,
        'is-disabled': disabled,
        'is-loading': loading,
				'is-block': block
      }
    ]" :style="buttonStyle" :disabled="disabled || loading" @click="handleClick">
		<i v-if="loading" class="ay-icon-loading"></i>
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: "ay-button",
		props: {
			// 按钮类型：primary, success, warning, danger, info
			type: {
				type: String,
				default: 'default'
			},
			// 是否为镂空按钮
			plain: {
				type: Boolean,
				default: false
			},
			// 是否为圆角按钮
			round: {
				type: Boolean,
				default: false
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 是否显示加载状态
			loading: {
				type: Boolean,
				default: false
			},
			// 自定义主题色
			color: {
				type: String,
				default: '#ff6700'
			},
			// 是否为块级元素
			block: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			buttonStyle() {
				if (this.type === 'default' && this.color) {
					return {
						'--button-color': this.color,
						'--button-background-color': this.color,
						'--button-border-color': this.color,
						'--button-hover-color': this.plain ? this.color : '#fff',
						'--button-hover-background-color': this.plain ? `${this.color}1a` : this.getLightenColor(this.color, 0.1),
						'--button-hover-border-color': this.getLightenColor(this.color, 0.1)
					}
				}
				return {}
			}
		},
		methods: {
			handleClick(e) {
				this.$emit('click', e)
			},
			getLightenColor(color, level) {
				if (color.startsWith('#')) {
					const hex = color.slice(1)
					const rgb = parseInt(hex, 16)
					const r = (rgb >> 16) + Math.floor(255 * level)
					const g = ((rgb >> 8) & 0x00FF) + Math.floor(255 * level)
					const b = (rgb & 0x0000FF) + Math.floor(255 * level)

					const newR = Math.min(r, 255)
					const newG = Math.min(g, 255)
					const newB = Math.min(b, 255)

					return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`
				}
				return color
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ay-button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 1;
		padding: 0 30rpx;
		font-size: 28rpx;
		border-radius: 8rpx;
		border: 2rpx solid;
		outline: none;
		transition: all 0.3s;
		box-sizing: border-box;
		/* #ifdef H5 */
		height: 80rpx;
		/* #endif */
		/* #ifdef APP-PLUS || MP-WEIXIN */
		height: 88rpx;
		/* #endif */

		// 默认样式
		color: #333;
		background: #fff;
		border-color: #dcdfe6;

		&:active {
			opacity: 0.8;
			transform: scale(0.98);
		}

		// 默认主题色按钮
		&--default {
			color: #fff;
			background-color: var(--button-background-color, #ff6700);
			border-color: var(--button-border-color, #ff6700);

			&:active {
				background-color: var(--button-hover-background-color, #ff8533);
				border-color: var(--button-hover-border-color, #ff8533);
			}

			&.is-plain {
				color: var(--button-color, #ff6700);
				background: rgba(255, 103, 0, 0.1);
				border-color: var(--button-border-color, #ff6700);

				&:active {
					color: #fff;
					background-color: var(--button-background-color, #ff6700);
					border-color: var(--button-border-color, #ff6700);
				}
			}
		}

		// 主要按钮
		&--primary {
			color: #fff;
			background-color: #409eff;
			border-color: #409eff;

			&:active {
				background-color: #66b1ff;
				border-color: #66b1ff;
			}

			&.is-plain {
				color: #409eff;
				background: #ecf5ff;
				border-color: #b3d8ff;

				&:active {
					color: #fff;
					background-color: #409eff;
					border-color: #409eff;
				}
			}
		}

		// 成功按钮
		&--success {
			color: #fff;
			background-color: #67c23a;
			border-color: #67c23a;

			&:active {
				background-color: #85ce61;
				border-color: #85ce61;
			}

			&.is-plain {
				color: #67c23a;
				background: #f0f9eb;
				border-color: #c2e7b0;

				&:active {
					color: #fff;
					background-color: #67c23a;
					border-color: #67c23a;
				}
			}
		}

		// 信息按钮
		&--info {
			color: #fff;
			background-color: #909399;
			border-color: #909399;

			&:active {
				background-color: #a6a9ad;
				border-color: #a6a9ad;
			}

			&.is-plain {
				color: #909399;
				background: #f4f4f5;
				border-color: #d3d4d6;

				&:active {
					color: #fff;
					background-color: #909399;
					border-color: #909399;
				}
			}
		}

		// 警告按钮
		&--warning {
			color: #fff;
			background-color: #e6a23c;
			border-color: #e6a23c;

			&:active {
				background-color: #ebb563;
				border-color: #ebb563;
			}

			&.is-plain {
				color: #e6a23c;
				background: #fdf6ec;
				border-color: #f5dab1;

				&:active {
					color: #fff;
					background-color: #e6a23c;
					border-color: #e6a23c;
				}
			}
		}

		// 危险按钮
		&--danger {
			color: #fff;
			background-color: #f56c6c;
			border-color: #f56c6c;

			&:active {
				background-color: #f78989;
				border-color: #f78989;
			}

			&.is-plain {
				color: #f56c6c;
				background: #fef0f0;
				border-color: #fbc4c4;

				&:active {
					color: #fff;
					background-color: #f56c6c;
					border-color: #f56c6c;
				}
			}
		}

		// 禁用状态
		&.is-disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		// 圆角按钮
		&.is-round {
			border-radius: 44rpx;
		}

		// 加载状态
		&.is-loading {
			position: relative;
			pointer-events: none;
			opacity: 0.8;

			.ay-icon-loading {
				display: inline-block;
				margin-right: 10rpx;
				animation: rotating 2s linear infinite;
			}
		}

		// 块级按钮
		&.is-block {
			display: flex;
			width: 100%;
			padding: 0;
		}

		// 按钮尺寸适配
		/* #ifdef H5 */
		&.is-mini {
			height: 56rpx;
			padding: 0 20rpx;
			font-size: 24rpx;
		}
		&.is-small {
			height: 64rpx;
			padding: 0 24rpx;
			font-size: 26rpx;
		}
		&.is-large {
			height: 88rpx;
			padding: 0 36rpx;
			font-size: 32rpx;
		}
		/* #endif */

		/* #ifdef APP-PLUS || MP-WEIXIN */
		&.is-mini {
			height: 60rpx;
			padding: 0 20rpx;
			font-size: 24rpx;
		}
		&.is-small {
			height: 72rpx;
			padding: 0 24rpx;
			font-size: 26rpx;
		}
		&.is-large {
			height: 96rpx;
			padding: 0 36rpx;
			font-size: 32rpx;
		}
		/* #endif */
	}

	// 加载动画
	@keyframes rotating {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>