import { defineStore } from 'pinia';
import service from '@services/section.service';
import { isEmptyObject } from '@utils/index';
import { ISection, TSectionType } from '@models/section';

interface SectionState {
	section: { data: ISection | undefined | null; loading: boolean; errors: any[] };
	sections: { data: ISection[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	section: { data: null, loading: false, errors: [] },
	sections: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as SectionState;

export const useSectionStore = defineStore({
	id: 'sections',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.sections.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.sections.data = data))
				.catch((error) => {
					this.sections.data = [];
					this.sections.errors.push(error);
				})
				.finally(() => (this.sections.loading = false));
		},
		async getAllByType(type: TSectionType) {
			// ** Note: Buna özel bir state tanımlanmalı
			this.sections.loading = true;

			await service
				.getAllByType(type)
				.then(async (data) => await data.data)
				.then((data) => (this.sections.data = data))
				.catch((error) => {
					this.sections.data = null;
					this.sections.errors.push(error);
				})
				.finally(() => (this.sections.loading = false));
		},
		async getById(id: string) {
			this.section.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.section.data = data))
				.catch((error) => {
					this.section.data = null;
					this.section.errors.push(error);
				})
				.finally(() => (this.section.loading = false));
		},
		async getByKey(key: string) {
			this.section.loading = true;

			await service
				.getByKey(key)
				.then(async (data) => await data.data)
				.then((data) => (this.section.data = data))
				.catch((error) => {
					this.section.data = null;
					this.section.errors.push(error);
				})
				.finally(() => (this.section.loading = false));
		},
		async newSection(section: Partial<ISection>): Promise<boolean> {
			this.section.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newSection(section)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.section.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.section.data = null;
					this.section.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.section.loading = false));

			return returnVal;
		},
		async updateSection(section: Partial<ISection>) {
			this.section.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateSection(section)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.section.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.section.data = null;
					this.section.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.section.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.section.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteSection(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.section.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.section.loading = false));

			return returnVal;
		}
	},
	getters: {
		isSection: (state) => !!state.section.data && !isEmptyObject(state.section.data),
		isSections: (state) => !!state.sections?.data?.length,
		isEmptySection: (state) => !!state.section.data && isEmptyObject(state.section.data!),
		isEmptySections: (state) => state.sections.data?.length === 0,
		isErrorSection: (state) => !!state.section.errors?.length,
		isErrorSections: (state) => !!state.sections.errors?.length,

		isEditingSection: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewSection: (state) => !state.newOrEditId,

		getSection: (state) => state.section.data,
		getSections: (state) => state.sections.data,
		getSectionErrors: (state) => state.section.errors,
		getSectionsErrors: (state) => state.sections.errors
	}
});