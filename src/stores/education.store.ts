import { defineStore } from 'pinia';
import service from '@services/education.service';
import { isEmptyObject } from '@utils/index';
import { IEducation } from '@models/education';

interface EducationState {
	education: { data: IEducation | undefined | null; loading: boolean; errors: any[] };
	educations: { data: IEducation[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	education: { data: null, loading: false, errors: [] },
	educations: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as EducationState;

export const useEducationStore = defineStore({
	id: 'educations',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.educations.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.educations.data = data))
				.catch((error) => {
					this.educations.data = [];
					this.educations.errors.push(error);
				})
				.finally(() => (this.educations.loading = false));
		},
		async getById(id: string) {
			this.education.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.education.data = data))
				.catch((error) => {
					this.education.data = null;
					this.education.errors.push(error);
				})
				.finally(() => {
					this.education.loading = false;
				});
		},
		async newEducation(education: Partial<IEducation>): Promise<boolean> {
			this.education.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newEducation(education)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.education.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.education.data = null;
					this.education.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.education.loading = false));

			return returnVal;
		},
		async updateEducation(education: Partial<IEducation>) {
			this.education.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateEducation(education)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.education.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.education.data = null;
					this.education.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.education.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.education.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteEducation(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.education.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.education.loading = false));

			return returnVal;
		}
	},
	getters: {
		isEducation: (state) => !!state.education.data && !isEmptyObject(state.education.data),
		isEducations: (state) => !!state.educations?.data?.length,
		isEmptyEducation: (state) => !!state.education.data && isEmptyObject(state.education.data!),
		isEmptyEducations: (state) => state.educations.data?.length === 0,
		isErrorEducation: (state) => !!state.education.errors?.length,
		isErrorEducations: (state) => !!state.educations.errors?.length,

		isEditingEducation: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewEducation: (state) => !state.newOrEditId,

		getEducation: (state) => state.education.data || {},
		getEducations: (state) => state.educations.data || [],
		getEducationErrors: (state) => state.education.errors || {},
		getEducationsErrors: (state) => state.educations.errors || []
	}
});