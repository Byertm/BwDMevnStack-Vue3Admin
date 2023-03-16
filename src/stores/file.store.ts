import { defineStore } from 'pinia';
import service from '@services/file.service';
import { isEmptyObject } from '@utils/index';
import { IFile, IFileAndAttrs, TFileType, TSelectedElement } from '@models/file';

interface FileState {
	file: { data: IFile | undefined | null; loading: boolean; errors: any[] };
	files: { data: IFile[] | null; loading: boolean; errors: any[] };
	filesByPath: { data: IFile[] | null; loading: boolean; errors: any[] };
	filesByMiddlePath: { data: IFile[] | null; loading: boolean; errors: any[] };
}

const initialState = {
	file: { data: null, loading: false, errors: [] },
	files: { data: [], loading: false, errors: [] }, // Default path all contents
	filesByPath: { data: [], loading: false, errors: [] }, // Path in all contents
	filesByMiddlePath: { data: [], loading: false, errors: [] } // Path in all contents
} as FileState;

export const useFileStore = defineStore({
	id: 'files',
	state: () => ({ ...initialState }),
	actions: {
		getImageUrlFromFile(middlePath: string, selectedFile: TSelectedElement) {
			return service.getImageUrlFromFile(middlePath, selectedFile);
		},
		async getAll() {
			this.files.loading = true;
			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.files.data = data))
				.catch((error) => {
					this.files.data = [];
					this.files.errors.push(error);
				})
				.finally(() => (this.files.loading = false));
		},
		async getAllByPath(path?: string) {
			this.filesByPath.loading = true;
			await service
				.getAllByPath(path)
				.then(async (data) => await data.data)
				.then((data) => (this.filesByPath.data = data))
				.catch((error) => {
					this.filesByPath.data = [];
					this.filesByPath.errors.push(error);
				})
				.finally(() => (this.filesByPath.loading = false));
		},
		async getAllByMiddlePath(path?: string) {
			this.filesByMiddlePath.loading = true;
			await service
				.getAllByMiddlePath(path)
				.then(async (data) => await data.data)
				.then((data) => (this.filesByMiddlePath.data = data))
				.catch((error) => {
					this.filesByMiddlePath.data = [];
					this.filesByMiddlePath.errors.push(error);
				})
				.finally(() => (this.filesByMiddlePath.loading = false));
		},
		async getFileByName(name: string, path?: string) {
			this.file.loading = true;
			await service
				.getFileByName(name, path)
				.then(async (data) => await data.data)
				.then((data) => (this.file.data = data))
				.catch((error) => {
					this.file.data = null;
					this.file.errors.push(error);
				})
				.finally(() => {
					this.file.loading = false;
				});
		},
		async uploadFile(fileAndAttrs: Partial<IFileAndAttrs>): Promise<boolean> {
			let returnVal: Promise<any> = Promise.resolve(null);
			await service
				.uploadFile(fileAndAttrs)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(data);
				})
				.catch((error) => {
					this.file.data = null;
					this.file.errors.push(error);
					returnVal = Promise.reject(error);
				})
				.finally(() => this.getAllByPath(fileAndAttrs?.path));
			return returnVal;
		},
		async uploadImage(fileAndAttrs: Partial<IFileAndAttrs>): Promise<boolean> {
			let returnVal: Promise<any> = Promise.resolve(null);
			await service
				.uploadImage(fileAndAttrs)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(data);
				})
				.catch((error) => {
					this.file.data = null;
					this.file.errors.push(error);
					returnVal = Promise.reject(error);
				})
				.finally(() => this.getAllByPath(fileAndAttrs?.path));
			return returnVal;
		},
		async createFile(name: string, path: string = '') {
			let returnVal: Promise<any> = Promise.resolve(null);
			await service
				.createFile(path, name)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(data);
					this.getAllByPath(path);
				})
				.catch((error) => {
					this.file.errors.push(error);
					returnVal = Promise.reject(error);
				});
			return returnVal;
		},
		async createDirectory(name: string, path: string = '') {
			let returnVal: Promise<any> = Promise.resolve(null);
			await service
				.createDirectory(path, name)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(data);
					this.getAllByPath(path);
				})
				.catch((error) => {
					this.file.errors.push(error);
					returnVal = Promise.reject(error);
				});
			return returnVal;
		},
		async delete(path: string, type: TFileType) {
			let returnVal: Promise<any> = Promise.resolve(null);
			await service
				.remove(path, type)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(data);
					this.getAll();
				})
				.catch((error) => {
					this.file.errors.push(error);
					returnVal = Promise.reject(error);
				});
			return returnVal;
		}
	},
	getters: {
		isFile: (state) => !!state.file.data && !isEmptyObject(state.file.data),
		isEmptyFile: (state) => !!state.file.data && isEmptyObject(state.file.data!),
		isErrorFile: (state) => !!state.file.errors?.length,

		isFiles: (state) => !!state.files?.data?.length,
		isEmptyFiles: (state) => state.files.data?.length === 0,
		isErrorFiles: (state) => !!state.files.errors?.length,

		isFilesByPath: (state) => !!state.filesByPath?.data?.length,
		isEmptyFilesByPath: (state) => state.filesByPath.data?.length === 0,
		isErrorFilesByPath: (state) => !!state.filesByPath.errors?.length,

		isFilesByMiddlePath: (state) => !!state.filesByMiddlePath?.data?.length,
		isEmptyFilesByMiddlePath: (state) => state.filesByMiddlePath.data?.length === 0,
		isErrorFilesByMiddlePath: (state) => !!state.filesByMiddlePath.errors?.length,

		getFile: (state) => state.file.data || {},
		getFileErrors: (state) => state.file.errors || {},

		getFiles: (state) => state.files.data || [],
		getFilesErrors: (state) => state.files.errors || [],

		getFilesByPath: (state) => state.filesByPath.data || [],
		getFilesByPathErrors: (state) => state.filesByPath.errors || [],

		getFilesByMiddlePath: (state) => state.filesByMiddlePath.data || [],
		getFilesByMiddlePathErrors: (state) => state.filesByMiddlePath.errors || []
	}
});