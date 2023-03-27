// import $bus from '@plugins/events';
import { formatDate } from '@plugins/formatDate';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$formatDate: typeof formatDate;
		// $filters: any;
		// $version: string;
		// $bus: typeof $bus;
	}
}

export {};