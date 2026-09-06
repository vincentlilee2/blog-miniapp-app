// 往期文章（归档）—— 按月手风琴浏览（默认展开最新月份）
import { getArchive } from '~/api/blog';

Page({
  data: {
    months: [],
    loading: true,
    error: '',
    openMonth: '', // 当前展开的月份 key
  },

  onLoad() {
    this.loadArchive();
  },

  async loadArchive() {
    this.setData({ loading: true, error: '' });
    try {
      const archive = await getArchive();
      const months = (archive || []).map((m) => ({
        ...m,
        monthLabel: this.monthLabel(m.month),
        posts: (m.posts || []).map((p) => ({ ...p, dateShort: (p.date || '').slice(5) })),
      }));
      this.setData({
        months,
        openMonth: months.length ? months[0].month : '',
      });
    } catch (e) {
      this.setData({ error: e.message || '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  monthLabel(key) {
    const [y, m] = (key || '').split('-');
    return y && m ? `${y}年${Number(m)}月` : key;
  },

  onToggleMonth(e) {
    const { month } = e.currentTarget.dataset;
    this.setData({ openMonth: this.data.openMonth === month ? '' : month });
  },

  onPostTap(e) {
    const { slug } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/article/index?slug=${slug}` });
  },

  onRetry() {
    this.loadArchive();
  },
});
