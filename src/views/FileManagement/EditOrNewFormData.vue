<template>
	<div>
		<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
			<FormKit type="file" label="Category Picture" name="photo" help="Bir kategori görseli" accept=".bmp, .jpg, .jpeg, .png, .webp, .gif" :validation="[[isPhoto ? 'required' : '']]" data-validation-visibility="live" />
		</FormKit>
	</div>
</template>

<script setup lang="ts">
	import axios, { AxiosRequestConfig } from "axios";
	import { BASE_API_URL } from "@utils/constants";
	import { getLS } from "@src/composables/local-storage";
	import { ICategory } from "@models/category";

	// Note: Burası ICategory den IFile a dönecek ona göre de photo bilgisi açılacak.
	const formData: Ref<Partial<ICategory>> = ref({});

	const isPhoto = computed(() => {
		// return !!formData?.value?.photo;
		return !!formData.value;
	});

	const testEditCategory = (category: Partial<ICategory>, id: string) => {
		const formData = new FormData();
		// // formData.append("_method", "PATCH");
		formData.append("name", category.name || "");
		// // formData.append("parentId", category.parentId?.toString() || "");

		// let picture: any = "bwdTest";
		// Note: Burası açıktı
		// category?.photo?.forEach((fileItem: any) => {
		// 	if (fileItem?.file) {
		// 		formData.append("photo", fileItem.file);
		// 	}
		// 	// if (!!fileItem?.file) picture = fileItem.file;
		// });

		// _original: {
		// 	name: 'TypeScript',
		// 	url: 'test',
		// 	parentId: null,
		// 	isActive: true,
		// 	slug: 'typescript',
		// 	editedCategory: {
		// 		name: 'TypeScript',
		// 		slug: 'typescript',
		// 		url: 'test',
		// 		photo: [Array],
		// 		parentId: null,
		// 		isActive: true
		// 	},
		// 	photo: ''
		// },

		const token: string = `Bearer ${getLS("accessToken")}`;
		const options: AxiosRequestConfig = { headers: { Authorization: token, "Content-Type": "multipart/form-data" }, method: "PATCH" };
		axios
			.post(BASE_API_URL + "api/category/" + id, formData, options)
			// .patch(BASE_API_URL + "api/category/" + id, { name: category.name, photo: picture }, options)
			.then((value) => {
				console.log("Result Data: => ", value.data);
			})
			.catch((err) => console.log(JSON.stringify(err)))
			.finally(() => console.log("İstek bitti"));
		// console.log("Result Data: => ", result.data);
		// console.log("Result: => ", result);
	};

	const testNewCategory = (category: Partial<ICategory>) => {
		const formData = new FormData();
		// formData.append("_method", "put");
		formData.append("name", category.name || "");
		// formData.append("parentId", category.parentId?.toString() || "");

		// Note: Burası açıktı
		// category?.photo?.forEach((fileItem: any) => {
		// 	if (fileItem?.file) formData.append("photo", fileItem.file);
		// });

		const token: string = `Bearer ${getLS("accessToken")}`;
		const options: AxiosRequestConfig = { headers: { Authorization: token, "Content-Type": "multipart/form-data" }, method: "Post" };
		axios
			.post(BASE_API_URL + "api/category", formData, options)
			.then((value) => {
				console.log("Result Data: => ", value.data);
			})
			.catch((err) => console.log(JSON.stringify(err)))
			.finally(() => console.log("İstek bitti"));
		// console.log("Result Data: => ", result.data);
		// console.log("Result: => ", result);
	};

	const formKitSubmit = (fields: any) => {
		debugger;
		const { name, url, photo, parentId, isActive } = fields;

		// if (isEditingCategory.value)
		testEditCategory({ name, url, parentId, isActive }, "postId"); // photo gönderiliyordu.
		// else
		testNewCategory({ name, url, parentId, isActive }); // photo gönderiliyordu.
	};
</script>

<style scoped></style>