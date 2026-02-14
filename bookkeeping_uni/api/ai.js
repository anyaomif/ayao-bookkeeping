import http from '@/utils/request'
import config from '@/utils/config'

export const aiApi = {
  confirm(items) { return http.post('/personal/ai/confirm', { items }) },
};

// SSE流式请求
export function aiStream(text, pendingItems, onChunk, onDone, onError) {
  const token = uni.getStorageSync('token');
  const data = { text };
  if (pendingItems && pendingItems.length) data.pendingItems = pendingItems;

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
