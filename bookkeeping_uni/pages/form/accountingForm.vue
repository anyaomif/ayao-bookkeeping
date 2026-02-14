<template>
	<view class="container">
		<!-- 切换标签 -->
		<ay-tabs class="custom-tabs" justify="space-around" v-model="currentTab" :list="tabs"
			@change="handleTabChange"></ay-tabs>

		<!-- 点工模块 -->
		<view v-if="form.type === '点工'" class="work-section">
			<!-- 上班选项 -->
			<view class="form-card">
				<text class="card-title">工作选项</text>
				<view class="options-grid point-grid">
					<view v-for="(option, index) in workOptions" :key="index"
						:class="['option-item', { active: form.workOption === index }]" @tap="selectWorkOption(index)">
						<tn-icon :name="getWorkOptionIcon(index)" size="40"
							:color="form.workOption === index ? '#fff' : '#666'"></tn-icon>
						<text :class="{'bold': form.workOption === index && (index === 1 || index === 2)}">
							{{getWorkOptionLabel(option, index)}}
						</text>
					</view>
				</view>
			</view>

			<!-- 点工金额 -->
			<view class="form-card" v-show="form.workDays != 0">
				<text class="card-title">点工金额</text>
				<view class="amount-input">
					<ay-input v-model="form.pointIncome" type="digit" placeholder="请输入点工金额" border>
						<template #prefix>
							<tn-icon name="money" size="32" color="#ff6700"></tn-icon>
						</template>
						<template #suffix>
							<text class="unit">元</text>
						</template>
					</ay-input>
				</view>
			</view>

			<!-- 加班选项 -->
			<view class="form-card" v-show="form.workDays != 0">
				<text class="card-title">加班设置</text>
				<view class="overtime-section">
					<view class="switch-container">
						<text class="switch-label" :class="{'active': form.hasOvertime}">
							{{form.hasOvertime ? '有加班' : '无加班'}}
						</text>
						<ay-switch v-model="form.hasOvertime" @change="toggleOvertime" active-color="#ff6700"></ay-switch>
					</view>
					<view v-if="form.hasOvertime" class="overtime-input">
						<ay-input v-model="form.overtimeAmount" type="digit" placeholder="请输入加班工资" :border="true">
							<template #prefix>
								<tn-icon name="money" size="32" color="#ff6700"></tn-icon>
							</template>
							<template #suffix>
								<text class="unit">元</text>
							</template>
						</ay-input>
					</view>
				</view>
			</view>

			<!-- 备注 -->
			<view class="form-card">
				<text class="card-title">备注信息</text>
				<view class="remark-section">
					<ay-textarea v-model="form.remark" placeholder="请输入备注信息" border auto_height showWordLimit :maxlength="200">
					</ay-textarea>
					<view class="upload-section">
						<view class="upload-header">
							<text class="upload-title">图片上传</text>
							<text class="upload-desc">最多上传9张图片</text>
						</view>
						<view class="image-grid">
							<view v-for="(image, index) in form.imageList" :key="index" class="image-preview"
								@tap="previewImage(image)">
								<image :src="image" mode="aspectFill" class="preview-image"></image>
								<view class="delete-btn" @tap.stop="removeImage(index)">
									<tn-icon name="close" color="#fff" size="24"></tn-icon>
								</view>
							</view>
							<view class="upload-btn" @tap="uploadImage" v-if="form.imageList.length < 9">
								<view class="upload-content">
									<tn-icon name="camera" color="#999" size="48"></tn-icon>
									<text>上传图片</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 包工模块 -->
		<view v-else class="contract-section">
			<!-- 包工内容 -->
			<view class="form-card">
				<text class="card-title">包工内容</text>
				<view class="options-grid contract-grid">
					<view v-for="(option, index) in contractOptions" :key="index"
						:class="['option-item', { active: form.contractOption === index }]" @tap="selectContractOption(index)">
						<text :class="{'bold': form.contractOption === index}">
							{{index === 3 && form.otherContractContent ? form.otherContractContent : option.label}}
						</text>
					</view>
				</view>
			</view>

			<!-- 包工金额 -->
			<view class="form-card">
				<text class="card-title">包工金额</text>
				<view class="amount-input">
					<ay-input v-model="form.amount" type="digit" placeholder="请输入包工金额" :border="true">
						<template #prefix>
							<tn-icon name="money" size="32" color="#ff6700"></tn-icon>
						</template>
						<template #suffix>
							<text class="unit">元</text>
						</template>
					</ay-input>
				</view>
			</view>

			<!-- 备注 -->
			<view class="form-card">
				<text class="card-title">备注信息</text>
				<view class="remark-section">
					<ay-textarea v-model="form.remark" placeholder="请输入备注信息" border auto_height showWordLimit :maxlength="200">
					</ay-textarea>
					<view class="upload-section">
						<view class="upload-header">
							<text class="upload-title">图片上传</text>
							<text class="upload-desc">最多上传9张图片</text>
						</view>
						<view class="image-grid">
							<view v-for="(image, index) in form.imageList" :key="index" class="image-preview"
								@tap="previewImage(image)">
								<image :src="image" mode="aspectFill" class="preview-image"></image>
								<view class="delete-btn" @tap.stop="removeImage(index)">
									<tn-icon name="close" color="#fff" size="24"></tn-icon>
								</view>
							</view>
							<view class="upload-btn" @tap="uploadImage" v-if="form.imageList.length < 9">
								<view class="upload-content">
									<tn-icon name="camera" color="#999" size="48"></tn-icon>
									<text>上传图片</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 确认记账按钮 -->
		<view class="btns">
			<template v-if="formState === 'add'">
				<ay-button round block class="btn1" @click="confirmRecord">确认记账</ay-button>
			</template>
			<template v-else>
				<view class="btn-group">
					<view class="btn-delete" @click="handleDelete">
						<tn-icon name="delete" size="40" color="#ff6700"></tn-icon>
						<text>删除</text>
					</view>
					<ay-button round block class="btn-save" @click="confirmRecord">保存</ay-button>
				</view>
			</template>
		</view>

		<!-- 其他包工内容输入弹窗 -->
		<ay-popup v-model="showOtherInput" position="center" :closeOnClickOverlay="false">
			<view class="other-input-popup">
				<view class="popup-header">
					<text class="title">请输入包工内容</text>
				</view>
				<view class="popup-content">
					<ay-input v-model="tempOtherContent" placeholder="请输入" :border="true" :clearable="true" />
				</view>
				<view class="popup-footer">
					<view class="btn cancel" @tap="cancelOtherInput">取消</view>
					<view class="btn confirm" @tap="confirmOtherInput">确定</view>
				</view>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch,
		nextTick
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		getParams,
		baseUrl,
		navigateTo
	} from '../../utils/ayao';
	import {
		recordApi
	} from '@/api/record';
	import {
		uploadApi
	} from '@/api/upload';

	// 合并表单数据
	const form = ref({
		date: '',
		type: '点工', // 点工 或 包工
		project: null,
		workOption: 0,
		workDays: 1,
		workHours: 0,
		hasOvertime: false,
		overtimeAmount: '',
		contractOption: 0,
		otherContractContent: '',
		pointIncome: '',
		amount: '',
		remark: '',
		imageList: [],
		imageUrls: []
	});

	const currentTab = ref(0);

	const tabs = ref([{
			title: '点工',
			value: '点工'
		},
		{
			title: '包工',
			value: '包工'
		}
	]);

	const workOptions = ref([{
			label: '1个工'
		},
		{
			label: '选工天'
		},
		{
			label: '休息'
		}
	]);

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

	// 防止重复提交标记
	const isSubmitting = ref(false);

	// 其他包工内容相关
	const showOtherInput = ref(false);
	const tempOtherContent = ref('');

	// 添加表单状态和记录ID变量
	const formState = ref('add'); // 默认为新增状态
	const recordId = ref(''); // 记录ID

	// 添加 tab 切换处理函数
	const handleTabChange = (index) => {
		currentTab.value = index;
		if (index === 0) {
			form.value = {
				...form.value,
				type: '点工',
				workOption: 0,
				workDays: 1,
				hasOvertime: false,
				overtimeAmount: '',
				contractOption: '',
				otherContractContent: '',
				pointIncome: Number(form.value.project.daily_wage).toFixed(0),
				amount: '',
				remark: '',
				imageList: [],
				imageUrls: []
			};
		} else if (index === 1) {
			form.value = {
				...form.value,
				type: '包工',
				workOption: '',
				workDays: '',
				hasOvertime: false,
				overtimeAmount: '',
				contractOption: 0,
				otherContractContent: '',
				pointIncome: '',
				amount: '',
				remark: '',
				imageList: [],
				imageUrls: []
			};
		}

	};

	const goToProject = () => {
		uni.navigateTo({
			url: '/pages/project/list'
		})
	}

	// 选择上班选项
	const selectWorkOption = (index) => {
		form.value.workOption = index;
		if (index === 1) {
			selectWorkDays();
		} else if (index === 0) {
			form.value.workDays = 1;
			form.value.workHours = 0;
			form.value.pointIncome = Number(form.value.project.daily_wage).toFixed(0);
		} else {
			form.value.workDays = 0;
			form.value.workHours = 0;
			form.value.pointIncome = '0';
		}
	};

	// 切换加班状态
	const toggleOvertime = (event) => {
		form.value.hasOvertime = event;
	};

	// 选择工天
	const selectWorkDays = () => {
		uni.showActionSheet({
			itemList: ['0.5', '1', '1.5', '2', '2.5', '3'],
			success: (res) => {
				const days = parseFloat(['0.5', '1', '1.5', '2', '2.5', '3'][res.tapIndex]);
				form.value.workDays = days;
				form.value.pointIncome = (form.value.project.daily_wage * days).toFixed(0);
			}
		});
	};

	// 获取工作选项显示文本
	const getWorkOptionLabel = (option, index) => {
		if (index === 1 && form.value.workDays) {
			return `${form.value.workDays}工天`;
		}
		if (index === 2 && form.value.workHours) {
			return `${form.value.workHours}小时`;
		}
		return option.label;
	};

	// 选择包工选项
	const selectContractOption = (index) => {
		form.value.contractOption = index;
		if (index === 3) {
			showOtherInput.value = true;
		}
	};

	// 确认其他包工内容
	const confirmOtherInput = () => {
		if (tempOtherContent.value.trim()) {
			form.value.otherContractContent = tempOtherContent.value;
			showOtherInput.value = false;
		} else {
			uni.showToast({
				title: '请输入内容',
				icon: 'none'
			});
		}
	};

	// 取消其他包工内容输入
	const cancelOtherInput = () => {
		if (!form.value.otherContractContent) {
			form.value.contractOption = 0;
		}
		showOtherInput.value = false;
		tempOtherContent.value = '';
	};

	// 上传图片
	const uploadImage = async () => {
		try {
			const res = await uni.chooseImage({
				count: 9,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera']
			});

			uni.showLoading({
				title: '上传中...',
				mask: true
			});

			const currentForm = form.value.type === '点工' ? form : form;
			currentForm.value.imageList = [...currentForm.value.imageList, ...res.tempFilePaths];

			// 上传图片到服务器
			const uploadPromises = res.tempFilePaths.map(filePath => uploadApi.uploadImage(filePath));
			const uploadResults = await Promise.all(uploadPromises);

			// 保存上传后的URL
			currentForm.value.imageUrls = [...currentForm.value.imageUrls, ...uploadResults.map(res => res.url)];

			uni.hideLoading();
		} catch (error) {
			uni.hideLoading();
			uni.showToast({
				title: '上传失败',
				icon: 'none'
			});
		}
	};

	// 移除图片
	const removeImage = (index) => {
		const currentForm = form.value.type === '点工' ? form : form;
		currentForm.value.imageList.splice(index, 1);
		currentForm.value.imageUrls.splice(index, 1);
	};

	// 预览图片
	const previewImage = (image) => {
		const currentForm = form.value.type === '点工' ? form : form;
		uni.previewImage({
			urls: currentForm.value.imageList,
			current: image
		});
	};

	// 获取工作选项图标
	const getWorkOptionIcon = (index) => {
		const icons = ['check', 'calendar', 'emoji-good'];
		return icons[index];
	}

	// 确认记账
	const confirmRecord = async () => {
		if (isSubmitting.value) return;

		// 包工模式下验证金额
		if (form.value.type === '包工' && !form.value.amount) {
			uni.showToast({
				title: '请输入包工金额',
				icon: 'none'
			});
			return;
		}

		isSubmitting.value = true;

		try {
			uni.showLoading({
				title: '提交中...',
				mask: true
			});

			// 封装请求数据
			const requestData = {
				date: form.value.date,
				project: form.value.project.id,
				type: form.value.type,
				work_option: form.value.workOption,
				work_days: form.value.workDays,
				has_overtime: form.value.hasOvertime,
				overtime_amount: form.value.overtimeAmount,
				contract_option: form.value.contractOption,
				contract_content: form.value.otherContractContent,
				point_income: form.value.pointIncome,
				amount: form.value.amount ? parseFloat(form.value.amount) : 0,
				remark: form.value.remark,
				image_list: form.value.imageUrls
			};

			let res;
			if (formState.value === 'edit') {
				res = await recordApi.update(recordId.value, requestData);
			} else {
				res = await recordApi.create(requestData);
			}

			if (res.success) {
				uni.showToast({
					title: formState.value === 'edit' ? '修改成功' : '记账成功',
					icon: 'success'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			} else {
				throw new Error(res.message || '操作失败');
			}
		} catch (error) {
			uni.showToast({
				title: error.message || '操作失败',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
			setTimeout(() => {
				isSubmitting.value = false;
			}, 2000);
		}
	};

	// 返回上一页
	const goBack = () => {
		uni.navigateBack();
	};

	onLoad((option) => {
		const params = getParams(option);

		// 获取缓存的项目信息
		const currentProject = uni.getStorageSync('current_project');
		if (!currentProject) {
			uni.showModal({
				title: '提示',
				content: '你还没有创建账本哦，请前往创建',
				confirmText: '去创建',
				success: (res) => {
					if (res.confirm) {
						navigateTo('/pages/project/form');
					} else {
						uni.showToast({
							title: '请先创建第一个项目',
							icon: 'none'
						})
						uni.navigateBack();
					}
				}
			});
			return;
		}

		// 设置项目信息
		form.value.project = currentProject;
		form.value.pointIncome = Number(currentProject.daily_wage).toFixed(0);

		// 设置日期
		form.value.date = params.date;

		// 保存表单状态和记录ID
		formState.value = params.state || 'add';
		if (formState.value === 'edit' && params.id) {
			recordId.value = params.id;
			getRecordDetail(params.id);
		}

		// 设置标题
		uni.setNavigationBarTitle({
			title: formState.value === 'add' ? '记一笔' : '修改'
		});
	});

	// 获取记录详情
	const getRecordDetail = async (id) => {
		try {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});

			const res = await recordApi.getDetail(id);
			if (res.success) {
				res.data.type === '包工' ? currentTab.value = 1 : currentTab.value = 0;
				// 将后端数据映射到表单
				form.value = {
					...form.value,
					type: res.data.type,
					workOption: res.data.work_option,
					workDays: res.data.work_days,
					hasOvertime: res.data.has_overtime,
					overtimeAmount: res.data.overtime_amount,
					contractOption: res.data.contract_option,
					otherContractContent: res.data.contract_content,
					pointIncome: res.data.point_income,
					amount: res.data.amount,
					remark: res.data.remark,
					imageList: res.data.image_list.map(item => baseUrl + item),
					imageUrls: res.data.image_list.map(item => baseUrl + item)
				};
				tempOtherContent.value = res.data.otherContractContent;
			}
		} catch (error) {
			uni.showToast({
				title: '获取记录详情失败',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	};

	// 删除记录
	const handleDelete = () => {
		uni.showModal({
			title: '提示',
			content: '确定要删除这条记录吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						const res = await recordApi.delete(recordId.value);
						if (res.success) {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
							uni.navigateBack();
						}
					} catch (error) {
						console.log(error);
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						});
					}
				}
			}
		});
	};
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh; min-height: 100dvh;
		background-color: #f8f9fc;
		padding: 20rpx;
		padding-bottom: calc(140rpx + env(safe-area-inset-bottom));

		.custom-tabs {
			background: #fff;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		}

		.form-card {
			background: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

			.card-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 24rpx;
				display: block;
			}

			.options-grid {
				display: grid;
				gap: 20rpx;

				&.point-grid {
					grid-template-columns: repeat(3, 1fr);
				}

				&.contract-grid {
					grid-template-columns: repeat(2, 1fr);
				}

				.option-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 30rpx;
					background: #f8f9fc;
					border-radius: 12rpx;
					transition: all 0.3s;
					gap: 12rpx;

					text {
						font-size: 28rpx;
						color: #666;
					}

					.tn-icon {
						font-size: 48rpx;
					}

					&.active {
						background: linear-gradient(135deg, #ff6700, #ff8c3f);
						transform: translateY(-2rpx);
						box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.2);

						text {
							color: #fff;
						}
					}
				}
			}

			.overtime-section {
				.switch-container {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 24rpx;

					.switch-label {
						font-size: 28rpx;
						color: #666;
						transition: all 0.3s;

						&.active {
							color: #ff6700;
							font-weight: 500;
						}
					}
				}

				.overtime-input {
					background: #f8f9fc;
					border-radius: 12rpx;
					padding: 20rpx;

					.unit {
						font-size: 26rpx;
						color: #666;
						margin-left: 8rpx;
					}
				}
			}

			.remark-section {
				.upload-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 24rpx 0;

					.upload-title {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}

					.upload-desc {
						font-size: 24rpx;
						color: #999;
					}
				}

				.image-grid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 16rpx;

					.image-preview {
						position: relative;
						width: 100%;
						padding-bottom: 100%;
						border-radius: 12rpx;
						overflow: hidden;

						.preview-image {
							position: absolute;
							width: 100%;
							height: 100%;
							object-fit: cover;
						}

						.delete-btn {
							position: absolute;
							top: 8rpx;
							right: 8rpx;
							width: 40rpx;
							height: 40rpx;
							background: rgba(0, 0, 0, 0.5);
							border-radius: 20rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}

					.upload-btn {
						position: relative;
						width: 100%;
						padding-bottom: 100%;
						background: #f8f9fc;
						border-radius: 12rpx;

						.upload-content {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							gap: 8rpx;
						}

						text {
							font-size: 24rpx;
							color: #999;
						}

						&:active {
							opacity: 0.8;
						}
					}
				}
			}
		}

		.bottom-btn-area {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 20rpx 30rpx;
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
			background: rgba(255, 255, 255, 0.9);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);

			.submit-btn {
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 12rpx;
				background: linear-gradient(135deg, #ff6700, #ff8c3f);
				border-radius: 44rpx;
				color: #fff;
				font-size: 32rpx;
				font-weight: 500;
				box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.3);
				transition: all 0.3s;

				&:active {
					transform: translateY(2rpx);
					opacity: 0.9;
				}

				&.disabled {
					background: #ccc;
					box-shadow: none;
				}
			}
		}

		.contract-section {
			.form-card {
				.amount-input {
					background: #f8f9fc;
					border-radius: 12rpx;
					padding: 20rpx;

					.unit {
						font-size: 26rpx;
						color: #666;
						margin-left: 8rpx;
					}
				}
			}
		}
	}

	.bold {
		font-weight: bold;
		color: #fff !important;
	}

	.other-input-popup {
		width: 600rpx;
		background-color: #fff;
		border-radius: 24rpx;
		overflow: hidden;

		.popup-header {
			padding: 30rpx;
			text-align: center;
			border-bottom: 2rpx solid #f5f5f5;

			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}

		.popup-content {
			padding: 30rpx;
		}

		.popup-footer {
			display: flex;
			border-top: 2rpx solid #f5f5f5;

			.btn {
				flex: 1;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;

				&.cancel {
					color: #666;
					background-color: #f5f5f5;
				}

				&.confirm {
					color: #fff;
					background: linear-gradient(135deg, #ff6700, #ff8c3f);
				}

				&:active {
					opacity: 0.8;
				}
			}
		}
	}

	.btns {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);

		.btn1 {
			width: 90vw;
			height: 88rpx;
			margin: 0 auto;
			background: linear-gradient(135deg, #ff6700, #ff8c3f);
			box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.2);
		}

		.btn-group {
			display: flex;
			align-items: center;
			gap: 24rpx;
			padding: 0 20rpx;

			.btn-delete {
				width: 88rpx;
				height: 88rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background: #fff;
				border: 2rpx solid #ff4d4f;
				border-radius: 16rpx;
				gap: 4rpx;

				.tn-icon {
					font-size: 36rpx;
					color: #ff4d4f;
				}

				text {
					color: #ff4d4f;
					font-size: 20rpx;
				}

				&:active {
					background: rgba(255, 77, 79, 0.05);
					transform: scale(0.95);
				}
			}

			.btn-save {
				flex: 1;
				height: 88rpx;
				background: linear-gradient(135deg, #ff6700, #ff8c3f);
				box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.2);
				border-radius: 44rpx;
			}
		}
	}
</style>