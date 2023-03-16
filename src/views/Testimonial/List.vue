<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Testimonials</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalTestimonial" title="New Testimonial" data-uk-tooltip data-uk-icon="icon: pencil" @click="newTestimonial" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorTestimonials">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyTestimonials" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isTestimonials" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Testimonial Name</th>
										<th>Testimonial Content</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="testimonial in testimonials" :key="testimonial.id">
										<td class="uk-width-2-5">{{ testimonial.title }}</td>
										<td class="uk-width-2-5">{{ testimonial.content }}</td>
										<td class="uk-width-1-5">
											<div @click="setTestimonialStatus(testimonial)">
												<span v-if="testimonial.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(testimonial.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(testimonial.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalTestimonial"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="editTestimonial(testimonial.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="deleteTestimonial(testimonial.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalTestimonial" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">Add Testimonial</h2>
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
	import { defineAsyncComponent } from "vue";
	import { useTestimonialStore } from "@stores/testimonial.store";
	import { ITestimonial } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Testimonial/EditOrNew.vue") });

	const testimonialStore = useTestimonialStore();
	const { isTestimonials, isEmptyTestimonials, getTestimonials: testimonials, isErrorTestimonials, getTestimonialsErrors: errors } = storeToRefs(testimonialStore);
	testimonialStore.getAll();

	const setTestimonialStatus = async (testimonial: Partial<ITestimonial>) => {
		await testimonialStore.updateTestimonial({ ...testimonial, isActive: !testimonial.isActive });
	};

	const newTestimonial = async () => {
		await testimonialStore.updateEditingId(null);
	};

	const editTestimonial = async (id: string) => {
		await testimonialStore.updateEditingId(id);
		await testimonialStore.getById(id);
	};

	const deleteTestimonial = async (id: string) => {
		await testimonialStore
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