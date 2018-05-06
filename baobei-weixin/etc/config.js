const env = 0  // 设置运行环境

const envs = [
	{
		id: 0,
		name: '线上环境',
		url: 'https://service.liechengcf.com',
	},
	{
		id: 1,
		name: '预发环境',
		url: 'https://preservice.liechengcf.com',
	},
	{
		id: 2,
		name: '测试环境',
		url: 'http://service.liechengcf.net',
	},
	{
		id: 3,
		name: '本地环境',
		url: 'http://service.baobei360.me',
	},
]

export default {
	version: '1.2.1',
	env: envs[env],
	basePath: envs[env].url,
}