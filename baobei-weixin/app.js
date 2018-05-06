import Config from 'etc/config'
import polyfill from 'plugins/polyfill'
import WxParse from 'plugins/wxParse/wxParse'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Mapping from 'helpers/Mapping'
import Event from 'helpers/Event'

let {WeToast} = require('./components/wetoast/wetoast.js')

//app.js
App({
  WeToast,
  onLaunch() {
    console.info('%c'+this.Config.env.name, 'color:#003366;font-size:24px')  // 打印运行环境
    this.getUserInfo()
  },
  getUserInfo() {
    return this.HttpService.getUserInfo()
    .then(data => {
      this.globalData.userInfo = data.res.data
      return data.res.data
    })
  },
  // 检测绑定手机
  checkPhone() {
    const userInfo = this.globalData.userInfo
    if(!userInfo.phone.length) {
      this.WxService.showModal({
        title: '请先绑定手机',
        content: '使用该功能需先绑定手机号码，以便发送重要通知',
        confirmText: '绑定手机',
        cancelText: '下次再说',
      })
      .then(data => {
        if(data.confirm) {
          this.WxService.redirectTo('/pages/bind-phone/bind-phone')
        }else {
          this.WxService.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  // 联系猎诚客服
  callLiechengcf() {
    wx.makePhoneCall({
      phoneNumber: '4006686208'
    })
  },
  getWeChatUserInfo() {
    return this.WxService.login()
    .then(data => {
      return this.WxService.getUserInfo()
    })
    .then(data => {
      let reqJSON = {
        bb_nickName: data.userInfo.nickName,
        bb_avatarUrl: data.userInfo.avatarUrl,
      }
      return this.HttpService.setUserInfo(reqJSON)
    })
    // 从服务器获取其他用户信息，如电话
    .then(data => this.getUserInfo())
  },
  renderImage(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
  showAddMenu() {
    return this.WxService.showActionSheet({
      itemList: ['拍照上传', '手动填写']
    })
    .then(data => {
      switch(data.tapIndex) {
        case 0: this.WxService.navigateTo('/pages/upload-photo/upload-photo')
          break
        case 1: this.WxService.navigateTo('/pages/policy-add/policy-add')
          break
        default:;
      }
    })
    .catch(data => console.log(data))
  },
  WxValidate: (rules, messages) => new WxValidate(rules, messages), 
  HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(), 
  HttpService: new HttpService, 
  WxService: new WxService, 
  Tools: new Tools, 
  Config: Config, 
  Mapping: Mapping, 
  Event: Event, 
  WxParse: WxParse, 
  globalData:{
    userInfo:null
  }
})