import http from '@/utils/request'

export const personalCategoryApi = {
  init() { return http.post('/personal/categories/init') },
  reset() { return http.post('/personal/categories/reset') },
  getAll() { return http.get('/personal/categories') },
  getByType(type) { return http.get('/personal/categories', { type }) },
  create(data) { return http.post('/personal/categories', data) },
  update(id, data) { return http.put(`/personal/categories/${id}`, data) },
  delete(id) { return http.delete(`/personal/categories/${id}`) },
}
