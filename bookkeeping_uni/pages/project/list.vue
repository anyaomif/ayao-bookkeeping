<template>
	<view class="project-list">
		<!-- 顶部搜索栏 -->
		<view class="search-bar">
			<view class="filter-btn" @tap="showStatusFilter">
				<text>筛选</text>
				<tn-icon name="filter" size="30" color="#666"></tn-icon>
			</view>
			<view class="search-input">
				<tn-icon name="search" size="40" color="#666"></tn-icon>
				<input type="text" v-model="keyword" placeholder="搜索项目名称" @confirm="handleSearch" />
				<view class="search-btn" @tap="handleSearch">
					<text>搜索</text>
				</view>
			</view>
		</view>

		<!-- 项目列表 -->
		<view class="project-list-content">
			<view class="project-item" v-for="item in projectList" :key="item.id" @tap="goToDetail(item)">
				<view class="project-header">
					<text class="project-name">{{item.name}}</text>
					<view :class="['status-tag', 'status-' + item.status]">{{getStatusText(item.status)}}</view>
				</view>
				<view class="project-info">
					<view class="info-row">
						<text class="label">开始时间：</text>
						<text class="value">{{item.start_date}}</text>
					</view>
					<view class="info-row">
						<text class="label">日薪：</text>
						<text class="value">¥{{item.daily_wage}}/天</text>
					</view>
					<view class="info-row" v-if="item.location">
						<text class="label">地点：</text>
						<text class="value">{{item.location}}</text>
					</view>
				</view>
				<view class="project-footer">
					<view class="contact" v-if="item.contact_person || item.contact_phone">
						<text class="contact-name" v-if="item.contact_person">{{item.contact_person}}</text>
						<text class="contact-phone" v-if="item.contact_phone">{{item.contact_phone}}</text>
					</view>
					<view class="action-btns">
						<view class="edit-btn" @tap.stop="editProject(item)">
							<tn-icon name="edit" size="30"></tn-icon>
						</view>
						<view class="delete-btn" @tap.stop="deleteProject(item)">
							<tn-icon name="close" size="30"></tn-icon>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="projectList.length === 0">
				<text>暂无项目</text>
			</view>

			<!-- 加载更多 -->
			<view class="loading-more" v-if="projectList.length > 0">
				<text v-if="hasMore">加载中...</text>
				<text v-else>没有更多了</text>
			</view>
		</view>

		<!-- 新增按钮 -->
		<view class="add-btn" @tap="goToCreate">
			<tn-icon name="add" bold size="40" color="#fff"></tn-icon>
		</view>

		<!-- 状态筛选弹窗 -->
		<ay-popup v-model="showFilter" position="left" :z-index="1">
			<view class="filter-popup">
				<view class="filter-header">
					<text class="title">项目状态</text>
					<tn-icon name="close" @click="showFilter = false" size="40" color="#666"></tn-icon>
				</view>
				<view class="filter-content">
					<view class="filter-item" v-for="(item, index) in statusOptions" :key="index"
						:class="{active: status === item.value}" @tap="selectStatus(item.value)">
						<text>{{item.label}}</text>
						<tn-icon v-if="status === item.value" name="check" size="30" color="#ff6700"></tn-icon>
					</view>
				</view>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
	import {
		onPullDownRefresh,
		onReachBottom
	} from '@dcloudio/uni-app'

	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		projectApi
	} from '@/api/project.js'
	import {
		formatDate,
		navigateTo
	} from '@/utils/ayao.js'

	// 状态选项
	const statusOptions = [{
			label: '全部',
			value: 0
		},
		{
			label: '进行中',
			value: 1
		},
		{
			label: '已完成',
			value: 2
		},
		{
			label: '已终止',
			value: 3
		}
	]

	// 列表数据
	const projectList = ref([])
	const page = ref(1)
	const pageSize = ref(10)
	const total = ref(0)
	const hasMore = computed(() => projectList.value.length < total.value)
	const isRefreshing = ref(false)

	// 搜索和筛选
	const keyword = ref('')
	const status = ref(0)
	const statusText = computed(() => {
		const option = statusOptions.find(item => item.value === status.value)
		return option ? option.label : '全部'
	})
	const showFilter = ref(false)

	// 获取项目列表
	const getList = async (isRefresh = false) => {
		try {
			const params = {
				page: page.value,
				pageSize: pageSize.value,
				keyword: keyword.value,
				status: status.value || ''
			}

			const res = await projectApi.getList(params)
			if (res.success) {
				if (isRefresh) {
					projectList.value = res.data.list
				} else {
					projectList.value = [...projectList.value, ...res.data.list]
				}
				total.value = res.data.total
			}
		} catch (error) {
			uni.showToast({
				title: '获取项目列表失败',
				icon: 'none'
			})
		}
	}

	// 刷新列表
	const refresh = async () => {
		isRefreshing.value = true
		page.value = 1
		await getList(true)
		isRefreshing.value = false
	}

	// 加载更多
	const loadMore = () => {
		if (hasMore.value) {
			page.value++
			getList()
		}
	}

	// 搜索
	const handleSearch = () => {
		page.value = 1
		getList(true)
	}

	// 显示状态筛选
	const showStatusFilter = () => {
		showFilter.value = true
	}

	// 选择状态
	const selectStatus = (value) => {
		status.value = value
		showFilter.value = false
		page.value = 1
		getList(true)
	}

	// 获取状态文本
	const getStatusText = (status) => {
		const option = statusOptions.find(item => item.value === status)
		return option ? option.label : ''
	}

	// 跳转到详情
	const goToDetail = (item) => {
		navigateTo('/pages/project/detail', {
			id: item.id
		})
	}

	// 跳转到创建
	const goToCreate = () => {
		navigateTo('/pages/project/form')
	}

	// 编辑项目
	const editProject = (item) => {
		navigateTo('/pages/project/form', {
			id: item.id
		})
	}

	// 删除项目
	const deleteProject = (item) => {
		uni.showModal({
			title: '提示',
			content: '确定要删除该项目吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						const res = await projectApi.delete(item.id)
						if (res.success) {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							refresh()
						}
					} catch (error) {
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						})
					}
				}
			}
		})
	}

	// 下拉刷新
	onPullDownRefresh(() => {
		refresh().then(() => {
			uni.stopPullDownRefresh()
		})
	})

	// 触底加载
	onReachBottom(() => {
		loadMore()
	})

	onMounted(() => {
		getList()
	})
