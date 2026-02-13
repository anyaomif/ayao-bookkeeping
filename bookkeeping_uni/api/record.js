import http from '@/utils/request'

// 记工记录相关接口
export const recordApi = {
	// 创建记工记录
	create(data) {
		return http.post('/records', data)
	},

	// 获取记工列表
	getList(params) {
		return http.get('/records', params)
	},

	// 根据项目获取记工记录
	getListByProject(id, params) {
		return http.get(`/projects/${id}/records`, params)
	},

	// 获取记工详情
	getDetail(id) {
		return http.get(`/records/${id}`)
	},

	// 更新记工记录
	update(id, data) {
		return http.put(`/records/${id}`, data)
	},

	// 删除记工记录
	delete(id) {
		return http.delete(`/records/${id}`)
	}
}