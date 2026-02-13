<template>
	<view class="ay-input" :class="[
		`ay-input--${type}`,
		`ay-input--align-${align}`,
		{
			'ay-input--border': border,
			'ay-input--underline': underline,
			'ay-input--disabled': disabled,
			'ay-input--readonly': readonly
		}
	]" :style="[inputStyle]">
		<!-- 前置插槽 -->
		<view v-if="$slots.prefix" class="ay-input__prefix">
			<slot name="prefix"></slot>
		</view>

		<!-- 输入区域 -->
		<template v-if="type === 'textarea'">
			<textarea class="ay-input__textarea" :value="modelValue" :placeholder="placeholder"
				:placeholder-style="placeholderStyle" :disabled="disabled" :readonly="readonly" :maxlength="maxlength"
				:focus="focus" :auto-height="autoHeight" :cursor-spacing="cursorSpacing" :style="[textareaStyle]"
				@input="handleInput" @focus="handleFocus" @blur="handleBlur" @confirm="handleConfirm">
			</textarea>
		</template>
		<template v-else>
			<input class="ay-input__input" :type="type" :value="modelValue" :placeholder="placeholder"
				:placeholder-style="placeholderStyle" :disabled="disabled" :readonly="readonly" :maxlength="maxlength"
				:focus="focus" :cursor-spacing="cursorSpacing" :password="type === 'password'" @input="handleInput"
				@focus="handleFocus" @blur="handleBlur" @confirm="handleConfirm" />
		</template>

		<!-- 后置插槽 -->
		<view v-if="$slots.suffix" class="ay-input__suffix">
			<slot name="suffix"></slot>
		</view>

		<!-- 清除按钮 -->
		<view v-if="clearable && modelValue && !disabled && !readonly" class="ay-input__clear" @tap.stop="handleClear">
			<tn-icon name="clear" class="iconfont" color="#ff6700"></tn-icon>
		</view>

		<!-- 字数统计 -->
		<view v-if="showWordLimit && maxlength" class="ay-input__count">
			<text>{{modelValue.length}}</text>
			<text>/</text>
			<text>{{maxlength}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ay-input",
		props: {
			// v-model 值
			modelValue: {
				type: [String, Number],
				default: ''
			},
			// 输入类型
			type: {
				type: String,
				default: 'text',
				validator: (value) => [
					'text',
					'number',
					'idcard',
					'digit',
					'password',
					'textarea'
				].includes(value)
			},
			// 占位文本
			placeholder: {
				type: String,
				default: '请输入'
			},
			// 占位文本样式
			placeholderStyle: {
				type: String,
				default: ''
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 最大长度
			maxlength: {
				type: [String, Number],
				default: -1
			},
			// 是否显示边框
			border: {
				type: Boolean,
				default: false
			},
			// 是否显示下划线
			underline: {
				type: Boolean,
				default: true
			},
			// 边框颜色
			borderColor: {
				type: String,
				default: '#dcdfe6'
			},
			// 文本对齐方式
			align: {
				type: String,
				default: 'left',
				validator: (value) => ['left', 'center', 'right'].includes(value)
			},
			// 高度
			height: {
				type: [String, Number],
				default: '80rpx'
			},
			// 是否自动增高
			autoHeight: {
				type: Boolean,
				default: false
			},
			// 是否显示清除按钮
			clearable: {
				type: Boolean,
				default: false
			},
			// 是否显示字数统计
			showWordLimit: {
				type: Boolean,
				default: false
			},
			// 是否自动获取焦点
			focus: {
				type: Boolean,
				default: false
			},
			// 光标与键盘的距离
			cursorSpacing: {
				type: Number,
				default: 0
			},
			// 输入框内边距
			padding: {
				type: String,
				default: '0 20rpx'
			},
			// 是否只读
			readonly: {
				type: Boolean,
				default: false
			},
		},
		computed: {
			// 输入框样式
			inputStyle() {
				return {
					height: this.type === 'textarea' ? 'auto' : this.height,
					borderColor: this.borderColor,
					padding: this.padding
				}
			},
			// 文本域样式
			textareaStyle() {
				return {
					minHeight: this.height
				}
			}
		},
		methods: {
			// 输入事件
			handleInput(event) {
				const value = event.detail.value
				this.$emit('update:modelValue', value)
				this.$emit('input', value)
			},
			// 获取焦点事件
			handleFocus(event) {
				this.$emit('focus', event)
			},
			// 失去焦点事件
			handleBlur(event) {
				this.$emit('blur', event)
			},
			// 点击完成按钮事件
			handleConfirm(event) {
				this.$emit('confirm', event)
			},
			// 清除内容
			handleClear() {
				this.$emit('update:modelValue', '')
				this.$emit('clear')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ay-input {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		font-size: 28rpx;
		color: #333;
		background-color: #fff;
		transition: all 0.3s;

		// 边框样式
		&--border {
			border: 2rpx solid #dcdfe6;
			border-radius: 8rpx;

			&:focus-within {
				border-color: #ff6700;
			}
		}

		// 下划线样式
		&--underline {
			border-bottom: 2rpx solid #dcdfe6;

			&:focus-within {
				border-bottom-color: #ff6700;
			}
		}

		// 禁用样式
		&--disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		// 对齐方式
		&--align {
			&-left {
				text-align: left;
			}

			&-center {
				text-align: center;
			}

			&-right {
				text-align: right;
			}
		}

		// 前置内容
		&__prefix {
			display: flex;
			align-items: center;
			padding-right: 20rpx;
		}

		// 后置内容
		&__suffix {
			display: flex;
			align-items: center;
			padding-left: 20rpx;
		}

		// 输入框
		&__input {
			flex: 1;
			width: 100%;
			height: 100%;
			min-height: 80rpx;
			line-height: 1.5;
			background-color: transparent;
		}

		// 文本域
		&__textarea {
			flex: 1;
			width: 100%;
			line-height: 1.5;
			background-color: transparent;
			padding: 20rpx 0;
		}

		// 清除按钮
		&__clear {
			display: flex;
			align-items: center;
			padding: 0 20rpx;

			.iconfont {
				font-size: 32rpx;
				color: #c0c4cc;
			}
		}

		// 字数统计
		&__count {
			position: absolute;
			right: 20rpx;
			bottom: 10rpx;
			font-size: 24rpx;
			color: #999;
		}

		// 获取焦点时的样式
		&:focus-within {
			border-color: #ff6700;
		}

		// 只读样式
		&--readonly {
			opacity: 0.7;
			cursor: default;

			.ay-input__input,
			.ay-input__textarea {
				pointer-events: none;
			}
		}
	}
</style>