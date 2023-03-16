import { string, object, array, number } from 'yup';

const OKey = object({
	[typeof string]: string() || object() || array() || number()
});

type TKey = typeof OKey;
export interface IBwdElement {
	id?: string;
	name: string;
	type: string;
	label: string;
	value?: string | undefined | null;
	rules?: TKey | any;
	successMessage?: string;
	className?: string;
}

export interface IBwdInput extends IBwdElement {
	placeholder?: string;
}

export interface IBwdOption {
	key: string;
	value: any;
	[x: string]: any;
}

export interface IBwdCheckbox extends IBwdElement {
	options?: Array<IBwdOption>;
}

export interface IBwdRadio extends IBwdElement {
	options?: Array<IBwdOption>;
}

export interface IBwdCheckboxGroup extends IBwdElement {
	items: Array<IBwdCheckbox>;
}

export interface IBwdRadioGroup extends IBwdElement {
	items: Array<IBwdRadio>;
}

export interface IBwdTextarea extends IBwdElement {
	placeholder?: string | null | undefined;
	rows?: number | string | null | undefined;
	cols?: number | string | null | undefined;
}

export type IBwdAllElements = IBwdInput | IBwdTextarea | IBwdCheckbox | IBwdRadio | IBwdCheckboxGroup | IBwdRadioGroup;

export interface IFormSchema<T extends IBwdElement = IBwdAllElements> {
	fields?: T[];
}

const schema: IFormSchema = { fields: [] };