</script>

<style lang="scss" scoped>
	page {
		max-height: 100vh; max-height: 100dvh;
		overflow: hidden;
	}

	.project-list {
		height: calc(100vh - 44px); height: calc(100dvh - 44px);
		/* #ifdef APP,MP-WEIXIN */
		height: 100vh; height: 100dvh;
		/* #endif */
		background-color: #f8f9fc;
		position: relative;
		overflow-y: auto;

		.search-bar {
			position: fixed;
			// top: 44px;
			/* #ifdef APP,MP-WEIXIN */
			top: 0;
			/* #endif */
			left: 0;
			right: 0;
			z-index: 100;
			display: flex;
			align-items: center;
			padding: 20rpx;
			background-color: #fff;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);

			.search-input {
				flex: 1;
				display: flex;
				align-items: center;
				background-color: #f5f5f5;
				border-radius: 32rpx;
				padding: 10rpx 20rpx;
				position: relative;

				input {
					flex: 1;
					height: 64rpx;
					font-size: 28rpx;
					margin-left: 10rpx;
					padding-right: 120rpx;
				}

				.search-btn {
					position: absolute;
					right: 0;
					top: 0;
					bottom: 0;
					width: 120rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(90deg, #ff6700, #ff8c3f);
					border-radius: 0 32rpx 32rpx 0;

					text {
						color: #fff;
						font-size: 28rpx;
						font-weight: 500;
					}
				}
			}

			.filter-btn {
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				height: 64rpx;
				background-color: #f5f5f5;
				border-radius: 32rpx;
				margin-right: 10rpx;
				gap: 8rpx;

				text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}

		.project-list-content {
			padding: 20rpx;
			padding-top: 72px;
		}

		.project-item {
			background-color: #fff;
			border-radius: 24rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
			transition: all 0.3s;

			&:active {
				transform: scale(0.98);
				opacity: 0.9;
			}

			.project-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;

				.project-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					flex: 1;
					margin-right: 20rpx;
				}

				.status-tag {
					padding: 6rpx 24rpx;
					border-radius: 24rpx;
					font-size: 24rpx;
					font-weight: 500;

					&.status-1 {
						background-color: #e6f7ff;
						color: #1890ff;
					}

					&.status-2 {
						background-color: #f6ffed;
						color: #52c41a;
					}

					&.status-3 {
						background-color: #fff1f0;
						color: #f5222d;
					}
				}
			}

			.project-info {
				background-color: #f8f9fc;
				border-radius: 16rpx;
				padding: 24rpx;
				margin-bottom: 20rpx;

				.info-row {
					display: flex;
					margin-bottom: 16rpx;

					&:last-child {
						margin-bottom: 0;
					}

					.label {
						width: 140rpx;
						font-size: 26rpx;
						color: #666;
					}

					.value {
						flex: 1;
						font-size: 26rpx;
						color: #333;
						font-weight: 500;
					}
				}
			}

			.project-footer {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-top: 20rpx;
				border-top: 2rpx solid #f5f5f5;
				gap: 30rpx;

				.contact {
					flex: 1;
					display: flex;
					align-items: center;
					gap: 20rpx;
					min-height: 60rpx;

					.contact-name {
						font-size: 26rpx;
						color: #333;
						font-weight: 500;
						position: relative;
						padding-right: 20rpx;

						&::after {
							content: '';
							position: absolute;
							right: 0;
							top: 50%;
							transform: translateY(-50%);
							width: 2rpx;
							height: 24rpx;
							background-color: #ddd;
						}
					}

					.contact-phone {
						font-size: 26rpx;
						color: #666;
					}
				}

				.action-btns {
					display: flex;
					gap: 16rpx;

					.edit-btn,
					.delete-btn {
						width: 64rpx;
						height: 64rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 32rpx;
						transition: all 0.3s;

						&:active {
							transform: scale(0.9);
							opacity: 0.8;
						}
					}

					.edit-btn {
						background-color: #e6f7ff;

						.tn-icon {
							color: #1890ff !important;
						}
					}

					.delete-btn {
						background-color: #fff1f0;

						.tn-icon {
							color: #f5222d !important;
						}
					}
				}
			}
		}

		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 100rpx 0;

			image {
				width: 240rpx;
				height: 240rpx;
				margin-bottom: 30rpx;
			}

			text {
				font-size: 28rpx;
				color: #999;
			}
		}

		.loading-more {
			text-align: center;
			padding: 30rpx 0;
			font-size: 24rpx;
			color: #999;
		}

		.add-btn {
			position: fixed;
			right: 40rpx;
			bottom: calc(40rpx + env(safe-area-inset-bottom));
			width: 100rpx;
			height: 100rpx;
			background: linear-gradient(135deg, #ff6700, #ff8c3f);
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.3);
			transition: all 0.3s;

			&:active {
				transform: scale(0.9);
				opacity: 0.9;
			}
		}

		.filter-popup {
			width: 50vw;
			height: 100vh; height: 100dvh;
			background-color: #fff;
			padding-top: 106px;
			/* #ifdef APP */
			padding-top: 62px;
			/* #endif */

			.filter-header {
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

			.filter-content {
				padding: 20rpx 0;

				.filter-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx;
					transition: all 0.3s;

					&.active {
						color: #ff6700;
						background-color: #fff2e8;
					}

					text {
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>