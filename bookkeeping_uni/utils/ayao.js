/* 
 * @Description: this is a utils file
 * @Version: 1.0
 * @Author: smallAnYao
 * @Date: 2025-01-28 11:43
 */

export const baseUrl = import.meta.env.VITE_API_URL;

// 获取当前年月日
export const getNowDate = () => {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day;
}

// 转换时间格式，目标格式为 yyyy-mm-dd
export const formatDate = (date) => {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day;
}

// 路由跳转封装
export const navigateTo = (url, params) => {
	uni.navigateTo({
		url: !params ? url : `${url}?params=${JSON.stringify(params)}`,
		success: res => {},
		fail: () => {},
		complete: () => {}
	});
}

// 取路由参数
export const getParams = (data) => {
	if (data && data.params) {
		return JSON.parse(data.params)
	} else {
		return null
	}
}

// 格式化数字，添加千分位分隔符，保留两位小数
export const formatNumber = (number) => {
	if (!number && number !== 0) return '0.00'
	
	// 将数字转换为字符串，并保留两位小数
	const num = parseFloat(number).toFixed(2)
	
	// 分割整数和小数部分
	const parts = num.toString().split('.')
	
	// 对整数部分添加千分位分隔符
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	
	// 重新组合整数和小数部分
	return parts.join('.')
}