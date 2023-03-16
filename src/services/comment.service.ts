import { IComment } from '@models/comment';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/comment';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const getAllByPostId = async (postId: string) => {
	return useFetch.get(getApiUrl(`post/${postId}`));
};

const newComment = async (comment: Partial<IComment>) => {
	const { id, author, updateUserId, createUserId, createdAt, ...data } = comment;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateComment = async (comment: Partial<IComment>) => {
	const { id, author, createUserId, createdAt, updatedAt, ...data } = comment;
	return useFetch.patch(getApiUrl(comment.id), { data: data });
};

const deleteComment = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getAllByPostId, getById, newComment, updateComment, deleteComment };
export default { getAll, getAllByPostId, getById, newComment, updateComment, deleteComment };