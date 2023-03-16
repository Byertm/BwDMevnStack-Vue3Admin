import { IDocument } from '@models/index';

export type TFileType = 'file' | 'directory';
export type TFileAttrs = { lastModified: number; name: string; size: number; type: string; webkitRelativePath: string };
export type TSelectedElement = { path: string; name: string; type: TFileType | ''; suffix: string; size: number };
export type TBase64Image = { imgBase64: string };

export interface IFileAndAttrs extends IDocument {
	file?: File | null;
	attrs?: Partial<TFileAttrs>;
	type?: TFileType;
	base64Image?: Partial<TBase64Image>;
	path?: string;
}

export interface IFile {
	name: string;
	type: TFileType;
	suffix: string;
	size: string;
}