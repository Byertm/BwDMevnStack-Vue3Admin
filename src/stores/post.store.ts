import { defineStore } from 'pinia';
import service from '@services/post.service';
import { isEmptyObject } from '@utils/index';
import { IPost, IPostRequest } from '@models/post';

export type GenericTypeWithPagination<T> = {
	data: { data: T[]; hasNext: boolean; hasPrev: boolean; pageNumber: number; size: number; totalCount: number; totalPages: number } | null;
	loading: boolean;
	errors: any[];
};

interface PostState {
	post: { data: IPost | undefined | null; loading: boolean; errors: any[] };
	posts: { data: IPost[] | null; loading: boolean; errors: any[] };
	mainPosts: { data: IPost[] | null; loading: boolean; errors: any[] };
	postsAndPagination: GenericTypeWithPagination<IPost>;
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	post: { data: null, loading: false, errors: [] },
	posts: { data: [], loading: false, errors: [] },
	mainPosts: { data: [], loading: false, errors: [] },
	postsAndPagination: { data: { data: [], hasNext: false, hasPrev: false, pageNumber: 1, size: 5, totalCount: 0, totalPages: 0 }, loading: false, errors: [] },
	newOrEditId: null
} as PostState;

export const usePostStore = defineStore({
	id: 'posts',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.posts.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.posts.data = data))
				.catch((error) => {
					this.posts.data = [];
					this.posts.errors.push(error);
				})
				.finally(() => (this.posts.loading = false));
		},
		async getAllWithPagination(params: any) {
			this.postsAndPagination.loading = true;
			this.postsAndPagination.data = null;

			await service
				.getAllWithPagination(params)
				.then(async (data) => await data.data)
				.then((data) => (this.postsAndPagination.data = data))
				.catch((error) => {
					this.postsAndPagination.data = null;
					this.postsAndPagination.errors.push(error);
				})
				.finally(() => (this.postsAndPagination.loading = false));
		},
		async getAllTopPosts() {
			this.mainPosts.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.mainPosts.data = data.filter((post: IPost) => post.createUserId === null)))
				.catch((error) => {
					this.mainPosts.data = [];
					this.mainPosts.errors.push(error);
				})
				.finally(() => (this.mainPosts.loading = false));
		},
		async getById(id: string) {
			this.post.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.post.data = data))
				.catch((error) => {
					this.post.data = null;
					this.post.errors.push(error);
				})
				.finally(() => (this.post.loading = false));
		},
		async getBySlug(slug: string) {
			this.post.loading = true;

			await service
				.getBySlug(slug)
				.then(async (data) => await data.data)
				.then((data) => (this.post.data = data))
				.catch((error) => {
					this.post.data = null;
					this.post.errors.push(error);
				})
				.finally(() => (this.post.loading = false));
		},
		async newPost(post: Partial<IPostRequest>): Promise<boolean> {
			this.post.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newPost(post)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.post.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.post.data = null;
					this.post.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.post.loading = false));

			return returnVal;
		},
		async updatePost(post: Partial<IPostRequest>) {
			this.post.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updatePost(post)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.post.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.post.data = null;
					this.post.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.post.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.post.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deletePost(id)
				.then(async (data) => await data.data)
				.then(() => {
					returnVal = Promise.resolve(true);
					this.getAll();
				})
				.catch((error) => {
					this.post.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.post.loading = false));

			return returnVal;
		}
	},
	getters: {
		isPost: (state) => !!state.post.data && !isEmptyObject(state.post.data),
		isPosts: (state) => !!state.posts?.data?.length,
		isMainPosts: (state) => !!state.posts?.data?.length,
		isPostsAndPagination: (state) => !!state.postsAndPagination?.data?.data?.length,

		isEmptyPost: (state) => !!state.post.data && isEmptyObject(state.post.data!),
		isEmptyPosts: (state) => state.posts.data?.length === 0,
		isMainEmptyPosts: (state) => state.posts.data?.length === 0,
		isEmptyPostsAndPagination: (state) => state.postsAndPagination.data?.data?.length === 0,

		isErrorPost: (state) => !!state.post.errors?.length,
		isErrorPosts: (state) => !!state.posts.errors?.length,
		isMainErrorPosts: (state) => !!state.posts.errors?.length,
		isErrorPostsAndPagination: (state) => !!state.postsAndPagination.errors?.length,

		isEditingPost: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewPost: (state) => !state.newOrEditId,

		getPost: (state) => state.post.data,
		getPosts: (state) => state.posts.data,
		getMainPosts: (state) => state.posts.data,
		getPostsAndPagination: (state) => state.postsAndPagination.data,
		getPostsAndPaginationData: (state) => state.postsAndPagination?.data?.data,

		getPostErrors: (state) => state.post.errors,
		getPostsErrors: (state) => state.posts.errors,
		getMainPostsErrors: (state) => state.posts.errors,
		getPostsAndPaginationErrors: (state) => state.postsAndPagination.errors
	}
});