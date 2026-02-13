<template>
	<view class="container">
		<ay-tabbar :currentTab="0" is-float text-only frosted></ay-tabbar>
		<!-- <view class="app-header-box"></view> -->
		<NavbarWrapper sticky>
			<ay-title title="俺要记账" class="ay-title">
				<template #right>
					<ProjectSelector v-model="currentProject" :projectList="projectList" @change="selectProject" />
				</template>
			</ay-title>
		</NavbarWrapper>

		<!-- 添加v-if等待数据加载 -->
		<template v-if="!isLoading">
			<ay-calendar :start-date="currentProject.start_date" :end-date="nowDate" @date-selected="handleDateSelect">
				<template v-slot:content="{date}">
					<view v-for="(record, index) in recordList" :key="index">
						<ay-tag v-if="formatDate(date?.date) === record?.date" class="tag" shape="round" font-size="16" bold
							size="small" :color="getTagColor(record)">
							{{getWorkText(record)}}
						</ay-tag>
					</view>
				</template>
			</ay-calendar>
		</template>
		<template v-else>
			<view class="loading">加载中...</view>
		</template>

		<view class="btns">
			<template v-if="!currentDayRecord">
				<ay-button round block class="btn1" @click="goForm('add')">记一笔</ay-button>
			</template>
			<template v-else>
				<view class="tn-flex">
					<ay-button round block class="btn2" @click="goForm('edit')">修改</ay-button>
					<ay-button round block class="btn2" @click="showRecordDetail">查看</ay-button>
				</view>
			</template>
		</view>

		<!-- 本月统计卡片 -->
		<ay-title title="本月统计"></ay-title>
		<view class="stats-card">
			<!-- 点工统计 -->
			<view class="stats-section">
				<view class="section-header">
					<text class="title">点工收入</text>
					<text class="total">¥{{formatNumber(monthlyStats.point.salary + monthlyStats.point.overtimeSalary)}}</text>
				</view>
				<view class="section-content">
					<view class="stats-item">
						<text class="label">工作天数</text>
						<text class="value">{{monthlyStats.point.workDays}}天</text>
					</view>
					<view class="stats-item">
						<text class="label">基本工资</text>
						<text class="value">¥{{formatNumber(monthlyStats.point.salary)}}</text>
					</view>
					<view class="stats-item">
						<text class="label">加班次数</text>
						<text class="value">{{monthlyStats.point.overtimeCount}}次</text>
					</view>
					<view class="stats-item">
						<text class="label">加班工资</text>
						<text class="value">¥{{formatNumber(monthlyStats.point.overtimeSalary)}}</text>
					</view>
				</view>
			</view>

			<!-- 包工统计 -->
			<view class="stats-section">
				<view class="section-header">
					<text class="title">包工收入</text>
					<text class="total">¥{{formatNumber(monthlyStats.contract.totalAmount)}}</text>
				</view>
				<view class="section-content">
					<view class="stats-item">
						<text class="label">总项目数</text>
						<text class="value">{{monthlyStats.contract.count}}个</text>
					</view>
					<view class="stats-item">
						<text class="label">总金额</text>
						<text class="value">¥{{monthlyStats.contract.totalAmount}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 记工详情弹窗 -->
		<ay-popup v-model="showDetailPopup" position="center" :overlay="true">
			<view class="record-detail-popup">
				<view class="popup-header">
					<text class="title">记工详情</text>
					<tn-icon name="close" @click="showDetailPopup = false" size="40" color="#666"></tn-icon>
				</view>

				<scroll-view scroll-y class="popup-content">
					<!-- 基本信息 -->
					<view class="detail-section">
						<view class="section-title">
							<tn-icon name="image-text" color="#ff6700" size="32"></tn-icon>
							<text>基本信息</text>
						</view>
						<view class="info-item">
							<text class="label">日期</text>
							<text class="value">{{currentDayRecord?.date}}</text>
						</view>
						<view class="info-item">
							<text class="label">类型</text>
							<text class="value">{{currentDayRecord?.type}}</text>
						</view>
					</view>

					<!-- 工作内容 -->
					<view class="detail-section" v-if="currentDayRecord?.type === '点工'">
						<view class="section-title">
							<tn-icon name="job" color="#ff6700" size="32"></tn-icon>
							<text>工作内容</text>
						</view>
						<view class="info-item">
							<text class="label">工作量</text>
							<text class="value">{{getWorkText(currentDayRecord)}}</text>
						</view>
						<view class="info-item" v-if="currentDayRecord?.has_overtime">
							<text class="label">有加班</text>
							<text class="value">加班费用{{currentDayRecord?.overtime_amount}}元</text>
						</view>
					</view>

					<!-- 包工内容 -->
					<view class="detail-section" v-if="currentDayRecord?.type === '包工'">
						<view class="section-title">
							<tn-icon name="job" color="#ff6700" size="32"></tn-icon>
							<text>包工内容</text>
						</view>
						<view class="info-item">
							<text class="label">内容</text>
							<text class="value">{{
								currentDayRecord.contract_option === 3 ? currentDayRecord.contract_content :
								contractOptions[currentDayRecord?.contract_option]?.label
							}}</text>
						</view>
						<view class="info-item">
							<text class="label">金额</text>
							<text class="value">¥{{currentDayRecord?.amount}}</text>
						</view>
					</view>

					<!-- 备注信息 -->
					<view class="detail-section" v-if="currentDayRecord?.remark || currentDayRecord?.image_list?.length">
						<view class="section-title">
							<tn-icon name="edit" color="#ff6700" size="32"></tn-icon>
							<text>备注信息</text>
						</view>
						<view class="remark-content" v-if="currentDayRecord?.remark">
							{{currentDayRecord?.remark}}
						</view>
						<view class="image-grid" v-if="currentDayRecord?.image_list?.length">
							<image v-for="(img, index) in currentDayRecord?.image_list" :key="index" :src="baseUrl+img"
								mode="aspectFill" @click="previewImage(img, currentDayRecord?.image_list)">
							</image>
						</view>
					</view>
				</scroll-view>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import {
		nextTick,
		ref,
		computed
	} from 'vue';
	import {
		formatDate,
		getNowDate,
		navigateTo,
		baseUrl
	} from '../../utils/ayao';
	import {
		recordApi
	} from '@/api/record.js'
	import {
		projectApi
	} from '@/api/project.js'

	const isLoading = ref(true)
	const selectDate = ref('')
	const nowDate = ref(getNowDate())
	const projectList = ref([])
	const currentProject = ref({})
	const recordList = ref([])
	const showDetailPopup = ref(false)
	const currentDayRecord = ref(null)

	const monthlyStats = ref({
		point: {
			workDays: 0, // 工作天数
			overtimeCount: 0, // 加班次数
			salary: 0, // 工资
			overtimeSalary: 0 // 加班工资
		},
		contract: {
			count: 0, // 包工数量
			totalAmount: 0 // 包工总金额
		}
	});

	const contractOptions = ref([{
			label: '砌墙'
		},
		{
			label: '贴砖'
		},
		{
			label: '刷漆'
		},
		{
			label: '其他'
		}
	]);

	// 获取工作文本
	const getWorkText = (record) => {
		if (!record) return '';

		if (record.type === '点工') {
			// 处理休息状态
			if (record.work_option === 2) {
				return '休息';
			}

			// 处理工天显示
			const days = parseFloat(record.work_days);
			if (days === 0.5) {
				return '半个工';
			} else if (days === 1) {
				return '一个工';
			} else if (days === 1.5) {
				return '一个半';
			} else if (days === 2) {
				return '两个工';
			} else if (days === 2.5) {
				return '两个半';
			} else if (days === 3) {
				return '三个工';
			}
			return `${days}个工`;
		} else if (record.type === '包工') {
			// 处理包工内容显示
			if (record.contract_option === 3 && record.contract_content) {
				return record.contract_content;
			}
			return contractOptions.value[record.contract_option].label;
		}
		return '';
	}

	const calculateMonthlyStatistics = () => {
		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1;

		// 重置统计数据
		monthlyStats.value = {
			point: {
				workDays: 0,
				overtimeCount: 0,
				salary: 0,
				overtimeSalary: 0
			},
			contract: {
				count: 0,
				totalAmount: 0
			}
		};

		// 过滤本月的记录
		const monthlyRecords = recordList.value.filter(record => {
			const [recordYear, recordMonth] = record.date.split('-').map(Number);
			return recordYear === year && recordMonth === month;
		});

		// 分别统计点工和包工数据
		monthlyRecords.forEach(record => {
			if (record.type === '点工') {
				// 统计工作天数
				monthlyStats.value.point.workDays += parseFloat(record.work_days) || 0;

				// 统计加班次数和加班工资
				if (record.has_overtime) {
					monthlyStats.value.point.overtimeCount++;
					monthlyStats.value.point.overtimeSalary += parseFloat(record.overtime_amount) || 0;
				}

				// 统计基本工资（这里需要从项目中获取日薪）
				const dailyWage = currentProject.value?.daily_wage || 0;
				monthlyStats.value.point.salary += dailyWage * parseFloat(record.work_days);

			} else if (record.type === '包工') {
				// 统计包工数据
				monthlyStats.value.contract.count++;
				monthlyStats.value.contract.totalAmount += parseFloat(record.amount) || 0;
			}
		});
	}

	// 修改获取记工记录列表方法
	const getRecordList = async () => {
		try {
			const res = await recordApi.getListByProject(currentProject.value.id)
			if (res.success) {
				recordList.value = res.data.list;
				calculateMonthlyStatistics();
				currentDayRecord.value = getCurrentDayRecord(new Date());
			}
		} catch (error) {
			uni.showToast({
				title: '获取记工记录失败',
				icon: 'none'
			})
		}
	}

	// 初始化数据
	const initData = async () => {
		try {
			isLoading.value = true;
			// 获取缓存中的项目
			const cachedProject = uni.getStorageSync('current_project');
			const token = uni.getStorageSync('token')

			if (!token) {
				uni.reLaunch({
					url: '/pages/login/login'
				})
				return
			}

			// 获取项目列表
			await getProjectList();

			if (projectList.value.length === 0) {
				uni.showModal({
					title: '提示',
					content: '你还没有创建账本哦，请前往创建',
					confirmText: '去创建',
					success: (res) => {
						if (res.confirm) {
							navigateTo('/pages/project/form');
						}
					}
				});
				return;
			}

			// 如果有缓存的项目，则使用缓存的项目
			if (cachedProject) {
				currentProject.value = cachedProject;
			} else {
				// 否则使用列表第一个项目
				currentProject.value = projectList.value[0];
				// 保存到缓存
				uni.setStorageSync('current_project', currentProject.value);
			}

			// 设置初始日期
			selectDate.value = formatDate(new Date());

			// 获取记工记录
			await getRecordList();
		} catch (error) {
			uni.showToast({
				title: '数据加载失败',
				icon: 'none'
			});
		} finally {
			isLoading.value = false;
		}
	}

	// 修改选择项目方法
	const selectProject = async (project) => {
		currentProject.value = project;

		// 保存到缓存
		uni.setStorageSync('current_project', project);

		// 重新加载记工记录
		isLoading.value = true;
		try {
			await getRecordList();
			currentDayRecord.value = getCurrentDayRecord(new Date());
		} catch (error) {
			console.error('刷新记工记录失败:', error);
		} finally {
			isLoading.value = false;
		}
	}

	// 获取项目列表
	const getProjectList = async () => {
		try {
			const res = await projectApi.getList()
			if (res.success) {
				projectList.value = res.data.list
			}
		} catch (error) {
			uni.showToast({
				title: '获取项目列表失败',
				icon: 'none'
			})
		}
	}

	// 获取当天记录
	const getCurrentDayRecord = (date) => {
		return recordList.value.find(record => record.date === formatDate(date));
	}

	// 显示记录详情
	const showRecordDetail = () => {
		showDetailPopup.value = true;
	}

	// 预览图片
	const previewImage = (current, urls) => {
		const fullUrls = urls.map(url => baseUrl + url);
		const currentUrl = baseUrl + current;

		uni.previewImage({
			current: currentUrl,
			urls: fullUrls
		});
	}

	// 修改日期选择处理方法
	const handleDateSelect = (time) => {
		const formattedDate = formatDate(time);
		selectDate.value = formattedDate;
		currentDayRecord.value = getCurrentDayRecord(time);
	}

	const goForm = (state) => {
		const params = {
			state,
			date: selectDate.value ? selectDate.value : nowDate.value
		};

		// 如果是编辑，需要传递记录ID
		if (state === 'edit' && currentDayRecord.value) {
			params.id = currentDayRecord.value.id;
		}

		navigateTo("/pages/form/accountingForm", params);
	}

	// 优化数字显示格式
	const formatNumber = (num) => {
		return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	// 修改标签颜色处理函数为计算属性
	const getTagColor = computed(() => {
		return (record) => {
			if (!record) return '#ff6700';

			if (record.type === '点工') {
				if (record.work_option === 2) {
					return '#52c41a'; // 休息状态显示绿色
				}
				return '#ff6700'; // 点工状态显示橙色
			} else if (record.type === '包工') {
				return '#1890ff'; // 包工状态显示蓝色
			}
			return '#ff6700'; // 默认颜色
		}
	});

	onShow(() => {
		if (!isLoading.value) {
			getRecordList()
			getProjectList()
		}
	})

	onLoad(() => {
		nextTick(() => {
			initData()
			// #ifdef APP
			uni.hideTabBar()
			// #endif
		})
	})
</script>

<style lang="scss" scoped>
	.container {
		padding-bottom: 140rpx;

		.app-header-box {
			width: 100vw;
			height: var(--status-bar-height);
			background: #fff;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1;
		}

		.ay-title {
			position: sticky;
			top: var(--status-bar-height);
			background: #fff;
			z-index: 1;
		}

		.btns {
			/* #ifdef MP-WEIXIN */
			margin: 20rpx;

			/* #endif */
			.btn1 {
				width: 90vw;
				margin: 20rpx auto;
			}

			.btn2 {
				width: 45vw;
				/* #ifndef MP-WEIXIN */
				margin: 20rpx auto;
				/* #endif */
				/* #ifdef MP-WEIXIN */
				margin: 0 auto;
				/* #endif */
			}
		}

		.stats-card {
			margin: 20rpx;
			border-radius: 24rpx;
			overflow: hidden;
			background: linear-gradient(135deg, #fff 0%, #f8f9fc 100%);
			box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);

			.stats-section {
				background: transparent;
				padding: 30rpx;
				position: relative;

				&:not(:last-child) {
					border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
				}

				.section-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 30rpx;

					.title {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
						position: relative;
						padding-left: 24rpx;

						&::before {
							content: '';
							position: absolute;
							left: 0;
							top: 50%;
							transform: translateY(-50%);
							width: 8rpx;
							height: 32rpx;
							background: #ff6700;
							border-radius: 4rpx;
						}
					}

					.total {
						font-size: 40rpx;
						font-weight: bold;
						background: linear-gradient(135deg, #ff6700, #ff8c3f);
						-webkit-background-clip: text;
						color: transparent;
					}
				}

				.section-content {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 20rpx;

					.stats-item {
						background: #fff;
						padding: 24rpx;
						border-radius: 16rpx;
						box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
						transition: all 0.3s;

						&:hover {
							transform: translateY(-2rpx);
							box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
						}

						.label {
							font-size: 26rpx;
							color: #666;
							display: block;
							margin-bottom: 12rpx;
						}

						.value {
							font-size: 32rpx;
							background: linear-gradient(135deg, #333 0%, #666 100%);
							-webkit-background-clip: text;
							color: transparent;
							font-weight: bold;
						}
					}
				}
			}
		}

		.loading {
			text-align: center;
			padding: 30rpx;
			color: #999;
			font-size: 28rpx;
		}
	}

	.tag {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: calc(34px);
	}

	.record-detail-popup {
		width: 80vw;
		max-height: 80vh;
		background-color: #fff;
		border-radius: 24rpx;
		overflow: hidden;

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

		.popup-content {
			max-height: calc(80vh - 100rpx);
			padding: 30rpx;
		}

		.detail-section {
			background-color: #f8f9fc;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 24rpx;

			.section-title {
				display: flex;
				align-items: center;
				gap: 12rpx;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
			}

			.info-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.label {
					font-size: 26rpx;
					color: #666;
				}

				.value {
					font-size: 26rpx;
					color: #333;
					font-weight: 500;
				}
			}

			.remark-content {
				font-size: 26rpx;
				color: #666;
				line-height: 1.6;
				margin-bottom: 16rpx;
			}

			.image-grid {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 16rpx;

				image {
					width: 100%;
					height: 160rpx;
					border-radius: 8rpx;
				}
			}
		}
	}
</style>