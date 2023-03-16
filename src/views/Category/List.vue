<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Categories</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalCategory" title="New Category" data-uk-tooltip data-uk-icon="icon: pencil" @click="newCategory" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorCategories">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyCategories" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isCategories" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Category Name</th>
										<th>Category Slug</th>
										<th>Category Url</th>
										<th>Parent Category</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="category in categories" :key="category.id">
										<td class="uk-width-2-5">{{ category.name }}</td>
										<td class="uk-width-2-5">{{ category.slug }}</td>
										<!-- <td class="uk-width-2-5">{{ category.url }}</td> -->
										<td class="uk-width-2-5"><img :src="getApiImageByImageUrl(category.url)" :alt="category.name" crossorigin="anonymous" width="50" height="50" class="uk-object-cover" /></td>
										<td class="uk-width-2-5">{{ getCategoryName(category.parentId) }}</td>
										<td class="uk-width-1-5">
											<div @click="setCategoryStatus(category)">
												<span v-if="category.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(category.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(category.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalCategory"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="editCategory(category.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="deleteCategory(category.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="modalCategory" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingCategory ? "Edit" : "Add" }} Category</h2>
			</div>

			<div class="uk-modal-body">
				<Suspense>
					<template #default>
						<NewOrEdit></NewOrEdit>
					</template>
					<template #fallback>Yükleniyor</template>
				</Suspense>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import type { Ref } from "vue";
	import { defineAsyncComponent, ref, watch } from "vue";
	import { getApiImageByImageUrl } from "@services/file.service";
	import { useCategoryStore } from "@/stores";
	import { ICategory } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Category/EditOrNew.vue") });

	const categoryList: Ref<ICategory[]> = ref([]);

	const categoryStore = useCategoryStore();
	const { isCategories, isEmptyCategories, getCategories: categories, isErrorCategories, getCategoriesErrors: errors, isEditingCategory } = storeToRefs(categoryStore);
	categoryStore.getAll();

	const setCategoryList = () => categories.value && (categoryList.value = categories.value);

	watch([() => categories.value, () => isCategories.value], () => setCategoryList());

	// const getCategoryImage = (categoryUrl: string | null) => {
	// 	getApiImageByImageUrl
	// 	return `http://localhost:9000/${categoryUrl}`;
	// };

	const getCategoryName = (categoryId: string | null) => {
		return !!categoryId ? categoryList.value?.find?.((category) => category.id === categoryId)?.name || "Kategori Bulunamadı" : "Ana Kategori";
	};

	const setCategoryStatus = async (category: Partial<ICategory>) => {
		await categoryStore.updateCategory({ ...category, isActive: !category.isActive });
	};

	const newCategory = async () => {
		await categoryStore.updateEditingId(null);
	};

	const editCategory = async (id: string) => {
		await categoryStore.updateEditingId(id);
		await categoryStore.getById(id);
	};

	const deleteCategory = async (id: string) => {
		await categoryStore
			.delete(id)
			.then((v) => {
				if (v) toast({ message: `<span uk-icon='icon: check'></span> İsteğiniz başarıyla gerçekleştirildi.`, status: "success" });
				else toast({ message: `<span uk-icon='icon: ban'></span> İsteğiniz sırasında bir hata oluştu.`, status: "danger" });
			})
			.catch(() => {
				// toast({ message: `<span uk-icon='icon: ban'></span> ${errors.value.forEach((e) => e.message)}.`, status: "danger" });
				toast({ message: `<span uk-icon='icon: ban'></span> İsteğiniz yapılırken bir hata oluştu.`, status: "danger" });
			});
	};
</script>

<style scoped></style>