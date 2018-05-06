//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    today: App.Tools.getToday(),

    companyList: [],  // 保险公司列表
    companyIndex: 0, //当前保险公司索引
    productList: [],  // 当前公司产品列表
    productIndex: 0, //当前产品索引
    code: '',  // 保单号
    customer_name: '',  // 投保人
    policy_name_cn: '',  // 受保人
    subproduct_id: 0,  // 当前选择缴费年期
    payment_method: 0,  // 当前选择缴费方式
    bb_first_year_payment_date: '',  // 首年缴费日期
    premium_usd: '',  // 年缴保费
  },
  // 下拉改变
  bindSelectChange(e) {
    let data = {}
    data[e.currentTarget.dataset.key] = e.detail.value
    this.setData(data)
  },
  // 重置所有
  reset(type) {
    let params = {}

    // params.company = {
    //   companyIndex: 0, //当前保险公司索引
    //   productList: [],  // 当前公司产品列表
    //   productIndex: 0, //当前产品索引
    //   code: '',  // 保单号
    //   customer_name: '',  // 投保人
    //   policy_name_cn: '',  // 受保人
    //   subproduct_id: 0,  // 当前选择缴费年期
    //   payment_method: 0,  // 当前选择缴费方式
    //   bb_first_year_payment_date: '',  // 首年缴费日期
    //   premium_usd: '',  // 年缴保费
    // }

    params.product = {
      code: '',  // 保单号
      customer_name: '',  // 投保人
      policy_name_cn: '',  // 受保人
      subproduct_id: 0,  // 当前选择缴费年期
      payment_method: 0,  // 当前选择缴费方式
      bb_first_year_payment_date: '',  // 首年缴费日期
      premium_usd: '',  // 年缴保费
    }

    params.company = Object.assign({}, params.product, {
      productIndex: 0, //当前产品索引
    })


    this.setData(params[type])
    // return App.HttpService.getCompanys()
  },
  formatData(data) {

    data.subproduct_id = App.Tools.getIndex(data.periodlistMapping, 'id', data.subproduct_id)
    data.payment_method = App.Tools.getIndex(this.data.mapping.list.payment_method, 'val', data.payment_method)
    data.premium_usd = Number(data.premium_usd)
    data.subproduct_id = Number(data.subproduct_id)

    return data
  },
  // 保险产品改变
  productsChange(e) {
    this.bindSelectChange(e)

    // 重置部分字段
    this.reset('product')
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
  
  submitFun(e) {
    if(!this.WxValidate.checkForm(e.detail.value)) return
      
    let detail = this.data
    let productList = detail.productList
    let companyList = detail.companyList
    const productIndex = detail.productIndex
    const companyIndex = detail.companyIndex
    let reqJSON = Object.assign({}, detail, e.detail.value, {
      subproduct_id: detail.periodlistMapping[detail.subproduct_id].id,
      payment_method: App.Mapping.list.payment_method[detail.payment_method].val,
    })

    // 添加保单发送请求
    App.HttpService.addPolicys(reqJSON)
    .then(data => {
      if(data.ret) {
        return App.WxService.showModal({
          title: '保存成功',
          showCancel: false,
          confirmText: '我知道了',
        })
        .then(data => {
          if(data.confirm) {
            App.WxService.navigateBack({delta: 1})
          }
        })
      }else {
        return App.WxService.showModal({
          title: '保存失败',
          content: '请稍后重试',
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    })

  },
  getPolicyDetail(id) {
    return App.HttpService.getPolicyDetail({
      id: id
    })
    .then(data => {
      if(data.ret) {
        let detail = this.formatData(data.res.data)

        this.setData(detail)
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  onLoad(e) {
    // 验证字规则初始化
    this.validateInit()

    // 获取保单详情
    const id = Number(e.id)
    this.getPolicyDetail(id)

  }
})
