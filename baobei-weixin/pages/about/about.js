//获取应用实例
var App = getApp()
Page({
  data: {
  	version: App.Config.version
  },
  // 拨打电话
  callLiechengcf() {
  	wx.makePhoneCall({
	  phoneNumber: '4006686208'
	})
  },
  onLoad() {

  }
})
