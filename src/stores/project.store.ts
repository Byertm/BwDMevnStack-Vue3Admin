import { defineStore } from 'pinia';
import service from '@services/project.service';
import { isEmptyObject } from '@utils/index';
import { IProject } from '@models/project';

interface ProjectState {
	project: { data: IProject | undefined | null; loading: boolean; errors: any[] };
	projects: { data: IProject[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	project: { data: null, loading: false, errors: [] },
	projects: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as ProjectState;

export const useProjectStore = defineStore({
	id: 'projects',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.projects.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.projects.data = data))
				.catch((error) => {
					this.projects.data = [];
					this.projects.errors.push(error);
				})
				.finally(() => (this.projects.loading = false));
		},
		async getById(id: string) {
			this.project.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.project.data = data))
				.catch((error) => {
					this.project.data = null;
					this.project.errors.push(error);
				})
				.finally(() => {
					this.project.loading = false;
					this.getAll();
				});
		},
		async newProject(project: Partial<IProject>): Promise<boolean> {
			this.project.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newProject(project)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.project.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.project.data = null;
					this.project.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.project.loading = false));

			return returnVal;
		},
		async updateProject(project: Partial<IProject>) {
			this.project.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateProject(project)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.project.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.project.data = null;
					this.project.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.project.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.project.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteProject(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.project.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.project.loading = false));

			return returnVal;
		}
	},
	getters: {
		isProject: (state) => !!state.project.data && !isEmptyObject(state.project.data),
		isProjects: (state) => !!state.projects?.data?.length,
		isEmptyProject: (state) => !!state.project.data && isEmptyObject(state.project.data!),
		isEmptyProjects: (state) => state.projects.data?.length === 0,
		isErrorProject: (state) => !!state.project.errors?.length,
		isErrorProjects: (state) => !!state.projects.errors?.length,

		isEditingProject: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewProject: (state) => !state.newOrEditId,

		getProject: (state) => state.project.data || {},
		getProjects: (state) => state.projects.data || [],
		getProjectErrors: (state) => state.project.errors || {},
		getProjectsErrors: (state) => state.projects.errors || []
	}
});