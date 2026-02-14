<template>
	<view class="categories-container">
		<NavbarWrapper sticky>
			<view class="custom-navbar">
				<view class="nav-left" @click="goBack">
					<tn-icon name="left" size="44" color="#1c1c1e"></tn-icon>
				</view>
				<view class="nav-center">
					<text class="nav-title">分类管理</text>
				</view>
				<view class="nav-right" @click="confirmReset">
					<tn-icon name="refresh" size="40" color="#1c1c1e"></tn-icon>
				</view>
			</view>
		</NavbarWrapper>

		<view class="type-selector">
			<view class="segmented">
				<view class="seg-slider" :style="{ transform: `translateX(${typeIndex * 100}%)` }"></view>
				<view class="seg-item" :class="{ active: currentType === 'expense' }" @click="currentType = 'expense'">
					<text>支出</text>
				</view>
				<view class="seg-item" :class="{ active: currentType === 'income' }" @click="currentType = 'income'">
					<text>收入</text>
				</view>
				<view class="seg-item" :class="{ active: currentType === 'transfer' }" @click="currentType = 'transfer'">
					<text>转账</text>
				</view>
			</view>
		</view>

		<!-- 主分类宫格 -->
		<view class="section-card">
			<view class="section-tip">
				<tn-icon name="info" size="28" color="#c7c7cc"></tn-icon>
				<text>长按分类可编辑或删除</text>
			</view>
			<view class="grid-wrap">
				<view class="grid-item" v-for="mainCate in categories[currentType]" :key="mainCate.id"
					:class="{ selected: expandedId === mainCate.id }"
					@click="toggleExpand(mainCate.id)" @longpress="onLongPress(mainCate, true)">
					<view class="grid-icon" :style="{ backgroundColor: mainCate.color }">
						<tn-icon :name="mainCate.icon" size="44" color="#fff"></tn-icon>
					</view>
					<text class="grid-name">{{ mainCate.name }}</text>
				</view>
				<!-- 添加一级分类 -->
				<view class="grid-item add-item" @click="openAddMain">
					<view class="grid-icon add-icon">
						<tn-icon name="add" size="44" color="#ff6700"></tn-icon>
					</view>
					<text class="grid-name add-text">添加</text>
				</view>
			</view>
		</view>

		<!-- 子分类宫格（展开时显示） -->
		<view class="section-card sub-section" v-if="expandedMain">
			<view class="sub-header">
				<text class="sub-title">{{ expandedMain.name }} - 子分类</text>
			</view>
			<view class="grid-wrap">
				<view class="grid-item" v-for="subCate in expandedMain.subcategories" :key="subCate.id"
					@longpress="onLongPress(subCate, false)">
					<view class="grid-icon small" :style="{ backgroundColor: subCate.color }">
						<tn-icon :name="subCate.icon" size="36" color="#fff"></tn-icon>
					</view>
					<text class="grid-name">{{ subCate.name }}</text>
				</view>
				<view class="grid-item add-item" @click="openAddSub">
					<view class="grid-icon small add-icon">
						<tn-icon name="add" size="36" color="#ff6700"></tn-icon>
					</view>
					<text class="grid-name add-text">添加</text>
				</view>
			</view>
		</view>

		<!-- 长按操作菜单 -->
		<ay-popup v-model="showActionMenu" position="bottom" :duration="300">
			<view class="action-menu">
				<view class="action-menu-item" @click="doEdit">
					<tn-icon name="edit" size="40" color="#ff6700"></tn-icon>
					<text>编辑</text>
				</view>
				<view class="action-menu-item danger" @click="doDelete">
					<tn-icon name="delete" size="40" color="#ff3b30"></tn-icon>
					<text>删除</text>
				</view>
				<view class="action-menu-cancel" @click="showActionMenu = false">
					<text>取消</text>
				</view>
			</view>
		</ay-popup>

		<!-- 编辑/添加弹层 -->
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
						<scroll-view scroll-y class="icon-scroll">
							<view class="icon-selector">
								<view class="icon-option" :class="{ active: categoryForm.icon === icon }"
									v-for="icon in iconOptions" :key="icon" @click="categoryForm.icon = icon">
									<tn-icon :name="icon" size="44"></tn-icon>
								</view>
							</view>
						</scroll-view>
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
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { personalCategoryApi } from '@/api/personal_category';

const currentType = ref('expense');
const typeIndex = computed(() => ({ expense: 0, income: 1, transfer: 2 }[currentType.value] || 0));
const categories = ref({ expense: [], income: [], transfer: [] });
const expandedId = ref(null);
const expandedMain = computed(() => {
	if (!expandedId.value) return null;
	return categories.value[currentType.value]?.find(c => c.id === expandedId.value) || null;
});

