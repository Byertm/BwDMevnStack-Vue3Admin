// import $bus from '@plugins/events';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$formatDate: any;
		// $filters: any;
		// $version: string;
		// $bus: typeof $bus;
	}
}

export {};