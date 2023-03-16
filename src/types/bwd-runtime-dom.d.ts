export interface ButtonHTMLAttributes extends HTMLAttributes {
	autofocus?: Booleanish;
	disabled?: Booleanish;
	form?: string;
	formaction?: string;
	formenctype?: string;
	formmethod?: string;
	formnovalidate?: Booleanish;
	formtarget?: string;
	name?: string;
	type?: 'submit' | 'reset' | 'button';
	value?: string | string[] | number;
}

export interface FieldsetHTMLAttributes extends HTMLAttributes {
	disabled?: Booleanish;
	form?: string;
	name?: string;
}

export interface FormHTMLAttributes extends HTMLAttributes {
	acceptcharset?: string;
	action?: string;
	autocomplete?: string;
	enctype?: string;
	method?: string;
	name?: string;
	novalidate?: Booleanish;
	target?: string;
}

export interface InputHTMLAttributes extends HTMLAttributes {
	accept?: string;
	alt?: string;
	autocomplete?: string;
	autofocus?: Booleanish;
	capture?: boolean | 'user' | 'environment'; // https://www.w3.org/tr/html-media-capture/#the-capture-attribute
	checked?: Booleanish | any[] | Set<any>; // for IDE v-model multi-checkbox support
	crossorigin?: string;
	disabled?: Booleanish;
	form?: string;
	formaction?: string;
	formenctype?: string;
	formmethod?: string;
	formnovalidate?: Booleanish;
	formtarget?: string;
	height?: Numberish;
	indeterminate?: boolean;
	list?: string;
	max?: Numberish;
	maxlength?: Numberish;
	min?: Numberish;
	minlength?: Numberish;
	multiple?: Booleanish;
	name?: string;
	pattern?: string;
	placeholder?: string;
	readonly?: Booleanish;
	required?: Booleanish;
	size?: Numberish;
	src?: string;
	step?: Numberish;
	type?: string;
	value?: any; // we support :value to be bound to anything w/ v-model
	width?: Numberish;
}

export interface LabelHTMLAttributes extends HTMLAttributes {
	for?: string;
	form?: string;
}

export interface OptgroupHTMLAttributes extends HTMLAttributes {
	disabled?: Booleanish;
	label?: string;
}

export interface OptionHTMLAttributes extends HTMLAttributes {
	disabled?: Booleanish;
	label?: string;
	selected?: Booleanish;
	value?: any; // we support :value to be bound to anything w/ v-model
}

export interface OutputHTMLAttributes extends HTMLAttributes {
	for?: string;
	form?: string;
	name?: string;
}

export interface ParamHTMLAttributes extends HTMLAttributes {
	name?: string;
	value?: string | string[] | number;
}

export interface ProgressHTMLAttributes extends HTMLAttributes {
	max?: Numberish;
	value?: string | string[] | number;
}

export interface SelectHTMLAttributes extends HTMLAttributes {
	autocomplete?: string;
	autofocus?: Booleanish;
	disabled?: Booleanish;
	form?: string;
	multiple?: Booleanish;
	name?: string;
	required?: Booleanish;
	size?: Numberish;
	value?: any; // we support :value to be bound to anything w/ v-model
}

export interface TextareaHTMLAttributes extends HTMLAttributes {
	autocomplete?: string;
	autofocus?: Booleanish;
	cols?: Numberish;
	dirname?: string;
	disabled?: Booleanish;
	form?: string;
	maxlength?: Numberish;
	minlength?: Numberish;
	name?: string;
	placeholder?: string;
	readonly?: boolean;
	required?: Booleanish;
	rows?: Numberish;
	value?: string | string[] | number;
	wrap?: string;
}

export interface TimeHTMLAttributes extends HTMLAttributes {
	datetime?: string;
}