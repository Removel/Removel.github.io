import type { CollectionEntry } from "astro:content";

type DiaryData = CollectionEntry<"diary">["data"];

export type DiaryItem = Omit<DiaryData, "published" | "draft"> & {
	id: string;
	date: string;
};

export interface MomentCardProps {
	moment: DiaryItem;
	index: number;
	minutesAgo: string;
	hoursAgo: string;
	daysAgo: string;
}
