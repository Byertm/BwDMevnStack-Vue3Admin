<template>
	<div v-if="isErrorTestimonial">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyTestimonial" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Testimonial Title" name="title" help="Bir bildirim adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Testimonial Content" name="content" help="Bir bildirim içeriği giriniz" validation="required|length:3,500" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Testimonial Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { useTestimonialStore } from "@/stores";
	import { ITestimonial } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const testimonialStore = useTestimonialStore();

	const formData: Ref<Partial<ITestimonial>> = ref({});

	const { testimonial, getTestimonial, isTestimonial, isEditingTestimonial, isErrorTestimonial, isEmptyTestimonial } = storeToRefs(testimonialStore);
	const { loading, errors } = toRefs(testimonial.value);

	const setInitialData = () => {
		formData.value = {};
	};

	const setTestimonial = () => {
		if (isEditingTestimonial.value && isTestimonial.value) formData.value = { title: getTestimonial.value?.title, content: getTestimonial.value?.content, isActive: getTestimonial.value?.isActive };
		else setInitialData();
	};

	watch([() => getTestimonial.value?.id, () => isEditingTestimonial.value], () => setTestimonial());

	const editTestimonial = (editedTestimonial: Partial<ITestimonial>) => {
		if (isTestimonial.value && getTestimonial.value)
			return testimonialStore
				.updateTestimonial({ ...getTestimonial.value, title: editedTestimonial.title, content: editedTestimonial.content, isActive: editedTestimonial.isActive })
				.then(() => {
					router.push("/testimonial");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni testimonial eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newTestimonial = (testimonial: Partial<ITestimonial>) => {
		return testimonialStore
			.newTestimonial(testimonial)
			.then(() => {
				router.push("/testimonial");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { title, content, isActive } = fields;

		if (isEditingTestimonial.value) editTestimonial({ title, content, isActive });
		else newTestimonial({ title, content, isActive });
	};
</script>

<style scoped></style>