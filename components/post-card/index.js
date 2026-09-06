// 文章卡片组件 props: post = { slug,title,description,date,tags,cover,coverPosition }
Component({
  properties: {
    post: { type: Object, value: {} },
  },
  data: {
    dateText: '',
  },
  observers: {
    'post.date'(date) {
      this.setData({ dateText: this.formatDate(date) });
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      // API 返回 YYYY-MM-DD
      return date.replace(/-/g, '.');
    },
    onTap() {
      const { slug } = this.data.post;
      if (!slug) return;
      wx.navigateTo({ url: `/pages/article/index?slug=${slug}` });
    },
    onTagTap(e) {
      const { tag } = e.currentTarget.dataset;
      wx.navigateTo({ url: `/pages/taglist/index?tag=${encodeURIComponent(tag)}` });
    },
  },
});
