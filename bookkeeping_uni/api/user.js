import http from '@/utils/request.js'

// 用户相关接口
export const userApi = {
	// 用户注册
	register(data) {
		return http.post('/user/register', data)
	},

	// 用户登录
	login(data) {
		return http.post('/user/login', data)
	},

	// 获取用户信息
	getUserInfo() {
		return http.get('/user/info')
	},

	// 更新用户信息
	updateUserInfo(data) {
		return http.put('/user/update', data)
	},

	// 修改密码
	updatePassword(data) {
		return http.put('/user/password', data)
	},

	// 获取工作统计数据
	getWorkStats() {
		return http.get('/user/work-stats')
	},

	// 获取更新
	getUpdate(data) {
		return http.post('/check-update', data)
	}
}