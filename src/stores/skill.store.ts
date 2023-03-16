import { defineStore } from 'pinia';
import service from '@services/skill.service';
import { isEmptyObject } from '@utils/index';
import { ISkill } from '@models/skill';

interface SkillState {
	skill: { data: ISkill | undefined | null; loading: boolean; errors: any[] };
	skills: { data: ISkill[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	skill: { data: null, loading: false, errors: [] },
	skills: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as SkillState;

export const useSkillStore = defineStore({
	id: 'skills',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.skills.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.skills.data = data))
				.catch((error) => {
					this.skills.data = [];
					this.skills.errors.push(error);
				})
				.finally(() => (this.skills.loading = false));
		},
		async getById(id: string) {
			this.skill.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.skill.data = data))
				.catch((error) => {
					this.skill.data = null;
					this.skill.errors.push(error);
				})
				.finally(() => {
					this.skill.loading = false;
					this.getAll();
				});
		},
		async newSkill(skill: Partial<ISkill>): Promise<boolean> {
			this.skill.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newSkill(skill)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.skill.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.skill.data = null;
					this.skill.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.skill.loading = false));

			return returnVal;
		},
		async updateSkill(skill: Partial<ISkill>) {
			this.skill.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateSkill(skill)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.skill.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.skill.data = null;
					this.skill.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.skill.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.skill.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteSkill(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.skill.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.skill.loading = false));

			return returnVal;
		}
	},
	getters: {
		isSkill: (state) => !!state.skill.data && !isEmptyObject(state.skill.data),
		isSkills: (state) => !!state.skills?.data?.length,
		isEmptySkill: (state) => !!state.skill.data && isEmptyObject(state.skill.data!),
		isEmptySkills: (state) => state.skills.data?.length === 0,
		isErrorSkill: (state) => !!state.skill.errors?.length,
		isErrorSkills: (state) => !!state.skills.errors?.length,

		isEditingSkill: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewSkill: (state) => !state.newOrEditId,

		getSkill: (state) => state.skill.data || {},
		getSkills: (state) => state.skills.data || [],
		getSkillErrors: (state) => state.skill.errors || {},
		getSkillsErrors: (state) => state.skills.errors || []
	}
});