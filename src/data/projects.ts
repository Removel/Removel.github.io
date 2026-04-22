// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "sewageWatch",
		title: "无人机污水监控系统",
		description:
			"基于mysql，springboot，mybatis等技术栈开发的无人机污水监控系统，实现对污水的实时监控与分析。",
		image: "",
		category: "web",
		techStack: ["mysql", "springboot", "mybatis"],
		status: "completed",
		sourceCode: "https://github.com/HDevtTeam/Springboot.git",
		startDate: "2025-12-20",
		endDate: "2026-5-20",
		featured: true,
		tags: ["后端", "无人机", "数据库", "对象管理"],
		showImage: false,
	},
	{
		id: "ai-cloud-computing-platform",
		title: "ACCP 算力云平台",
		description:
			"面向分布式算力调度与资源管理的云平台，支持邮箱注册与登陆认证和权限管理，支持租借服务器资源，限时秒杀服务器租赁优惠券，与大模型实现带记忆多轮会话。",
		image: "",
		category: "web",
		techStack: ["Java", "SpringBoot", "MySQL", "Redis", "Ollama","spring_ai","spring_email","Mybatis_plus"],
		status: "in-progress",
		liveDemo: "",
		sourceCode: "https://github.com/Removel/AiCloudComputingPlatform.git",
		startDate: "2026-03-12",
		endDate: "2026-07-12",
		featured: true,
		tags: ["云平台", "算力秒杀", "分布式", "后端开发"],
		showImage: false,
	},
	{
		id: "leetcode-practice",
		title: "LeetCode 刷题仓库",
		description:
			"长期维护的算法刷题仓库，持续记录数据结构与算法题解、思路总结、代码模板与解题技巧，用于提升编程能力与面试准备。",
		image: "",
		category: "other",
		techStack: ["Java", "算法", "数据结构", "LeetCode", "刷题", "c++"],
		status: "in-progress",
		sourceCode: "https://github.com/Removel/LeetCode",
		startDate: "2025-09-03",
		featured: false,
		tags: ["算法", "刷题", "数据结构", "面试", "长期更新"],
		showImage: false,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
