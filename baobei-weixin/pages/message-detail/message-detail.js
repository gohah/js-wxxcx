//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    content: '',
  },
  // 设置消息已读
  readMessage(messageId, messageIndex) {

    return App.HttpService.readMessage({
      id: messageId
    })
    .then(data => {
      if(data.ret) {
        console.log('已读成功')
        App.Event.emit('messageReaded', messageIndex)
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  getMessage(messageIndex) {
    var messageList = App.globalData.messageList

    this.setData({
      content: messageList[messageIndex].content
    })
  },
  onLoad: function (e) {
    var messageIndex = Number(e.index)
    var messageList = App.globalData.messageList
    var messageId = messageList[messageIndex].id

    // 获取消息内容
    this.getMessage(messageIndex)

    // 设置消息已读
    this.readMessage(messageId, messageIndex)
  }
})
