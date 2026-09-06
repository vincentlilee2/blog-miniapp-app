// app.js —— 记忆花园 Blog 小程序
import config from './config';

App({
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({ env: config.cloudEnv, traceUser: true });
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否重启应用？',
        success(res) {
          if (res.confirm) updateManager.applyUpdate();
        },
      });
    });
  },
  globalData: {},
});
