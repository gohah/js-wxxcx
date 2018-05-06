//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    recentemail: [],
    detail: {
      email: ''
    }
  },
  saveEmail(email) {
    let emailList = this.getRecentEmails()

    emailList.unshift(email)
    emailList = App.Tools.uniqueArray(emailList).slice(0,3)

    return App.WxService.setStorage({
      key: 'recentemail',
      data: emailList,
    })
  },
  getRecentEmails() {
    return App.WxService.getStorageSync('recentemail') || []
  },
  setRecentEmails() {
    this.setData({
      recentemail: this.getRecentEmails()
    })
  },
  // 邮箱输入改变
  emailInput(e) {
    this.setData({
      'detail.email': e.detail.value
    })
    this.saveDetail()
  },
  saveDetail() {
    let detailStorage = App.WxService.getStorageSync('plan_detail')||{}
    Object.assign(detailStorage, this.data.detail)
    App.WxService.setStorageSync('plan_detail', detailStorage)
  },
  // 点击最近输入邮箱
  recentlyEmailTap(e) {
    this.setData({
      'detail.email': e.currentTarget.dataset.val
    })
  },
  // 上一步
  prevStep() {
    App.WxService.navigateBack({
      delta: 1
    })
  },
  // 验证字段初始化
  validateInit() {
    const rules = {
      email: {
        required: true,
        email: true,
      },
    }
    const messages = {
      email: {
        required: '请输入邮箱', 
        email: '邮箱格式有误',
      },
    }

    this.WxValidate = App.WxValidate(rules, messages)
  },
  check() {
    const detailStorage = App.WxService.getStorageSync('plan_detail')
    if(!detailStorage.email) return  // 没有缓存

    this.setData({
      detail: detailStorage,
    })
  },
  // 提交完成删除缓存
  submitFinish() {
    App.WxService.removeStorageSync('plan_detail')
    App.WxService.navigateBack({
      delta: 3
    })
  },
  submitFun() {

    let data = this.data
    let detail = data.detail
    let reqJSON = {
      email: detail.email
    }
    if(!this.WxValidate.checkForm(reqJSON)) return

    this.saveEmail(detail.email)  // 保存email
    let detailStorage = App.WxService.getStorageSync('plan_detail')||{}
    Object.assign(detailStorage, reqJSON)
    App.HttpService.addPlan(detailStorage)
    .then(data => {
      if(data.ret) {
        // this.submitFinish()
        // App.WxService.redirectTo('/pages/plan-order/success/success', {
        //   id: data.res.data.id
        // })
        App.WxService.showModal({
          title: '提交成功',
          content: '计划书生成后会有短信通知',
          showCancel: false,
          confirmText: '我知道了',
        })
        .then(data => this.submitFinish())
      }else {
        console.log(data.res.errorMsg)
      }
    })

  },
  init() {
    // 自动填充用户邮箱
    try {
      const email = App.globalData.userInfo.email
      if(email) {
        this.setData({
          'detail.email': email
        })
      }
    } catch(e) {
      console.log('捕获异常：',e)
    }
  },
  onShow() {
  },
  onLoad() {

    this.init()

    this.check()  // 检查是新增还是修改

    this.validateInit()  // 表单验证初始化
    
    this.setRecentEmails()  // 设置最近邮箱
  }
});
