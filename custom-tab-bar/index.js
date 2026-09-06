Component({
  data: {
    value: 'card', // 当前选中 tab（路由第二段 card/home/my）；默认 card=首屏名片页，防首帧主题闪烁
    list: [
      { icon: 'home', value: 'home', label: '首页' },
      { icon: 'card', value: 'card', label: '电子名片' },
      { icon: 'user', value: 'my', label: '我的' },
    ],
  },
  lifetimes: {
    ready() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      if (curPage) {
        const m = /pages\/(\w+)\/index/.exec(curPage.route || '');
        if (m && m[1]) this.setData({ value: m[1] });
      }
    },
  },
  methods: {
    handleChange(e) {
      const { value } = e.detail;
      wx.switchTab({ url: `/pages/${value}/index` });
    },
  },
});
