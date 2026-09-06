// 全局配置 —— 部署前请替换为你自己的微信云托管环境
// API 走微信云托管「小程序端内调用」(wx.cloud.callContainer)——云网关通道，
// 不需要 request 合法域名、不需要自备备案域名，体验版/正式版均可用。
// 如何配置：见 README「部署到你的云托管」。
export default {
  isMock: false,
  // 微信云托管环境 ID（云托管控制台 → 环境设置，形如 prod-xxxxxxx）
  cloudEnv: 'your-cloud-env-id',
  // 云托管服务名（部署服务时填的名字，如 blog-api；多服务时必须显式指定）
  cloudService: 'your-service-name',
};
