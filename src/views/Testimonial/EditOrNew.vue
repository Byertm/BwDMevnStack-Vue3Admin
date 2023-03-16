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
		<FormKit type="text" label="Testimonial Content" name="content" help="Bir bildirim içeriği giriniz" validation="required|length:3,250" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Testimonial Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import { ref, toRefs } from "vue";
	import { watch } from "vue";
	// import { object, string, array, number, boolean } from "yup";
	import { useTestimonialStore } from "@/stores";
	import { ITestimonial } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const testimonialStore = useTestimonialStore();

	const formData = ref();

	const { testimonial, isTestimonial, isEditingTestimonial, isErrorTestimonial, isEmptyTestimonial } = storeToRefs(testimonialStore);
	const { loading, errors } = toRefs(testimonial.value);

	const setInitialData = () => {
		formData.value = {};
	};

	watch([() => testimonial.value.data?.id, () => isEditingTestimonial.value], () => {
		if (isEditingTestimonial.value && isTestimonial.value) formData.value = { title: testimonial.value.data?.title, content: testimonial.value.data?.content, isActive: testimonial.value.data?.isActive };
		else setInitialData();
	});

	const editTestimonial = (editedTestimonial: Partial<ITestimonial>) => {
		if (isTestimonial.value && testimonial.value.data)
			return testimonialStore
				.updateTestimonial({ ...testimonial.value.data, title: editedTestimonial.title, content: testimonial.value.data?.content, isActive: editedTestimonial.isActive })
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