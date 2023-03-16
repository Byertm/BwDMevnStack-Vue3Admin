import { IDocument } from '@models/index';

export interface IComment extends IDocument {
	comment: string;
	author?: string | null;
	postId?: string | null;
	parentId?: string | null;
	createUserId?: string | null;
	updateUserId?: string | null;
	isBanned: boolean;
	isHidden: boolean;
	isActive: boolean;
}