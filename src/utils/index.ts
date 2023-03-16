export { launchConfetti } from '@utils/confetti';
export { customFetch as useFetch, customFetchCache as useFetchCache } from '@utils/fetch-api';
export { fetchWrapper } from '@utils/fetchApi';
export { toast } from '@utils/toast';

const isEmptyObject = (obj: Object) => Object.keys(obj).length === 0 && obj.constructor === Object;

const convertToSlug = (text: string) => {
	// return text
	// 	.toLowerCase()
	// 	.replace(/ /g, '-')
	// 	.replace(/[^\w-]+/g, '');

	text = text.normalize('NFKD');

	text = text.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLocaleLowerCase();
	// trim spaces at start and end of string
	text = text.replace(/^\s+|\s+$/gm, '');
	// replace space with dash/hyphen
	text = text.replace(/\s+/g, '-');
	return text;
};

const slugifyFormKit = (str: string) => {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, ' ')
		.trim()
		.replace(/\s+/g, '-');
};

const slugify = (text: string) => {
	if (text) {
		const trMap: { [key: string]: string } = { çÇ: 'c', ğĞ: 'g', şŞ: 's', üÜ: 'u', ıİ: 'i', öÖ: 'o' };

		for (let key in trMap) {
			text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
		}

		return text
			.replace(/[^-a-zA-Z0-9\s]+/gi, '') // remove non-alphanumeric chars
			.replace(/\s/gi, '-') // convert spaces to dashes
			.replace(/[-]+/gi, '-') // trim repeated dashes
			.toLowerCase();
	}

	return text;
};

export { isEmptyObject, convertToSlug, slugify, slugifyFormKit as slugifyFK };
export default { isEmptyObject, convertToSlug, slugify, slugifyFK: slugifyFormKit };