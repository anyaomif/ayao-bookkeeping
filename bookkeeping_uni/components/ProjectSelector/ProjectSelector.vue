<template>
	<!-- 触发按钮 -->
	<view class="project-selector" @tap="showPopup = true">
		<text>{{ displayName }}</text>
		<tn-icon name="right-double" color="#ff6700"></tn-icon>
	</view>

	<!-- 弹出层 -->
	<ay-popup v-model="showPopup" position="left" :zIndex="1001">
		<view class="project-popup">
			<view class="popup-header">
				<text class="title">选择项目</text>
				<tn-icon name="close" @tap="showPopup = false" size="40" color="#666"></tn-icon>
			</view>
			<view class="project-list">
				<view v-for="item in projectList" :key="item.id" class="project-item"
					:class="{ 'active': modelValue?.id === item.id }" @tap="onSelect(item)">
					<text class="project-name">{{ item.name }}</text>
					<tn-icon v-if="modelValue?.id === item.id" name="check" color="#ff6700"></tn-icon>
				</view>
			</view>
			<view class="project-manage" @tap="goProject">
				<view class="left">
					<tn-icon name="set" size="40" color="#ff6700"></tn-icon>
					<text>项目管理</text>
				</view>
				<tn-icon name="right" size="40" color="#666"></tn-icon>
			</view>
		</view>
	</ay-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { navigateTo } from '@/utils/ayao'

const props = defineProps({
	modelValue: { type: Object, default: () => ({}) },
	projectList: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'change'])

const showPopup = ref(false)

// popup 打开时隐藏 tabbar，关闭时恢复
watch(showPopup, (val) => {
	uni.$emit('toggleTabbar', !val)
})

const displayName = computed(() => {
	const name = props.modelValue?.name
	if (!name) return '选择项目'
	return name.length > 7 ? name.slice(0, 7) + '...' : name
})

const onSelect = (item) => {
	emit('update:modelValue', item)
	emit('change', item)
	showPopup.value = false
}

const goProject = () => {
	navigateTo('/pages/project/list')
}
</script>

<style lang="scss" scoped>
.project-selector {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 12rpx 20rpx;
	color: #ff6700;
	font-size: 28rpx;
	font-weight: 500;
	background-color: #fff2e8;
	border-radius: 32rpx;
	transition: all 0.3s;
	margin-right: 10rpx;

	&:active {
		transform: scale(0.95);
		opacity: 0.9;
	}
}

.project-popup {
	width: 50vw;
	height: 100vh;
	background-color: #fff;
	padding-top: var(--status-bar-height);

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 2rpx solid #f5f5f5;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.project-list {
		padding: 20rpx 0;

		.project-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			transition: all 0.3s;

			&.active {
				color: #ff6700;
				background-color: #fff2e8;
			}

			.project-name {
				font-size: 30rpx;
			}
		}
	}

	.project-manage {
		position: absolute;
		bottom: 20rpx;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;

		.left {
			display: flex;
			align-items: center;
			font-weight: bold;

			text {
				margin-left: 20rpx;
			}
		}
	}
}
</style>
