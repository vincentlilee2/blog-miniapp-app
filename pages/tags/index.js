// 标签云 —— 点击进入该标签的文章列表（taglist 分包）
import { getTags } from '~/api/blog';

Page({
  data: {
    tags: [],
    loading: true,
    error: '',
  },

  onLoad() {
    this.loadTags();
  },

  async loadTags() {
    this.setData({ loading: true, error: '' });
    try {
      const tags = await getTags();
      this.setData({ tags });
    } catch (e) {
      this.setData({ error: e.message || '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onTagTap(e) {
    const { name } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/taglist/index?tag=${encodeURIComponent(name)}` });
  },

  onRetry() {
    this.loadTags();
  },
});
