import { IPostRequest } from '@models/post';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (apiUrl: string) => {
	return (...args: any) => {
		// let apiUrl: string = 'api/post';
		if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
		return apiUrl;
	};
};

const apiMore: string = 'api/post';

const getAll = async () => {
	return useFetch.get(getApiUrl(apiMore)());
};

const getAllWithPagination = async (params: any) => {
	return useFetch.get(getApiUrl(apiMore)('pagination'), { params });
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(apiMore)(id));
};

const getBySlug = async (slug: string) => {
	return useFetch.get(getApiUrl(apiMore)(slug));
};

const newPost = async (post: Partial<IPostRequest>) => {
	const { id, updateUserId, createUserId, createdAt, updatedAt, slug, ...data } = post;
	return useFetch.post(getApiUrl(apiMore)(), { data: data });
};

const updatePost = async (post: Partial<IPostRequest>) => {
	const { id, createUserId, createdAt, updatedAt, slug, ...data } = post;
	return useFetch.patch(getApiUrl(apiMore)(post.id), { data: data });
};

const deletePost = async (id: string) => {
	return useFetch.delete(getApiUrl(apiMore)(id));
};

export { getAll, getAllWithPagination, getById, getBySlug, newPost, updatePost, deletePost };
export default { getAll, getAllWithPagination, getById, getBySlug, newPost, updatePost, deletePost };