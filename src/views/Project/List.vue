<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Projects</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalProject" title="New Project" data-uk-tooltip data-uk-icon="icon: pencil" @click="newProject" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorProjects">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyProjects" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isProjects" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Project Name</th>
										<th>Project Description</th>
										<th>Project Demo Preview Url</th>
										<th>Project Deploy Url</th>
										<th>Project Image Url</th>
										<th>Project Category</th>
										<th>Start Date</th>
										<th>Finish Date</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="project in projects" :key="project.id">
										<td class="uk-width-2-5">{{ project.name }}</td>
										<td class="uk-width-2-5">{{ project.description }}</td>
										<td class="uk-width-2-5">{{ project.demoPreviewUrl }}</td>
										<td class="uk-width-2-5">{{ project.deployUrl }}</td>
										<td class="uk-width-2-5"><img :src="getApiImageByImageUrl(project.imageUrl)" :alt="project.name" crossorigin="anonymous" width="50" height="50" class="uk-object-cover" /></td>
										<td class="uk-width-2-5">{{ getCategoryName(project.categoryId) }}</td>
										<td class="uk-width-2-5">{{ $formatDate.format(project.startDate) || null }}</td>
										<td class="uk-width-2-5">{{ $formatDate.format(project.finishDate) || null }}</td>
										<td class="uk-width-1-5">
											<div @click="setProjectStatus(project)">
												<span v-if="project.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(project.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(project.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalProject"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="editProject(project.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="deleteProject(project.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalProject" uk-modal>
		<div v-if="isShowEditOrNew" class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingProject ? "Edit" : "Add" }} Project</h2>
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
	import { defineAsyncComponent, onMounted, ref, watch } from "vue";
	import { getApiImageByImageUrl } from "@services/file.service";
	import { useProjectStore, useCategoryStore } from "@/stores";
	import { ICategory, IProject } from "@models/index";
	import toast from "@utils/toast";
	import UIkit from "uikit";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Project/EditOrNew.vue") });

	const categoryList: Ref<ICategory[]> = ref([]);

	const projectStore = useProjectStore();
	const categoryStore = useCategoryStore();
	const isShowEditOrNew: Ref<boolean> = ref(false);

	const { isProjects, isEmptyProjects, getProjects: projects, isErrorProjects, getProjectsErrors: errors, isEditingProject } = storeToRefs(projectStore);
	const { getCategories: categories, isCategories } = storeToRefs(categoryStore);

	projectStore.getAll();
	categoryStore.getAll();

	const setCategoryList = () => categories.value && (categoryList.value = categories.value);

	watch([() => categories.value, () => isCategories.value], () => setCategoryList());

	const getCategoryName = (categoryId: string) => {
		return categoryList.value?.find?.((category) => category.id === categoryId)?.name || "Kategori Bulunamadı";
	};

	const setProjectStatus = async (project: Partial<IProject>) => {
		await projectStore.updateProject({ ...project, isActive: !project.isActive });
	};

	const newProject = async () => {
		await (isShowEditOrNew.value = true);
		await projectStore.updateEditingId(null);
	};

	const editProject = async (id: string) => {
		await (isShowEditOrNew.value = true);
		await projectStore.updateEditingId(id);
		await projectStore.getById(id);
	};

	const deleteProject = async (id: string) => {
		await projectStore
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

	onMounted(() => {
		UIkit.util.on("#modalProject", "beforeshow", function () {
			isShowEditOrNew.value = true;
		});

		UIkit.util.on("#modalProject", "beforehide", function () {
			isShowEditOrNew.value = false;
		});
	});
</script>

<style scoped></style>