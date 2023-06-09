<template>
	<div v-if="isErrorEducation">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyEducation" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Education Title" name="title" help="Bir eğitim başlığı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Education Scholl" name="scholl" help="Bir okul adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Education Section" name="section" help="Bir alan giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Education Description" name="description" help="Bir açıklama giriniz" validation="required|length:3,500" data-validation-visibility="live" />
		<FormKit type="date" label="Start Date" name="startDate" help="Bir başlangıç tarihi seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="date" label="Finish Date" name="finishDate" help="Bir bitiş tarihi seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Education Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { useEducationStore } from "@/stores";
	import { IEducation } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const formatDate: any = inject("formatDate");

	const educationStore = useEducationStore();

	const formData: Ref<Partial<IEducation>> = ref({});

	const { education, getEducation, isEducation, isEditingEducation, isErrorEducation, isEmptyEducation } = storeToRefs(educationStore);
	const { loading, errors } = toRefs(education.value);

	const setInitialData = () => {
		formData.value = {};
	};

	const setEducation = () => {
		if (isEditingEducation.value && isEducation.value)
			formData.value = {
				title: getEducation.value?.title,
				scholl: getEducation.value?.scholl,
				section: getEducation.value?.section,
				description: getEducation.value?.description,
				startDate: formatDate.formatFK(getEducation.value?.startDate), //getEducation.value?.startDate,
				finishDate: formatDate.formatFK(getEducation.value?.finishDate), // getEducation.value?.finishDate,
				isActive: getEducation.value?.isActive
			};
		else setInitialData();
	};

	watch([() => getEducation.value?.id, () => isEditingEducation.value], () => setEducation());

	const editEducation = (editedEducation: Partial<IEducation>) => {
		if (isEducation.value && getEducation.value)
			return educationStore
				.updateEducation({
					...getEducation.value,
					title: editedEducation.title,
					scholl: editedEducation.scholl,
					section: editedEducation.section,
					description: editedEducation.description,
					startDate: editedEducation.startDate,
					finishDate: editedEducation.finishDate,
					isActive: editedEducation.isActive
				})
				.then(() => {
					router.push("/education");
					toast({ message: `<span uk-icon='icon: check'></span> Eğitim başarıyla düzenlendi!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newEducation = (education: Partial<IEducation>) => {
		return educationStore
			.newEducation(education)
			.then(() => {
				router.push("/education");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni eğitim eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { title, scholl, section, description, startDate, finishDate, isActive } = fields;

		if (isEditingEducation.value) editEducation({ title, scholl, section, description, startDate, finishDate, isActive });
		else newEducation({ title, scholl, section, description, startDate, finishDate, isActive });
	};
</script>

<style scoped></style>