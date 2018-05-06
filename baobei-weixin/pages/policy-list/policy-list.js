//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    // tabs: ["默认排序", "产品排序", "公司排序"],
    activeIndex: 0,
    orders: [
      {
        name: '默认排序',
        field: 'filterDefault',  // 排序字段名
        order: 'desc'  // 排序方式,asc升序，desc降序，default未排序
      },
      {
        name: '产品排序',
        field: 'filterProduct',
        order: 'default'
      },
      {
        name: '公司排序',
        field: 'filterCompany',
        order: 'default'
      }
    ],
    policys: {
      items: [],
      params: {
          page : 1,
          limit: 10,
      },
      pagination: {
        hasNext: true
      }
    }
  },
  showAddMenu: App.showAddMenu,
  // 设置默认数据
  getDefaultData() {
    let orders = [
      {
        name: '默认排序',
        field: 'filterDefault',  // 排序字段名
        order: 'default'  // 排序方式,asc升序，desc降序，default未排序
      },
      {
        name: '产品排序',
        field: 'filterProduct',
        order: 'default'
      },
      {
        name: '公司排序',
        field: 'filterCompany',
        order: 'default'
      }
    ]
    let policys = {
      items: [],
      params: {
          page : 1,
          limit: 10,
      },
      pagination: {
        hasNext: true
      }
    }

    return {
      orders,
      policys,
    }

  },
  tabClick: function (e) {

    const index = e.currentTarget.dataset.index
    let orders = this.getDefaultData().orders
    let policys = this.getDefaultData().policys

    let orderType = ''

    if(index === this.data.activeIndex) {
      orderType = this.data.orders[index].order === 'asc' ? 'desc':'asc'
    }else {
      orderType = 'asc'
    }
    orders[index].order = orderType

    this.setData({
        activeIndex: index,
        orders: orders,
        policys: policys
    })

    this.getPolicysByOrder()
  },
  // 自动根据参数获取保单列表
  getPolicysByOrder() {
    let orders = this.data.orders
    this.getPolicys(orders[this.data.activeIndex].field, orders[this.data.activeIndex].order)
  },
  // 传参数获取保单列表
  getPolicys(orderParameter = 'filterDefault', orderType = 'ASC' ) {
    let policys = this.data.policys
    let params = policys.params

    orderType = orderType.toUpperCase()
    params[orderParameter] = orderType
    
    if(!policys.pagination.hasNext) return
    return App.HttpService.getPolicys(params)
    .then(data => {
      if(data.ret) {
        policys.items = [...policys.items, ...data.res.data]
        // 大金额加「万」
        policys.items.forEach((item,index) => {
          item.premium_usd = App.Tools.tenThousand(item.premium_usd)
        })
        if(data.res.data.length < policys.params.limit) {
          policys.pagination.hasNext = false
        }
        policys.params.page++
        this.setData({
          policys: policys
        })
      }else {
        console.log(data.res.errorMsg)
      }

    })
  },
  deletePolicy(e) {
    const index = e.currentTarget.dataset.index
    const id = this.data.policys.items[index].id
    let items = this.data.policys.items

    App.WxService.showModal({
      title: '确定删除以下保单？',
      confirmText: '删除',
      content: items[index].productMapping.name
    })
    .then(data => {
      if(data.confirm){
        return App.HttpService.deletePolicy({
          id: id
        })
        .then(data => {
          if(data.ret) {
            this.wetoast.toast({
                title: '删除成功',
                duration: 1000
            })

            // 删除某项
            items.splice(index, 1)
            this.setData({
              'policys.items': items
            })

          }else {
            console.log(data.res.errorMsg);
          }
        })
      }
    })
  },
  init() {
    // 列表内容改变
    App.Event.on('policyadd', this, function(data) {
      let orders = [
      {
        name: '默认排序',
        field: 'filterDefault',  // 排序字段名
        order: 'desc'  // 排序方式,asc升序，desc降序，default未排序
      },
      {
        name: '产品排序',
        field: 'filterProduct',
        order: 'default'
      },
      {
        name: '公司排序',
        field: 'filterCompany',
        order: 'default'
      }
    ]
    let policys = {
      items: [],
      params: {
          page : 1,
          limit: 10,
      },
      pagination: {
        hasNext: true
      }
    }

    this.setData({
      orders: orders,
      policys: policys,
    })
    this.getPolicysByOrder()
    })
  },
  onReachBottom() {
    this.getPolicysByOrder()
  },
  onShow: function() {
  },
  onLoad: function () {
    //创建可重复使用的WeToast实例，并附加到this上，通过this.wetoast访问
    new App.WeToast()

    this.init()

    // 获取所有保单
    this.getPolicysByOrder()
  },
  onUnload(e) {
    // 移除监听
    App.Event.remove('policyadd', this)
  }
})
