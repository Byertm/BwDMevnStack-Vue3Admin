import { IDocument } from '@models/index';

export interface ICategory extends IDocument {
	name: string;
	url: string;
	slug: string;
	parentId: string | null;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isActive: boolean;
}