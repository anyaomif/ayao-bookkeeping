<template>
	<view class="ay-switch" :class="[
      modelValue ? 'ay-switch--active' : '',
      `ay-switch--${size}`
    ]" :style="{
      backgroundColor: modelValue ? activeColor : inactiveColor,
      borderColor: modelValue ? activeColor : inactiveColor
    }" @tap="handleTap">
		<view class="ay-switch__node" :class="{ 'ay-switch__node--active': modelValue }">
			<view v-if="loading" class="ay-switch__loading"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ay-switch",
		props: {
			modelValue: {
				type: Boolean,
				default: false
			},
			activeColor: {
				type: String,
				default: '#ff6700'
			},
			inactiveColor: {
				type: String,
				default: '#dcdfe6'
			},
			size: {
				type: String,
				default: 'medium', // small, medium, large
				validator: (value) => ['small', 'medium', 'large'].includes(value)
			},
			loading: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			handleTap() {
				if (this.disabled || this.loading) return;
				const newValue = !this.modelValue;
				this.$emit('update:modelValue', newValue);
				this.$emit('change', newValue);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ay-switch {
		position: relative;
		display: inline-flex;
		align-items: center;
		border: 2rpx solid transparent;
		border-radius: 999rpx;
		box-sizing: border-box;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		// 尺寸变体
		&--small {
			width: 68rpx;
			height: 36rpx;

			.ay-switch__node {
				width: 28rpx;
				height: 28rpx;
			}
		}

		&--medium {
			width: 88rpx;
			height: 44rpx;

			.ay-switch__node {
				width: 36rpx;
				height: 36rpx;
			}
		}

		&--large {
			width: 108rpx;
			height: 52rpx;

			.ay-switch__node {
				width: 44rpx;
				height: 44rpx;
			}
		}

		&__node {
			position: absolute;
			left: 4rpx;
			background-color: #fff;
			border-radius: 50%;
			box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.12);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			display: flex;
			align-items: center;
			justify-content: center;

			&--active {
				transform: translateX(calc(100% + 4rpx));
			}
		}

		&__loading {
			width: 70%;
			height: 70%;
			border: 2rpx solid;
			border-color: transparent transparent transparent currentColor;
			border-radius: 50%;
			animation: ay-switch-loading 1s linear infinite;
		}
	}

	@keyframes ay-switch-loading {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>