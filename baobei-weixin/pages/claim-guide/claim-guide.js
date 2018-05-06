//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    userInfo: null
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
  onLoad: function () {
    this.getUserInfo()
  }
});
