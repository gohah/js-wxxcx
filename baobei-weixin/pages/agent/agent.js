//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    userInfo: null
  },
  previewImage(e) {
    App.WxService.previewImage({
      urls: [e.currentTarget.dataset.url]
    })
  },
  getUserInfo() {
    const userInfo = App.globalData.userInfo
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      return
    }

    // 首次获取
    App.getUserInfo()
    .then(data => {
      this.setData({
        userInfo: data
      })
    })
  },
  onShow() {
  },
  onLoad() {
    this.getUserInfo()

    // 监听用户信息改变
    App.Event.on('userInfoUpdated', this, function(data) {
      console.log(data)
      App.getUserInfo()
      .then(data => {
        this.getUserInfo()
      })
    })
  }
});
