// 我的 —— 作者名片（数据来自 /api/site，即 site-config.json）
// 小程序无法直接打开外链（web-view 需业务域名），社交/项目链接点击 = 复制到剪贴板
import { getSite } from '~/api/blog';

Page({
  data: {
    author: {},
    loading: true,
    error: '',
    // 社交链接白名单（图标名 → 跳转行为文案）
    socials: [],
    projects: [],
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
      // 社交链接：从 site-config 的 author 取，缺失自动隐藏
      const socialDefs = [
        { key: 'blog', icon: 'link', label: '博客站点' },
        { key: 'github', icon: 'logo-github', label: 'GitHub' },
        { key: 'xiaohongshu', icon: 'link', label: '小红书' },
        { key: 'guestbook', icon: 'chat-bubble', label: '给我留言' },
      ];
      const socials = socialDefs
        .filter((s) => s.key === 'guestbook' || author[s.key])
        .map((s) => ({ ...s, url: author[s.key] || '' }));
      this.setData({
        author,
        socials,
        projects: (author.card && author.card.projects) || [],
        wechatQr: (author.card && author.card.wechatQr) || '',
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

  // 社交/链接 → 复制；留言 → 跳留言页
  onSocialTap(e) {
    const { url, label, key } = e.currentTarget.dataset;
    if (key === 'guestbook') {
      wx.navigateTo({ url: '/pages/guestbook/index' });
      return;
    }
    if (!url) return;
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title: `${label}链接已复制`, icon: 'none' }) });
  },

  onProjectTap(e) {
    const { url, name } = e.currentTarget.dataset;
    if (!url || url === 'https://github.com/vincentlilee2/') return;
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title: `${name}链接已复制`, icon: 'none' }) });
  },

  onQrPreview(e) {
    const { src } = e.currentTarget.dataset;
    if (src) wx.previewImage({ current: src, urls: [src] });
  },

  onCopyWechat() {
    const { wechatid } = this.data.author.card || {};
    if (wechatid) wx.setClipboardData({ data: wechatid, success: () => wx.showToast({ title: '微信号已复制', icon: 'none' }) });
  },
});
