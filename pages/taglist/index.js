// 标签文章列表（分包）—— 展示某标签下全部文章，复用首页列表交互
import { getPosts } from '~/api/blog';

const PAGE_SIZE = 10;

Page({
  data: {
    tag: '',
    posts: [],
    loading: true,
    loadingMore: false,
    finished: false,
    error: '',
    initError: false,
  },

  onLoad(options) {
    const tag = decodeURIComponent(options.tag || '');
    this.setData({ tag });
    if (tag) wx.setNavigationBarTitle({ title: `# ${tag}` });
    this.loadFirstPage();
  },

  async loadFirstPage() {
    const { tag } = this.data;
    this.setData({ loading: true, error: '', initError: false });
    try {
      const data = await getPosts({ page: 1, size: PAGE_SIZE, tag });
      this.setData({ posts: data.list, finished: !data.hasMore });
    } catch (e) {
      this.setData({ error: e.message || '加载失败', initError: true });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  async loadMore() {
    const { tag, posts, loading, loadingMore, finished } = this.data;
    if (loading || loadingMore || finished) return;
    const nextPage = Math.floor(posts.length / PAGE_SIZE) + 1;
    this.setData({ loadingMore: true });
    try {
      const data = await getPosts({ page: nextPage, size: PAGE_SIZE, tag });
      this.setData({ posts: posts.concat(data.list), finished: !data.hasMore });
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
