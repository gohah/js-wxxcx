//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    today: App.Tools.getToday(),
    companyList: [],  // 保险公司列表
    productList: [],  // 当前公司产品列表
    selector: {
      company: 0,
      product: 0,
      subproduct_id: 0,
    },
    detail: {
      date: '',
      time: '10:00'
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
  // 保险产品改变
  productsChange(e) {
    this.bindSelectChange(e)

    // 重置年期
    this.setData({
      'selector.subproduct_id': 0
    })
  },
  getCompanys() {
    return App.HttpService.getCompanys()
    .then(data => {
      if(data.ret) {
        const index = this.data.selector.company
        App.globalData.companyList = data.res.data
        this.setData({
          companyList: data.res.data
        })
        if(this.initData) {
          this.getProducts(this.initData.company_id)          
        }else {
          // 获取保险产品
          this.getProducts(App.globalData.companyList[index].id)          
        }
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  getProducts(companyId) {
    let reqJSON = {
      company_id:companyId
    }
    return App.HttpService.getProducts(reqJSON)
    .then(data => {
      if(data.ret) {
        let productList = data.res.data
        // 更新数据
        this.setData({
          productList: productList
        })
        this.getInitData()  // 初始化数据
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  getInitData() {
    if(!this.initData) return  // 没有缓存的数据
    const formatData = this.formatData(this.initData)
    this.setData({
      selector: formatData.selector
    })
    this.initData = null
  },
  // 验证字段初始化
  validateInit() {
    const rules = {
      date: {
        required: true,
      },
    }
    const messages = {
      date: {
        required: '请选择签单日期',
      },
    }

    this.WxValidate = App.WxValidate(rules, messages)
  },
  submitFun(e) {

    let data = this.data
    let productList = data.productList
    let companyList = data.companyList
    const detail = data.detail
    const selector = data.selector

    let reqJSON = Object.assign({}, {
      date: detail.date,
      company_id: companyList[selector.company].id,
      product_id: productList[selector.product].id,
      subproduct_id: productList[selector.product].paymentperiodsMapping[selector.subproduct_id].id,
      detailtime: data.detail.date + ' ' + data.detail.time
    })

    if(!this.WxValidate.checkForm(reqJSON)) return
    App.HttpService.orderAppointment(reqJSON)
    .then(data => {
      if(data.ret) {
        App.WxService.showModal({
          title: '提交成功',
          content: '已生成预约订单，为节省签单时间，请到猎诚财富ERP平台填写详细信息并提交',
          cancelText: '联系客服',
          confirmText: '查看订单',
        })
        .then(data => {
          if(data.confirm) {
            App.WxService.redirectTo('/pages/appointment-list/appointment-list')
          }else {
            App.callLiechengcf()
          }
        })
      }else {
        return App.WxService.showModal({
          title: '提交失败',
          content: data.res.errorMsg,
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    })

  },
  checkAgent() {
    const userInfo = App.globalData.userInfo

    // 不是代理人
    if(userInfo.bb_status == 0 || userInfo.bb_status == -1) {
      App.WxService.showModal({
        title: '请先成为代理人',
        content: '您还不是保呗代理人，申请成为保呗代理人可享多种特权',
        confirmText: '申请代理',
        cancelText: '下次再说',
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
      return false
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
  formatData(data) {
    const companyList = this.data.companyList
    const productList = this.data.productList
    let selector = {}
    selector.company = App.Tools.getIndex(companyList, 'id', data.company_id)
    selector.product = App.Tools.getIndex(productList, 'id', data.product_id)
    console.log(productList[selector.product].paymentperiodsMapping, data.subproduct_id)
    selector.subproduct_id = App.Tools.getIndex(productList[selector.product].paymentperiodsMapping, 'id', data.subproduct_id)

    return {
      selector,
    }
  },
  // 缓存初始化数据
  setInitData(e) {
    if(e.company_id) {
      this.initData = e
    }
  },
  // 添加状态加载数据
  init() {
    // 获取保险公司列表
    this.getCompanys()

    // 监听保险公司更新
    App.Event.on('companyChanged', this, function(data) {
      const index = data
      const companyId = App.globalData.companyList[index].id

      // 更新view数据
      this.setData({
        'selector.company': index,
        'selector.product': 0,
        'selector.subproduct_id': 0,
      })

      // 获取保险产品列表
      this.getProducts(companyId)
    })
  },
  onLoad(e) {
    this.setInitData(e)
    this.validateInit()
  },
  onShow() {
    if(!this.checkAgent()) return  // 不是代理人
    this.init()
  },
  onUnload(e) {
    // 移除监听
    App.Event.remove('companyChanged', this)
  }
});
