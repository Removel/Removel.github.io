// 日记数据配置
// 用于管理日记页面的数据

export interface DiaryItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// 示例日记数据
const diaryData: DiaryItem[] = [
	{
		id: 1,
		content: "樱花下落的速度是秒速五厘米（串台了）",
		date: "2025-08-20T10:30:00Z",
		images: ["/images/diary/sakura.jpg", "/images/diary/1.webp"],
	},
	{
		id: 2,
		content: "上学期跑的步竟然变成了奖状和奖品（一个书包）！",
		date: "2026-04-20T08:00:00Z",
		images: ["/images/diary/chat_picture.jpg"],
		location: "学校",
		mood: "开心",
		tags: ["跑步", "奖状", "奖品", "书包"],
	},
	{
		id: 3,
		content: "今天又参加了电脑维护活动呀~",
		date: "2026-04-25T15:00:00Z",
		images: ["/images/diary/computer-maintenance-activity.jpg"],
		location: "学校",
		mood: "充实",
		tags: ["社团活动", "电脑维护"],
	},
];

// 获取日记列表（按时间倒序）
export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取所有标签
export const getAllTags = () => {
	const tags = new Set<string>();
	diaryData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};
