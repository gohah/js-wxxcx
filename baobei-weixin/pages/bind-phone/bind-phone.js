//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    detail: {
      phone: '',
      code: ''
    }
  },
  // 验证字段初始化
  validateInit() {

    // 手机验证
    const phone_rules = {
      phone: {
        required: true,
        tel: true,
      },
    }
    const phone_messages = {
      phone: {
        required: '请输入手机号码', 
        tel: '请输入11位的大陆手机号码',
      },
    }

    // 验证码验证
    const vcode_rules = {
      code: {
        required: true, 
        vcode: true,
      },
    }
    const vcode_messages = {
      code: {
        required: '请输入短信验证码', 
        vcode: '短信验证码不正确',
      },
    }

    let all_rules = Object.assign({}, phone_rules, vcode_rules)
    let all_messages = Object.assign({}, phone_messages, vcode_messages)
    // 仅验证手机
    this.phoneValidate = App.WxValidate(phone_rules, phone_messages)
    // 全部验证
    this.allValidate = App.WxValidate(all_rules, all_messages)

  },
  // 表单验证
  // validate(type) {
  //   let detail = this.data.detail

  //   var validateList = [
  //     {
  //       name: 'phone',
  //       val: detail.phone,
  //       empty: {
  //         tips: '请输入手机号'
  //       },
  //       reg: {
  //         val: /^1[34578]\d{9}$/,
  //         tips: '请输入11位的大陆手机号码'
  //       }
  //     },
  //     {
  //       name: 'code',
  //       val: detail.code,
  //       empty: {
  //         tips: '请输入验证码'
  //       },
  //       reg: {
  //         val: /^\d{4}$/,
  //         tips: '验证码格式不对'
  //       }
  //     }
  //   ]

  //   switch(type) {
  //     case 'phone':
  //       return App.Tools.formValidate(validateList.slice(0, 1))
  //     break
  //     case 'code':
  //       return App.Tools.formValidate(validateList.slice(1, 1))
  //     break
  //     default:
  //       return App.Tools.formValidate(validateList)
  //   }
  //   // return type === 'phone'? App.Tools.formValidate(validateList):App.Tools.formValidate(validateList2)
  // },
  // 手机改变
  phoneInput(e) {
  	this.setData({
      'detail.phone': e.detail.value
    })
  },
  // 验证码改变
  codeInput(e) {
    this.setData({
      'detail.code': e.detail.value
    })
  },
  // 检查是否已绑定手机
  checkBind() {
    const phone = App.globalData.userInfo.phone
    if(!phone.length) return

    App.WxService.showModal({
      title: '您已绑定以下手机！',
      content: phone + '，可在此页面换绑',
      showCancel: false,
      confirmText: '确定',
    })
  },
  // 发送验证码
  sendCode(phone) {
    if(!this.phoneValidate.checkForm(this.data.detail)) return
    
    let detail = this.data.detail

    return App.HttpService.sendCode({
      phone: detail.phone
    })
    .then(data => {
      if(data.ret) {
        App.WxService.showToast({
          title: '短信发送成功',
          icon: 'success',
          duration: 1500
        })
      }else {
        App.WxService.showModal({
          title: data.res.errorMsg,
          showCancel: false,
          confirmText: '关闭',
        })
      }
    })
  },
  submitFun() {
    if(!this.allValidate.checkForm(this.data.detail)) return

    let detail = this.data.detail

    return App.HttpService.bindPhone({
      phone: detail.phone,
      code: detail.code
    })
    .then(data => {
      if(data.ret) {
        App.WxService.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 1500
        })
        .then(data => {
          App.Event.emit('userInfoUpdated', '手机号修改')
          setTimeout(function(){
            App.WxService.navigateBack({
              delta: 1
            })
          }, 1500)
        })
      }else {
        App.WxService.showModal({
          title: data.res.errorMsg,
          showCancel: false,
          confirmText: '关闭',
        })
      }
    })
  },
  onLoad(e) {

    // 验证字规则初始化
    this.validateInit()

    // 检查是否已绑定手机
    this.checkBind()

  }
})
