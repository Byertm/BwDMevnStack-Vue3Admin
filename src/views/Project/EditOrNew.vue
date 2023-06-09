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

	<template v-if="!isEditingProject || (isProject && isEditingProject)"></template>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Project Name" name="name" help="Proje adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="we" label="Project Description" name="description" help="Proje açıklaması giriniz" validation="required|length:3,5000" data-validation-visibility="live" />
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

	const { project, getProject, isProject, isEditingProject, isErrorProject, isEmptyProject } = storeToRefs(projectStore);
	const { getCategories, isCategories } = storeToRefs(categoryStore);
	const { loading, errors } = toRefs(project.value);

	if (!isCategories.value) categoryStore.getAll();

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

	const setProject = () => {
		if (isEditingProject.value && isProject.value)
			formData.value = {
				name: getProject.value?.name,
				categoryId: getProject.value?.categoryId,
				demoPreviewUrl: getProject.value?.demoPreviewUrl,
				deployUrl: getProject.value?.deployUrl,
				description: getProject.value?.description,
				startDate: formatDate.formatFK(getProject.value?.startDate),
				finishDate: formatDate.formatFK(getProject.value?.finishDate),
				isActive: getProject.value?.isActive,
				imageUrl: getProject.value?.imageUrl
			};
		else setInitialData();
	};

	watch([() => getCategories.value, () => isCategories.value], () => setProjectCategories());

	watch([() => getProject.value?.id, () => isEditingProject.value], () => setProject());

	const editProject = (editedProject: Partial<IProject>) => {
		if (isProject.value && getProject.value)
			return projectStore
				.updateProject({
					...getProject.value,
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