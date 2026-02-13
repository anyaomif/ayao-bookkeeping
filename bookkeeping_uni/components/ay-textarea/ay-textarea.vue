<template>
	<view class="ay-textarea" :class="{
		'ay-textarea--border': border,
		'ay-textarea--disabled': disabled,
		'ay-textarea--readonly': readonly
	}">
		<textarea class="ay-textarea__inner" v-model="inputValue" :placeholder="placeholder"
			:placeholder-style="placeholderStyle" :disabled="disabled" :readonly="readonly" :maxlength="maxlength" adjust-position
			:auto-height="auto_height" :style="textareaStyle" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
			@confirm="handleConfirm" />

		<!-- 字数统计 -->
		<view v-if="showWordLimit && maxlength" class="ay-textarea__count">
			<text>{{inputValue.length}}</text>
			<text>/</text>
			<text>{{maxlength}}</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		onMounted,
		computed
	} from 'vue'

	const props = defineProps({
		modelValue: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: '请输入'
		},
		placeholderStyle: {
			type: String,
			default: ''
		},
		maxlength: {
			type: [String, Number],
			default: 140
		},
		disabled: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: true
		},
		showWordLimit: {
			type: Boolean,
			default: true
		},
		auto_height: {
			type: Boolean,
			default: false
		},
		height: {
			type: [String, Number],
			default: '120rpx'
		}
	})

	const emit = defineEmits(['update:modelValue', 'input', 'focus', 'blur', 'confirm'])

	// 输入值
	const inputValue = ref('')

	// 计算文本域样式
	const textareaStyle = computed(() => {
		return {
			height: props.auto_height ? 'auto' : props.height
		}
	})

	// 监听值变化
	watch(() => props.modelValue, (newVal) => {
		inputValue.value = newVal
	}, {
		immediate: true
	})

	// 输入事件
	function handleInput(event) {
		const {
			value
		} = event.detail
		emit('update:modelValue', value)
		emit('input', value)
	}

	// 获取焦点事件
	function handleFocus(event) {
		emit('focus', event)
	}

	// 失去焦点事件
	function handleBlur(event) {
		emit('blur', event)
	}

	// 完成事件
	function handleConfirm(event) {
		emit('confirm', event)
	}
</script>

<style lang="scss" scoped>
	.ay-textarea {
		position: relative;
		width: 100%;
		background-color: #fff;
		padding-bottom: 20rpx;

		&--border {
			border: 2rpx solid #dcdfe6;
			border-radius: 8rpx;

			&:focus-within {
				border-color: #ff6700;
			}
		}

		&--disabled {
			opacity: 0.6;
			cursor: not-allowed;

			.ay-textarea__inner {
				pointer-events: none;
			}
		}

		&--readonly {
			opacity: 0.7;
			cursor: default;

			.ay-textarea__inner {
				pointer-events: none;
			}
		}

		&__inner {
			width: 100%;
			min-height: 32rpx;
			padding: 20rpx;
			font-size: 28rpx;
			color: #333;
			background-color: transparent;
			box-sizing: border-box;
			display: block;
			line-height: 1.5;

			&::placeholder {
				color: #999;
			}
		}

		&__count {
			position: absolute;
			right: 20rpx;
			bottom: 10rpx;
			font-size: 24rpx;
			color: #999;
		}
	}
</style>