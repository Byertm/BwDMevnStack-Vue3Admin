import { IFileAndAttrs, TFileType, TSelectedElement } from '@models/file';
import { useFetch } from '@utils/index';
import { BASE_API_URL } from '@utils/constants';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/file';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getImageUrlFromFile = (middlePath: string, selectedFile: TSelectedElement) => {
	return `${BASE_API_URL}uploads/manager/${middlePath}${selectedFile.name}.${selectedFile.suffix}`;
};

const getApiImageByImageUrl = (imageUrl?: string | null, isExternal?: boolean) => {
	return `${!isExternal ? BASE_API_URL : ''}${imageUrl ? imageUrl : ''}`;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getContent = (ePath: string, path: string = '') => {
	return useFetch.post(getApiUrl(ePath), { data: { path } });
};

const getAllByPath = async (path: string = '') => {
	return getContent('getContent', path);
};

const getAllByMiddlePath = async (path: string = '') => {
	return getContent('getCategoryContent', path);
};

const getFileByName = async (name: string, path: string = '') => {
	return useFetch.get(getApiUrl(name), { data: { path } });
};

const uploadFile = (fileAndAttrs: Partial<IFileAndAttrs>) => {
	const { path, attrs: { name } = { name: '' }, base64Image: { imgBase64 } = { imgBase64: '' } } = fileAndAttrs;
	return useFetch.post(getApiUrl('uploadFile'), { data: { path, name, imgBase64 } });
};

const uploadImage = (fileAndAttrs: Partial<IFileAndAttrs>) => {
	const { path, attrs: { name } = { name: '' }, base64Image: { imgBase64 } = { imgBase64: '' } } = fileAndAttrs;
	return useFetch.post(getApiUrl('uploadImageFile'), { data: { path, name, imgBase64 } });
};

const createFile = (file: string, path: string = '') => {
	return useFetch.post(getApiUrl('createFile'), { data: { path, file } });
};

const createDirectory = (directory: string, path: string = '') => {
	return useFetch.post(getApiUrl('createDirectory'), { data: { path, directory } });
};

const deleteFile = async (path: string) => {
	return useFetch.delete(getApiUrl('remove'), { data: { path, type: 'file' } });
};

const deleteDir = async (path: string) => {
	return useFetch.delete(getApiUrl('remove'), { data: { path, type: 'directory' } });
};

const remove = async (path: string, type: TFileType) => {
	return type === 'file' ? deleteFile(path) : deleteDir(path);
};

export {
	getAll,
	getAllByPath,
	getFileByName,
	getAllByMiddlePath,
	uploadFile,
	uploadImage,
	getImageUrlFromFile,
	getApiImageByImageUrl,
	getContent,
	createFile,
	createDirectory,
	deleteFile,
	deleteDir,
	remove
};
export default {
	getAll,
	getAllByPath,
	getFileByName,
	getAllByMiddlePath,
	uploadFile,
	uploadImage,
	getContent,
	getImageUrlFromFile,
	getApiImageByImageUrl,
	createFile,
	createDirectory,
	deleteFile,
	deleteDir,
	remove
};