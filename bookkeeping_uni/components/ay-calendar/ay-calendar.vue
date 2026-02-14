<template>
	<view class="ay-calendar-container">
		<view class="calendar-navigation">
			<view class="calendar-nav-prev" @click="prevMonth" :class="{'calendar-nav-prev-disabled': isAtStart}">
				<tn-icon class="calendar-nav-prev-icon" name="left" size="36" offset-top="2"></tn-icon>
				<text class="calendar-nav-prev-text">上个月</text>
			</view>

			<view class="calendar-month-title">
				<text class="calendar-month-title-main">{{ currentMonthTitle }}</text>
				<view class="calendar-month-title-background">{{ currentMonthTitle.slice(0, 4) }}</view>
			</view>

			<view class="calendar-nav-next" @click="nextMonth"
				:class="{'calendar-nav-next-disabled': isAtEnd}">
				<text class="calendar-nav-next-text">下个月</text>
				<tn-icon class="calendar-nav-next-icon" name="right" size="36" offset-top="2"></tn-icon>
			</view>
		</view>
		<view class="calendar-weekdays">
			<text v-for="day in weekdays" :key="day" class="weekday">
				{{ day }}
			</text>
		</view>
		<!-- #ifndef MP-WEIXIN -->
		<ay-swiper autoHight :duration="duration" :indicator="false" :current="currentSlide" @change="onSlideChange">
			<ay-swiper-item v-for="(monthData, index) in monthSlides" :key="index">
				<view class="calendar">
					<view class="calendar-days">
						<view v-for="day in monthData.days" :key="day.date.toISOString()" :class="[
		            'calendar-day', 
		            { 
		              'current-month': day.isCurrentMonth,
		              'today': day.isToday,
		              'selected': isSelectedDate(day.date),
		              'disabled': !isDateInRange(day.date)
		            }
		          ]" @tap="selectDate(day.date)">
							{{ day.day }}
							<text v-if="showLunar" class="lunar-date">{{ getLunarDate(day.date) }}</text>
							<slot name="content" :date="day"></slot>
						</view>
					</view>
					<view class="background-number">{{/(\d+)月/.exec(currentMonthTitle)[1]}}</view>
				</view>
			</ay-swiper-item>
		</ay-swiper>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view v-for="(monthData, index) in monthSlides" :key="index" v-show="currentSlide === index">
			<view class="calendar">
				<view class="calendar-days">
					<view v-for="day in monthData.days" :key="day.date.toISOString()" :class="[
		          'calendar-day', 
		          { 
		            'current-month': day.isCurrentMonth,
		            'today': day.isToday,
		            'selected': isSelectedDate(day.date),
		            'disabled': !isDateInRange(day.date)
		          }
		        ]" @tap="selectDate(day.date)">
						{{ day.day }}
						<text v-if="showLunar" class="lunar-date">{{ getLunarDate(day.date) }}</text>
						<slot name="content" :date="day"></slot>
					</view>
					<view class="background-number">{{/(\d+)月/.exec(currentMonthTitle)[1]}}</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		getLunarDate
	} from '@/utils/lunar-calendar';

	export default {
		name: 'AyCalendar',
		props: {
			startDate: {
				type: [Date, String],
				default () {
					const today = new Date();
					return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
				},
				validator(value) {
					const minDate = new Date(1970, 0, 1);
					const inputDate = value instanceof Date ? value : new Date(value);
					return !isNaN(inputDate.getTime()) && inputDate >= minDate;
				}
			},
			endDate: {
				type: [Date, String],
				default: null
			},
			showLunar: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				selectedDate: null,
				currentSlide: 0,
				monthSlides: [],
				weekdays: ['日', '一', '二', '三', '四', '五', '六'],
				duration: 0,
				monthCache: {}
			};
		},
		computed: {
			processedStartDate() {
				return this.parseDateInput(this.startDate);
			},
			processedEndDate() {
				return this.endDate ?
					this.parseDateInput(this.endDate) :
					new Date(this.processedStartDate.getFullYear(), 11, 31);
			},
			currentMonthTitle() {
				const currentMonth = this.monthSlides[this.currentSlide];
				return currentMonth ? currentMonth.title : '';
			},
			isAtStart() {
				const cur = this.monthSlides[this.currentSlide];
				if (!cur) return true;
				const s = this.processedStartDate;
				return cur.year === s.getFullYear() && cur.month === s.getMonth();
			},
			isAtEnd() {
				const cur = this.monthSlides[this.currentSlide];
				if (!cur) return true;
				const e = this.processedEndDate;
				return cur.year === e.getFullYear() && cur.month === e.getMonth();
			}
		},
		created() {
			const today = new Date();
			const startDate = this.processedStartDate;
			const endDate = this.processedEndDate;
			// 确定初始月份（当月，但不超出范围）
			let initYear = today.getFullYear();
			let initMonth = today.getMonth();
			if (today < startDate) { initYear = startDate.getFullYear(); initMonth = startDate.getMonth(); }
			if (today > endDate) { initYear = endDate.getFullYear(); initMonth = endDate.getMonth(); }

			// 生成当月±1
			const months = [];
			for (let offset = -1; offset <= 1; offset++) {
				const d = new Date(initYear, initMonth + offset, 1);
				if (d >= new Date(startDate.getFullYear(), startDate.getMonth(), 1) &&
					d <= new Date(endDate.getFullYear(), endDate.getMonth(), 1)) {
					months.push(this.buildMonth(d.getFullYear(), d.getMonth()));
				}
			}
			this.monthSlides = months;
			// currentSlide 指向当月
			const idx = months.findIndex(m => m.year === initYear && m.month === initMonth);
			this.currentSlide = idx >= 0 ? idx : 0;

			this.$nextTick(() => { setTimeout(() => { this.duration = 500; }, 100); });
		},
		methods: {
			parseDateInput(input) {
				if (input instanceof Date) {
					return input;
				}

				if (typeof input === 'string') {
					const dateStr = input.replace(/\//g, '-');
					const [year, month, day] = dateStr.split('-').map(Number);
					const parsedDate = new Date(year, month - 1, day || 1);

					// 验证日期是否有效且不小于1970年
					const minDate = new Date(1970, 0, 1);
					if (isNaN(parsedDate.getTime()) || parsedDate < minDate) {
						console.warn('Invalid date or date before 1970-01-01, using current date instead');
						return new Date();
					}

					return parsedDate;
				}

				return new Date();
			},
			buildMonth(year, month) {
				const key = `${year}-${month}`;
				if (this.monthCache[key]) return this.monthCache[key];
				const data = {
					title: `${year}年${month + 1}月`,
					year,
					month,
					days: this.generateCalendarDays(year, month)
				};
				this.monthCache[key] = data;
				return data;
			},
			ensureAdjacentMonths() {
				const cur = this.monthSlides[this.currentSlide];
				if (!cur) return;
				const startFirst = new Date(this.processedStartDate.getFullYear(), this.processedStartDate.getMonth(), 1);
				const endFirst = new Date(this.processedEndDate.getFullYear(), this.processedEndDate.getMonth(), 1);
				// 往前补
				const first = this.monthSlides[0];
				const prevD = new Date(first.year, first.month - 1, 1);
				if (prevD >= startFirst && this.currentSlide <= 1) {
					this.monthSlides.unshift(this.buildMonth(prevD.getFullYear(), prevD.getMonth()));
					this.currentSlide++;
				}
				// 往后补
				const last = this.monthSlides[this.monthSlides.length - 1];
				const nextD = new Date(last.year, last.month + 1, 1);
				if (nextD <= endFirst && this.currentSlide >= this.monthSlides.length - 2) {
					this.monthSlides.push(this.buildMonth(nextD.getFullYear(), nextD.getMonth()));
				}
			},
			onSlideChange(e) {
				this.currentSlide = e;
				this.ensureAdjacentMonths();
			},
			generateCalendarDays(year, month) {
				const firstDay = new Date(year, month, 1);
				const lastDay = new Date(year, month + 1, 0);
				const today = new Date();

				const days = [];
				const startingDay = firstDay.getDay();

				// 填充上个月的日期
				for (let i = 0; i < startingDay; i++) {
					const prevMonthDay = new Date(year, month, -startingDay + i + 1);
					days.push({
						day: prevMonthDay.getDate(),
						date: prevMonthDay,
						isCurrentMonth: false,
						isToday: this.isSameDay(prevMonthDay, today)
					});
				}

				// 当前月的日期
				for (let day = 1; day <= lastDay.getDate(); day++) {
					const date = new Date(year, month, day);
					days.push({
						day,
						date,
						isCurrentMonth: true,
						isToday: this.isSameDay(date, today)
					});
				}

				// 填充下个月的日期
				const remainingCells = 35 - days.length;
				for (let i = 1; i <= remainingCells; i++) {
					const nextMonthDay = new Date(year, month + 1, i);
					days.push({
						day: i,
						date: nextMonthDay,
						isCurrentMonth: false,
						isToday: this.isSameDay(nextMonthDay, today)
					});
				}

				return days;
			},
			selectDate(date) {
				if (this.isDateInRange(date)) {
					this.selectedDate = date;
					this.$emit('date-selected', date);

					const cur = this.monthSlides[this.currentSlide];
					if (date.getMonth() !== cur.month || date.getFullYear() !== cur.year) {
						// 查找目标月是否已在数组中
						let idx = this.monthSlides.findIndex(m => m.year === date.getFullYear() && m.month === date.getMonth());
						if (idx < 0) {
							// 动态插入目标月
							const target = this.buildMonth(date.getFullYear(), date.getMonth());
							const targetOffset = date.getFullYear() * 12 + date.getMonth();
							const curOffset = cur.year * 12 + cur.month;
							if (targetOffset < curOffset) {
								this.monthSlides.unshift(target);
								this.currentSlide++;
								idx = 0;
							} else {
								this.monthSlides.push(target);
								idx = this.monthSlides.length - 1;
							}
						}
						this.currentSlide = idx;
						this.ensureAdjacentMonths();
					}
				}
			},
			isSelectedDate(date) {
				return this.selectedDate && this.isSameDay(date, this.selectedDate);
			},
			isSameMonth(date1, date2) {
				return date1.getFullYear() === date2.getFullYear() &&
					date1.getMonth() === date2.getMonth();
			},
			isSameDay(date1, date2) {
				return (
					date1.getFullYear() === date2.getFullYear() &&
					date1.getMonth() === date2.getMonth() &&
					date1.getDate() === date2.getDate()
				);
			},
			isDateInRange(date) {
				const startTime = this.processedStartDate.getTime();
				const endTime = this.processedEndDate.getTime();
				const dateTime = date.getTime();

				return dateTime >= startTime && dateTime <= endTime;
			},
			getLunarDate(date) {
				return getLunarDate(date);
			},
			prevMonth() {
				if (this.currentSlide > 0) {
					this.currentSlide--;
					this.ensureAdjacentMonths();
				}
			},
			nextMonth() {
				if (this.currentSlide < this.monthSlides.length - 1) {
					this.currentSlide++;
					this.ensureAdjacentMonths();
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.ay-calendar-container {
		width: 100%;
		height: 100%;
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;

		.calendar {
			&-navigation {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 20rpx;
			}

			&-nav {

				&-prev,
				&-next {
					display: flex;
					align-items: center;
					line-height: 36rpx;
					cursor: pointer;
					color: #ff6700;

					&-icon {
						margin: {
							right: 10rpx;
							left: 10rpx;
						}
					}

					&-disabled {
						opacity: 0.3;
						cursor: not-allowed;
					}
				}
			}

			&-month-title {
				position: relative;
				text-align: center;

				&-main {
					font-size: 36rpx;
					color: #ff6700;
					font-weight: bold;
				}

				&-background {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					font-size: 100rpx;
					font-weight: bold;
					color: rgba(255, 103, 0, 0.15);
				}
			}
		}

		.calendar-weekdays {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			text-align: center;
			margin: 5px 0;
			padding: 0 15px;

			.weekday {
				color: #ff0000;
				font-weight: bold;
				opacity: 0.7;
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}

		.calendar {
			height: 100%;
			padding: 0 15px 15px;
			position: relative;

			&-days {
				display: grid;
				grid-template-columns: repeat(7, 1fr);
				gap: 5px;
				text-align: center;

				.background-number {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					font-size: 240rpx;
					font-weight: bold;
					color: rgba(255, 103, 0, 0.15);
					font-family: math;
					z-index: 0 !important;
				}

				.calendar-day {
					width: 90rpx;
					height: auto;
					min-height: 80rpx;
					line-height: 36rpx;
					padding: 10rpx 0;
					border-radius: 16rpx;
					cursor: pointer;
					transition: all 0.3s ease;
					font-size: 28rpx;
					position: relative;
					border: 2rpx solid transparent;
					box-sizing: border-box;
					z-index: 1;

					&:not(.current-month) {
						color: #ccc;
						cursor: default;
					}

					&.today {
						background-color: rgba(255, 103, 0, 0.1);
						color: #ff0000;
					}

					&.selected {
						border-color: #ff6700;
						color: #ff6700;
						background-color: transparent;
					}

					&.disabled {
						color: #ccc;
						cursor: not-allowed;
						opacity: 0.5;
					}

					/* #ifndef MP-WEIXIN */
					&:hover:not(.current-month, .disabled) {
						background-color: rgba(255, 0, 0, 0.1);
					}

					/* #endif */

					.lunar-date {
						display: block;
						white-space: nowrap;
						font-size: 20rpx;
						color: #999;
					}
				}
			}

			/* #ifndef MP-WEIXIN */
			.background-number {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				font-size: 240rpx;
				font-weight: bold;
				color: rgba(255, 103, 0, 0.15);
				font-family: math;
				z-index: -1;
			}

			/* #endif */
		}
	}
</style>