import { ISkill } from '@models/skill';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/skill';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newSkill = async (skill: Partial<ISkill>) => {
	const { id, createdAt, updatedAt, ...data } = skill;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateSkill = async (skill: Partial<ISkill>) => {
	const { id, createdAt, updatedAt, ...data } = skill;
	return useFetch.patch(getApiUrl(skill.id), { data: data });
};

const deleteSkill = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, newSkill, updateSkill, deleteSkill };
export default { getAll, getById, newSkill, updateSkill, deleteSkill };