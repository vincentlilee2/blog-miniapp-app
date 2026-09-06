# 记忆花园电子名片 · 微信小程序

> 微信小程序版的「数字名片」：深色精致的个人电子名片，附带博客文章流与访客留言。
> 配套后端仓库：[blog-miniapp-api](https://github.com/vincentlilee2/blog-miniapp-api)（Express + 微信云托管）。

## ✨ 功能

- **🪪 电子名片**（默认首屏）：品牌字标 + 头像 + 姓名/头衔/一句话 + 作品列表 + 社交入口 + 个人微信/公众号双二维码，长按可存码
- **💬 给我留言**：访客私信直达（邮件回传，不在小程序公开展示）
- **📰 博客文章流**：封面卡片列表、分页加载、下拉刷新（数据来自你的 Blog，md 写作 → 数据包 → API）
- **🏷 标签浏览**：标签云 → 同标签文章列表
- 自定义 tabBar 深色/浅色主题随页面切换；mp-html 富文本渲染

## 🏗 技术栈

原生小程序（JS + WXSS）+ [TDesign miniprogram](https://github.com/TDesignOteam/tdesign-miniprogram) 组件库 + [mp-html](https://github.com/jin-yufeng/mp-html) 富文本 + **微信云托管**后端。

## 🔑 关键设计：免域名调用

个人主体小程序没有可用备案域名时，API 走 **`wx.cloud.callContainer()`** 云网关通道——不需要 request 合法域名、不需要备案域名，体验版/正式版均可用（header 必须带 `X-WX-SERVICE` 指定服务名，否则报 `-601031 INVALID_PATH`）。

## 🚀 跑起来

1. 下载代码，用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)导入
2. `project.config.json` 的 `appid` 换成你自己的（当前为游客号）
3. `config.js` 填入你的云托管环境 ID 与服务名
4. 后端部署见 [blog-miniapp-api](https://github.com/vincentlilee2/blog-miniapp-api) README（Express + Dockerfile，`npm start` 即可本地跑）

> 文章/名片内容均来自后端 API（单一内容源：md + site-config），改内容不用重新发版。
> 留言默认发往作者邮箱，部署请改 `pages/guestbook/index.js` 与后端 `SMTP_*` 环境变量。

## 📄 开源协议

MIT —— 本项目基于 [tdesign-miniprogram-starter](https://github.com/TDesignOteam/tdesign-miniprogram-starter)（MIT）改造，保留其版权声明。
