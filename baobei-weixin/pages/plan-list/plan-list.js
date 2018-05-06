//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    planStateList: [{'key':-1, 'val':'全部'}, ...App.Mapping.list.plan_state],
    planStateIndex: 0,
    plans: {
      items: [],
      params: {
          page : 1,
          limit: 10,
          state: -1,
      },
      pagination: {
        hasNext: true
      }
    }
  },
  // 审核状态改变
  stateChange(e) {
  	const state = this.data.planStateList[e.detail.value].key

  	this.setData({
      planStateIndex: e.detail.value
    })

  	let plans = {
      items: [],
      params: {
          page : 1,
          limit: 10,
          state: -1,
      },
      pagination: {
        hasNext: true
      }
    }

    plans.params.state = state
    this.setData({
    	plans: plans
    })
    this.getPlanList()
  },
  getPlanList() {
    let plans = this.data.plans
    let params = plans.params

    if(!plans.pagination.hasNext) return
    return App.HttpService.getPlanList(params)
    .then(data => {
      if(data.ret) {
        plans.items = [...plans.items, ...data.res.data]
        if(data.res.data.length < plans.params.limit) {
          plans.pagination.hasNext = false
        }
        plans.params.page++
        this.setData({
          plans: plans
        })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  onReachBottom() {
    this.getPlanList()
  },
  onShow() {
  },
  onLoad() {
  	this.getPlanList()
  }
});
