// Blog API 封装 —— 对应后端 miniapp/server.js 路由
import request from '~/api/request';

/** 文章列表：{ list, total, page, size, hasMore } */
export function getPosts({ page = 1, size = 10, tag = '' } = {}) {
  const query = { page, size };
  if (tag) query.tag = tag;
  return request(`/api/posts?${Object.entries(query).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`);
}

/** 文章详情：{ slug,title,description,date,tags,cover,coverPosition,contentHtml } */
export function getPost(slug) {
  return request(`/api/posts/${encodeURIComponent(slug)}`);
}

/** 标签聚合：[{name,count}] */
export function getTags() {
  return request('/api/tags');
}

/** 站点/作者信息 */
export function getSite() {
  return request('/api/site');
}

/** 访客留言（私信通道，邮件回传） */
export function submitGuestbook(name, contact, content) {
  return request('/api/guestbook', 'POST', { name, contact, content });
}
