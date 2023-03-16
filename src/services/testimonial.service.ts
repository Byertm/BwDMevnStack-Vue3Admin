import { ITestimonial } from '@models/testimonial';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/testimonial';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newTestimonial = async (testimonial: Partial<ITestimonial>) => {
	const { id, ...data } = testimonial;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateTestimonial = async (testimonial: Partial<ITestimonial>) => {
	const { id, ...data } = testimonial;
	return useFetch.patch(getApiUrl(testimonial.id), { data: data });
};

const deleteTestimonial = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, newTestimonial, updateTestimonial, deleteTestimonial };
export default { getAll, getById, newTestimonial, updateTestimonial, deleteTestimonial };