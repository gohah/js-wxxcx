const App = getApp()

Page({
	data: {
		logged: !1
	},
    onLoad() {},
    onShow() {
    	const sessionId = App.WxService.getStorageSync('sessionId')
    	this.setData({
    		logged: !!sessionId
    	})
    	sessionId && setTimeout(this.goIndex, 1500)
    },
    login() {
    	this.signIn(this.goIndex)
    },
    goIndex() {
    	App.WxService.switchTab({
    		url: '/pages/index/index'
    	})
    	.then(data => App.getWeChatUserInfo())
    },
	showModal() {
		App.WxService.showModal({
            title: '友情提示', 
            content: '获取用户登录状态失败，请重新登录', 
            showCancel: !1, 
        })
	},
	signIn(cb) {
		if (App.WxService.getStorageSync('sessionId')) return
		App.WxService.login()
		// 用code请求sessionId
		.then(data => {
			return App.HttpService.signIn({
				code: data.code
			})
		})
		// 请求成功，跳转首页
		.then(data => {
			if (data.ret == true) {
				App.WxService.setStorageSync('sessionId', data.res.data.sessionId)
				cb()
			}else {
				console.log(data.res.errorMsg)
			}
		})
	},
})