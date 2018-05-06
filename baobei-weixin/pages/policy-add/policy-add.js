//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    today: App.Tools.getToday(),
    companyList: [],  // 保险公司列表
    productList: [],  // 当前公司产品列表
    selector: {
      company:0,
      product:0,
      subproduct_id: 0,  // 当前选择缴费年期
      payment_method: 0,  // 当前选择缴费方式
    },
    detail: {
      code: '',  // 保单号
      customer_name: '',  // 投保人
      policy_name_cn: '',  // 受保人
      bb_first_year_payment_date: '',  // 首年缴费日期
      premium_usd: '',  // 年缴保费
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
  bindSwiChange(e) {
    let swi = this.data.swi
    swi[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      swi: swi
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

    this.setData({
      subproduct_id: 0
    })
  },
  // 验证字段初始化
  validateInit() {
    const rules = {
      code: {
        required: true,
      },
      customer_name: {
        required: true,
      },
      policy_name_cn: {
        required: true,
      },
      bb_first_year_payment_date: {
        required: true,
      },
      premium_usd: {
        required: true,
        number: true,
      },
    }
    const messages = {
      code: {
        required: '请输入保单号', 
      },
      customer_name: {
        required: '请输入投保人', 
      },
      policy_name_cn: {
        required: '请输入受保人', 
      },
      bb_first_year_payment_date: {
        required: '请选择首年缴费日期', 
      },
      premium_usd: {
        required: '请输入年缴保费', 
        number: '年缴保费只能是纯数字',
      },
    }

    this.WxValidate = App.WxValidate(rules, messages)
  },
  
  submitFun() {
      
    const data = this.data
    const detail = data.detail
    const productList = data.productList
    const companyList = data.companyList
    const selector = data.selector

    console.log(productList[selector.product], selector)
    let reqJSON = Object.assign({}, detail, {
        id: 0,
        company_id: companyList[selector.company].id,
        bb_product_id: productList[selector.product].id,
        subproduct_id: productList[selector.product].paymentperiodsMapping[selector.subproduct_id].id,
        payment_method: App.Mapping.list.payment_method[selector.payment_method].val,
    })
    console.log(reqJSON)
    if(!this.WxValidate.checkForm(reqJSON)) return

    // 添加保单发送请求
    App.HttpService.addPolicys(reqJSON)
    .then(data => {
      if(data.ret) {
        return App.WxService.showModal({
          title: '添加成功',
          showCancel: false,
          confirmText: '确定',
        })
      }else {
        return App.WxService.showModal({
          title: '添加失败',
          showCancel: false,
          confirmText: '确定',
        })
      }
    })
    .then(data => {
      App.Event.emit('policyadd', '添加新保单')
      if (data.confirm) {
        App.WxService.navigateBack({
          delta: 1
        })
      }
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
        // 获取保险产品
        this.getProducts(App.globalData.companyList[index].id)
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
        this.reset('company')
      }else {
        console.log(data.res.errorMsg)
      }
    })
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
      })

      // 获取保险产品列表
      this.getProducts(companyId)
    })

  },
  onLoad(e) {
    // 验证字规则初始化
    this.validateInit()

    this.init()

  },
  onUnload(e) {
    // 移除监听
    App.Event.remove('companyChanged', this)
  }
})
