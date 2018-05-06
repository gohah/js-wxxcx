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
    this.setData({
      userInfo: App.globalData.userInfo
    })
  },
  onShow() {
    this.getUserInfo()
  },
  onUnload(e) {
    // 移除监听
    App.Event.remove('userInfoUpdated', this)
  },
  onLoad() {

    // 监听用户信息改变
    App.Event.on('userInfoUpdated', this, function(data) {
      App.getUserInfo()
      .then(data => {
        this.getUserInfo()
      })
    })
  }
})
