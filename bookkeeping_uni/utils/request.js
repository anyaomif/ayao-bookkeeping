import config from './config'

const BASE_URL = config.BASE_URL
const TIMEOUT = 15000

// 请求封装
const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    // 处理请求地址
    options.url = `${BASE_URL}${options.url}`
    
    // 处理请求头
    options.header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    
    // 获取本地存储的token
    const token = uni.getStorageSync('token')
    if (token) {
      options.header.Authorization = `Bearer ${token}`
    }
    
    // 发起请求
    uni.request({
      ...options,
      timeout: TIMEOUT,
      
      success: (res) => {
        const { statusCode, data } = res
        
        // 请求成功
        if (statusCode === 200) {
          if (data.success) {
            resolve(data)
          } else {
            uni.showToast({
              title: data.message || '请求失败',
              icon: 'none'
            })
            reject(data)
          }
        } 
        // 401 未授权
        else if (statusCode === 401) {
          // 清除本地token
          uni.removeStorageSync('token')
          // 跳转登录页
          uni.reLaunch({
            url: '/pages/login/login'
          })
          reject(new Error('未授权，请重新登录'))
        }
        // 其他错误
        else {
          uni.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(new Error('网络错误'))
        }
      },
      
      fail: (err) => {
        uni.showToast({
          title: '请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// 封装常用请求方法
const http = {
  get(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'GET',
      ...options
    })
  },
  
  post(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'POST',
      ...options
    })
  },
  
  put(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'PUT',
      ...options
    })
  },
  
  delete(url, data = {}, options = {}) {
    return request({
      url,
      data,
      method: 'DELETE',
      ...options
    })
  }
}

export default http 