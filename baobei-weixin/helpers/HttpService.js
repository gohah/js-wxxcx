import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super()
		this.$$prefix = ''
		this.$$path = {
			login: '/common/sales/login',  // 登录
			doUserInfo: '/common/sales/doinfo',  // 设置用户信息
			userInfo: '/common/sales/info',  // 获取用户信息
			dosendcode: '/common/sales/dosendcode',  // 发送验证码
			dobind: '/common/sales/dobind',  // 绑定手机
			messages: '/common/messages',  // 我的消息
			domessages: '/common/domessages',  // 使消息已读
			policys: '/policys',  // 所有保单
			dopolicys: '/dopolicys',  // 添加或修改保单
			companys: '/companys',  // 获取公司列表
			deletepolicys: '/deletepolicys',  // 删除保单
			products: '/companys/products',  // 获取产品列表
			// news: '/news',
			// newsdetail: '/newsdetail',
			// hkinfos: '/hkinfos',
			// hkinfodetail: '/hkinfodetail',
			// faqdetail: '/faqdetail',
			// faqs: '/faqs',
			policyphotoupload: '/policyphotoupload',  // 上传保单照片
			policyphotos: '/policyphotos',  // 获取保单照片列表
			policyphotodrop: '/policyphotodrop',  // 撤回保单照片上传
			policydetail: '/policydetail',  // 获取保单详情
			dofeedback: '/dofeedback',  // 意见反馈

			dosales: '/dosales',  // 申请代理人·
			doappointments: '/doappointments',  // 添加预约签单
			appointments: '/appointments',  // 获取预约签单列表
			doplans: '/doplans',  // 添加或修改计划书
			plandetail: '/plandetail',  // 获取计划书详情
			plans: '/plans',  // 获取计划书列表
			plandrop: '/plandrop',  // 撤回计划书

        }
	}

	// 登录
	signIn(params) {
		return this.postRequest(this.$$path.login, params) 
	}

	// 设置用户信息
	setUserInfo(params) {
		return this.postRequest(this.$$path.doUserInfo, params) 
	}

	// 获取用户信息
	getUserInfo(params) {
		return this.getRequest(this.$$path.userInfo, params) 
	}

	// 获取保单列表
	getPolicys(params) {
		return this.getRequest(this.$$path.policys, params) 
	}

	// 获取公司列表
	getCompanys(params) {
		return this.getRequest(this.$$path.companys, params) 
	}

	// 添加保单
	addPolicys(params) {
		return this.postRequest(this.$$path.dopolicys, params) 
	}

	// 获取产品列表
	getProducts(params) {
		return this.getRequest(this.$$path.products, params) 
	}

	// 删除保单
	deletePolicy(params) {
		return this.postRequest(this.$$path.deletepolicys, params) 
	}

	// 获取消息列表
	getMessages(params) {
		return this.getRequest(this.$$path.messages, params) 
	}

	// 使消息已读
	readMessage(params) {
		return this.postRequest(this.$$path.domessages, params) 
	}

	// getNews(params) {
	// 	return this.getRequest(this.$$path.news, params) 
	// }

	// getNewsDetail(params) {
	// 	return this.getRequest(this.$$path.newsdetail, params) 
	// }

	// getKnowledge(params) {
	// 	return this.getRequest(this.$$path.hkinfos, params) 
	// }
	// getKnowledgeDetail(params) {
	// 	return this.getRequest(this.$$path.hkinfodetail, params) 
	// }

	// getFaqs(params) {
	// 	return this.getRequest(this.$$path.faqs, params) 
	// }
	
	// getFaqDetail(params) {
	// 	return this.getRequest(this.$$path.faqdetail, params) 
	// }

	// 获取保单照片列表
	getPhotoList(params) {
		return this.getRequest(this.$$path.policyphotos, params) 
	}

	// 撤回保单照片上传
	cancelPhotoUpload(params) {
		return this.postRequest(this.$$path.policyphotodrop, params) 
	}

	// 获取保单详情
	getPolicyDetail(params) {
		return this.getRequest(this.$$path.policydetail, params) 
	}

	// 添加意见反馈
	addFeedback(params) {
		return this.postRequest(this.$$path.dofeedback, params) 
	}

	// 发送验证码
	sendCode(params) {
		return this.postRequest(this.$$path.dosendcode, params) 
	}

	// 绑定手机
	bindPhone(params) {
		return this.postRequest(this.$$path.dobind, params) 
	}

	// 申请代理人
	applyAgent(params) {
		return this.postRequest(this.$$path.dosales, params) 
	}

	// 预约签单
	orderAppointment(params) {
		return this.postRequest(this.$$path.doappointments, params) 
	}
	
	// 获取预约签单列表
	getAppointmentList(params) {
		return this.getRequest(this.$$path.appointments, params) 
	}

	// 添加或修改计划书
	addPlan(params) {
		return this.postRequest(this.$$path.doplans, params) 
	}

	// 获取计划书详情
	getPlanDetail(params) {
		return this.getRequest(this.$$path.plandetail, params) 
	}

	// 获取计划书列表
	getPlanList(params) {
		return this.getRequest(this.$$path.plans, params) 
	}

	// 撤回计划书
	cancelPlan(params) {
		return this.postRequest(this.$$path.plandrop, params) 
	}

	// uploadPoto(params) {
	// 	let header = {
	// 		'Content-Type': 'multipart/form-data'
	// 	}
	// 	return this.postRequest(this.$$path.policyphotoupload, params, header) 
	// }

}

export default Service