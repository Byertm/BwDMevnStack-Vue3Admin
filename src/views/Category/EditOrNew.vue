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
	import { FormKitOptionsList } from "@formkit/inputs";
	import { useCategoryStore } from "@/stores";
	import { ICategory } from "@models/index";
	import toast from "@utils/toast";

	const router = useRouter();
	const categoryStore = useCategoryStore();

	const formData: Ref<Partial<ICategory>> = ref({});
	const parentCategories: Ref<FormKitOptionsList> = ref([]);

	const { category, getCategory, isCategory, isEditingCategory, isErrorCategory, isEmptyCategory, getMainCategories, isMainCategories } = storeToRefs(categoryStore);
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

	const setCategory = () => {
		if (isEditingCategory.value && isCategory.value)
			formData.value = {
				name: getCategory.value?.name,
				url: getCategory.value?.url || "",
				parentId: getCategory.value?.parentId || null,
				isActive: getCategory.value?.isActive
			};
		else setInitialData();
	};

	watch([() => getMainCategories.value, () => isMainCategories.value], () => setMainCategories());

	watch([() => getCategory.value?.id, () => isEditingCategory.value], () => setCategory());

	if (!isMainCategories.value) categoryStore.getAllTopCategories();

	const editCategory = (editedCategory: Partial<ICategory>) => {
		if (isCategory.value && getCategory.value)
			return categoryStore
				.updateCategory({
					...getCategory.value,
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