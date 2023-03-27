<template>
	<div v-if="isErrorTag">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyTag" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Tag Name" name="name" help="Etiket adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Tag Url" name="url" help="Etiket bağlantı adresi giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Tag Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { useTagStore } from "@/stores";
	import { ITag } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const tagStore = useTagStore();

	const formData = ref();

	const { tag, isTag, isEditingTag, isErrorTag, isEmptyTag } = storeToRefs(tagStore);
	const { loading, errors } = toRefs(tag.value);

	const setInitialData = () => {
		formData.value = {};
	};

	watch([() => tag.value.data?.id, () => isEditingTag.value], () => {
		if (isEditingTag.value && isTag.value)
			formData.value = {
				name: tag.value.data?.name,
				url: tag.value.data?.url,
				isActive: tag.value.data?.isActive
			};
		else setInitialData();
	});

	const editTag = (editedTag: Partial<ITag>) => {
		if (isTag.value && tag.value.data)
			return tagStore
				.updateTag({
					...tag.value.data,
					name: editedTag.name,
					url: editedTag.url,
					isActive: editedTag.isActive
				})
				.then(() => {
					router.push("/tag");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni tag eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newTag = (tag: Partial<ITag>) => {
		return tagStore
			.newTag(tag)
			.then(() => {
				router.push("/tag");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { name, url, isActive } = fields;

		if (isEditingTag.value) editTag({ name, url, isActive });
		else newTag({ name, url, isActive });
	};
</script>

<style scoped></style>