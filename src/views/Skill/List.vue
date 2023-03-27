<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Skills</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalSkill" title="New Skill" data-uk-tooltip data-uk-icon="icon: pencil" @click="newSkill" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorSkills">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptySkills" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isSkills" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Skill Name</th>
										<th>Skill Url</th>
										<th>Skill Image Url</th>
										<th>Skill Ratio</th>
										<th>Is Language</th>
										<th>Is Special</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="skill in skills" :key="skill.id">
										<td class="uk-width-2-5">{{ skill.name }}</td>
										<td class="uk-width-2-5">{{ skill.url }}</td>
										<td class="uk-width-2-5">{{ skill.imgUrl }}</td>
										<td class="uk-width-2-5">{{ skill.ratio }}</td>
										<td class="uk-width-1-5">
											<div @click="setSkillLanguageStatus(skill)">
												<span v-if="skill.isLanguage" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">
											<div @click="setSkillSpecialStatus(skill)">
												<span v-if="skill.isSpecial" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">
											<div @click="setSkillStatus(skill)">
												<span v-if="skill.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(skill.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(skill.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalSkill"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="editSkill(skill.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="deleteSkill(skill.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalSkill" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">Add Skill</h2>
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
	import { useSkillStore } from "@stores/skill.store";
	import { ISkill } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Skill/EditOrNew.vue") });

	const skillStore = useSkillStore();
	const { isSkills, isEmptySkills, getSkills: skills, isErrorSkills, getSkillsErrors: errors } = storeToRefs(skillStore);
	skillStore.getAll();

	const setSkillStatus = async (skill: Partial<ISkill>) => {
		await skillStore.updateSkill({ ...skill, isActive: !skill.isActive });
	};

	const setSkillLanguageStatus = async (skill: Partial<ISkill>) => {
		await skillStore.updateSkill({ ...skill, isLanguage: !skill.isLanguage });
	};

	const setSkillSpecialStatus = async (skill: Partial<ISkill>) => {
		await skillStore.updateSkill({ ...skill, isSpecial: !skill.isSpecial });
	};

	const newSkill = async () => {
		await skillStore.updateEditingId(null);
	};

	const editSkill = async (id: string) => {
		await skillStore.updateEditingId(id);
		await skillStore.getById(id);
	};

	const deleteSkill = async (id: string) => {
		await skillStore
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