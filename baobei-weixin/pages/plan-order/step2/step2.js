//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    companyList: [],  // 保险公司列表
    productList: [],  // 当前公司产品列表
    selector: {
      company: 0,
      product: 0,
      nbf_type: 0,
      subproduct_id: 0
    },
    swi: {
      fujia: false,
      tqsm: false,
      gdcp: false
    },
    // 计划书基本信息
    detail: {
      bb_product_id: 0,
      premium: '',
      remarks: '',
      fujia: '',
      tqsm: '',
      gdcp: '',
      bzqy: '',
      bzjb: '',
      zhifu: ''
    },
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
  companyChangeReset() {
    this.setData({
      'selector.product': 0,
      'selector.subproduct_id': 0
    })
  },
  // 保险产品改变
  productsChange(e) {
    this.bindSelectChange(e)
    this.productChangeReset()  // 重置部分字段
  },
  // 保险产品改变重置操作
  productChangeReset() {
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
        this.productChangeReset()
        this.check()  // 检查是新增还是修改
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  // 下一步
  nextStep() {
      App.WxService.navigateTo('/pages/plan-order/step3/step3')
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
      premium: {
        required: true,
        number: true,
      },
      fujia: {
        required: true,
        dependOn: 'has_fujia',
      },
      tqsm: {
        required: true,
        dependOn: 'has_tqsm',
      },
      gdcp: {
        required: true,
        dependOn: 'has_gaoduan',
      },
      bzqy: {
        required: true,
        dependOn: 'has_gaoduan',
      },
      bzjb: {
        required: true,
        dependOn: 'has_gaoduan',
      },
      zhifu: {
        required: true,
        dependOn: 'has_gaoduan',
      },
    }
    const messages = {
      premium: {
        required: '请输入费用',
        number: '年保费请输入数字',
      },
      fujia: {
        required: '请输入附加险说明', 
      },
      tqsm: {
        required: '请输入提取说明', 
      },
      gdcp: {
        required: '请输入高端产品', 
      },
      bzqy: {
        required: '请输入保障区域', 
      },
      bzjb: {
        required: '请输入保障级别', 
      },
      zhifu: {
        required: '请输入自付额', 
      },
    }

    this.WxValidate = App.WxValidate(rules, messages)
  },
  submitFun() {

    let data = this.data
    let detail = data.detail
    let swi = data.swi

    let reqJSON = Object.assign({}, detail, {
      company_id: data.companyList[data.selector.company].id,
      product_id: data.productList[data.selector.product].id,
      subproduct_id: data.productList[data.selector.product].paymentperiodsMapping[data.selector.subproduct_id].id,
      nbf_type: data.mapping.list.nbf_type[data.selector.nbf_type].key,
      has_fujia: swi.fujia,
      has_tqsm: swi.tqsm,
      has_gaoduan: swi.gdcp,
      zhifu_type: 1, // 自付额类型固定为USD
    })

    if(!this.WxValidate.checkForm(reqJSON)) return

    let detailStorage = App.WxService.getStorageSync('plan_detail')||{}
    Object.assign(detailStorage, reqJSON)
    App.WxService.setStorageSync('plan_detail', detailStorage)
    this.nextStep()
  },
  // 检查是新增还是修改
  check() {
    const detailStorage = App.WxService.getStorageSync('plan_detail')
    if(!detailStorage.company_id) return  // 没有缓存
    const id = Number(detailStorage.id)

    // if(id > 0) {  // 编辑
    //   const formatData = this.formatData(detailStorage) 
    //   this.setData({
    //     detail: detailStorage,
    //     selector: formatData.selector,
    //     swi: formatData.swi,
    //   })
    // }else {  // 新增
    //   console.log('新增')
    // }

    const formatData = this.formatData(detailStorage) 
    this.setData({
      detail: detailStorage,
      selector: formatData.selector,
      swi: formatData.swi,
    })
  },
  // 编辑时格式化数据用于selector等
  formatData(data) {
    const companyList = this.data.companyList
    const productList = this.data.productList

    let selector = {}
    selector.company = App.Tools.getIndex(companyList, 'id', data.company_id)
    selector.product = App.Tools.getIndex(productList, 'id', data.product_id)
    selector.nbf_type = App.Tools.getIndex(App.Mapping.list.nbf_type, 'key', data.nbf_type)
    selector.subproduct_id = App.Tools.getIndex(productList[selector.product].paymentperiodsMapping, 'id', data.subproduct_id)

    let swi = {}
    swi.fujia = !!data.fujia
    swi.tqsm = !!data.tqsm
    swi.gdcp = !!data.gdcp
    return {
      selector,
      swi,
    }
  },
  // 添加状态加载数据
  init() {
    this.getCompanys()  // 获取保险公司列表

    // 监听保险公司更新
    App.Event.on('companyChanged', this, function(data) {
      const index = data
      const companyId = App.globalData.companyList[index].id

      // 更新view数据
      this.setData({
        'selector.company': index,
      })

      this.getProducts(companyId)  // 获取保险产品列表
    })
  },
  onShow() {
  },
  onLoad() {

    this.init()
    this.validateInit()
  },
  onUnload(e) {
    // 移除监听
    App.Event.remove('companyChanged', this)
  }
});
