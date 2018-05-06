//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping
  },
  getPlanDetail(id) {
  	return App.HttpService.getPlanDetail({
  		id: id
  	})
    .then(data => {
      if(data.ret) {
        this.setData({
          detail: data.res.data
        })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  dropPlan(e) {
    const id = Number(e.currentTarget.dataset.id)

    return App.HttpService.cancelPlan({
      id: id
    })
    .then(data => {
      if(data.ret) {
        this.setData({
          'detail.state': 3
        })
        App.WxService.showToast({
          title: '撤回成功',
          icon: 'success',
          duration: 1500
        })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  downloadPlan(e) {
    const url = e.currentTarget.dataset.url
    return App.WxService.downloadFile({
      url: url
    })
    .then(data => {
       App.WxService.openDocument({
        filePath: data.tempFilePath
      })
      .then(data => console.log('文档打开成功', data))
    })
    .catch(data => console.log(data))
  },
  // 预约签单
  appointmentSign(e) {
    App.WxService.redirectTo('/pages/appointment-sign/appointment-sign', {
      company_id: e.currentTarget.dataset.company_id,
      product_id: e.currentTarget.dataset.product_id,
      subproduct_id: e.currentTarget.dataset.subproduct_id
    })
  },
  editPlan(e) {
    const id = Number(e.currentTarget.dataset.id)
    App.WxService.redirectTo('/pages/plan-order/step0/step0', {
      id:id
    })
  },
  onShow() {
  },
  onLoad(e) {
  	const id = Number(e.id)
  	this.getPlanDetail(id)
  }
})
