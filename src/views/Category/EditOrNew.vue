<template>
	<div v-if="isErrorCategory">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyCategory" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<!-- <div v-for="cat in getMainCategories" uk-alert class="uk-alert-info">
		<a class="uk-alert-close" uk-close></a>
		<p>{{ cat.name }}</p>
	</div> -->

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Category Name" name="name" help="Bir kategori adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="cis" category-name="category" label="Category Url" name="url" help="Bir kategori görseli seçiniz" validation="required|length:3" data-validation-visibility="live" />
		<!-- <FormKit type="otp" label="Category Otp" name="otp" digits="4" help="Otp giriniz" validation="required|length:3" data-validation-visibility="live" /> -->
		<FormKit type="select" label="Category Name" :options="parentCategories" name="parentId" help="Üst kategori seçebilirsiniz" validation="" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Category Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import type { Ref } from "vue";
	import { ref, toRefs } from "vue";
	import { watch } from "vue";
	import { FormKitOptionsList } from "@formkit/inputs";
	import { useCategoryStore } from "@/stores";
	import { ICategory } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const categoryStore = useCategoryStore();

	const formData: Ref<Partial<ICategory>> = ref({});
	const parentCategories: Ref<FormKitOptionsList> = ref([]);

	const { category, isCategory, isEditingCategory, isErrorCategory, isEmptyCategory, getMainCategories, isMainCategories } = storeToRefs(categoryStore);
	const { loading, errors } = toRefs(category.value);

	const setMainCategories = () => {
		if (getMainCategories.value)
			parentCategories.value = [
				{ label: "Üst Kategori", value: null, attrs: { disabled: false } },
				...getMainCategories?.value?.map((category) => {
					return { label: category.name, value: category.id, attrs: { disabled: false } };
				})
			];
	};

	setMainCategories();

	const setInitialData = () => {
		formData.value = {};

		setMainCategories();
	};

	watch([() => getMainCategories.value, () => isMainCategories.value], () => setMainCategories());

	watch([() => category.value.data?.id, () => isEditingCategory.value], () => {
		if (isEditingCategory.value && isCategory.value)
			formData.value = {
				name: category.value.data?.name,
				url: category.value.data?.url || "",
				parentId: category.value.data?.parentId || null,
				isActive: category.value.data?.isActive
			};
		else setInitialData();
	});

	categoryStore.getAllTopCategories();

	const editCategory = (editedCategory: Partial<ICategory>) => {
		if (isCategory.value && category.value.data)
			return categoryStore
				.updateCategory({
					...category.value.data,
					name: editedCategory.name,
					url: editedCategory.url || "",
					parentId: editedCategory.parentId || null,
					isActive: editedCategory.isActive
				})
				.then(() => {
					router.push("/category");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni category eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newCategory = (category: Partial<ICategory>) => {
		return categoryStore
			.newCategory(category)
			.then(() => {
				router.push("/category");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { name, url, parentId, isActive } = fields;

		if (isEditingCategory.value) editCategory({ name, url, parentId, isActive });
		else newCategory({ name, url, parentId, isActive });
	};
</script>

<style scoped></style>