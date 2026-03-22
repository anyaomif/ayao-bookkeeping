<template>
	<!-- 触发按钮 -->
	<view class="project-selector" @tap="openPopup">
		<text>{{ displayName }}</text>
		<tn-icon name="right-double" size="24" color="#ff6700"></tn-icon>
	</view>

	<!-- 底部弹出层 -->
	<ay-popup v-model="showPopup" position="bottom" :zIndex="1001">
		<view class="project-popup" :style="themeVars">
			<view class="popup-header">
				<text class="title">选择项目</text>
				<tn-icon name="close" @tap="showPopup = false" size="40" :color="isDark ? '#8e8e93' : '#666'"></tn-icon>
			</view>

			<!-- 全部项目（多选模式才显示） -->
			<template v-if="!single">
				<view class="project-item all-item" :class="{ active: isAllSelected }" @tap="toggleAll">
					<view class="item-left">
						<view class="check-box" :class="{ checked: isAllSelected }">
							<tn-icon v-if="isAllSelected" name="check" size="26" color="#fff"></tn-icon>
						</view>
						<text class="project-name">全部项目</text>
					</view>
					<text class="count-badge">{{ projectList.length }}个</text>
				</view>
				<view class="divider"></view>
			</template>

			<!-- 项目列表 -->
			<scroll-view class="project-list" scroll-y>
				<view v-for="item in projectList" :key="item.id" class="project-item"
					:class="{ active: isChecked(item.id) }" @tap="toggleItem(item)">
					<view class="item-left">
						<view class="check-box" :class="{ checked: isChecked(item.id) }">
							<tn-icon v-if="isChecked(item.id)" name="check" size="26" color="#fff"></tn-icon>
						</view>
						<text class="project-name">{{ item.name }}</text>
					</view>
				</view>
			</scroll-view>

			<!-- 底部操作区 -->
			<view class="popup-footer">
				<view class="footer-manage" @tap="goProject">
					<tn-icon name="set" size="36" color="#ff6700"></tn-icon>
					<text>管理</text>
				</view>
				<view v-if="!single" class="confirm-btn" @tap="confirm">
					<text>确认{{ tempSelected.length > 0 ? '（' + tempSelected.length + '个）' : '' }}</text>
				</view>
			</view>
		</view>
	</ay-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { navigateTo } from '@/utils/ayao'
import { isDarkMode, getThemeVars } from '@/utils/theme'

const props = defineProps({
	modelValue: { type: Array, default: () => [] },
	projectList: { type: Array, default: () => [] },
	single: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const showPopup = ref(false)
const isDark = ref(isDarkMode())
const themeVars = ref(getThemeVars())
const tempSelected = ref([])

watch(showPopup, (val) => {
	uni.$emit('toggleTabbar', !val)
	if (val) {
		isDark.value = isDarkMode()
		themeVars.value = getThemeVars()
		// 打开时同步当前选中状态
		tempSelected.value = props.modelValue.length > 0
			? [...props.modelValue]
			: [...props.projectList]
	}
})

// 项目列表变化时，若当前无选中则默认选中（单选取第一个，多选全选）
watch(() => props.projectList, (list) => {
	if (list.length > 0 && props.modelValue.length === 0) {
		const defaultVal = props.single ? [list[0]] : [...list]
		emit('update:modelValue', defaultVal)
		emit('change', defaultVal)
	}
}, { immediate: true })

const isAllSelected = computed(() => tempSelected.value.length === props.projectList.length && props.projectList.length > 0)

const isChecked = (id) => tempSelected.value.some(p => p.id === id)

const toggleAll = () => {
	if (isAllSelected.value) {
		tempSelected.value = []
	} else {
		tempSelected.value = [...props.projectList]
	}
}

const toggleItem = (item) => {
	if (props.single) {
		// 单选：直接选中并关闭
		showPopup.value = false
		emit('update:modelValue', [item])
		emit('change', [item])
		return
	}
	const idx = tempSelected.value.findIndex(p => p.id === item.id)
	if (idx >= 0) {
		tempSelected.value.splice(idx, 1)
	} else {
		tempSelected.value.push(item)
	}
}

const openPopup = () => {
	showPopup.value = true
}

const confirm = () => {
	if (tempSelected.value.length === 0) {
		uni.showToast({ title: '请至少选择一个项目', icon: 'none' })
		return
	}
	showPopup.value = false
	const selected = [...tempSelected.value]
	emit('update:modelValue', selected)
	emit('change', selected)
}

const goProject = () => {
	showPopup.value = false
	navigateTo('/pages/project/list')
}

const displayName = computed(() => {
	const val = props.modelValue
	if (!val || val.length === 0) return '选择项目'
	if (val.length === 1) {
		const name = val[0]?.name || ''
		return name.length > 7 ? name.slice(0, 7) + '...' : name
	}
	if (val.length === props.projectList.length && props.projectList.length > 0) return '全部项目'
	return `已选 ${val.length} 个`
})
</script>

<style lang="scss" scoped>
.project-selector {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 8rpx 16rpx;
	border-radius: 30rpx;
	background: rgba(255, 103, 0, 0.1);

	text {
		font-size: 26rpx;
		color: #ff6700;
		max-width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.project-popup {
	width: 100vw;
	max-height: 80vh;
	background: var(--bg-card-solid, #fff);
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx 30rpx 20rpx;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: var(--text-primary, #333);
		}
	}

	.divider {
		height: 1rpx;
		background: var(--divider, #f0f0f0);
		margin: 0 30rpx;
	}

	.project-list {
		flex: 1;
		max-height: 50vh;
	}

	.project-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 30rpx;
		transition: background 0.15s;

		&.active {
			background: rgba(255, 103, 0, 0.06);
		}

		&.all-item {
			padding: 24rpx 30rpx;
		}

		.item-left {
			display: flex;
			align-items: center;
			gap: 20rpx;
		}

		.project-name {
			font-size: 30rpx;
			color: var(--text-primary, #333);
		}

		.count-badge {
			font-size: 24rpx;
			color: var(--text-secondary, #999);
		}
	}

	.check-box {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 2rpx solid var(--divider, #ddd);
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		transition: all 0.2s;

		&.checked {
			background: #ff6700;
			border-color: #ff6700;
		}
	}

	.popup-footer {
		display: flex;
		align-items: center;
		gap: 20rpx;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		border-top: 1rpx solid var(--divider, #f0f0f0);

		.footer-manage {
			display: flex;
			align-items: center;
			gap: 8rpx;
			padding: 16rpx 24rpx;
			border-radius: 20rpx;
			background: var(--bg-input);
			text {
				font-size: 26rpx;
				color: var(--text-secondary);
			}
		}

		.confirm-btn {
			flex: 1;
			background: #ff6700;
			border-radius: 20rpx;
			padding: 20rpx;
			text-align: center;
			text {
				color: #fff;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
	}
}
</style>
