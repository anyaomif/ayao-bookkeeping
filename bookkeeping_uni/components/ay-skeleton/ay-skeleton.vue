<template>
	<view class="ay-skeleton" v-if="loading">
		<slot name="skeleton"></slot>
	</view>
	<view v-else>
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'AySkeleton',
	props: {
		loading: { type: Boolean, default: true }
	}
}
</script>

<style lang="scss" scoped>
.ay-skeleton {
	::v-deep .sk-block {
		background: #e8e8e8;
		border-radius: 12rpx;
		position: relative;
		overflow: hidden;
		&::after {
			content: '';
			position: absolute;
			top: 0; left: 0; right: 0; bottom: 0;
			background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
			animation: sk-shimmer 1.5s infinite;
		}
	}
	::v-deep .sk-circle {
		border-radius: 50%;
	}
	::v-deep .sk-card {
		border-radius: 24rpx;
	}
}
@keyframes sk-shimmer {
	0% { transform: translateX(-100%); }
	100% { transform: translateX(100%); }
}
</style>
