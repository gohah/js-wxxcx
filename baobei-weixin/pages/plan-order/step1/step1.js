//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    today: App.Tools.getToday(),
    selector: {
      toubao_sex: 0,
      shoubao_sex: 0,
      toubao_smoke: 0,
      shoubao_smoke: 0,
    },
    swi: {
      samePeople: false,
    },
    detail: {
      toubao_birthday: '1980-01-01',
      shoubao_birthday: '1980-01-01',
    }
  },
  // 下拉改变
  bindSelectChange(e) {
    let selector = this.data.selector
    selector[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      selector: selector
    })
  },
  bindInputChange(e) {
    let detail = this.data.detail
    detail[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      detail: detail
    })
  },
  bindSwiChange(e) {
    let swi = this.data.swi
    swi[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      swi: swi
    })
  },
  // 出生日期改变
  bindBirthdayChange(e) {
    this.setData({
      'detail.toubao_birthday': e.detail.value
    })
  },
  bindBirthdayChange2(e) {
    this.setData({
      'detail.shoubao_birthday': e.detail.value
    })
  },
  // 下一步
  nextStep() {
    App.WxService.navigateTo('/pages/plan-order/step2/step2')
  },
  // 验证字段初始化
  validateInit() {
    const rules = {
      toubao_name: {
        required: true,
      },
      // toubao_birthday: {
      //   required: true,
      // },
      shoubao_name: {
        required: true,
        dependOn: 'differentPeople',
      },
      // shoubao_birthday: {
      //   required: true,
      //   dependOn: 'differentPeople',
      // },
    }
    const messages = {
      toubao_name: {
        required: '请填写投保人姓名', 
      },
      // toubao_birthday: {
      //   required: '请选择投保人出生日期', 
      // },
      shoubao_name: {
        required: '请填写受保人姓名', 
      },
      // shoubao_birthday: {
      //   required: '请选择受保人出生日期', 
      // },
    }

    this.WxValidate = App.WxValidate(rules, messages)
  },
  // 同一人则同步信息
  syncInsurant(detail) {
    detail.shoubao_name = detail.toubao_name
    detail.shoubao_sex = detail.toubao_sex
    detail.shoubao_smoke = detail.toubao_smoke
    detail.shoubao_birthday = detail.toubao_birthday
    return detail
  },
  formatData(data) {
    let selector = {}

    selector.toubao_sex = App.Tools.getIndex(this.data.mapping.list.sex, 'key', data.toubao_sex)
    selector.shoubao_sex = App.Tools.getIndex(this.data.mapping.list.sex, 'key', data.shoubao_sex)
    selector.toubao_smoke = App.Tools.getIndex(this.data.mapping.list.smoke, 'key', data.toubao_smoke)
    selector.shoubao_smoke = App.Tools.getIndex(this.data.mapping.list.smoke, 'key', data.shoubao_smoke)
    return {
      selector,
    }
  },
  getPlanDetail(id) {
    return App.HttpService.getPlanDetail({
      id: id
    })
    .then(data => {
      if(data.ret) {
        let detail = Object.assign({}, this.data.detail, data.res.data)
        this.setData({
          detail: detail,
          selector: this.formatData(data.res.data).selector
        })
        console.log(22, data.res.data)
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  // checkEdit() {
  //   let detailStorage = App.WxService.getStorageSync('plan_detail')
  //   if(detailStorage) {
  //     App.WxService.showModal({
  //       title: '您有未提交的计划书，要继续编辑吗？',
  //       confirmText: '继续编辑',
  //       cancelText: '重新添加',
  //     })
  //     .then(data => {
  //       if(data.confirm) {
  //           // let detailStorage = App.WxService.getStorageSync('plan_detail')||{}
  //           // Object.assign(detailStorage, reqJSON)
  //       }else {
  //         console.log('重新添加')
  //       }
  //     })
  //   }
  // },

  // 检查计划书数量是否超限
  checkPlanLimit() {
    const userInfo = App.globalData.userInfo
    if(userInfo.bb_status != 2 && userInfo.planCount > 10) {  
      App.WxService.showModal({
        title: '普通用户最多能生成10份计划书',
        content: '申请成为保呗代理人可无限制生成计划书',
        confirmText: '申请代理',
        cancelText: '下次再说'
      })
      .then(data => {
        if(data.confirm) {
          App.WxService.redirectTo('/pages/agent/agent')
        }else {
          App.WxService.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  // 检测编辑还是新增  
  checkEdit(e) {
    const id = Number(e.id)

    if(id > 0) {  // 编辑
      this.getPlanDetail(id)
    }else {  // 新增
      this.checkPlanLimit()  // 检测下载计划书是否超出限制
      this.setData({
        'detail.id': 0
      })
      console.log('新增')
    }
  },
  submitFun() {
    let detail = this.data.detail
    detail.differentPeople = !this.data.swi.samePeople
    let selector = this.data.selector
    let swi = this.data.swi

    if(!this.WxValidate.checkForm(detail)) return


    let reqJSON = Object.assign({}, detail, {
      toubao_sex: App.Mapping.list.sex[selector.toubao_sex].key,
      shoubao_sex: App.Mapping.list.sex[selector.shoubao_sex].key,
      toubao_smoke: App.Mapping.list.smoke[selector.toubao_smoke].key,
      shoubao_smoke: App.Mapping.list.smoke[selector.shoubao_smoke].key,
    })

    if(this.data.swi.samePeople) {
      reqJSON = this.syncInsurant(reqJSON)
    }
    let detailStorage = App.WxService.getStorageSync('plan_detail')||{}
    Object.assign(detailStorage, reqJSON)
    App.WxService.setStorageSync('plan_detail', detailStorage)
    this.nextStep()
  },
  onShow() {
    App.checkPhone()  // 检测是否绑定手机
  },
  onUnload() {
    App.WxService.removeStorageSync('plan_detail')
  },
  onLoad(e) {

    this.checkEdit(e)  // 处理编辑还是新增
    
    this.validateInit()
  }
});
