import type { TimelineItem } from "../components/features/timeline/types";

export const timelineData: TimelineItem[] = [
	{
		id: "edu-1",
		title: "智能科学与技术",
		description: "大一学年，湖南大学智能科学与技术专业学习，经历保研压力与宿舍生活困境",
		type: "education",
		startDate: "2024-09-01",
		endDate: "2025-06-30",
		location: "湖南长沙",
		organization: "湖南大学",
		position: "本科生",
		skills: ["C++", "数据结构", "算法"],
	},
	{
		id: "proj-1",
		title: "51单片机嵌入式开发",
		description: "大一暑假初次接触嵌入式开发，学习51单片机，成功点亮LED灯，了解引脚、总线等硬件控制知识",
		type: "project",
		startDate: "2025-07-01",
		endDate: "2025-07-31",
		skills: ["嵌入式", "51单片机", "Keil5", "硬件编程"],
	},
	{
		id: "proj-2",
		title: "Linux系统学习",
		description: "跟随黑马Linux教程，学习Linux操作系统、命令行操作、用户权限管理、虚拟机搭建等知识",
		type: "project",
		startDate: "2025-08-01",
		endDate: "2025-08-31",
		skills: ["Linux", "VMware", "FinalShell", "命令行", "WSL"],
	},
	{
		id: "life-1",
		title: "独立生活：搬出宿舍",
		description: "因宿舍生活问题与家庭不支持，决定独立租房。8月19日提前返校找房源，9月6日正式搬入出租屋，开始独立生活",
		type: "achievement",
		startDate: "2025-08-19",
		endDate: "2025-09-06",
		location: "湖南长沙",
		achievements: [
			"独立完成租房决策与执行",
			"用生活费支付房租",
			"积累租房经验，为后续实习租房做准备"
		],
	},
	{
		id: "proj-3",
		title: "MySQL数据库学习",
		description: "学习MySQL数据库基础，掌握增删改查操作，使用DataGrip进行数据库管理，为后续项目开发打下基础",
		type: "project",
		startDate: "2025-09-01",
		endDate: "2025-10-01",
		skills: ["MySQL", "SQL", "DataGrip", "数据库设计"],
	},
	{
		id: "proj-4",
		title: "Minecraft UGC地图开发",
		description: "加入岳麓幻境社，参与网易Minecraft UGC地图项目，使用Lua脚本调用API开发地图玩法关卡。因文档不足和技术能力限制，10月中旬退出项目",
		type: "project",
		startDate: "2025-09-15",
		endDate: "2025-10-15",
		location: "湖南长沙",
		organization: "岳麓幻境社",
		skills: ["Lua", "API调用", "游戏开发"],
		achievements: [
			"完成Demo开发",
			"认识到团队协作与自我提升的重要性"
		],
	},
	{
		id: "proj-5",
		title: "LeetCode算法刷题",
		description: "从10月14日开始每日至少一道力扣题目，持续5个月，主要跟随灵茶山艾府推荐题库练习算法与数据结构",
		type: "project",
		startDate: "2025-10-14",
		endDate: "2026-03-14",
		skills: ["算法", "数据结构", "LeetCode", "问题解决"],
		links: [
			{ name: "GitHub仓库", url: "https://github.com/Removel/LeetCode.git", type: "project" }
		],
		achievements: [
			"累计完成约150道算法题",
			"建立持续学习习惯"
		],
	},
	{
		id: "proj-7",
		title: "JavaWeb后端学习",
		description: "从11月开始系统学习Java后端技术栈，包括JavaSE、SpringBoot、MyBatis、Maven等，为后续项目开发打下基础",
		type: "project",
		startDate: "2025-11-01",
		endDate: "2025-12-31",
		skills: ["Java", "SpringBoot", "MyBatis", "Maven", "JWT"],
		achievements: [
			"系统掌握Java后端开发基础",
			"学会使用Git进行版本控制",
			"能够独立搭建简单后端项目"
		],
	},
	{
		id: "proj-6",
		title: "图书管理系统",
		description: "大一上学期程序设计大作业，大二寒假前重新实现。满足老师所有要求，包括数据库集成、用户管理等完整功能",
		type: "project",
		startDate: "2026-01-10",
		endDate: "2026-01-24",
		skills: ["C++", "数据库", "程序设计", "项目开发"],
		links: [
			{ name: "GitHub仓库", url: "https://github.com/Removel/Library_Management_System", type: "project" }
		],
	},
	{
		id: "proj-8",
		title: "污水处理识别项目",
		description: "加入老师项目组，负责Java后端开发。项目涉及YOLOv13模型识别、Vue前端、RTMP视频流、Python后端等。从零搭建后端，代码量约3.5k行",
		type: "project",
		startDate: "2026-01-15",
		endDate: "2026-05-15",
		location: "湖南长沙",
		organization: "湖南大学",
		skills: ["Java", "SpringBoot", "Vue", "Python", "YOLO", "Docker", "部署"],
		links: [
			{ name: "GitHub仓库", url: "https://github.com/HDevtTeam/Springboot.git", type: "project" }
		],
		achievements: [
			"独立完成Java后端开发",
			"学会项目部署与前后端联调",
			"了解深度学习模型训练与推理",
			"掌握飞书文档协作与项目管理"
		],
	},
	{
		id: "proj-9",
		title: "AI云计算平台",
		description: "学习Redis缓存技术后，独立开发AI云计算平台项目。包含登录系统、高并发处理、AI对话功能，灵感来自AutoDL平台",
		type: "project",
		startDate: "2026-03-01",
		endDate: "2026-04-15",
		skills: ["Java", "Redis", "SpringBoot", "AI", "高并发"],
		links: [
			{ name: "GitHub仓库", url: "https://github.com/Removel/AiCloudComputingPlatform.git", type: "project" }
		],
		achievements: [
			"掌握Redis缓存技术",
			"理解高并发场景下的锁机制",
			"实现AI对话功能",
			"项目成为面试亮点"
		],
	},
	{
		id: "proj-10",
		title: "OpenWrt路由器定制",
		description: "给出租屋路由器安装OpenWrt系统，实现内网穿透、自动代理等功能。后续用于远程控制家中设备",
		type: "project",
		startDate: "2026-03-01",
		endDate: "2026-03-31",
		skills: ["OpenWrt", "内网穿透", "网络配置", "Linux"],
		achievements: [
			"实现远程控制家中设备",
			"部署个人博客到GitHub Pages"
		],
	},
	{
		id: "proj-11",
		title: "AI科研课题组",
		description: "加入AI科研组，学习Claude Code技能编写、LangChain智能体构建、Hermes自学习系统。后因实习压力于6月7日离组",
		type: "project",
		startDate: "2026-03-15",
		endDate: "2026-06-07",
		location: "湖南长沙",
		organization: "湖南大学",
		skills: ["Python", "LangChain", "AI", "Claude", "Hermes", "科研"],
		achievements: [
			"了解学术科研流程",
			"深入理解AI对话系统",
			"掌握智能体开发技术",
			"对AI情感、记忆、自进化产生兴趣"
		],
	},
	{
		id: "proj-12",
		title: "OneAndOnly AI项目",
		description: "投递实习过程中独立探索开发的简单AI项目",
		type: "project",
		startDate: "2026-04-01",
		endDate: "2026-04-30",
		skills: ["AI", "Python"],
		links: [
			{ name: "GitHub仓库", url: "https://github.com/Removel/OneAndOnly.git", type: "project" }
		],
	},
	{
		id: "work-1",
		title: "字节跳动后端开发实习",
		description: "从零开始学习计算机到拿到字节跳动实习offer，完成从大一结束到大二结束的一年学习与成长历程",
		type: "work",
		startDate: "2026-06-01",
		location: "上海",
		organization: "字节跳动",
		position: "后端开发实习生",
		skills: ["后端开发", "算法", "数据库", "Linux"],
		featured: true,
	},
];