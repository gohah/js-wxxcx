//获取应用实例
var App = getApp();
Page({
  data: {
    companyList: []
  },
  chooseCompany(e) {
    App.Event.emit('companyChanged', e.currentTarget.dataset.index)
    App.WxService.navigateBack({
      delta: 1
    })
  },
  onLoad() {
    this.setData({
      companyList: App.globalData.companyList
    })
  }
})
