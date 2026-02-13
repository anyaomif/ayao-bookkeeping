<template>
	<view class="categories-container">
		<!-- 自定义导航栏 -->
		<NavbarWrapper sticky>
			<view class="custom-navbar">
				<view class="nav-left">
					<tn-icon name="left" size="44" color="#1c1c1e" @click="goBack"></tn-icon>
				</view>
				<view class="nav-center">
					<text class="nav-title">分类管理</text>
				</view>
				<view class="nav-right" @click="openCategoryPopup()">
					<tn-icon name="add" size="44" color="#1c1c1e"></tn-icon>
				</view>
			</view>
		</NavbarWrapper>

		<!-- 类型选择器 -->
		<view class="type-selector-wrapper">
			<view class="type-selector">
				<view class="segmented">
					<view class="seg-item" :class="{ active: currentType === 'expense' }" @click="currentType = 'expense'">
						<text>支出</text>
					</view>
					<view class="seg-item" :class="{ active: currentType === 'income' }" @click="currentType = 'income'">
						<text>收入</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 分类列表 -->
		<view class="categories-list-section">
			<tn-collapse v-model="activeCollapse" accordion>
				<tn-collapse-item v-for="mainCate in categories[currentType]" :key="mainCate.id" :title="mainCate.name"
					:name="mainCate.id">
					<template #title>
						<view class="main-category-title">
							<view class="title-left">
								<tn-icon :name="mainCate.icon" size="40"></tn-icon>
								<text>{{ mainCate.name }} ({{ mainCate.subcategories.length }})</text>
							</view>
							<view class="title-right">
								<tn-icon name="menu" size="40" color="#c7c7cc"></tn-icon>
							</view>
						</view>
					</template>

					<view class="sub-category-list">
						<tn-swipe-action>
							<tn-swipe-action-item v-for="subCate in mainCate.subcategories" :key="subCate.id"
								:options="swipeOptions" @click="handleSwipeClick($event, subCate.id)">
								<view class="sub-category-item">
									<view class="item-left">
										<view class="icon-wrapper" :style="{ backgroundColor: subCate.color }">
											<tn-icon :name="subCate.icon" size="40" color="#fff"></tn-icon>
										</view>
										<text class="item-name">{{ subCate.name }}</text>
									</view>
									<view class="item-right">
										<tn-icon name="menu" size="40" color="#c7c7cc"></tn-icon>
									</view>
								</view>
							</tn-swipe-action-item>
						</tn-swipe-action>
					</view>
				</tn-collapse-item>
			</tn-collapse>
		</view>


		<!-- 添加/编辑分类弹层 -->
		<ay-popup v-model="showPopup" position="bottom" :duration="300" draggable show-drag-handle>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">{{ popupMode === 'add' ? '添加分类' : '编辑分类' }}</text>
				</view>
				<view class="form-section">
					<view class="form-item">
						<text class="form-label">分类名称</text>
						<ay-input v-model="categoryForm.name" placeholder="请输入分类名称" border />
					</view>
					<view class="form-item">
						<text class="form-label">选择图标</text>
						<view class="icon-selector">
							<view class="icon-option" :class="{ active: categoryForm.icon === icon }"
								v-for="icon in iconOptions" :key="icon" @click="categoryForm.icon = icon">
								<tn-icon :name="icon" size="48"></tn-icon>
							</view>
						</view>
					</view>
					<view class="form-item">
						<text class="form-label">选择颜色</text>
						<view class="color-selector">
							<view class="color-option" :style="{ backgroundColor: color }"
								:class="{ active: categoryForm.color === color }" v-for="color in colorOptions"
								:key="color" @click="categoryForm.color = color">
								<tn-icon name="check" v-if="categoryForm.color === color" color="#fff" size="32"></tn-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-actions">
					<ay-button block round @click="saveCategory">保 存</ay-button>
				</view>
			</view>
		</ay-popup>

	</view>
</template>

<script setup>
import { ref } from 'vue';

const currentType = ref('expense');
const activeCollapse = ref([]);
const showPopup = ref(false);
const popupMode = ref('add');

const categoryForm = ref({
	id: null,
	name: '',
	icon: 'eat',
	color: '#ff9f0a'
});

const iconOptions = ref(['eat', 'shop', 'car', 'mobile', 'science', 'ticket', 'fire', 'safe', 'wallet', 'card', 'wechat', 'alipay']);
const colorOptions = ref(['#ff6700', '#007aff', '#34c759', '#ff9f0a', '#af52de', '#ff3b30', '#5ac8fa', '#8e8e93']);

