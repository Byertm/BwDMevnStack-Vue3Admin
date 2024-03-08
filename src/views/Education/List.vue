<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Educations</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalEducation" title="New Education" data-uk-tooltip data-uk-icon="icon: pencil" @click="newEducation" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorEducations">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyEducations" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isEducations" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th></th>
										<th>Education Title</th>
										<th>Education Scholl</th>
										<th>Education Section</th>
										<!-- <th class="uk-table-expand">Education Description</th> -->
										<th>Start Date</th>
										<th>Finish Date</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<template v-for="education in educations" :key="education.id">
										<tr>
											<td class="uk-width-auto">
												<button
													type="button"
													:data-id="education.id"
													data-uk-icon="icon: chevron-down"
													data-uk-tooltip
													title="Detay Göster"
													:uk-toggle="`target: .row-detail[data-id='${education.id}'], .detail-btn[data-id='${education.id}']`"
													class="detail-btn uk-icon-button uk-button-secondary uk-margin-small-right"></button>
												<button
													type="button"
													:data-id="education.id"
													data-uk-icon="icon: chevron-up"
													data-uk-tooltip
													title="Detay Gizle"
													:uk-toggle="`target: .row-detail[data-id='${education.id}'], .detail-btn[data-id='${education.id}']`"
													hidden
													class="detail-btn uk-icon-button uk-button-secondary uk-margin-small-right"></button>
											</td>
											<td class="uk-width-auto">{{ education.title }}</td>
											<td class="uk-width-auto">{{ education.scholl }}</td>
											<td class="uk-width-auto">{{ education.section }}</td>
											<!-- <td class="uk-table-expand uk-width-expand">{{ education.description }}</td> -->
											<td class="uk-width-auto">{{ $formatDate.format(education.startDate) || null }}</td>
											<td class="uk-width-auto">{{ $formatDate.format(education.finishDate) || null }}</td>
											<td class="uk-width-auto">
												<div @click="() => setEducationStatus(education)">
													<span v-if="education.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
													<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
												</div>
											</td>
											<td class="uk-width-auto">{{ $formatDate.format(education.createdAt) || null }}</td>
											<td class="uk-width-auto">{{ $formatDate.format(education.updatedAt) || null }}</td>
											<td class="uk-width-auto">
												<div class="uk-button-group">
													<a
														href="#modalEducation"
														uk-toggle
														title="Düzenle"
														data-uk-tooltip
														data-uk-icon="icon: pencil"
														@click="() => editEducation(education.id)"
														class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
													<a @click="() => deleteEducation(education.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
												</div>
											</td>
										</tr>
										<tr :data-id="education.id" hidden class="row-detail">
											<td colspan="10" class="uk-table-expand">
												<div class="uk-padding-small">{{ education.description }}</div>
											</td>
										</tr>
									</template>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="modalEducation" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingEducation ? "Edit" : "Add" }} Education</h2>
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
	import { useEducationStore } from "@stores/education.store";
	import { IEducation } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Education/EditOrNew.vue") });

	const educationStore = useEducationStore();
	const { isEducations, isEditingEducation, isEmptyEducations, getEducations: educations, isErrorEducations, getEducationsErrors: errors } = storeToRefs(educationStore);

	if (!isEducations.value) educationStore.getAll();

	const setEducationStatus = async (education: Partial<IEducation>) => {
		await educationStore.updateEducation({ ...education, isActive: !education.isActive });
	};

	const newEducation = async () => {
		await educationStore.updateEditingId(null);
	};

	const editEducation = async (id: string) => {
		await educationStore.updateEditingId(id);
		await educationStore.getById(id);
	};

	const deleteEducation = async (id: string) => {
		await educationStore
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