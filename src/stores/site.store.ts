import { defineStore } from 'pinia';
import service from '@services/site.service';
import { isEmptyObject } from '@utils/index';
import { InitialSiteData, InitialSiteLogoData, InitialSiteOwnerData, ISite } from '@models/site';

interface SiteState {
	site: { data: ISite | undefined | null; loading: boolean; errors: any[] };
	sites: { data: ISite[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	site: { data: InitialSiteData, loading: false, errors: [] },
	sites: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as SiteState;

export const useSiteStore = defineStore({
	id: 'sites',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async get() {
			this.site.loading = true;

			await service
				.get()
				.then(async (data) => await data.data)
				.then((data) => (this.site.data = data))
				.catch((error) => {
					this.site.data = null;
					this.site.errors.push(error);
				})
				.finally(() => (this.site.loading = false));
		},
		async getAll() {
			this.sites.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.sites.data = data))
				.catch((error) => {
					this.sites.data = [];
					this.sites.errors.push(error);
				})
				.finally(() => (this.sites.loading = false));
		},
		async getById(id: string) {
			this.site.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.site.data = data))
				.catch((error) => {
					this.site.data = null;
					this.site.errors.push(error);
				})
				.finally(() => (this.site.loading = false));
		},
		async newSite(site: Partial<ISite>): Promise<boolean> {
			this.site.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newSite(site)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.site.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.site.data = null;
					this.site.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.site.loading = false));

			return returnVal;
		},
		async updateSite(site: Partial<ISite>) {
			this.site.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateSite(site)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.site.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.site.data = null;
					this.site.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.site.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.site.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteSite(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.site.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.site.loading = false));

			return returnVal;
		}
	},
	getters: {
		isSite: (state) => !!state.site.data && !isEmptyObject(state.site.data),

		isSiteLogo: (state) => (state.site.data?.logo ? state.site.data.logo : false),
		isSiteOwner: (state) => (state.site.data?.owner ? state.site.data.owner : false),
		// isSiteSections: (state) => (state.site.data?.sections && state.site.data?.sections?.length > 0 ? true : false),

		isSites: (state) => !!state.sites?.data?.length,
		isEmptySite: (state) => !!state.site.data && isEmptyObject(state.site.data!),
		isEmptySites: (state) => state.sites.data?.length === 0,
		isErrorSite: (state) => !!state.site.errors?.length,
		isErrorSites: (state) => !!state.sites.errors?.length,

		isEditingSite: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewSite: (state) => !state.newOrEditId,

		getSite: (state) => state.site.data || ({} as ISite),

		getSiteLogo: (state) => (state.site.data?.logo ? state.site.data.logo : InitialSiteLogoData),
		getSiteOwner: (state) => (state.site.data?.owner ? state.site.data.owner : InitialSiteOwnerData),
		// getSiteSections: (state) => (state.site.data?.sections ? state.site.data.sections : InitialSiteSectionData),

		getSites: (state) => state.sites.data || ([] as ISite[]),
		getSiteErrors: (state) => state.site.errors || ({} as ISite),
		getSitesErrors: (state) => state.sites.errors || ([] as ISite[])
	}
});