const showPopup = ref(false);
const showActionMenu = ref(false);
const popupMode = ref('add');
const categoryForm = ref({ id: null, name: '', icon: 'eat', color: '#ff9f0a', type: 'expense', parent_id: 0 });
let actionTarget = null;
let actionIsMain = false;

const iconOptions = [
	'eat', 'eat-fill', 'eat-west', 'eat-other', 'food', 'food-fill', 'orange', 'basket',
	'shop', 'shopbag', 'cart', 'clothing-male', 'clothing-female', 'computer', 'sofa',
	'taxi', 'taxi-fill', 'bus', 'train', 'airplane', 'electromobile',
	'money', 'money-fill', 'bankcard', 'piggy-bank', 'lucky-money', 'pay', 'funds', 'receipt', 'coupon', 'refund',
	'home', 'bed', 'building', 'medical', 'pharmacy', 'education', 'book', 'notebook',
	'game', 'music-fill', 'video', 'sport-run',
	'phone', 'email', 'message', 'gift', 'birthday', 'fire', 'safe', 'trophy', 'job',
	'panda', 'rabbit', 'fish', 'koi', 'refresh', 'left-arrow', 'right-arrow', 'star',
];
const colorOptions = ['#ff6700', '#007aff', '#34c759', '#ff9f0a', '#af52de', '#ff3b30', '#5ac8fa', '#8e8e93', '#ff2d55', '#5856d6'];

const toggleExpand = (id) => { expandedId.value = expandedId.value === id ? null : id; };

const loadCategories = async () => {
	try {
		const res = await personalCategoryApi.getAll();
		if (res.success) categories.value = res.data;
	} catch (e) { }
};

const openAddMain = () => {
	popupMode.value = 'add';
	categoryForm.value = { id: null, name: '', icon: 'eat', color: '#ff9f0a', type: currentType.value, parent_id: 0 };
	showPopup.value = true;
};

const openAddSub = () => {
	if (!expandedMain.value) return;
	popupMode.value = 'add';
	categoryForm.value = { id: null, name: '', icon: 'eat', color: expandedMain.value.color, type: currentType.value, parent_id: expandedMain.value.id };
	showPopup.value = true;
};

const onLongPress = (cate, isMain) => {
	actionTarget = cate;
	actionIsMain = isMain;
	showActionMenu.value = true;
};

const doEdit = () => {
	showActionMenu.value = false;
	if (!actionTarget) return;
	popupMode.value = 'edit';
	categoryForm.value = {
		id: actionTarget.id, name: actionTarget.name, icon: actionTarget.icon,
		color: actionTarget.color, type: actionTarget.type || currentType.value, parent_id: actionTarget.parent_id,
	};
	showPopup.value = true;
};

const doDelete = () => {
	showActionMenu.value = false;
	if (!actionTarget) return;
	confirmDelete(actionTarget.id, actionIsMain);
};

const saveCategory = async () => {
	const { id, name, icon, color, type, parent_id } = categoryForm.value;
	if (!name.trim()) return uni.showToast({ title: '请输入分类名称', icon: 'none' });
	try {
		const payload = { name: name.trim(), icon, color, type: type || currentType.value, parent_id };
		if (popupMode.value === 'add') await personalCategoryApi.create(payload);
		else await personalCategoryApi.update(id, payload);
		uni.showToast({ title: '保存成功', icon: 'none' });
		showPopup.value = false;
		loadCategories();
	} catch (e) { }
};

const confirmDelete = (id, isMain) => {
	uni.showModal({
		title: '确认删除',
		content: isMain ? '将同时删除所有子分类，确定？' : '确定要删除该分类吗？',
		confirmColor: '#ff3b30',
		success: async (res) => {
			if (res.confirm) {
				try {
					await personalCategoryApi.delete(id);
					uni.showToast({ title: '删除成功', icon: 'none' });
					if (isMain && expandedId.value === id) expandedId.value = null;
					loadCategories();
				} catch (e) { }
			}
		}
	});
};

const confirmReset = () => {
	uni.showModal({
		title: '恢复默认分类',
		content: '将删除所有自定义分类并恢复为系统默认，确定？',
		confirmColor: '#ff3b30',
		success: async (res) => {
			if (res.confirm) {
				try {
					await personalCategoryApi.reset();
					uni.showToast({ title: '已恢复默认', icon: 'success' });
					expandedId.value = null;
					loadCategories();
				} catch (e) { }
			}
		}
	});
};

const goBack = () => uni.navigateBack();
onShow(() => { loadCategories(); });
</script>

