//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
    photos: {
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
  // 预览照片
  previewPhoto(e) {
    let url = e.currentTarget.dataset.url;

    return App.WxService.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  // 撤销
  cancelPhotoUpload(e) {
    const id = e.target.dataset.id
    const index = e.target.dataset.index

    App.WxService.showModal({
      title: '友情提示',
      content: '确定撤销这张保单照片吗？'
    })
    .then(data => {
      if(data.confirm) {
        App.HttpService.cancelPhotoUpload({
          id: id
        })
        .then(data => {
          if(data.ret) {
            let item = this.data.photos.items
            item[index] = data.res.data
            this.setData({
              'photos.items': item
            })
          }else {
            console.log(data.res.errorMsg)
          }
        })
      }
    })
  },
  uploadFile(filePath, id) {
    return App.WxService.uploadFile({
      url: App.HttpService.setUrl('/policyphotoupload'),
      filePath: filePath,
      name: 'file',
      formData: {
        id: id,
        sessionId: wx.getStorageSync('sessionId')
      }
    })
  },
  chooseImage(e) {
    const index = e.currentTarget.dataset.index

    return App.WxService.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    })
    .then(data => {
      var tempFilePaths = data.tempFilePaths

      App.WxService.showToast({
        title: '上传中',
        icon: 'loading',
        duration: 10000
      })
      this.uploadFile(tempFilePaths[0], e.currentTarget.dataset.id)
      .then(data => {
        let req = JSON.parse(data.data)
        App.WxService.hideToast()

        if(req.ret) {
          App.WxService.showToast({
            title: '上传成功',
            icon: 'success'
          })
          let items = this.data.photos.items
          items[index].status = 0

          this.setData({
            'photos.items': items
          })
        }else {
          console.log(data.res.errorMsg)
          App.WxService.showModal({
            title: '抱歉，上传失败',
            content: '请稍后重试',
            showCancel: false,
            confirmText: '确定',
          })
        }
      })
    })
  },
  // 查看保单
  checkPolicy(e) {
    App.WxService.navigateTo('/pages/policy-detail/policy-detail', {
      id: e.target.dataset.policyid
    })
  },
  getPhotoList() {
    let photos = this.data.photos
    let params = photos.params

    if(!photos.pagination.hasNext) return
    return App.HttpService.getPhotoList(params)
    .then(data => {
      if(data.ret) {
        photos.items = [...photos.items, ...data.res.data]
        if(data.res.data.length < photos.params.limit) {
          photos.pagination.hasNext = false
        }
        photos.params.page++
        this.setData({
          photos: photos
        })
      }else {
        console.log(data.res.errorMsg)
      }
    })
  },
  onReachBottom() {
    this.getPhotoList()
  },
  onShow() {
    this.getPhotoList()
  },
  onLoad() {
  }
});
