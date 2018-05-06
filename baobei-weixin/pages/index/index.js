//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    plans: {
      items: [],
      params: {
          page : 1,
          limit: 3,
          state: -1,
      },
      pagination: {
        hasNext: true
      }
    }
  },
  getPlanList() {
    let plans = this.data.plans
    let params = plans.params

    // if(!plans.pagination.hasNext) return
    return App.HttpService.getPlanList(params)
    .then(data => {
      if(data.ret) {
        plans.items = data.res.data
        if(data.res.data.length < plans.params.limit) {
          plans.pagination.hasNext = false
        }
        this.setData({
          plans: plans
        })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  getUserInfo() {
    // 首次获取
    App.getUserInfo()
    .then(data => {
      this.setData({
        userInfo: data
      })
    })
  },
  onShow() {
  	this.getPlanList()
    this.getUserInfo()
  },
  onLoad() {
  },
  // 分享
  onShareAppMessage: function() {
    return {
      title: '保呗Lite',
      desc: '专业的港险理财师助手',
      path: '/pages/index/index'
    }
  }
});
