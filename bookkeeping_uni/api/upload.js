import http from '@/utils/request'

// 上传相关接口
export const uploadApi = {
  // 上传图片
  uploadImage(filePath) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: `${import.meta.env.VITE_API_URL}/upload`,
        filePath,
        name: 'file',
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          const data = JSON.parse(res.data)
          if (data.code == 200) {
            resolve(data.data)
          } else {
            uni.showToast({
              title: data.message || '上传失败',
              icon: 'none'
            })
            reject(data)
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          })
          reject(err)
        }
      })
    })
  }
} 