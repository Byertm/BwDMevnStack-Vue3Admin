<template>
	<EasyDataTable
		:headers="headers"
		:items="items"
		:alternating="alternating"
		:border-cell="borderCell"
		:buttons-pagination="buttonsPagination"
		v-model:server-options="serverOptions"
		:server-items-length="serverItemsLength"
		@update-page-items="updatePageItems"
		:loading="loading">
		<template #loading>
			Yükleniyor...
			<!-- <img src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif" style="width: 100px; height: 80px" /> -->
		</template>
		<template #empty-message>
			Bulunamadı!
			<!-- <a href="https://google.com">nothing here</a> -->
		</template>
	</EasyDataTable>
</template>

<script setup lang="ts">
	import type { Header, Item, ClickRowArgument, ServerOptions } from "vue3-easy-data-table";
	import { usePostStore } from "@/stores";
	import { IPost } from "@models/post";

	export type Props = {
		headers: Array<Header>;
		// items: Array<Item>;
		alternating?: boolean;
		borderCell?: boolean;
		buttonsPagination?: boolean;
		// serverOptions?: ServerOptions;
	};

	const postStore = usePostStore();
	const { isPostsAndPagination, getPostsAndPagination } = storeToRefs(postStore);

	const items = ref<Item[]>([]);

	const loading = ref(false);
	const serverItemsLength = ref(0);
	const serverOptions = ref<ServerOptions>({ page: 1, rowsPerPage: 5, sortBy: "age", sortType: "desc" });

	const props = withDefaults(defineProps<Props>(), {
		alternating: false,
		borderCell: false,
		buttonsPagination: false,
		// items: () => [],
		header: []
		// serverOptions: { page: 1, rowsPerPage: 5, sortBy: "id", sortType: "asc" }
	});

	const loadFromServer = async () => {
		loading.value = true;
		postStore.getAllWithPagination({ pageNumber: serverOptions.value.page, size: serverOptions.value.rowsPerPage });
	};

	watch([() => isPostsAndPagination.value, () => getPostsAndPagination.value], () => {
		loading.value = true;
		const response: any = getPostsAndPagination.value;
		const rows = response?.data || [];
		serverItemsLength.value = response?.totalCount || 0;
		serverOptions.value.page = response?.pageNumber;
		serverOptions.value.rowsPerPage = response?.pageSize;

		items.value = rows.map(({ author, category, comments, content, createdAt, id, imageUrl, isActive, preTitle, slug, tags, title, updatedAt }: IPost) => {
			return {
				// id,
				title: title,
				preTitle: preTitle,
				slug: slug,
				content: content,
				comments: comments,
				imageUrl: imageUrl,
				category: category?.name || "",
				author: author?.name || "",
				tags: tags,
				isActive: isActive,
				createdAt: createdAt,
				updatedAt: updatedAt,
				process: "Ekstra"
			};
		});

		loading.value = false;
	});

	// watch(
	// 	serverOptions,
	// 	(value) => {
	// 		loadFromServer();
	// 	},
	// 	{ deep: true }
	// );

	loadFromServer();

	// const getPaginationOptions = computed(() => {
	// 	return Object.assign(paginationInitialOptions, props.paginationOptions);
	// });

	const clickRowEmitName: string = "clickRow";
	const emits = defineEmits<{ (e: typeof clickRowEmitName, data: ClickRowArgument): void }>();

	const updatePageItems = (item: any) => {
		// emits(clickRowEmitName, item);
		console.log(JSON.stringify(item));
	};
</script>

<style scoped></style>