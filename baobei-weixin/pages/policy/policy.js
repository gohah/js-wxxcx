//index.js
//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    userInfo: null,
    policys: {
      items: [],
      params: {
          page : 1,
          limit: 3,
      },
      pagination: {
        hasNext: true
      }
    }
  },
  showAddMenu: App.showAddMenu,
  // 预览头像
  previewAvatar(e) {
    let bb_avatarUrl = this.data.userInfo.bb_avatarUrl
    wx.previewImage({
      current: bb_avatarUrl,
      urls: [bb_avatarUrl]
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
  getPolicys(orderParameter = 'filterDefault', orderType = 'ASC' ) {
    let policys = this.data.policys
    let params = policys.params

    return App.HttpService.getPolicys(params)
    .then(data => {
      if(data.ret) {
        policys.items = data.res.data
        // 大金额加「万」
        policys.items.forEach((item,index) => {
          item.premium_usd = App.Tools.tenThousand(item.premium_usd)
        })
        if(data.res.data.length < policys.params.limit) {
          policys.pagination.hasNext = false
        }
        this.setData({
          policys: policys
        })
      }else {
        console.log(data.res.errorMsg)
      }

    })
  },
  onShow() {
    this.getUserInfo()
    this.getPolicys()
  },
  onLoad() {
  }
});
