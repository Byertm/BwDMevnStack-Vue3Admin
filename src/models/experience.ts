import { IDocument } from '@models/index';

export interface IExperience extends IDocument {
	title: string;
	company: string;
	section: string;
	description: string;
	startDate: string;
	finishDate: string;
	isActive: boolean;
}