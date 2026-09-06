// 给 Vincent 留言 —— 访客私信通道，内容邮件回传，不在小程序显示
import { submitGuestbook } from '~/api/blog';

Page({
  data: {
    name: '',
    contact: '',
    content: '',
    submitting: false,
    done: false,
    errMsg: '',
    email: '244384154@qq.com', // 展示用（与后端 SMTP_TO 一致）
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
  },

  async onSubmit() {
    const { name, contact, content, submitting } = this.data;
    if (submitting) return;
    const trimmed = content.trim();
    if (!trimmed) {
      this.setData({ errMsg: '请写下你的留言' });
      return;
    }
    if (trimmed.length > 500) {
      this.setData({ errMsg: '留言请控制在 500 字以内' });
      return;
    }
    this.setData({ submitting: true, errMsg: '' });
    try {
      await submitGuestbook(name.trim(), contact.trim(), trimmed);
      this.setData({ done: true, submitting: false });
    } catch (e) {
      this.setData({ errMsg: e.message || '发送失败，请稍后再试', submitting: false });
    }
  },

  onReset() {
    this.setData({ name: '', contact: '', content: '', done: false, errMsg: '' });
  },
});
