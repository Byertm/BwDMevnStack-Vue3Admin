<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Sections</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalSection" title="New Section" data-uk-tooltip data-uk-icon="icon: pencil" @click="newSection" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorSections">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptySections" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isSections" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Section Key</th>
										<th>Section Name</th>
										<th>Section Type</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="section in sections" :key="section.id">
										<td class="uk-width-2-5">{{ section.key }}</td>
										<td class="uk-width-2-5">{{ section.name }}</td>
										<td class="uk-width-2-5">{{ section.type }}</td>
										<!-- <td class="uk-width-2-5">{{ section.subSections }}</td> -->
										<td class="uk-width-1-5">
											<div @click="() => setSectionStatus(section)">
												<span v-if="section.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(section.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(section.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalSection"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="() => editSection(section.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="() => deleteSection(section.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalSection" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingSection ? "Edit" : "Add" }} Section</h2>
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
	import { useSectionStore } from "@stores/section.store";
	import { ISection } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Section/EditOrNew.vue") });

	const sectionStore = useSectionStore();
	const { isSections, isEditingSection, isEmptySections, getSections: sections, isErrorSections, getSectionsErrors: errors } = storeToRefs(sectionStore);
	sectionStore.getAll();

	const setSectionStatus = async (section: Partial<ISection>) => {
		await sectionStore.updateSection({ ...section, isActive: !section.isActive });
	};

	const newSection = async () => {
		await sectionStore.updateEditingId(null);
	};

	const editSection = async (id: string) => {
		await sectionStore.updateEditingId(id);
		await sectionStore.getById(id);
	};

	const deleteSection = async (id: string) => {
		await sectionStore
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