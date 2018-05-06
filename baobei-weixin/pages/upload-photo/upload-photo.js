//获取应用实例
var App = getApp()
Page({
  data: {
    mapping: App.Mapping,
  },
  uploadFile(filePath) {
  	return App.WxService.uploadFile({
      url: App.HttpService.setUrl('/policyphotoupload'),
      filePath: filePath,
      name: 'file',
      formData: {
      	id: 0,
      	sessionId: wx.getStorageSync('sessionId')
      }
	})
  },
  chooseImage() {
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
		this.uploadFile(tempFilePaths[0])
		.then(data => {
			let req = JSON.parse(data.data)
			if(req.ret) {
				App.WxService.hideToast()
				App.WxService.showModal({
		          title: '上传成功',
		          cancelText: '继续添加',
		          confirmText: '前往查看',
		        })
		        .then(data => {
		          if (data.confirm) {
		            // 查看最新照片
		            App.WxService.navigateTo('/pages/photo-list/photo-list')
		          }
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
  onLoad() {
  }
});
