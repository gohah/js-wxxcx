//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    today: App.Tools.getToday(),
    companyList: [],  // 保险公司列表
    productList: [],  // 当前公司产品列表
    selector: {
      toubao_sex: 0,
      shoubao_sex: 0,
      toubao_smoke: 0,
      shoubao_smoke: 0,
      company: 0,
      product: 0,
      nbf_type: 0,
      subproduct_id: 0,
    },
    swi: {
      samePeople: false,
      fujia: false,
      tqsm: false,
      gdcp: false,
    },
    detail: {
      toubao_name: '',
      shoubao_name: '',
      toubao_birthday: '',
      shoubao_birthday: '',
      bb_product_id: 0,
      premium: '',
      remarks: '',
      fujia: '',
      tqsm: '',
      gdcp: '',
      bzqy: '',
      bzjb: '',
      zhifu: '',
      email: '',
    }
  },
  // 下拉改变
  bindSelectChange(e) {
    let selector = this.data.selector
    selector[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      selector: selector
    })
    this.saveStorage()
  },
  bindSwiChange(e) {
    let swi = this.data.swi
    swi[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      swi: swi
    })
    this.saveStorage()
  },
  bindInputChange(e) {
    let detail = this.data.detail
    detail[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      detail: detail
    })
    this.saveStorage()
  },
  // 分步
  sliderInit() {
    const slider = {}
    const that = this
    // 初始化

    slider.init = function() {
      this.activeIndex = 0  // 当前页
      this.len = 3  // 总共页数
      this.width = wx.getSystemInfoSync().windowWidth
    }

    // 滑动至
    slider.jumpTo = function(index) {
      if(index < 0 || index >= this.len) return

      let offset = -index*this.width

      that.step.translate(offset).step()
      this.activeIndex = index
      that.setData({
        step: that.step.export()
      })
      
    }

    // 滑动至下一页
    slider.next = function() {
      this.jumpTo(this.activeIndex+1)
    }

    // 滑动至上一页
    slider.prev = function() {
      this.jumpTo(this.activeIndex-1)
    }

    slider.init()
    that.slider = slider
  },
  prevStep() {
    this.slider.prev()
  },
  nextStep1() {
    let reqJSON = this.getReqJSON(this.data)
    if(!this.WxValidate1.checkForm(reqJSON)) return
    this.slider.next()
  },
  nextStep2() {
    let reqJSON = this.getReqJSON(this.data)
    if(!this.WxValidate2.checkForm(reqJSON)) return
    this.slider.next()
  },
  // 检查是否有缓存
  checkStorage() {
    const plan = App.WxService.getStorageSync('plan', plan)
    if(plan) {
      App.WxService.showModal({
        title: '您有上次未提交的计划书',
        content: '需要继续编辑吗？',
        confirmText: '继续编辑',
        cancelText: '重新添加',
      })
      .then(data => {
        if(data.confirm) {  // 继续编辑
          this.setData(plan)
        }else {  // 重新添加
          App.WxService.removeStorageSync('plan')  // 删除缓存
        }
      })
      
    }
  },
  // 缓存数据
  saveStorage() {
    let plan = {}
    plan.detail = this.data.detail
    plan.selector = this.data.selector
    plan.swi = this.data.swi
    plan.companyList = this.data.companyList
    plan.productList = this.data.productList
    App.WxService.setStorageSync('plan', plan)
  },
  companysChangeReset() {
    this.setData({
      'selector.product': 0,
      'selector.subproduct_id': 0
    })
  },
  // 保险产品改变
  productsChange(e) {
    this.bindSelectChange(e)
    this.productsChangeReset()  // 重置部分字段
  },
  // 保险产品改变重置操作
  productsChangeReset() {
    this.setData({
      'selector.subproduct_id': 0
    })
  },
  getCompanys() {
    return App.HttpService.getCompanys()
    .then(data => {
      if(data.ret) {
        App.globalData.companyList = data.res.data
        this.setData({
          companyList: data.res.data
        })
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
        this.productsChangeReset()
      }else {
        console.log(data.res.errorMsg)
      }
    })
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
  // 点击最近输入邮箱
  recentlyEmailTap(e) {
    this.setData({
      'detail.email': e.currentTarget.dataset.val
    })
  },
  // 下一步
  nextStep() {
    App.WxService.navigateTo('/pages/plan-order/step2/step2')
  },
  // 验证字段初始化
  validateInit() {

    // 第一步验证
    const rules1 = {
      toubao_name: {
        required: true,
      },
      toubao_birthday: {
        required: true,
      },
      shoubao_name: {
        required: true,
        dependOn: 'differentPeople',
      },
      shoubao_birthday: {
        required: true,
        dependOn: 'differentPeople',
      },
    }
    const messages1 = {
      toubao_name: {
        required: '请填写投保人姓名', 
      },
      toubao_birthday: {
        required: '请选择投保人出生日期', 
      },
      shoubao_name: {
        required: '请填写受保人姓名', 
      },
      shoubao_birthday: {
        required: '请选择受保人出生日期', 
      },
    }
    this.WxValidate1 = App.WxValidate(rules1, messages1)

    // 第二步验证
    const rule2 = {
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
    const messages2 = {
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
    this.WxValidate2 = App.WxValidate(rule2, messages2)

    // 第三步验证
    const rules3 = {
      email: {
        required: true,
        email: true,
      },
    }
    const messages3 = {
      email: {
        required: '请输入邮箱', 
        email: '邮箱格式有误',
      },
    }
    this.WxValidate3 = App.WxValidate(rules3, messages3)
  },
  // 同一人则同步信息
  syncInsurant(detail) {
    detail.shoubao_sex = detail.toubao_sex
    detail.shoubao_smoke = detail.toubao_smoke
    detail.shoubao_birthday = detail.toubao_birthday
    return detail
  },
  formatData(data) {
    let selector = {}
    let swi = {}
    // 第一步
    selector.toubao_sex = App.Tools.getIndex(App.Mapping.list.sex, 'key', data.toubao_sex)
    selector.shoubao_sex = App.Tools.getIndex(App.Mapping.list.sex, 'key', data.shoubao_sex)
    selector.toubao_smoke = App.Tools.getIndex(App.Mapping.list.smoke, 'key', data.toubao_smoke)
    selector.shoubao_smoke = App.Tools.getIndex(App.Mapping.list.smoke, 'key', data.shoubao_smoke)
    // 第二步
    console.log(22, data.company_id, this.data.companyList)
    selector.company = App.Tools.getIndex(this.data.companyList, 'id', data.company_id)
    selector.product = App.Tools.getIndex(this.data.productList, 'id', data.product_id)
    selector.nbf_type = App.Tools.getIndex(App.Mapping.list.nbf_type, 'key', data.nbf_type)
    selector.subproduct_id = App.Tools.getIndex(this.data.productList[selector.product].paymentperiodsMapping, 'id', data.subproduct_id)
    swi.fujia = !!data.fujia
    swi.tqsm = !!data.tqsm
    swi.gdcp = !!data.gdcp

    this.setData({
      detail: data,
      selector: selector,
      swi: swi
    })
  },
  getPlanDetail(id) {
    return App.HttpService.getPlanDetail({
      id: id
    })
    .then(data => {
      if(data.ret) {
        const detail = data.res.data
        this.getProducts(data.res.data.company_id)
        .then(data => {
          const formatData = this.formatData(detail)
        })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  // 检查计划书是否超过限制份数
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
    this.id = id
    console.log(33, this.id)

    if(id > 0) {  // 编辑
      console.log('编辑')
      this.getPlanDetail(id)
      .then(data => {
        this.getCompanys()
        this.getProducts(data.res.data.product_id)
      })
    }else {  // 新增
      console.log('新增')
      this.getCompanys()
      .then(data => {
        const index = this.data.selector.company
        this.getProducts(App.globalData.companyList[index].id)        
      })

      this.checkStorage()  // 检测是否有缓存
      this.checkPlanLimit()  // 检测下载计划书是否超出限制
      this.setData({
        'detail.id': 0
      })
    }
  },
  getReqJSON(data) {
    let detail = data.detail
    detail.differentPeople = !data.swi.samePeople
    let selector = data.selector
    let swi = data.swi

    let reqJSON = Object.assign({}, detail, {
      toubao_sex: App.Mapping.list.sex[selector.toubao_sex].key,
      shoubao_sex: App.Mapping.list.sex[selector.shoubao_sex].key,
      toubao_smoke: App.Mapping.list.smoke[selector.toubao_smoke].key,
      shoubao_smoke: App.Mapping.list.smoke[selector.shoubao_smoke].key,

      company_id: data.companyList[data.selector.company].id,
      product_id: data.productList[data.selector.product].id,
      subproduct_id: data.productList[data.selector.product].paymentperiodsMapping[data.selector.subproduct_id].id,
      nbf_type: data.mapping.list.nbf_type[data.selector.nbf_type].key,
      has_fujia: swi.fujia,
      has_tqsm: swi.tqsm,
      has_gaoduan: swi.gdcp,
      zhifu_type: 1, // 自付额类型固定为USD

      email: detail.email,
    })

    // 选择同一个数据同步
    if(data.swi.samePeople) {
      reqJSON = this.syncInsurant(reqJSON)
    }

    return reqJSON
  },
  submitFinish() {
    App.WxService.removeStorageSync('plan')
    App.WxService.navigateBack({
      delta: 1
    })
  },
  submitFun() {
    let reqJSON = this.getReqJSON(this.data)    

    if(!this.WxValidate3.checkForm(reqJSON)) return

    App.HttpService.addPlan(reqJSON)
    .then(data => {
      if(data.ret) {
        App.WxService.showModal({
          title: '提交成功',
          content: '计划书生成后会有短信通知',
          showCancel: false,
          confirmText: '我知道了',
        })
        .then(data => {
          if(data.confirm) {
            this.submitFinish()
          }
        })
        // .then(data => this.submitFinish())
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  init() {
    // this.getCompanys().then(data => {
    //   const index = this.data.selector.company
    //   this.getProducts(App.globalData.companyList[index].id)
    //   .then(data => {
    //     console.log(5, data)
    //     this.getPlanDetail()
    //   })
    // })
    // .then(data => console.log(55, data))

    // 监听保险公司更新
    App.Event.on('companyChanged', this, function(data) {
      const index = data
      const companyId = App.globalData.companyList[index].id

      // 更新view数据
      this.setData({
        'selector.company': index,
        'detail.company_id': this.data.companyList[index]
      })

      this.companysChangeReset()  // 重置部分字段
      this.getProducts(companyId)  // 获取保险产品列表
      this.saveStorage()
    })
  },
  onShow() {
    App.checkPhone()  // 检测是否绑定手机
  },
  onReady() {
    this.step = wx.createAnimation({
      duration: 300
    })
  },
  onLoad(e) {

    
    this.checkEdit(e)  // 处理编辑还是新增
    this.getCompanys()    
    this.init()
    this.validateInit()  // 表单验证初始化
    this.sliderInit()  // 分步动画
  },
  onUnload(e) {
    // 移除监听
    App.Event.remove('companyChanged', this)
  }
});
