import http from '@/utils/request'

// 统计相关接口
export const statisticsApi = {
  // 获取统计数据
  getStatistics(params) {
    return http.post('/statistics', params)
  }
}
