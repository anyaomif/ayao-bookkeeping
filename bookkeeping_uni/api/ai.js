import http from '@/utils/request'
import config from '@/utils/config'

export const aiApi = {
  confirm(items, msgId) { return http.post('/personal/ai/confirm', { items, msgId }) },
  getHistory(page = 1, pageSize = 100) { return http.get('/personal/ai/history', { page, pageSize }) },
  clearHistory() { return http.delete('/personal/ai/history') },
  discard(msgId) { return http.post('/personal/ai/discard', { msgId }) },
};

// 语音转文字（5555api.com ASR）
// filePath: App/小程序端传文件路径，H5端传 Blob 对象
export function voiceToText(fileOrBlob) {
  // #ifdef H5
  if (fileOrBlob instanceof Blob) {
    return voiceToTextH5(fileOrBlob);
  }
  // #endif
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'https://5555api.com/data/api/fetchTextByVoice',
      filePath: fileOrBlob,
      name: 'audio',
      formData: { apikey: 'test_app_key_5555api.com' },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 200 || data.code === 0 || data.text) {
            resolve(data.text || data.data?.text || data.result || '');
          } else {
            reject(new Error(data.msg || data.message || '识别失败'));
          }
        } catch (e) {
          reject(new Error('解析响应失败'));
        }
      },
      fail: (err) => { reject(err); },
    });
  });
}

// H5端用 fetch + FormData 上传 Blob
function voiceToTextH5(blob) {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.ogg');
  formData.append('apikey', 'test_app_key_5555api.com');
  return fetch('https://5555api.com/data/api/fetchTextByVoice', {
    method: 'POST',
    body: formData,
  }).then(r => r.json()).then(data => {
    if (data.code === 200 || data.code === 0 || data.text) {
      return data.text || data.data?.text || data.result || '';
    }
    throw new Error(data.msg || data.message || '识别失败');
  });
}

// SSE流式请求，App端降级为非流式+打字机效果
export function aiStream(text, pendingItems, onChunk, onDone, onError) {
  const token = uni.getStorageSync('token');
  const data = { text };
  if (pendingItems && pendingItems.length) data.pendingItems = pendingItems;

  // App端不支持 onChunkReceived，直接走非流式
  // #ifdef APP-PLUS
  return aiStreamFallback(data, token, onChunk, onDone, onError);
  // #endif

  // 小程序/H5 走 SSE 流式
  // #ifndef APP-PLUS
  const requestTask = uni.request({
    url: `${config.BASE_URL}/personal/ai/stream`,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    enableChunked: true,
    success: () => {},
    fail: (err) => { onError(err); },
  });

  let buffer = '';
  requestTask.onChunkReceived((res) => {
    const text = arrayBufferToString(res.data);
    buffer += text;
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      try {
        const json = JSON.parse(trimmed.slice(5).trim());
        if (json.type === 'chunk') onChunk(json.content);
        else if (json.type === 'done') onDone(json);
        else if (json.type === 'error') onError(new Error(json.message));
      } catch (e) { /* 忽略 */ }
    }
  });

  return requestTask;
  // #endif
}

// App端降级：调非流式接口，模拟打字机逐字输出
function aiStreamFallback(data, token, onChunk, onDone, onError) {
  return uni.request({
    url: `${config.BASE_URL}/personal/ai/chat`,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    success: (res) => {
      const result = res.data?.data || res.data;
      if (!result || !result.reply) {
        onError(new Error('响应异常'));
        return;
      }
      // 打字机效果逐字输出
      const reply = result.reply;
      let i = 0;
      const step = 2;
      const timer = setInterval(() => {
        if (i < reply.length) {
          const chunk = reply.slice(i, i + step);
          onChunk(chunk);
          i += step;
        } else {
          clearInterval(timer);
          onDone({
            success: result.success || false,
            items: result.items || [],
            action: result.action || null,
            data: result.data || null,
          });
        }
      }, 30);
    },
    fail: (err) => { onError(err); },
  });
}

function arrayBufferToString(buffer) {
  try {
    return new TextDecoder('utf-8').decode(new Uint8Array(buffer));
  } catch (e) {
    const arr = new Uint8Array(buffer);
    let str = '';
    for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
    return decodeURIComponent(escape(str));
  }
}
