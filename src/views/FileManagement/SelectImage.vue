<template>
	<div class="images-wrapper">
		<div uk-grid class="uk-flex">
			<template v-if="isErrorFilesByMiddlePath">
				<div v-for="err in errors" uk-alert class="uk-alert-warning">
					<a class="uk-alert-close" uk-close></a>
					<p>{{ err.message }}</p>
				</div>
			</template>

			<template v-if="isEmptyFilesByMiddlePath">
				<a class="uk-alert-close" uk-close></a>
				<p>Veri bulunamadı</p>
			</template>

			<template v-if="loading">
				<div uk-alert class="uk-alert-info">
					<p>Yükleniyor...</p>
				</div>
			</template>

			<template v-if="isFilesByMiddlePath">
				<div uk-grid class="uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l uk-text-center">
					<div v-for="image in getFilesByMiddlePath" :key="image.name" @click="() => onHandleClick(image)">
						<!-- <div class="uk-card uk-card-primary uk-card-hover"> -->
						<!-- <div class="uk-card-media-top"> -->
						<img :alt="image.suffix" :title="image.name" :src="getImageUrlFromFile(image)" crossorigin="anonymous" class="uk-image" />
						<!-- </div> -->
						<!-- </div> -->
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import { useFileStore } from "@/stores";
	import { IFile, TSelectedElement } from "@models/file";
	import { onMounted } from "vue";
	const fileStore = useFileStore();
	const { isFilesByMiddlePath, filesByMiddlePath, getFilesByMiddlePath, isEmptyFilesByMiddlePath, isErrorFilesByMiddlePath } = storeToRefs(fileStore);
	const { loading, errors, data: images } = filesByMiddlePath.value;
	// const categoryImages: Ref<Array<IFile>> = ref([]);

	const props = defineProps<{ categoryName: string }>();
	const emit = defineEmits<{ (e: "selectImage", image: IFile): void }>();

	const getImageUrlFromFile = (selectedFile: TSelectedElement | any) => {
		return fileStore.getImageUrlFromFile(`${props.categoryName}/`, selectedFile);
	};

	const onHandleClick = (image: IFile) => {
		emit("selectImage", image);
	};

	onMounted(() => {
		if (props.categoryName) fileStore.getAllByMiddlePath(props.categoryName);
	});

	// watch([() => getFilesByMiddlePath.value, () => isFilesByMiddlePath.value], () => {
	// 	categoryImages.value = getFilesByMiddlePath.value;
	// });
</script>

<style lang="scss" scoped>
	.images-wrapper {
		max-height: 15rem;
		overflow: auto;
		padding: 1rem 1rem 1rem 0;

		&::-webkit-scrollbar {
			width: 0.25rem;
			height: 0.25rem;
			border-radius: 0.5rem;

			&-thumb {
				box-shadow: 0px 0px 0.25rem rgba(0, 0, 0, 0.25);
			}
		}

		.uk-image {
			--b-color: #e0e0e0;
			--fb-color: #dfdfdf;
			aspect-ratio: 1;
			object-fit: cover;
			padding: 0.25rem;
			border: 1px solid var(--b-color, var(--fb-color, #cfcfcf));
			border-radius: 0.5rem;
			transition: background-color 300ms linear, padding 200ms linear, object-fit 200ms linear;
			cursor: pointer;

			&:hover {
				object-fit: contain;
				padding: 0.5rem;
				background-color: var(--b-color, var(--fb-color, #cfcfcf));
			}
		}
	}
</style>