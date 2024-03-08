<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Sites</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalSite" title="New Site" data-uk-tooltip data-uk-icon="icon: pencil" @click="newSite" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorSites">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptySites" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isSites" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Site Key</th>
										<th>Site Logo Text</th>
										<th>Site Logo Image Url</th>
										<!-- <th>Site Owner</th> -->
										<!-- <th>Active</th> -->
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="site in sites" :key="site.id">
										<td class="uk-width-2-5">{{ site.id }}</td>
										<td class="uk-width-2-5">{{ site.logo?.text }}</td>
										<td class="uk-width-2-5">{{ site.logo?.imageUrl }}</td>
										<!-- <td class="uk-width-2-5">{{ site.owner }}</td> -->
										<!-- <td class="uk-width-1-5">
											<div @click="() => setSiteStatus(site)">
												<span v-if="site.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td> -->
										<td class="uk-width-1-5">{{ $formatDate.format(site.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(site.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalSite"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="() => editSite(site.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="() => deleteSite(site.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalSite" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingSite ? "Edit" : "Add" }} Site</h2>
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
	import { useSiteStore } from "@stores/site.store";
	import { ISite } from "@models/index";
	import toast from "@utils/toast";

	defineOptions({ name: "Site_List", inheritAttrs: false });

	// const formatDate: any = inject("formatDate");

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Site/EditOrNew.vue") });

	const siteStore = useSiteStore();
	const { isSites, isEditingSite, isEmptySites, getSites: sites, isErrorSites, getSitesErrors: errors } = storeToRefs(siteStore);
	if (!isSites.value) siteStore.getAll();

	// const setSiteStatus = async (site: Partial<ISite>) => {
	// 	await siteStore.updateSite({ ...site, isActive: !site.isActive });
	// };

	const newSite = async () => {
		await siteStore.updateEditingId(null);
	};

	const editSite = async (id: string) => {
		await siteStore.updateEditingId(id);
		await siteStore.getById(id);
	};

	const deleteSite = async (id: string) => {
		await siteStore
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