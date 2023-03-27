import { IDocument } from '@models/index';

export interface IEducation extends IDocument {
	title: string;
	scholl: string;
	section: string;
	description: string;
	startDate: string;
	finishDate: string;
	isActive: boolean;
}