//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    messages: {
      items: [],
      params: {
          page : 1,
          limit: 10,
      },
      pagination: {
        hasNext: true
      }
    },
  },

  getMessages() {
    let messages = this.data.messages
    let params = messages.params

    return App.HttpService.getMessages(params)
    .then(data => {
      if(data.ret) {
        messages.items = [...messages.items, ...data.res.data]
        if(data.res.data.length < messages.params.limit) {
          messages.pagination.hasNext = false
        }
        messages.params.page++
        App.globalData.messageList = messages.items
        this.setData({
          messages: messages
        })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  readMessage(index) {
    let items = App.globalData.messageList
    items[index].status = 1
    this.setData({
      'messages.items': items
    })
  },
  onReachBottom() {
    this.getMessages()
  },
  onShow() {
  },
  onUnload(e) {
    // 移除监听
    App.Event.remove('messageReaded', this)
  },
  onLoad() {
    this.getMessages()

    // 消息已读
    App.Event.on('messageReaded', this, function(data) {
      this.readMessage(data)
    }) 
  }
})
