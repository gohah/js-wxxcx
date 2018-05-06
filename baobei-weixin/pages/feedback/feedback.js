//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    type: 0,
    content: '',
    labelList: [
      {
        id: 0,
        name: '功能建议',
        checked: true
      },
      {
        id: 1,
        name: '程序问题',
      },
      {
        id: 2,
        name: '缺少公司或产品',
      }
    ]
  },
  // 选择单选框
  radioChanged(e) {
    const id = e.detail.value
    this.checkRadio(id)
  },
  checkRadio(id) {
    id = Number(id)
    let labelList = this.data.labelList
    labelList.forEach(n => n.checked = n.id === id)
    this.setData({
      type: id,
      labelList: labelList
    })
  },
  // 意见内容改变
  contentChanged(e) {
    console.log(111,e)
    this.setData({
      content: e.detail.value
    })
  },
  validate(e) {
    let content = e.detail.value.content
    let validateList = [
      {
        name: 'content',
        val: content,
        empty: {
          tips: '请输入反馈意见'
        }
      }
    ]
    return App.Tools.formValidate(validateList)
  },
  submitFun(e) {
    if(!this.validate(e)) return

    return App.HttpService.addFeedback({
      type: this.data.type,
      content: e.detail.value.content
    })
    .then(data => {
      if(data.ret) {
        App.WxService.showModal({
          title: '反馈成功',
          showCancel: false,
          confirmText: '确定',
        })
        .then(data => {
          if(data.confirm) {
            App.WxService.navigateBack({delta: 1})
          }
        })
        // App.WxService.showToast({
        //   title: '反馈成功',
        //   icon: 'success',
        //   duration: 1500
        // })
        // .then(data => {
        //   // setTimeout(function(){
        //     App.WxService.navigateBack({delta: 1})
        //   // }.bind(this), 1500)
        // })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  onLoad(e) {
    //创建可重复使用的WeToast实例，并附加到this上，通过this.wetoast访问
    new App.WeToast()

    const type = e.type
    type!=undefined && this.checkRadio(type)
  }
});
