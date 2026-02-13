<template>
	<view class="ay-title" :class="[
		`ay-title--${mode}`,
		`ay-title--align-${align}`,
		{
			'ay-title--border': border,
			'ay-title--bold': bold
		}
	]">
		<!-- 左侧内容区 -->
		<view class="ay-title__left">
			<slot></slot>
		</view>

		<!-- 标题区 -->
		<view class="ay-title__content" :style="contentStyle">
			<!-- 左侧装饰条 -->
			<view v-if="mode === 'line'" class="ay-title__line" :style="{ backgroundColor: line_color }"></view>
			<!-- 标题文本 -->
			<text class="ay-title__text" :style="{ color: color }">{{title}}</text>
		</view>

		<!-- 右侧内容区 -->
		<view class="ay-title__right">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ay-title",
		props: {
			// 标题文本
			title: {
				type: String,
				default: ''
			},
			// 标题模式：normal-普通模式，line-带竖线模式，border-带边框模式
			mode: {
				type: String,
				default: 'line',
				validator: (value) => ['normal', 'line', 'border'].includes(value)
			},
			// 对齐方式
			align: {
				type: String,
				default: 'left',
				validator: (value) => ['left', 'center', 'right'].includes(value)
			},
			// 是否显示底部边框
			border: {
				type: Boolean,
				default: false
			},
			// 文字是否加粗
			bold: {
				type: Boolean,
				default: false
			},
			// 标题颜色
			color: {
				type: String,
				default: '#333'
			},
			// 竖线颜色
			line_color: {
				type: String,
				default: '#ff6700'
			},
			// 标题大小
			size: {
				type: [String, Number],
				default: '32rpx'
			},
			// 上下间距
			padding: {
				type: String,
				default: '20rpx'
			},
			// 左右间距
			margin: {
				type: String,
				default: '20rpx'
			}
		},
		computed: {
			// 内容区样式
			contentStyle() {
				return {
					padding: `${this.padding} ${this.margin}`,
					fontSize: this.size
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ay-title {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #fff;

		// 普通模式
		&--normal {
			.ay-title__content {
				flex: 1;
			}
		}

		// 竖线模式
		&--line {
			.ay-title__content {
				flex: 1;
				display: flex;
				align-items: center;
				gap: 16rpx;
			}

			.ay-title__line {
				width: 8rpx;
				height: 32rpx;
				border-radius: 4rpx;
			}
		}

		// 边框模式
		&--border {
			.ay-title__content {
				flex: 1;
				border-bottom: 2rpx solid #f5f5f5;
			}
		}

		// 对齐方式
		&--align {
			&-left {
				.ay-title__content {
					justify-content: flex-start;
				}
			}

			&-center {
				.ay-title__content {
					justify-content: center;
				}
			}

			&-right {
				.ay-title__content {
					justify-content: flex-end;
				}
			}
		}

		// 加粗文字
		&--bold {
			.ay-title__text {
				font-weight: bold;
			}
		}

		// 左侧内容
		&__left {
			display: flex;
			align-items: center;
		}

		// 右侧内容
		&__right {
			display: flex;
			align-items: center;
		}

		// 标题文本
		&__text {
			line-height: 1.5;
			transition: color 0.3s;
		}

		// 装饰线
		&__line {
			transition: background-color 0.3s;
		}
	}
</style> 