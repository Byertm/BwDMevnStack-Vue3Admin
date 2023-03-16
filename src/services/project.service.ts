import { IProject } from '@models/project';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/project';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newProject = async (project: Partial<IProject>) => {
	const { id, createdAt, updatedAt, ...data } = project;

	return useFetch.post(getApiUrl(), { data: data });
};

const updateProject = async (project: Partial<IProject>) => {
	const { id, createdAt, updatedAt, ...data } = project;

	return useFetch.patch(getApiUrl(project.id), { data: data });
};

const deleteProject = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, newProject, updateProject, deleteProject };
export default { getAll, getById, newProject, updateProject, deleteProject };