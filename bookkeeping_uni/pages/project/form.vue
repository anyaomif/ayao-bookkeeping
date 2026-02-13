<template>
	<view class="project-form">
		<!-- 表单内容 -->
		<view class="form-content">
			<!-- 基本信息 -->
			<view class="form-section">
				<ay-title title="基本信息" bold padding="0" margin="0"></ay-title>
				<view class="form-item">
					<text class="label required">项目名称</text>
					<ay-input class="form-value" v-model="form.name" placeholder="请输入项目名称" :underline="true" :clearable="true" />
				</view>

				<view class="form-item">
					<text class="label required">开始时间</text>
					<ay-input class="form-value" v-model="form.start_date" placeholder="请选择开始时间" :underline="true" readonly
						@click="showDatePicker('start')" @focus.prevent>
						<template #suffix>
							<tn-icon name="calendar" size="30" color="#ff6700" @click="showDatePicker('start')"></tn-icon>
						</template>
					</ay-input>
				</view>

				<view class="form-item">
					<text class="label">结束时间</text>
					<ay-input class="form-value" v-model="form.end_date" placeholder="请选择结束时间" :underline="true" readonly
						@click="showDatePicker('end')" @focus.prevent>
						<template #suffix>
							<tn-icon name="calendar" size="30" color="#ff6700" @click="showDatePicker('end')"></tn-icon>
						</template>
					</ay-input>
				</view>

				<view class="form-item">
					<text class="label">项目地点</text>
					<ay-input class="form-value" v-model="form.location" placeholder="请输入项目地点" :underline="true"
						:clearable="true">
						<template #suffix>
							<tn-icon name="location" size="30" color="#666"></tn-icon>
						</template>
					</ay-input>
				</view>

				<view class="form-item">
					<text class="label">项目描述</text>
					<ay-textarea class="form-value" v-model="form.description" placeholder="请输入项目描述" border auto_height
						showWordLimit :maxlength="200">
					</ay-textarea>
				</view>
			</view>

			<!-- 工资设置 -->
			<view class="form-section">
				<ay-title title="工资设置" bold padding="0" margin="0"></ay-title>
				<view class="form-item">
					<text class="label required">点工日薪</text>
					<ay-input class="form-value" v-model="form.daily_wage" type="digit" placeholder="请输入点工日薪" :underline="true"
						align="right">
						<template #suffix>
							<text class="unit">元/天</text>
						</template>
					</ay-input>
				</view>
			</view>

			<!-- 联系人信息 -->
			<view class="form-section">
				<ay-title title="联系人信息" bold padding="0" margin="0"></ay-title>
				<view class="form-item">
					<text class="label">联系人</text>
					<ay-input class="form-value" v-model="form.contact_person" placeholder="请输入联系人" :underline="true"
						:clearable="true">
					</ay-input>
				</view>

				<view class="form-item">
					<text class="label">联系电话</text>
					<ay-input class="form-value" v-model="form.contact_phone" type="number" placeholder="请输入联系电话"
						:underline="true" :maxlength="11" :clearable="true">
					</ay-input>
				</view>
			</view>

			<!-- 项目状态 -->
			<view class="form-section">
				<ay-title title="项目状态" bold margin="0" padding="0"></ay-title>
				<view class="status-options">
					<view v-for="(item, index) in statusOptions" :key="index"
						:class="['status-item', { active: form.status === item.value }]" @tap="selectStatus(item.value)">
						<text>{{item.label}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-btn-area">
			<view class="submit-btn" @tap="handleSubmit">
				{{isEdit ? '保存' : '创建'}}
			</view>
		</view>

		<!-- 日期选择器 -->
		<ay-popup v-model="showCalendar" position="bottom">
			<view class="calendar-container">
				<ay-calendar v-if="showCalendar" :startDate="calendarStartDate" :endDate="calendarEndDate"
					@date-selected="handleDateSelect"></ay-calendar>
			</view>
		</ay-popup>
	</view>
</template>

<script setup>
	import {
		onLoad
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
		getParams,
		formatDate,
		getNowDate
	} from '@/utils/ayao.js'

	const statusOptions = [{
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

	// 表单数据
	const form = ref({
		name: '',
		start_date: '',
		end_date: '',
		daily_wage: '',
		status: 1,
		location: '',
		description: '',
		contact_person: '',
		contact_phone: ''
	})

	// 日期选择相关
	const showCalendar = ref(false)
	const dateType = ref('start')

	// 计算日历的开始和结束日期
	const calendarStartDate = computed(() => {
		if (dateType.value === 'end' && form.value.start_date) {
			return form.value.start_date
		}
		return '2024-01-01'
	})

	const calendarEndDate = computed(() => {
		if (dateType.value === 'start' && form.value.end_date) {
			return form.value.end_date
		}
		return getNowDate()
	})

	// 编辑状态
	const isEdit = ref(false)
	const projectId = ref('')

	// 显示日期选择器
	const showDatePicker = (type) => {
		dateType.value = type
		showCalendar.value = true
	}

	// 日期选择回调
	const handleDateSelect = (date) => {
		const formattedDate = formatDate(date)
		if (dateType.value === 'start') {
			form.value.start_date = formattedDate
			// 如果结束日期小于开始日期，清空结束日期
			if (form.value.end_date && form.value.end_date < formattedDate) {
				form.value.end_date = ''
			}
		} else {
			form.value.end_date = formattedDate
		}
		showCalendar.value = false
	}

	// 选择状态
	const selectStatus = (value) => {
		form.value.status = value
	}

	// 表单验证
	const validateForm = () => {
		if (!form.value.name) {
			uni.showToast({
				title: '请输入项目名称',
				icon: 'none'
			})
			return false
		}
		if (!form.value.start_date) {
			uni.showToast({
				title: '请选择开始时间',
				icon: 'none'
			})
			return false
		}
		if (!form.value.daily_wage) {
			uni.showToast({
				title: '请输入点工日薪',
				icon: 'none'
			})
			return false
		}
		return true
	}

	// 提交表单
	const handleSubmit = async () => {
		if (!validateForm()) return

		try {
			uni.showLoading({
				title: '提交中...',
				mask: true
			})

			const submitData = {
				...form.value,
				daily_wage: parseFloat(form.value.daily_wage)
			}

			const res = isEdit.value ?
				await projectApi.update(projectId.value, submitData) :
				await projectApi.create(submitData)

			if (res.success) {
				// 编辑时同步更新本地缓存的当前项目
				if (isEdit.value) {
					const cached = uni.getStorageSync('current_project')
					if (cached && String(cached.id) === String(projectId.value)) {
						uni.setStorageSync('current_project', res.data)
					}
				}

				uni.showToast({
					title: isEdit.value ? '修改成功' : '创建成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			}
		} catch (error) {
			uni.showToast({
				title: error.message || '提交失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	// 获取项目详情
	const getProjectDetail = async (id) => {
		try {
			const res = await projectApi.getDetail(id)
			if (res.success) {
				form.value = res.data
			}
		} catch (error) {
			uni.showToast({
				title: '获取项目详情失败',
				icon: 'none'
			})
		}
	}

	onLoad((options) => {
		const params = getParams(options)
		if (params?.id) {
			isEdit.value = true
			projectId.value = params.id
			getProjectDetail(params.id)
		}
	})
</script>

<style lang="scss" scoped>
	.project-form {
		min-height: 100vh;
		background-color: #f8f9fc;
		padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);

		.form-content {
			padding: 20rpx;
		}

		.form-section {
			background-color: #fff;
			border-radius: 24rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

			.form-item {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				&:last-child {
					margin-bottom: 0;
				}

				&.is-vertical {
					flex-direction: column;
					align-items: flex-start;

					.label {
						margin-bottom: 16rpx;
					}
				}

				.label {
					width: 180rpx;
					font-size: 28rpx;
					color: #333;
					padding: 8rpx 0 0 10rpx;
					position: relative;

					&.required::before {
						content: '*';
						color: #ff4d4f;
						margin-right: 4rpx;
						font-weight: bold;
						position: absolute;
						left: -5rpx;
						top: 5rpx;
					}
				}

				.form-value {
					flex: 1;
				}

				.unit {
					font-size: 26rpx;
					color: #666;
					margin-left: 8rpx;
					padding-right: 8rpx;
				}
			}
		}

		.status-options {
			display: flex;
			gap: 20rpx;
			margin-top: 20rpx;

			.status-item {
				flex: 1;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f5f5f5;
				border-radius: 44rpx;
				font-size: 28rpx;
				color: #666;
				transition: all 0.3s;

				&.active {
					background: linear-gradient(to right, #ff6700, #ff8c3f);
					color: #fff;
					box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.3);
					transform: translateY(-2rpx);
				}

				&:active {
					transform: translateY(0);
					opacity: 0.9;
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
			background-color: #fff;
			box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);

			.submit-btn {
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: linear-gradient(to right, #ff6700, #ff8c3f);
				color: #fff;
				border-radius: 44rpx;
				font-size: 32rpx;
				font-weight: 500;
				box-shadow: 0 4rpx 16rpx rgba(255, 103, 0, 0.3);
				transition: all 0.3s;

				&:active {
					transform: translateY(2rpx);
					opacity: 0.9;
				}
			}
		}

		.calendar-container {
			background-color: #fff;
			border-radius: 24rpx 24rpx 0 0;
			overflow: hidden;
		}
	}
</style>