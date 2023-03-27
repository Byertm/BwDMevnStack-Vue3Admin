<template>
	<div v-if="isErrorExperience">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyExperience" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Experience Title" name="title" help="Bir eğitim başlığı giriniz" validation="required|length:3,100" data-validation-visibility="live" />
		<FormKit type="text" label="Experience Company" name="company" help="Bir okul adı giriniz" validation="required|length:3,100" data-validation-visibility="live" />
		<FormKit type="text" label="Experience Section" name="section" help="Bir alan giriniz" validation="required|length:3,100" data-validation-visibility="live" />
		<FormKit type="text" label="Experience Description" name="description" help="Bir açıklama giriniz" validation="required|length:3,2500" data-validation-visibility="live" />
		<FormKit type="date" label="Start Date" name="startDate" help="Bir başlangıç tarihi seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="date" label="Finish Date" name="finishDate" help="Bir bitiş tarihi seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Experience Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { useExperienceStore } from "@/stores";
	import { IExperience } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const formatDate: any = inject("formatDate");

	const experienceStore = useExperienceStore();

	const formData = ref();

	const { experience, isExperience, isEditingExperience, isErrorExperience, isEmptyExperience } = storeToRefs(experienceStore);
	const { loading, errors } = toRefs(experience.value);

	const setInitialData = () => {
		formData.value = {};
	};

	watch([() => experience.value.data?.id, () => isEditingExperience.value], () => {
		if (isEditingExperience.value && isExperience.value)
			formData.value = {
				title: experience.value.data?.title,
				company: experience.value.data?.company,
				section: experience.value.data?.section,
				description: experience.value.data?.description,
				startDate: formatDate.formatFK(experience.value.data?.startDate), //experience.value.data?.startDate,
				finishDate: formatDate.formatFK(experience.value.data?.finishDate), // experience.value.data?.finishDate,
				isActive: experience.value.data?.isActive
			};
		else setInitialData();
	});

	const editExperience = (editedExperience: Partial<IExperience>) => {
		if (isExperience.value && experience.value.data)
			return experienceStore
				.updateExperience({
					...experience.value.data,
					title: editedExperience.title,
					company: editedExperience.company,
					section: editedExperience.section,
					description: editedExperience.description,
					startDate: editedExperience.startDate,
					finishDate: editedExperience.finishDate,
					isActive: editedExperience.isActive
				})
				.then(() => {
					router.push("/experience");
					toast({ message: `<span uk-icon='icon: check'></span> Deneyim başarıyla düzenlendi!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newExperience = (experience: Partial<IExperience>) => {
		return experienceStore
			.newExperience(experience)
			.then(() => {
				router.push("/experience");
				toast({ message: `<span uk-icon='icon: check'></span> Yeni deneyim başarıyla eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { title, company, section, description, startDate, finishDate, isActive } = fields;

		if (isEditingExperience.value) editExperience({ title, company, section, description, startDate, finishDate, isActive });
		else newExperience({ title, company, section, description, startDate, finishDate, isActive });
	};
</script>

<style scoped></style>