const categories = ref({
	expense: [
		{
			id: 'exp-1', name: '餐饮', icon: 'eat', subcategories: [
				{ id: 'exp-sub-1', name: '早餐', icon: 'eat', color: '#ff9f0a' },
				{ id: 'exp-sub-2', name: '午餐', icon: 'eat', color: '#ff9f0a' },
				{ id: 'exp-sub-3', name: '晚餐', icon: 'eat', color: '#ff9f0a' },
			]
		},
		{
			id: 'exp-2', name: '购物', icon: 'shop', subcategories: [
				{ id: 'exp-sub-4', name: '服饰', icon: 'shop', color: '#af52de' },
				{ id: 'exp-sub-5', name: '日用', icon: 'shop', color: '#af52de' },
			]
		},
	],
	income: [
		{
			id: 'inc-1', name: '职业', icon: 'fire', subcategories: [
				{ id: 'inc-sub-1', name: '工资', icon: 'fire', color: '#34c759' },
				{ id: 'inc-sub-2', name: '奖金', icon: 'fire', color: '#34c759' },
			]
		},
	],
});

const swipeOptions = ref([
	{ text: '编辑', style: { backgroundColor: '#007aff' } },
	{ text: '删除', style: { backgroundColor: '#ff3b30' } }
]);

const goBack = () => uni.navigateBack();

const openCategoryPopup = (mode = 'add', category = null) => {
	popupMode.value = mode;
	if (mode === 'add') {
		categoryForm.value = { id: null, name: '', icon: 'eat', color: '#ff9f0a' };
	} else {
		categoryForm.value = { ...category };
	}
	showPopup.value = true;
};

const saveCategory = () => {
	uni.showToast({ title: '保存成功', icon: 'none' });
	showPopup.value = false;
};

const handleSwipeClick = (event, id) => {
	const action = event.index === 0 ? '编辑' : '删除';
	uni.showToast({ title: `${action} ID: ${id}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
.categories-container {
	background-color: #f6f6f6;
	min-height: 100vh;
}

.custom-navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 88rpx;
	padding: 0 10rpx;
	background-color: #f6f6f6;

	.nav-left,
	.nav-right {
		width: 88rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #1c1c1e;
	}
}

.type-selector-wrapper {
	padding: 20rpx 30rpx;
	background-color: #f6f6f6;
}

.type-selector {
	display: flex;
	background: #fff;
	padding: 6rpx;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);

	.segmented {
		display: flex;
		flex: 1;
		gap: 4rpx;

		.seg-item {
			flex: 1;
			text-align: center;
			padding: 20rpx 24rpx;
			border-radius: 20rpx;
			transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);

			text {
				font-size: 30rpx;
				font-weight: 500;
				color: #8e8e93;
			}

			&.active {
				background: linear-gradient(135deg, #ff6700 0%, #ff8f3d 100%);
				box-shadow: 0 8rpx 20rpx rgba(255, 103, 0, 0.25);

				text {
					color: #fff;
					font-weight: 600;
				}
			}
		}
	}
}

.categories-list-section {
	padding: 0 30rpx;

	::v-deep .tn-collapse {
		background-color: transparent !important;
	}

	::v-deep .tn-collapse-item {
		background-color: #fff !important;
		border-radius: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);

		.tn-collapse-item__header {
			border-bottom-color: #f5f5f5 !important;
		}
	}
}

.main-category-title {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.title-left {
		display: flex;
		align-items: center;
		gap: 16rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #1c1c1e;
	}
}

.sub-category-list {
	::v-deep .tn-swipe-action {
		overflow: hidden;
	}
}

.sub-category-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 0;
	margin: 0 24rpx;
	border-bottom: 1rpx solid #f5f5f5;

	&:last-child {
		border-bottom: none;
	}

	.item-left {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}

	.icon-wrapper {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.item-name {
		font-size: 28rpx;
		color: #1c1c1e;
	}
}


/* 弹层样式 */
.popup-content {
	padding: 12rpx 30rpx 40rpx 30rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	background-color: #fff;
}

.popup-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 0 32rpx 0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1c1c1e;
}

.form-section {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.form-item {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.form-label {
	font-size: 28rpx;
	font-weight: 500;
	color: #1c1c1e;
}

.icon-selector,
.color-selector {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.icon-option,
.color-option {
	width: 96rpx;
	height: 96rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f6f6f6;
	transition: all 0.2s ease;

	&.active {
		background-color: #ff6700;
		color: #fff;
		transform: scale(1.1);
	}
}

.color-option {
	&.active {
		box-shadow: 0 0 0 4rpx rgba(255, 103, 0, 0.3);
	}
}

.popup-actions {
	margin-top: 50rpx;
}
</style>
