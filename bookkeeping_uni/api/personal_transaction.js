import http from '@/utils/request'

export const personalTransactionApi = {
  create(data) { return http.post('/personal/transactions', data) },
  getList(params) { return http.get('/personal/transactions', params) },
  getRecent(days = 3) { return http.get('/personal/transactions/recent', { days }) },
  getDetail(id) { return http.get(`/personal/transactions/${id}`) },
  update(id, data) { return http.put(`/personal/transactions/${id}`, data) },
  delete(id) { return http.delete(`/personal/transactions/${id}`) },
  getStatistics(params) { return http.get('/personal/statistics', params) },
  getReport(params) { return http.get('/personal/statistics/report', params) },
  getUserStats() { return http.get('/personal/statistics/user-stats') },
}
