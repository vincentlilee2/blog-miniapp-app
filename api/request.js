import config from '~/config';

/**
 * 统一请求封装 —— 走微信云托管「小程序端内调用」(wx.cloud.callContainer)
 * 云网关通道：不需要 request 合法域名 / 备案域名，体验版与正式版均可用。
 * 前置：云托管服务开启「小程序端访问」；app.js 已 wx.cloud.init({env})
 *
 * 后端约定返回 { ok: true, data: ... }；非 ok / HTTP 非 2xx → reject
 */
function request(path, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    if (!wx.cloud || !wx.cloud.callContainer) {
      reject(new Error('基础库版本过低，不支持云托管调用'));
      return;
    }
    wx.cloud.callContainer({
      config: { env: config.cloudEnv },
      path, // 容器内路径，如 /api/posts
      method,
      data,
      header: {
        'content-type': 'application/json',
        // 显式指定目标服务（缺省会 INVALID_PATH -601031）
        'X-WX-SERVICE': config.cloudService,
      },
      success(res) {
        const body = res.data || {};
        if (res.statusCode >= 200 && res.statusCode < 300 && body.ok) {
          resolve(body.data);
        } else {
          const err = new Error((body && body.error) || `请求失败(${res.statusCode})`);
          err.statusCode = res.statusCode;
          reject(err);
        }
      },
      fail(err) {
        reject(new Error((err && err.errMsg) || '网络错误'));
      },
    });
  });
}

/** 带 toast 的请求（列表页公共错误提示用） */
export function requestWithToast(url, method, data) {
  return request(url, method, data).catch((err) => {
    wx.showToast({ title: err.message || '网络错误', icon: 'none' });
    throw err;
  });
}

export default request;
