import { defineStore } from 'pinia';
import service from '@services/role.service';
import { isEmptyObject } from '@utils/index';
import { IRole } from '@models/role';

interface RoleState {
	role: { data: IRole | undefined | null; loading: boolean; errors: any[] };
	roles: { data: IRole[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	role: { data: null, loading: false, errors: [] },
	roles: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as RoleState;

export const useRoleStore = defineStore({
	id: 'roles',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.roles.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.roles.data = data))
				.catch((error) => {
					this.roles.data = [];
					this.roles.errors.push(error);
				})
				.finally(() => (this.roles.loading = false));
		},
		async getById(id: string) {
			this.role.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.role.data = data))
				.catch((error) => {
					this.role.data = null;
					this.role.errors.push(error);
				})
				.finally(() => (this.role.loading = false));
		},
		async newRole(role: Partial<IRole>): Promise<boolean> {
			this.role.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newRole(role)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.role.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.role.data = null;
					this.role.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.role.loading = false));

			return returnVal;
		},
		async updateRole(role: Partial<IRole>) {
			this.role.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateRole(role)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.role.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.role.data = null;
					this.role.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.role.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.role.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteRole(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.role.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.role.loading = false));

			return returnVal;
		}
	},
	getters: {
		isRole: (state) => !!state.role.data && !isEmptyObject(state.role.data),
		isRoles: (state) => !!state.roles?.data?.length,
		isEmptyRole: (state) => !!state.role.data && isEmptyObject(state.role.data!),
		isEmptyRoles: (state) => state.roles.data?.length === 0,
		isErrorRole: (state) => !!state.role.errors?.length,
		isErrorRoles: (state) => !!state.roles.errors?.length,

		isEditingRole: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewRole: (state) => !state.newOrEditId,

		getRole: (state) => state.role.data,
		getRoles: (state) => state.roles.data,
		getRoleErrors: (state) => state.role.errors,
		getRolesErrors: (state) => state.roles.errors
	}
});