import http from '@/utils/request'

// 项目管理相关接口
export const projectApi = {
  // 创建项目
  create(data) {
    return http.post('/projects', data)
  },

  // 获取项目列表
  getList(params) {
    return http.get('/projects', params)
  },

  // 获取项目详情
  getDetail(id) {
    return http.get(`/projects/${id}`)
  },

  // 更新项目
  update(id, data) {
    return http.put(`/projects/${id}`, data)
  },

  // 删除项目
  delete(id) {
    return http.delete(`/projects/${id}`)
  }
} 