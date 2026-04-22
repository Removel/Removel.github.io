// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other" | "LLM&Agent";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	{
		id: "java",
		name: "Java",
		description:
			"后端核心开发语言",
		icon: "logos:java",
		category: "backend",
		level: "intermediate",
		experience: {
			years: 0,
			months: 11,
		},
		projects: ["accp"],
		color: "#437291",
	},
	{
		id: "spring",
		name: "Spring & SpringBoot",
		description:
			"Java主流后端框架，快速开发RESTful API、服务层与分布式云平台模块",
		icon: "logos:spring-icon",
		category: "backend",
		level: "intermediate",
		experience: {
			years: 0,
			months: 11,
		},
		projects: ["accp-cloud-platform"],
		color: "#6DB33F",
	},
	{
		id: "cpp",
		name: "C/C++",
		description:
			"学校学的，竞赛用的",
		icon: "logos:c-plusplus",
		category: "other",
		level: "intermediate",
		experience: {
			years: 1,
			months: 7,
		},
		projects: ["LeetCode"],
		color: "#00599C",
	},
	{
		id: "python",
		name: "Python",
		description:
			"通用开发语言，用于AI大模型、RAG应用、自动化脚本与数据处理开发",
		icon: "logos:python",
		category: "LLM&Agent",
		level: "intermediate",
		experience: {
			years: 0,
			months: 3,
		},
		projects: [],
		color: "#3776AB",
	},
	{
		id: "mysql",
		name: "MySQL",
		description: "关系型数据库，数据存储、查询优化与事务管理",
		icon: "logos:mysql",
		category: "database",
		level: "intermediate",
		experience: {
			years: 1,
			months: 1,
		},
		projects: ["accp-cloud-platform"],
		color: "#00758F",
	},
	{
		id: "redis",
		name: "Redis",
		description: "内存数据库与缓存中间件，用于高并发、分布式锁与流量控制",
		icon: "skill-icons:redis-dark",
		category: "database",
		level: "intermediate",
		experience: {
			years: 0,
			months: 5,
		},
		projects: ["accp-cloud-platform"],
		color: "#D82C20",
	},
	{
		id: "langchain",
		name: "LangChain",
		description:
			"大模型应用开发框架，用于RAG系统、智能体与多模态AI应用构建",
		icon: "simple-icons:langchain",
		category: "LLM&Agent",
		level: "intermediate",
		experience: {
			years: 0,
			months: 2,
		},
		projects: [],
		color: "#65B800",
	},
	{
		id: "hermes",
		name: "Hermes",
		description:
			"大模型agent，用于帮我干活与生活小助手",
		icon: "material-symbols:smart-toy",
		category: "LLM&Agent",
		level: "intermediate",
		experience: {
			years: 0,
			months: 1,
		},
		projects: [],
		color: "#7F50F5",
	},
	{
		id: "rag",
		name: "RAG 检索增强生成",
		description:
			"AI大模型增强技术，构建知识库问答、文档检索与精准生成式AI系统",
		icon: "material-symbols:database-search",
		category: "LLM&Agent",
		level: "intermediate",
		experience: {
			years: 0,
			months: 2,
		},
		projects: [],
		color: "#FF6B6B",
	},
	{
		id: "conda",
		name: "Conda",
		description: "Python环境管理工具，管理多版本Python、AI依赖库与虚拟环境",
		icon: "logos:conda",
		category: "tools",
		level: "advanced",
		experience: {
			years: 0,
			months: 5,
		},
		projects: [],
		color: "#44A833",
	},
	{
		id: "linux",
		name: "Linux",
		description:
			"服务器操作系统，用于项目部署、环境配置、命令行操作与服务管理",
		icon: "skill-icons:linux-dark",
		category: "tools",
		level: "intermediate",
		experience: {
			years: 1,
			months: 0,
		},
		projects: ["accp-cloud-platform"],
		color: "#FCC624",
	},
	{
		id: "frontend",
		name: "css&html&js",
		description:
			"HTML + CSS + JavaScript，前端基础，实现页面布局与基础交互",
		icon: "skill-icons:html",
		category: "frontend",
		level: "intermediate",
		experience: {
			years: 0,
			months: 4,
		},
		projects: [],
		color: "#E34C25",
	},
	{
		id: "tailscale",
		name: "Tailscale",
		description: "零配置VPN工具，用于跨设备、跨网络安全远程访问与内网穿透",
		icon: "simple-icons:tailscale",
		category: "tools",
		level: "intermediate",
		experience: {
			years: 0,
			months: 3,
		},
		projects: [],
		color: "#30C2D6",
	},
	{
		id: "pcb",
		name: "PCB设计与制图",
		description:
			"电路板原理图设计、PCB制图与硬件工程制图",
		icon: "logos:aws-eventbridge",
		category: "other",
		level: "intermediate",
		experience: {
			years: 0,
			months: 2,
		},
		projects: ["drone-project"],
		color: "#4CAF50",
	},
	{
		id: "git",
		name: "Git & GitHub",
		description: "代码版本控制，多项目管理、协作开发与GitHub开源仓库维护",
		icon: "skill-icons:git",
		category: "tools",
		level: "advanced",
		experience: {
			years: 1,
			months: 0,
		},
		projects: ["accp-cloud-platform", "sewageWatch", "leetcode-practice"],
		color: "#F05032",
	},
	{
		id: "nginx",
		name: "Nginx",
		description:
			"高性能Web服务器与反向代理，用于项目部署、负载均衡与静态资源托管",
		icon: "skill-icons:nginx",
		category: "tools",
		level: "intermediate",
		experience: {
			years: 0,
			months: 4,
		},
		projects: ["sewageWatch"],
		color: "#009639",
	},
	{
		id: "docker",
		name: "Docker",
		description: "容器化技术，统一开发/部署环境，实现项目快速打包与迁移",
		icon: "logos:docker-icon",
		category: "tools",
		level: "intermediate",
		experience: {
			years: 0,
			months: 6,
		},
		projects: ["accp-cloud-platform"],
		color: "#2496ED",
	},
	{
		id: "apifox",
		name: "Apifox",
		description: "API调试、文档管理与接口测试工具，用于后端接口开发调试",
		icon: "simple-icons:apifox",
		category: "tools",
		level: "advanced",
		experience: {
			years: 1,
			months: 0,
		},
		projects: ["accp", "sewageWatch"],
		color: "#615ECE",
	},
	{
		id: "vmware",
		name: "VMware",
		description: "虚拟机软件，用于搭建Linux测试环境、多系统模拟与服务部署",
		icon: "logos:vmware",
		category: "tools",
		level: "intermediate",
		experience: {
			years: 1,
			months: 1,
		},
		projects: [],
		color: "#607494",
	},
];
