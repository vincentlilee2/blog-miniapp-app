// 电子名片（tab1，小程序默认首屏）—— 复刻 web 名片页 card/index.astro 的展示内容
// 数据源：/api/site（site-config.json 的 author + author.card，后台「名片」页可配置）
import { getSite } from '~/api/blog';

Page({
  data: {
    loading: true,
    error: '',
    card: {
      brand: '',
      name: '',
      role: '',
      sub: '',
      avatar: '',
      wechatId: '',
      wechatQr: '',
      officialQr: '',
      projects: [],
      socials: [],
    },
  },

  onLoad() {
    this.loadCard();
  },

  onPullDownRefresh() {
    this.loadCard().finally(() => wx.stopPullDownRefresh());
  },

  async loadCard() {
    this.setData({ loading: true, error: '' });
    try {
      const site = await getSite();
      const author = site.author || {};
      const c = author.card || {};
      const socialDefs = [
        { key: 'blog', label: '博客' },
        { key: 'github', label: 'GitHub' },
        { key: 'xiaohongshu', label: '小红书' },
        { key: 'guestbook', label: '给我留言' },
      ];
      this.setData({
        card: {
          brand: c.brand || '记忆花园 MemoryGarden',
          name: author.name || '',
          role: author.role || '',
          sub: c.sub || '',
          avatar: author.avatar || '',
          wechatId: c.wechatId || '',
          wechatQr: c.wechatQr || '',
          officialQr: c.officialQr || '',
          projects: (Array.isArray(c.projects) ? c.projects : []).filter((p) => p && p.name),
          socials: socialDefs
            .filter((s) => s.key === 'guestbook' || author[s.key])
            .map((s) => ({ ...s, url: author[s.key] || '' })),
        },
      });
    } catch (e) {
      this.setData({ error: e.message || '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onRetry() {
    this.loadCard();
  },

  // 点二维码 → 放大预览；长按可保存
  onQrPreview(e) {
    const { src } = e.currentTarget.dataset;
    if (src) wx.previewImage({ current: src, urls: [src] });
  },

  onCopyWechat() {
    const { wechatId } = this.data.card;
    if (!wechatId) return;
    wx.setClipboardData({ data: wechatId, success: () => wx.showToast({ title: '微信号已复制', icon: 'none' }) });
  },

  onSocialTap(e) {
    const { url, label, key } = e.currentTarget.dataset;
    // 留言入口 → 跳留言页；其余链接 → 复制
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
});
