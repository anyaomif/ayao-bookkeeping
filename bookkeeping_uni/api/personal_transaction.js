import http from '@/utils/request'

export const personalTransactionApi = {
  create(data) { return http.post('/personal/transactions', data) },
  getList(params) { return http.get('/personal/transactions', params) },
  getDetail(id) { return http.get(`/personal/transactions/${id}`) },
  update(id, data) { return http.put(`/personal/transactions/${id}`, data) },
  delete(id) { return http.delete(`/personal/transactions/${id}`) },
  getStatistics(params) { return http.get('/personal/statistics', params) },
}
