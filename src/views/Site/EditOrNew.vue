<template>
	<div v-if="isErrorSite">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptySite" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Site ID" name="key" help="Alan anahtarı giriniz" :aria-readonly="true" :disabled="true" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="cis" category-name="site" label="Site Logo Image Url" name="logo.imageUrl" help="Logo görseli seçiniz" validation="" data-validation-visibility="live" />
		<FormKit type="text" label="Site Logo Text" name="logo.text" help="Logo Text giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<!-- <FormKit type="select" label="Site Type" :options="siteTypes" name="type" help="Üst kategori seçebilirsiniz" validation="" data-validation-visibility="live" /> -->
		<FormKit type="checkbox" label="Site Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	// import { FormKitOptionsList } from "@formkit/inputs";
	import { useSiteStore } from "@/stores";
	import { ISite } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	// ESiteType
	// TSiteType

	// const siteTypes: Ref<FormKitOptionsList> = ref([]);

	const siteStore = useSiteStore();

	const formData: Ref<Partial<ISite>> = ref({});

	const { site, getSite, isSite, isEditingSite, isErrorSite, isEmptySite } = storeToRefs(siteStore);
	const { loading, errors } = toRefs(site.value);

	const setInitialData = () => {
		formData.value = {};
	};

	const setSite = () => {
		if (isEditingSite.value && isSite.value) formData.value = { id: getSite.value?.id, logo: getSite.value?.logo, owner: getSite.value?.owner };
		else setInitialData();
	};

	// siteTypes.value = [{ label: "Üst Kategori", value: null, attrs: { disabled: true } }, ...Object.entries(SiteTypes).map(([key, value]) => ({ value: value, label: key, attrs: { disabled: false } }))];

	watch([() => getSite.value?.id, () => isEditingSite.value], () => setSite());

	const editSite = (editedSite: Partial<ISite>) => {
		if (isSite.value && getSite.value)
			return siteStore
				.updateSite({ ...getSite.value, id: editedSite.id, logo: editedSite.logo, owner: editedSite.owner })
				.then(() => {
					router.push("/site");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni site eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newSite = (site: Partial<ISite>) => {
		return siteStore
			.newSite(site)
			.then(() => {
				router.push("/site");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { id, logo, owner } = fields;

		if (isEditingSite.value) editSite({ id, logo, owner });
		else newSite({ id, logo, owner });
	};
</script>

<style scoped></style>