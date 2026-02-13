<template>
	<view class="ay-tag" :class="[
      `ay-tag--${type}`, 
      `ay-tag--${size}`, 
      `ay-tag--${shape}`,
      {
        'ay-tag--closable': closable,
        'ay-tag--disabled': disabled,
        'ay-tag--plain': plain,
        'ay-tag--bold': bold,
        'ay-tag--custom': color
      }
    ]" :style="tagStyle" @click="handleClick">
		<slot>{{ text }}</slot>
		<view v-if="closable" class="ay-tag__close" @click.stop="handleClose">
			×
		</view>
	</view>
</template>

<script>
	export default {
		name: 'AyTag',
		props: {
			// 标签文本（如果未提供插槽）
			text: {
				type: String,
				default: ''
			},
			// 标签类型/样式
			type: {
				type: String,
				default: 'default',
				validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
			},
			// 标签尺寸
			size: {
				type: String,
				default: 'medium',
				validator: (value) => ['small', 'medium', 'large'].includes(value)
			},
			// 标签形状
			shape: {
				type: String,
				default: 'rectangle',
				validator: (value) => ['rectangle', 'round', 'circle'].includes(value)
			},
			// 是否可关闭
			closable: {
				type: Boolean,
				default: false
			},
			// 禁用交互
			disabled: {
				type: Boolean,
				default: false
			},
			// 字体大小
			fontSize: {
				type: [Number, String],
				default: 24
			},
			// 文字是否加粗
			bold: {
				type: Boolean,
				default: false
			},
			// 是否为镂空样式
			plain: {
				type: Boolean,
				default: false
			},
			// 添加自定义颜色属性
			color: {
				type: String,
				default: ''
			}
		},
		computed: {
			// 添加计算属性处理样式
			tagStyle() {
				const style = {
					fontSize: `${this.fontSize}rpx`
				};
				
				if (this.color) {
					if (this.plain) {
						style.color = this.color;
						style.borderColor = this.color;
						style.backgroundColor = 'transparent';
					} else {
						style.color = '#ffffff';
						style.backgroundColor = this.color;
						style.borderColor = this.color;
					}
				}
				
				return style;
			}
		},
		methods: {
			// 处理标签点击事件
			handleClick(event) {
				if (!this.disabled) {
					this.$emit('click', event)
				}
			},
			// 处理标签关闭事件
			handleClose(event) {
				if (!this.disabled) {
					this.$emit('close', event)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ay-tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin: 0 4px;
		transition: all 0.3s ease;
		position: relative;

		// 形状定义
		&--rectangle {
			border-radius: 4px;
		}

		&--round {
			border-radius: 16px;
		}

		&--circle {
			border-radius: 50%;
			width: 32px;
			height: 32px;
			padding: 0;
			justify-content: center;
		}

		// 字体加粗
		&--bold {
			font-weight: bold;
		}

		// 默认主题
		&--default {
			background-color: #ff6700;
			color: white;
			border: 1px solid #ff6700;
		}

		// 镂空样式
		&--plain {
			background-color: transparent;
			color: #ff6700;
			border: 1px solid #ff6700;
		}

		// 颜色变体
		&--primary {
			background-color: #1890ff;
			color: white;
			border: 1px solid #1890ff;

			&.ay-tag--plain {
				background-color: transparent;
				color: #1890ff;
			}
		}

		&--success {
			background-color: #52c41a;
			color: white;
			border: 1px solid #52c41a;

			&.ay-tag--plain {
				background-color: transparent;
				color: #52c41a;
			}
		}

		&--warning {
			background-color: #faad14;
			color: white;
			border: 1px solid #faad14;

			&.ay-tag--plain {
				background-color: transparent;
				color: #faad14;
			}
		}

		&--danger {
			background-color: #f5222d;
			color: white;
			border: 1px solid #f5222d;

			&.ay-tag--plain {
				background-color: transparent;
				color: #f5222d;
			}
		}

		// 尺寸变体
		&--small {
			padding: 0 4px;
			height: 36rpx;
		}

		&--medium {
			padding: 0 8px;
			height: 56rpx;
		}

		&--large {
			padding: 0 12px;
			height: 72rpx;
		}

		// 可关闭标签
		&--closable {
			padding-right: 40rpx;
		}

		// 关闭图标
		&__close {
			position: absolute;
			right: 4px;
			top: 50%;
			transform: translateY(-50%);
			color: rgba(0, 0, 0, 0.45);
			font-size: 12px;
			cursor: pointer;
			transition: color 0.3s ease;

			&:hover {
				color: #333;
			}
		}

		// 禁用状态
		&--disabled {
			cursor: not-allowed;
			opacity: 0.5;
			pointer-events: none;
		}

		// 悬停和点击状态
		&:not(.ay-tag--disabled) {
			&:hover {
				opacity: 0.8;
			}

			&:active {
				opacity: 0.9;
			}
		}

		// 自定义颜色时覆盖默认主题样式
		&--custom {
			&.ay-tag--plain {
				background-color: transparent;
			}

			// 禁用默认主题的样式
			&.ay-tag--default,
			&.ay-tag--primary,
			&.ay-tag--success,
			&.ay-tag--warning,
			&.ay-tag--danger {
				background-color: inherit;
				border-color: inherit;
				color: inherit;
			}
		}
	}
</style>