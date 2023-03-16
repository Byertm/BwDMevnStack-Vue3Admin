import { ICategory } from '@models/category';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a ara bir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (apiUrl: string) => {
	return (...args: any) => {
		// let apiUrl: string = 'api/category';
		if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
		return apiUrl;
	};
};

const apiMore: string = 'api/category';

const getAll = async () => {
	return useFetch.get(getApiUrl(apiMore)());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(apiMore)(id));
};

const newCategory = async (category: Partial<ICategory>) => {
	const { id, updateUserId, createUserId, createdAt, updatedAt, slug, ...data } = category;

	return useFetch.post(getApiUrl(apiMore)(), { data: data });
};

const updateCategory = async (category: Partial<ICategory>) => {
	const { id, createUserId, createdAt, updatedAt, slug, ...data } = category;

	return useFetch.patch(getApiUrl(apiMore)(category.id), { data: data });
};

const deleteCategory = async (id: string) => {
	return useFetch.delete(getApiUrl(apiMore)(id));
};

export { getAll, getById, newCategory, updateCategory, deleteCategory };
export default { getAll, getById, newCategory, updateCategory, deleteCategory };