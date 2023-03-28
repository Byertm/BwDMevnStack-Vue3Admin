import { defineStore } from 'pinia';
import service from '@services/tag.service';
import { isEmptyObject } from '@utils/index';
import { ITag } from '@models/tag';

interface TagState {
	tag: { data: ITag | undefined | null; loading: boolean; errors: any[] };
	tags: { data: ITag[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	tag: { data: null, loading: false, errors: [] },
	tags: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as TagState;

export const useTagStore = defineStore({
	id: 'tags',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.tags.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.tags.data = data))
				.catch((error) => {
					this.tags.data = [];
					this.tags.errors.push(error);
				})
				.finally(() => (this.tags.loading = false));
		},
		async getById(id: string) {
			this.tag.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.tag.data = data))
				.catch((error) => {
					this.tag.data = null;
					this.tag.errors.push(error);
				})
				.finally(() => (this.tag.loading = false));
		},
		async newTag(tag: Partial<ITag>): Promise<boolean> {
			this.tag.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newTag(tag)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.tag.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.tag.data = null;
					this.tag.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.tag.loading = false));

			return returnVal;
		},
		async updateTag(tag: Partial<ITag>) {
			this.tag.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateTag(tag)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.tag.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.tag.data = null;
					this.tag.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.tag.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.tag.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteTag(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.tag.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.tag.loading = false));

			return returnVal;
		}
	},
	getters: {
		isTag: (state) => !!state.tag.data && !isEmptyObject(state.tag.data),
		isTags: (state) => !!state.tags?.data?.length,
		isEmptyTag: (state) => !!state.tag.data && isEmptyObject(state.tag.data!),
		isEmptyTags: (state) => state.tags.data?.length === 0,
		isErrorTag: (state) => !!state.tag.errors?.length,
		isErrorTags: (state) => !!state.tags.errors?.length,

		isEditingTag: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewTag: (state) => !state.newOrEditId,

		getTag: (state) => state.tag.data,
		getTags: (state) => state.tags.data,
		getTagErrors: (state) => state.tag.errors,
		getTagsErrors: (state) => state.tags.errors
	}
});