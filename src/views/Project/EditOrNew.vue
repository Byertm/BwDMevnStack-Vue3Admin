<template>
	<div v-if="isErrorProject">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyProject" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Project Name" name="name" help="Proje adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="qt" label="Project Description" name="description" help="Proje açıklaması giriniz" validation="required|length:3,500" data-validation-visibility="live" />
		<FormKit type="text" label="Project Demo Preview Url" name="demoPreviewUrl" help="Proje demo gösterim adresi giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Project Deploy Url" name="deployUrl" help="Proje çıkış adresi giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="cis" category-name="project" label="Category Url" name="imageUrl" help="Bir kategori görseli seçiniz" validation="required|length:3,500" data-validation-visibility="live" />
		<FormKit type="select" label="Project Kategorisi" :options="categoryList" name="categoryId" help="Proje kategorisi seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="date" label="Start Date" name="startDate" help="Bir başlangıç tarihi seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="date" label="Finish Date" name="finishDate" help="Bir bitiş tarihi seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Project Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import type { Ref } from "vue";
	import { ref, toRefs } from "vue";
	import { inject, watch } from "vue";
	import { useProjectStore, useCategoryStore } from "@/stores";
	import { FormKitOptionsList } from "@formkit/inputs";
	import { IProject } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const formatDate: any = inject("formatDate");

	// const closeEmitName = "close";
	// const emits = defineEmits<{ (e: typeof closeEmitName): void }>();

	const projectStore = useProjectStore();
	const categoryStore = useCategoryStore();

	const formData: Ref<Partial<IProject>> = ref({});
	const categoryList: Ref<FormKitOptionsList> = ref([]);

	const { project, isProject, isEditingProject, isErrorProject, isEmptyProject } = storeToRefs(projectStore);
	const { getCategories, isCategories } = storeToRefs(categoryStore);
	const { loading, errors } = toRefs(project.value);

	categoryStore.getAll();

	const setProjectCategories = () => {
		if (getCategories.value)
			categoryList.value = [
				// { label: "Üst Kategori", value: null, attrs: { disabled: false } },
				...getCategories?.value?.map((category) => {
					return { label: category.name, value: category.id, attrs: { disabled: false } };
				})
			];
	};

	const setInitialData = () => {
		formData.value = {};
		// setProjectCategories();
	};

	watch([() => getCategories.value, () => isCategories.value], () => setProjectCategories());

	watch([() => project.value.data?.id, () => isEditingProject.value], () => {
		if (isEditingProject.value && isProject.value)
			formData.value = {
				name: project.value.data?.name,
				categoryId: project.value.data?.categoryId,
				demoPreviewUrl: project.value.data?.demoPreviewUrl,
				deployUrl: project.value.data?.deployUrl,
				description: project.value.data?.description,
				startDate: formatDate.formatFK(project.value.data?.startDate),
				finishDate: formatDate.formatFK(project.value.data?.finishDate),
				isActive: project.value.data?.isActive,
				imageUrl: project.value.data?.imageUrl
			};
		else setInitialData();
	});

	const editProject = (editedProject: Partial<IProject>) => {
		if (isProject.value && project.value.data)
			return projectStore
				.updateProject({
					...project.value.data,
					name: editedProject.name,
					categoryId: editedProject.categoryId,
					demoPreviewUrl: editedProject.demoPreviewUrl,
					deployUrl: editedProject.deployUrl,
					description: editedProject.description,
					startDate: editedProject.startDate,
					finishDate: editedProject.finishDate,
					isActive: editedProject.isActive,
					imageUrl: editedProject?.imageUrl
				})
				.then(() => {
					router.push("/project");
					toast({ message: `<span uk-icon='icon: check'></span> Proje başarıyla düzenlendi!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newProject = (project: Partial<IProject>) => {
		return projectStore
			.newProject(project)
			.then(() => {
				router.push("/project");
				toast({ message: `<span uk-icon='icon: check'></span> Yeni proje başarıyla eklendi!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { name, categoryId, demoPreviewUrl, deployUrl, description, startDate, finishDate, isActive, imageUrl } = fields;

		if (isEditingProject.value) editProject({ name, categoryId, demoPreviewUrl, deployUrl, description, startDate, finishDate, isActive, imageUrl });
		else newProject({ name, categoryId, demoPreviewUrl, deployUrl, description, startDate, finishDate, isActive, imageUrl });
	};
</script>

<style scoped></style>