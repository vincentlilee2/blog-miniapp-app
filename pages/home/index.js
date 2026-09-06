// 首页 —— 博客文章流（全部文章，按日期倒序，触底分页 + 下拉刷新）
import { getPosts } from '~/api/blog';

const PAGE_SIZE = 10;

Page({
  data: {
    posts: [],
    loading: false, // 首屏/翻页 loading
    loadingMore: false,
    finished: false, // 没有更多了
    error: '',
    initError: false,
  },

  onLoad() {
    this.loadFirstPage();
  },

  async loadFirstPage() {
    this.setData({ loading: true, error: '', initError: false });
    try {
      const data = await getPosts({ page: 1, size: PAGE_SIZE });
      this.setData({
        posts: data.list,
        finished: !data.hasMore,
      });
    } catch (e) {
      this.setData({ error: e.message || '加载失败', initError: true });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  async loadMore() {
    const { posts, loading, loadingMore, finished } = this.data;
    if (loading || loadingMore || finished) return;
    const nextPage = Math.floor(posts.length / PAGE_SIZE) + 1;
    this.setData({ loadingMore: true });
    try {
      const data = await getPosts({ page: nextPage, size: PAGE_SIZE });
      this.setData({
        posts: posts.concat(data.list),
        finished: !data.hasMore,
      });
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loadingMore: false });
    }
  },

  onReachBottom() {
    this.loadMore();
  },

  onPullDownRefresh() {
    this.loadFirstPage();
  },

  onRetry() {
    this.loadFirstPage();
  },
});
