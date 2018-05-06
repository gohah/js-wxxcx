// 说明：
// mapping.list.表名 可返回 mapping 对象数组
// 如 mapping.list.gender 结果返回:
// [{key:0, val:'女'},{key:1, val:'男'}]

// mapping 表
var mapping = {
	// 性别
    gender: {
        '0': '女',
        '1': '男'
    },
    // 性别，erp数据库使用
    sex: {
        '1': '男',
        '2': '女'
    },
    // 缴费方式
    payment_method: {
        '1': '年缴',
        '2': '月缴',
        '3': '季缴',
        '4': '半年缴',
        '5': '趸缴'
    },
    // 消息类型
    message_type: {
    	'0': '系统消息',
    	'1': '续保消息'
    },
    // 吸烟情况
    smoke: {
        '1': '吸烟',
        '2': '不吸烟'
    },
    // 保费类型
    nbf_type: {
        '1': '年保费',
        '2': '总保额'
    },
    // 计划书状态
    plan_state: {
        '0': '生成中',
        '1': '已生成',
        '2': '生成失败',
        '3': '已撤回'
    },
    // 预约签单状态
    appointment_state: {
        '0': '未提交',
        '1': '审核通过',
        '2': '审核中',
        '3': '资料不全',
        '4': '已签单',
        '5': '预约中',
        '6': '预约成功',
        '7': '已取消预约',
    },
}


// 生成 mapping 对象数组
var mappingList = {}
for(let atr in mapping) {
	let subObj = mapping[atr]
	let list = []
	// 遍历子对象
	for(let atr2 in subObj) {
		let obj = {}
		obj.key = atr2
		obj.val = subObj[atr2]
		list.push(obj)
	}
	mappingList[atr] = list
}
mapping.list = mappingList


module.exports = mapping
