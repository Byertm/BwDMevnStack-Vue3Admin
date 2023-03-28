<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Tags</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalTag" title="New Tag" data-uk-tooltip data-uk-icon="icon: pencil" @click="newTag" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorTags">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyTags" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isTags" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Tag Name</th>
										<th>Tag Slug</th>
										<th>Tag Url</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="tag in tags" :key="tag.id">
										<td class="uk-width-2-5">{{ tag.name }}</td>
										<td class="uk-width-2-5">{{ tag.slug }}</td>
										<td class="uk-width-2-5">{{ tag.url }}</td>
										<td class="uk-width-1-5">
											<div @click="() => setTagStatus(tag)">
												<span v-if="tag.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(tag.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(tag.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a href="#modalTag" uk-toggle title="Düzenle" data-uk-tooltip data-uk-icon="icon: pencil" @click="() => editTag(tag.id)" class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="() => deleteTag(tag.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalTag" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingTag ? "Edit" : "Add" }} Tag</h2>
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
	import { useTagStore } from "@stores/tag.store";
	import { ITag } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Tag/EditOrNew.vue") });

	const tagStore = useTagStore();
	const { isTags, isEditingTag, isEmptyTags, getTags: tags, isErrorTags, getTagsErrors: errors } = storeToRefs(tagStore);
	tagStore.getAll();

	const setTagStatus = async (tag: Partial<ITag>) => {
		await tagStore.updateTag({ ...tag, isActive: !tag.isActive });
	};

	const newTag = async () => {
		await tagStore.updateEditingId(null);
	};

	const editTag = async (id: string) => {
		await tagStore.updateEditingId(id);
		await tagStore.getById(id);
	};

	const deleteTag = async (id: string) => {
		await tagStore
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