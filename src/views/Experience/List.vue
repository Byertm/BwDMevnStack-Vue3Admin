<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Experiences</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalExperience" title="New Experience" data-uk-tooltip data-uk-icon="icon: pencil" @click="newExperience" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorExperiences">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyExperiences" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isExperiences" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Experience Title</th>
										<th>Experience Scholl</th>
										<th>Experience Section</th>
										<th>Experience Description</th>
										<th>Start Date</th>
										<th>Finish Date</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="experience in experiences" :key="experience.id">
										<td class="uk-width-2-5">{{ experience.title }}</td>
										<td class="uk-width-2-5">{{ experience.company }}</td>
										<td class="uk-width-2-5">{{ experience.section }}</td>
										<td class="uk-width-2-5">{{ experience.description }}</td>
										<td class="uk-width-2-5">{{ $formatDate.format(experience.startDate) || null }}</td>
										<td class="uk-width-2-5">{{ $formatDate.format(experience.finishDate) || null }}</td>
										<td class="uk-width-1-5">
											<div @click="() => setExperienceStatus(experience)">
												<span v-if="experience.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(experience.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(experience.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalExperience"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="() => editExperience(experience.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="() => deleteExperience(experience.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalExperience" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingExperience ? "Edit" : "Add" }} Experience</h2>
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
	import { useExperienceStore } from "@stores/experience.store";
	import { IExperience } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Experience/EditOrNew.vue") });

	const experienceStore = useExperienceStore();
	const { isExperiences, isEditingExperience, isEmptyExperiences, getExperiences: experiences, isErrorExperiences, getExperiencesErrors: errors } = storeToRefs(experienceStore);
	experienceStore.getAll();

	const setExperienceStatus = async (experience: Partial<IExperience>) => {
		await experienceStore.updateExperience({ ...experience, isActive: !experience.isActive });
	};

	const newExperience = async () => {
		await experienceStore.updateEditingId(null);
	};

	const editExperience = async (id: string) => {
		await experienceStore.updateEditingId(id);
		await experienceStore.getById(id);
	};

	const deleteExperience = async (id: string) => {
		await experienceStore
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