<style lang="scss" scoped>
.categories-container { background-color: #f6f6f6; min-height: 100vh; min-height: 100dvh; }

.custom-navbar {
	display: flex; align-items: center; justify-content: space-between;
	width: 100%; height: 88rpx; padding: 0 10rpx; background-color: #f6f6f6;
	.nav-left, .nav-right {
		width: 88rpx; height: 88rpx;
		display: flex; align-items: center; justify-content: center;
	}
}
.nav-center { flex: 1; display: flex; justify-content: center; }
.nav-title { font-size: 34rpx; font-weight: 600; color: #1c1c1e; }

.type-selector { padding: 10rpx 30rpx 30rpx 30rpx; }
.segmented {
	display: flex; position: relative; background: #fff; padding: 0 8rpx;
	border-radius: 24rpx; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
}
.seg-slider {
	position: absolute; top: 8rpx; left: 8rpx;
	width: calc((100% - 16rpx) / 3); height: calc(100% - 16rpx);
	background: linear-gradient(135deg, #ff6700 0%, #ff8f3d 100%);
	border-radius: 18rpx; box-shadow: 0 8rpx 20rpx rgba(255,103,0,0.25);
	transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
}
.seg-item {
	flex: 1; text-align: center; padding: 22rpx 24rpx;
	border-radius: 18rpx; position: relative; z-index: 1;
	text { font-size: 30rpx; font-weight: 500; color: #8e8e93; transition: color 0.3s ease; }
	&.active text { color: #fff; font-weight: 600; }
}

.section-card {
	margin: 0 30rpx 20rpx; background: #fff; border-radius: 24rpx;
	box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06); padding: 24rpx 16rpx;
}
.section-tip {
	display: flex; align-items: center; gap: 8rpx;
	padding: 0 12rpx 20rpx;
	text { font-size: 24rpx; color: #c7c7cc; }
}
.sub-section { background: #fafafa; }
.sub-header {
	padding: 0 12rpx 20rpx; border-bottom: 1rpx solid #f0f0f0; margin-bottom: 20rpx;
}
.sub-title { font-size: 28rpx; font-weight: 500; color: #8e8e93; }

.grid-wrap { display: flex; flex-wrap: wrap; }
.grid-item {
	width: 20%; display: flex; flex-direction: column; align-items: center;
	padding: 16rpx 0; border-radius: 16rpx; transition: background 0.2s;
	&.selected { background: rgba(255,103,0,0.08); }
	&:active { background: #f0f0f0; }
}
.grid-icon {
	width: 88rpx; height: 88rpx; border-radius: 50%;
	display: flex; align-items: center; justify-content: center;
	&.small { width: 72rpx; height: 72rpx; }
}
.grid-name {
	font-size: 24rpx; color: #1c1c1e; margin-top: 10rpx;
	max-width: 120rpx; text-align: center;
	overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.add-icon { background: #f0f0f0; }
.add-text { color: #ff6700; }

.action-menu {
	padding: 20rpx 30rpx; padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
.action-menu-item {
	display: flex; align-items: center; gap: 24rpx;
	padding: 28rpx 20rpx; border-radius: 16rpx;
	font-size: 30rpx; color: #1c1c1e;
	&:active { background: #f0f0f0; }
	&.danger { color: #ff3b30; }
}
.action-menu-cancel {
	margin-top: 16rpx; padding: 28rpx; text-align: center;
	border-radius: 16rpx; background: #f6f6f6; font-size: 30rpx; color: #8e8e93;
	&:active { background: #eee; }
}

.popup-content {
	padding: 12rpx 30rpx 40rpx 30rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}
.popup-header { display: flex; justify-content: center; padding: 0 0 32rpx 0; }
.popup-title { font-size: 32rpx; font-weight: 600; color: #1c1c1e; }
.form-section { display: flex; flex-direction: column; gap: 30rpx; }
.form-item { display: flex; flex-direction: column; gap: 16rpx; }
.form-label { font-size: 28rpx; font-weight: 500; color: #1c1c1e; }
.icon-scroll { max-height: 320rpx; }
.icon-selector {
	display: grid; grid-template-columns: repeat(6, 1fr); gap: 16rpx; padding: 8rpx;
}
.color-selector { display: flex; flex-wrap: wrap; gap: 20rpx; }
.icon-option {
	height: 88rpx; border-radius: 20rpx;
	display: flex; align-items: center; justify-content: center;
	background-color: #f6f6f6; transition: all 0.2s ease;
	&.active { background-color: #ff6700; color: #fff; transform: scale(1.08); }
}
.color-option {
	width: 72rpx; height: 72rpx; border-radius: 50%;
	display: flex; align-items: center; justify-content: center;
	transition: all 0.2s ease;
	&.active { box-shadow: 0 0 0 4rpx rgba(255,103,0,0.3); transform: scale(1.1); }
}
.popup-actions { margin-top: 40rpx; }
</style>
