//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    appointments: {
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
  getAppointments() {
    let appointments = this.data.appointments
    let params = appointments.params
    
    if(!appointments.pagination.hasNext) return
    return App.HttpService.getAppointmentList(params)
    .then(data => {
      if(data.ret) {
        appointments.items = [...appointments.items, ...data.res.data]
        if(data.res.data.length < appointments.params.limit) {
          appointments.pagination.hasNext = false
        }
        appointments.params.page++
        this.setData({
          appointments: appointments
        })
      }else {
        console.log(data.res.errorMsg)
      }

    })
  },
  onShow() {
  },
  onLoad() {

    this.getAppointments()
  }
});
