// 文章详情（分包）—— mp-html 渲染服务端转换好的 HTML 正文
import { getPost } from '~/api/blog';

Page({
  data: {
    post: null,
    loading: true,
    error: '',
    dateText: '',
    coverPositionStyle: '',
    // mp-html 标签样式（组件只支持内联 style / tag-style，代码块与引用在这里兜底）
    tagStyle: {
      pre: 'background:#f6f6f6;padding:20rpx;border-radius:8rpx;font-size:26rpx;overflow-x:auto;',
      code: 'background:#f6f6f6;padding:2rpx 8rpx;border-radius:4rpx;font-size:24rpx;color:#d14;',
      img: 'max-width:100%;border-radius:8rpx;display:block;margin:16rpx 0;',
      blockquote: 'border-left:6rpx solid #0052d9;margin:16rpx 0;padding:8rpx 20rpx;color:#666;background:#f8faff;',
      p: 'margin:0 0 20rpx;line-height:1.8;font-size:30rpx;color:rgba(0,0,0,.85);',
      h1: 'font-size:36rpx;margin:32rpx 0 16rpx;',
      h2: 'font-size:34rpx;margin:32rpx 0 16rpx;',
      h3: 'font-size:32rpx;margin:28rpx 0 14rpx;',
      ul: 'margin:0 0 20rpx;padding-left:40rpx;font-size:30rpx;line-height:1.8;',
      ol: 'margin:0 0 20rpx;padding-left:40rpx;font-size:30rpx;line-height:1.8;',
      a: 'color:#0052d9;',
      table: 'border-collapse:collapse;margin:16rpx 0;font-size:26rpx;',
      th: 'border:1rpx solid #ddd;padding:8rpx 16rpx;background:#fafafa;',
      td: 'border:1rpx solid #ddd;padding:8rpx 16rpx;',
    },
  },

  onLoad(options) {
    const slug = options.slug || '';
    wx.setNavigationBarTitle({ title: '文章' });
    this.loadPost(slug);
  },

  async loadPost(slug) {
    if (!slug) {
      this.setData({ loading: false, error: '缺少文章参数' });
      return;
    }
    this.setData({ loading: true, error: '' });
    try {
      const post = await getPost(slug);
      if (!post) throw new Error('文章不存在');
      this.setData({
        post,
        dateText: (post.date || '').replace(/-/g, '.'),
        coverPositionStyle: post.coverPosition
          ? `object-position: ${post.coverPosition};`
          : '',
      });
      wx.setNavigationBarTitle({ title: post.title.slice(0, 20) });
    } catch (e) {
      this.setData({ error: e.message || '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onRetry() {
    this.loadPost(this.options && this.options.slug);
  },

  // 点击封面 → 预览大图
  onCoverTap(e) {
    const { src } = e.currentTarget.dataset;
    if (src) wx.previewImage({ current: src, urls: [src] });
  },

  // 点击正文图片 → 预览大图
  onImgTap(e) {
    const { src } = e.detail || {};
    if (!src) return;
    wx.previewImage({ current: src, urls: [src] });
  },

  onTagTap(e) {
    const { tag } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/taglist/index?tag=${encodeURIComponent(tag)}` });
  },
});
