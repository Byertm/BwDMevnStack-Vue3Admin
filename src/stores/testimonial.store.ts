import { defineStore } from 'pinia';
import service from '@services/testimonial.service';
import { isEmptyObject } from '@utils/index';
import { ITestimonial } from '@models/testimonial';

interface TestimonialState {
	testimonial: { data: ITestimonial | undefined | null; loading: boolean; errors: any[] };
	testimonials: { data: ITestimonial[] | null; loading: boolean; errors: any[] };
	newOrEditId: number | string | undefined | null;
}

const initialState = {
	testimonial: { data: null, loading: false, errors: [] },
	testimonials: { data: [], loading: false, errors: [] },
	newOrEditId: null
} as TestimonialState;

export const useTestimonialStore = defineStore({
	id: 'testimonials',
	state: () => ({ ...initialState }),
	actions: {
		async updateEditingId(newValue: string | number | undefined | null) {
			this.newOrEditId = newValue;
		},
		async getAll() {
			this.testimonials.loading = true;

			await service
				.getAll()
				.then(async (data) => await data.data)
				.then((data) => (this.testimonials.data = data))
				.catch((error) => {
					this.testimonials.data = [];
					this.testimonials.errors.push(error);
				})
				.finally(() => (this.testimonials.loading = false));
		},
		async getById(id: string) {
			this.testimonial.loading = true;
			await this.updateEditingId(id);

			await service
				.getById(id)
				.then(async (data) => await data.data)
				.then((data) => (this.testimonial.data = data))
				.catch((error) => {
					this.testimonial.data = null;
					this.testimonial.errors.push(error);
				})
				.finally(() => (this.testimonial.loading = false));
		},
		async newTestimonial(testimonial: Partial<ITestimonial>): Promise<boolean> {
			this.testimonial.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.newTestimonial(testimonial)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.testimonial.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.testimonial.data = null;
					this.testimonial.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.testimonial.loading = false));

			return returnVal;
		},
		async updateTestimonial(testimonial: Partial<ITestimonial>) {
			this.testimonial.loading = true;
			await this.updateEditingId(null);

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.updateTestimonial(testimonial)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					this.testimonial.data = data;
					this.getAll();
				})
				.catch((error) => {
					this.testimonial.data = null;
					this.testimonial.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.testimonial.loading = false));

			return returnVal;
		},
		async delete(id: string) {
			this.testimonial.loading = true;

			let returnVal: Promise<boolean> = Promise.resolve(false);

			await service
				.deleteTestimonial(id)
				.then(async (data) => await data.data)
				.then((data) => {
					returnVal = Promise.resolve(true);
					// this.datas.push(data);
					this.getAll();
				})
				.catch((error) => {
					this.testimonial.errors.push(error);
					returnVal = Promise.reject(false);
				})
				.finally(() => (this.testimonial.loading = false));

			return returnVal;
		}
	},
	getters: {
		isTestimonial: (state) => !!state.testimonial.data && !isEmptyObject(state.testimonial.data),
		isTestimonials: (state) => !!state.testimonials?.data?.length,
		isEmptyTestimonial: (state) => !!state.testimonial.data && isEmptyObject(state.testimonial.data!),
		isEmptyTestimonials: (state) => state.testimonials.data?.length === 0,
		isErrorTestimonial: (state) => !!state.testimonial.errors?.length,
		isErrorTestimonials: (state) => !!state.testimonials.errors?.length,

		isEditingTestimonial: (state) => !!state.newOrEditId && (typeof state.newOrEditId === 'string' || (typeof state.newOrEditId === 'number' && state.newOrEditId > -1)),
		isNewTestimonial: (state) => !state.newOrEditId,

		getTestimonial: (state) => state.testimonial.data,
		getTestimonials: (state) => state.testimonials.data,
		getTestimonialErrors: (state) => state.testimonial.errors,
		getTestimonialsErrors: (state) => state.testimonials.errors
	}
});