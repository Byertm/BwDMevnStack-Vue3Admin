import { IDocument } from '@models/index';

export interface ITag extends IDocument {
	name: string;
	slug: string;
	url: string;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isActive: boolean;
}