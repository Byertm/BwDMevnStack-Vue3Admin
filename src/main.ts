import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { plugin as formKitPlugin, defaultConfig as defaultFormKitConfig, createInput as createInputFormKit } from '@formkit/vue';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { QuillEditor } from '@vueup/vue-quill';
import Vue3EasyDataTable from 'vue3-easy-data-table';

import CustomImageSelector from '@components/shared/FormKit/CustomImageSelector.vue';
import OneTimePassword from '@components/shared/FormKit/OneTimePassword.vue';
import QuillTextarea from '@components/shared/FormKit/QuillTextarea.vue';
import WangEditor from '@components/shared/FormKit/WangEditor.vue';
import 'vue3-easy-data-table/dist/style.css';

import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'uikit/dist/css/uikit.min.css';
import '@formkit/themes/genesis';

// loads the Icon plugin
UIkit.use(Icons);

// Styles
// import 'bootstrap/dist/css/bootstrap.css';
// import '@/assets/scss/date-range.scss';
import '@/style.scss';

import App from '@/App.vue';
import router from '@/router';

// Layouts
import Default from '@/layouts/Default.vue';
import { FontAwesomeIcon } from '@/plugins/fontAwesome';
import { formatDate } from '@plugins/formatDate';

import { useAuthStore, useUserStore } from '@stores/index';

async function startApp() {
	const adminApp = createApp(App);
	const pinia = createPinia();

	adminApp.config.globalProperties.$uikit = UIkit;
	adminApp.config.globalProperties.$formatDate = formatDate;
	// adminApp.config.globalProperties.productionTip = false;
	// adminApp.config.globalProperties.$eventHub = $hub;

	adminApp.provide('formatDate', formatDate);

	adminApp.component('default-layout', Default);
	adminApp.component('font-awesome-icon', FontAwesomeIcon);
	adminApp.component('EasyDataTable', Vue3EasyDataTable);
	adminApp.component('QuillEditor', QuillEditor);
	adminApp.component('WangEditor', WangEditor);

	adminApp.use(router);
	adminApp.use(pinia);
	// adminApp.use(formKitPlugin, defaultFormKitConfig);
	adminApp.use(
		formKitPlugin,
		defaultFormKitConfig({
			inputs: {
				otp: createInputFormKit(OneTimePassword, { props: ['digits'] }),
				cis: createInputFormKit(CustomImageSelector, { props: ['categoryName', 'showSourceSwitcher'] }),
				qt: createInputFormKit(QuillTextarea),
				we: createInputFormKit(WangEditor)
			}
		})
	);

	// attempt to auto refresh token before startup
	try {
		const authStore = useAuthStore();
		await authStore.refreshToken();

		const userStore = useUserStore();
		await userStore.getMeData();
	} catch {
		// catch error to start app on success or failure
	}

	adminApp.mount('#app');
}

startApp();