// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据

export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "LeetCode",
		imgurl: "https://static.leetcode.cn/cn-frontendx-assets/production/_next/static/images/logo-711e116152be014f445f50aa6a369231.png?x-oss-process=image%2Fformat%2Cwebp",
		desc: "全球极客挚爱的技术成长平台",
		siteurl: "https://leetcode.cn",
		tags: ["Coding", "Algorithm"],
	},
	{
		id: 2,
		title: "牛客网",
		imgurl: "https://static.nowcoder.com/fe/file/logo/1.png",
		desc: "专业的IT笔试面试备考平台",
		siteurl: "https://www.nowcoder.com",
		tags: ["Coding", "Interview"],
	},
	{
		id: 3,
		title: "VS Code",
		imgurl: "https://code.visualstudio.com/assets/favicon.ico",
		desc: "微软开发的轻量级代码编辑器",
		siteurl: "https://code.visualstudio.com",
		tags: ["Editor", "Development"],
	},
	{
		id: 4,
		title: "Nginx",
		imgurl: "https://nginx.org/favicon.ico",
		desc: "高性能的HTTP和反向代理服务器",
		siteurl: "https://nginx.org",
		tags: ["Server", "Web"],
	},
	{
		id: 5,
		title: "Docker",
		imgurl: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png",
		desc: "容器化平台，简化应用部署",
		siteurl: "https://www.docker.com",
		tags: ["DevOps", "Container"],
	},
	{
		id: 6,
		title: "Steam",
		imgurl: "https://store.steampowered.com/favicon.ico",
		desc: "全球最大的数字游戏发行平台",
		siteurl: "https://store.steampowered.com",
		tags: ["Gaming", "Platform"],
	},
	{
		id: 7,
		title: "JetBrains",
		imgurl: "https://www.jetbrains.com/favicon.ico",
		desc: "专业的软件开发工具提供商",
		siteurl: "https://www.jetbrains.com",
		tags: ["IDE", "Development"],
	},
	{
		id: 8,
		title: "Apifox",
		imgurl: "https://www.apifox.cn/favicon.ico",
		desc: "API设计、调试、测试一体化平台",
		siteurl: "https://www.apifox.cn",
		tags: ["API", "Testing"],
	},
	{
		id: 9,
		title: "原神",
		imgurl: "https://genshin.hoyoverse.com/favicon.ico",
		desc: "开放世界冒险RPG游戏",
		siteurl: "https://genshin.hoyoverse.com",
		tags: ["Game", "Genshin"],
	},
	{
		id: 10,
		title: "崩坏星穹铁道",
		imgurl: "https://hsr.hoyoverse.com/favicon.ico",
		desc: "回合制策略RPG游戏",
		siteurl: "https://hsr.hoyoverse.com",
		tags: ["Game", "Honkai"],
	},
	{
		id: 11,
		title: "绝区零",
		imgurl: "https://zenless.hoyoverse.com/favicon.ico",
		desc: "动作角色扮演游戏",
		siteurl: "https://zenless.hoyoverse.com",
		tags: ["Game", "Zenless"],
	},
	{
		id: 12,
		title: "蔚蓝档案",
		imgurl: "https://webcnstatic.yostar.net/ba_cn_web/prod/web/assets/LOGO.4a06cdd2.png",
		desc: "校园题材角色扮演游戏",
		siteurl: "https://bluearchive-cn.com/",
		tags: ["Game", "Anime"],
	},
	{
		id: 13,
		title: "碧蓝航线",
		imgurl: "https://azurlane.yo-star.com/favicon.ico",
		desc: "战舰拟人化策略手游",
		siteurl: "https://azurlane.yo-star.com",
		tags: ["Game", "Anime"],
	},
	{
		id: 14,
		title: "守望先锋",
		imgurl: "https://ld5.res.netease.com/images/20241213/1734074185668_1f8923e771.svg",
		desc: "团队第一人称射击游戏",
		siteurl: "https://ow.blizzard.cn/#/",
		tags: ["Game", "FPS"],
	},
	{
		id: 15,
		title: "EA",
		imgurl: "https://media.contentapi.ea.com/content/dam/eacom/common/medallion-violet.png",
		desc: "全球领先的互动娱乐软件公司",
		siteurl: "https://www.ea.com",
		tags: ["Game", "Publisher"],
	},
	{
		id: 16,
		title: "战网",
		imgurl: "https://d3ukkjpihy42k4.cloudfront.net/images/favicon.b50a2b7ffcd4631c52d2b61e5d6fec8757e5b81a.ico",
		desc: "暴雪游戏平台",
		siteurl: "https://www.blizzard.com",
		tags: ["Gaming", "Platform"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}