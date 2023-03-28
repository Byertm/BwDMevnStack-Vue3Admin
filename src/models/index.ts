export type { ICategory } from '@models/category';
export type { IComment } from '@models/comment';
export type { IDocument } from '@models/document';
export type { IEducation } from '@models/education';
export type { IExperience } from '@models/experience';
export type { IPost } from '@models/post';
export type { IProject } from '@models/project';
export type { IRole } from '@models/role';
export type { ISkill } from '@models/skill';
export type { ITag } from '@models/tag';
export type { ITestimonial } from '@models/testimonial';
export type { IUser } from '@models/user';
export type { ISection } from '@models/section';
export type { ISite } from '@models/site';
export type { IFile } from '@models/file';

// ModelType örneği
export interface ITodo {
	id: number;
	title: string;
	completed: boolean;
}

export interface ModelType {
	id: number;
	[key: string]: any;
}

export interface ModelFields {
	key: string;
	label: string;
	actions?: Array<any>;
}

// ModelFields örneği
export const todoFields: ModelFields[] = [
	{ key: 'id', label: 'ID' },
	{ key: 'title', label: 'Title' },
	{ key: 'completed', label: 'Completed' }
];