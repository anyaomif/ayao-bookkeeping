import http from '@/utils/request'

export const personalAccountApi = {
  init() { return http.post('/personal/accounts/init') },
  create(data) { return http.post('/personal/accounts', data) },
  getList() { return http.get('/personal/accounts') },
  getDetail(id) { return http.get(`/personal/accounts/${id}`) },
  update(id, data) { return http.put(`/personal/accounts/${id}`, data) },
  delete(id) { return http.delete(`/personal/accounts/${id}`) },
}
