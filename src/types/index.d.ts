declare module '@vue/runtime-core' {
	interface ComponentCustomOptions {
		customTest?(n: number): void;
	}

	import UIkit from 'uikit';
	interface ComponentCustomProperties {
		$uikit: typeof UIkit;
		state?: 'stopped' | 'running';
	}

	interface ComponentCustomProps {
		custom?: number;
	}
}

declare module 'vue' {
	import axios from 'axios';
	interface ComponentCustomProperties {
		$http: typeof axios;
		$translate: (key: string) => string;
	}

	import UIkit from 'uikit';
	interface ComponentCustomProperties {
		$uikit: typeof UIkit;
	}
}

type MyAppendTypes = string | number | boolean | Blob | null | undefined;

declare global {
	/** Provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method. It uses the same format a form would use if the encoding type were set to "multipart/form-data". */
	interface FormData {
		append(name: string, value: MyAppendTypes, fileName?: string): void;
	}
}

export {};