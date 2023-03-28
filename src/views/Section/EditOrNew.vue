<template>
	<div v-if="isErrorSection">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptySection" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Section Key" name="key" help="Alan anahtarı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Section Name" name="name" help="Alan adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="select" label="Section Type" :options="sectionTypes" name="type" help="Üst kategori seçebilirsiniz" validation="" data-validation-visibility="live" />
		<!-- <FormKit type="text" label="Sub Sections" name="subSections" help="Alt alanları giriniz" validation="" data-validation-visibility="live" /> -->
		<FormKit type="checkbox" label="Section Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { FormKitOptionsList } from "@formkit/inputs";
	import { ESectionType } from "@models/section";
	import { useSectionStore } from "@/stores";
	import { ISection } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	// ESectionType
	// TSectionType

	const SectionTypes: typeof ESectionType = ESectionType;
	const sectionTypes: Ref<FormKitOptionsList> = ref([]);

	const sectionStore = useSectionStore();

	const formData: Ref<Partial<ISection>> = ref({});

	const { getSection, section, isSection, isEditingSection, isErrorSection, isEmptySection } = storeToRefs(sectionStore);
	const { loading, errors } = toRefs(section.value);

	const setInitialData = () => {
		formData.value = {};
	};

	const setSection = () => {
		if (isSection.value && isEditingSection.value)
			// formData.value = { key: getSection.value?.key, name: getSection.value?.name, type: getSection.value?.type, subSections: getSection.value?.subSections, isActive: getSection.value?.isActive };
			formData.value = { ...getSection.value };
		else setInitialData();
	};

	sectionTypes.value = [{ label: "Üst Kategori", value: null, attrs: { disabled: true } }, ...Object.entries(SectionTypes).map(([key, value]) => ({ value: value, label: key, attrs: { disabled: false } }))];

	watch([() => getSection.value, () => isEditingSection.value], () => setSection());

	const editSection = (editedSection: Partial<ISection>) => {
		if (isSection.value && getSection.value)
			return sectionStore
				.updateSection({ ...getSection.value, key: editedSection.key, name: editedSection.name, type: editedSection.type, subSections: editedSection.subSections, isActive: editedSection.isActive })
				.then(() => {
					router.push("/section");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni section eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newSection = (section: Partial<ISection>) => {
		return sectionStore
			.newSection(section)
			.then(() => {
				router.push("/section");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { key, name, type, subSections, isActive } = fields;

		if (isEditingSection.value) editSection({ key, name, type, subSections, isActive });
		else newSection({ key, name, type, subSections, isActive });
	};
</script>

<style scoped></style>