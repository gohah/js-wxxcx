//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    detail: {
      name: '',
      phone: '',
      email: '',
      wechat: ''
    }
  },
  checkAgent() {
    const userInfo = App.globalData.userInfo

    // 已经是代理人
    if(userInfo.bb_status == 2) {
      App.WxService.showModal({
        title: '您已经是代理人',
        confirmText: '我知道了',
        showCancel: false,
      })
      .then(data => {
        if(data.confirm) {
          App.WxService.navigateBack({
            delta: 1
          })
        }
      })
    }else if(userInfo.bb_status == 1){  // 申请中
      App.WxService.showModal({
        title: '代理人申请中',
        content: '您的代理人身份正在申请中，请耐心等待',
        confirmText: '我知道了',
        showCancel: false,
      })
      .then(data => {
        if(data.confirm) {
          App.WxService.navigateBack({
            delta: 1
          })
        }
      })
      return false
    }
    return true
  },
  // 验证字段初始化
  validateInit() {
    const rules = {
      name: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      },
      email: {
        required: true,
        email: true,
      },
    }
    const messages = {
      name: {
        required: '请输入姓名', 
      },
      phone: {
        required: '请输入手机号码', 
        tel: '手机号码格式有误'
      },
      email: {
        required: '请输入邮箱', 
        email: '邮箱格式有误',
      },
    }

    this.WxValidate = App.WxValidate(rules, messages)
  },
  submitFun(e) {
    if(!this.WxValidate.checkForm(e.detail.value)) return

    let reqJSON = Object.assign({}, e.detail.value)
    App.HttpService.applyAgent(reqJSON)
    .then(data => {
      if(data.ret) {
        App.WxService.showModal({
          title: '提交成功',
          content: '审核成功后会有短信通知您',
          showCancel: false,
          confirmText: '我知道了',
        })
        .then(data => {
          App.Event.emit('userInfoUpdated', '代理人申请中')
          App.WxService.navigateBack({
            delta: 1
          })
        })
      }else {
        return App.WxService.showModal({
          title: '提交失败',
          content: '请稍后重试',
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    })

  },
  init() {
    const userInfo = App.globalData.userInfo
    this.setData({
      detail: userInfo
    })
  },
  onShow() {
    App.checkPhone()
  },
  onLoad() {
    this.init()  // 加载用户信息
    this.checkAgent()  // 检测是否是代理人
    this.validateInit()
  }
});
