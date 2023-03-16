import { IDocument } from '@models/index';

export interface IProject extends IDocument {
	name: string;
	description: string;
	demoPreviewUrl: string;
	deployUrl: string;
	categoryId: string;
	startDate: string;
	finishDate: string;
	createUserId: string | null | undefined;
	updateUserId: string | null | undefined;
	isActive: boolean;
	imageUrl?: string;
}