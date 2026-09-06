// 我的 —— 内容中心 + 关于（展示职责已全部移交「电子名片」页，本页只做读者向浏览与站点信息）
// 身份条取 /api/site；版本号静态维护(发版时手改)
import { getSite } from '~/api/blog';

const VERSION = '0.2.0';
const CHANGELOG = '我的页内容中心(归档/标签/关于) · 电子名片 · 访客留言';

Page({
  data: {
    author: { name: '', role: '', avatar: '' },
    githubRepos: [],
    version: VERSION,
    changelog: CHANGELOG,
    loading: true,
    error: '',
  },

  onLoad() {
    this.loadSite();
  },

  onPullDownRefresh() {
    this.loadSite().finally(() => wx.stopPullDownRefresh());
  },

  async loadSite() {
    this.setData({ loading: true, error: '' });
    try {
      const site = await getSite();
      const author = site.author || {};
      this.setData({
        author: {
          name: author.name || '',
          role: author.role || '',
          avatar: author.avatar || '',
        },
        githubRepos: [
          { label: '电子名片小程序(前端)', url: 'https://github.com/vincentlilee2/blog-miniapp-app' },
          { label: '小程序后端 API', url: 'https://github.com/vincentlilee2/blog-miniapp-api' },
        ],
      });
    } catch (e) {
      this.setData({ error: e.message || '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onRetry() {
    this.loadSite();
  },

  // ── 内容导航 ──
  goArchive() {
    wx.navigateTo({ url: '/pages/archive/index' });
  },
  goTags() {
    wx.navigateTo({ url: '/pages/tags/index' });
  },
  goAllPosts() {
    wx.switchTab({ url: '/pages/home/index' });
  },

  // ── 给我留言 ──
  goGuestbook() {
    wx.navigateTo({ url: '/pages/guestbook/index' });
  },

  // ── 关于：复制链接 ──
  onCopyLink(e) {
    const { url, label } = e.currentTarget.dataset;
    if (!url) return;
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title: `${label}已复制`, icon: 'none' }) });
  },

  // 点身份条 → 看完整电子名片
  goCard() {
    wx.switchTab({ url: '/pages/card/index' });
  },
});
