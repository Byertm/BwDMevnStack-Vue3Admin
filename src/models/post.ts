import { IComment, ICategory, IDocument, IUser, ITag } from '@models/index';

export interface IPost extends IDocument {
	title: string;
	slug: string;
	preTitle: string;
	content: string;
	imageUrl: string;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	author: Partial<IUser> | null | undefined;
	category: Partial<ICategory> | null | undefined;
	comments: Array<Partial<IComment>> | null | undefined;
	tags: Array<Partial<ITag>> | null | undefined;
	isActive: boolean;
}

type TPostRequest = Omit<IPost, 'author' | 'category' | 'comments' | 'tags'>;

export interface IPostRequest extends TPostRequest {
	author: Array<Partial<IUser>> | string | null | undefined;
	category: Array<Partial<ICategory>> | string | null | undefined;
	comments: Array<Partial<IComment>> | string | null | undefined;
	tags: Array<Partial<ITag>> | string | null | undefined;
}