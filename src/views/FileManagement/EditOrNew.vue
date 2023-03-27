<template>
	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="file" label="Category Picture" name="photo" help="Bir kategori görseli" accept=".bmp, .jpg, .jpeg, .png, .webp, .gif" validation="required" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Category Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	const formData = ref();

	const editFileOrDirectory = (props: any) => {};
	const newFileOrDirectory = (props: any) => {};

	const formKitSubmit = (fields: any) => {
		const { photo, isActive } = fields;

		if (!false) editFileOrDirectory({ photo, isActive });
		else newFileOrDirectory({ photo, isActive });
	};
</script>

<style scoped></style>