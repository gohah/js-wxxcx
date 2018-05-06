//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    detail: {}
  },
  getPolicyDetail(id) {
  	return App.HttpService.getPolicyDetail({
  		id: id
  	})
  	.then(data => {
      let item = data.res.data
      item.premium_usd = App.Tools.tenThousand(item.premium_usd)

      if(data.ret) {
        this.setData({
          detail: item
        })
      }else {
        console.log(data.res.errorMsg)
      }
  	})
  },
  editPolicy() {
    const id = Number(this.data.detail.id)

    return App.WxService.navigateTo('/pages/policy-edit/policy-edit', {
      id: id
    })
  },
  onShow(e) {
    const id = this.data.detail.id

    if(id) {
      console.log(22, id)
      this.getPolicyDetail(id)
    }
  },
  onLoad(e) {
    //创建可重复使用的WeToast实例，并附加到this上，通过this.wetoast访问
    new App.WeToast()

    const id = e.id
    this.getPolicyDetail(id)
  }
});
