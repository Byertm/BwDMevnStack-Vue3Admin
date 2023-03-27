<template>
	<table-lite
		:is-loading="table.isLoading"
		:columns="table.columns"
		:rows="table.rows"
		:total="table.totalRecordCount"
		:sortable="table.sortable"
		:page="table.pageNumber"
		:page-size="table.pageSize"
		:page-options="table.pageOptions"
		@get-now-page="getNowPage"
		@do-search="doSearch"
		@is-finished="tableLoadingFinish"></table-lite>
</template>

<script setup lang="ts">
	import TableLite from "vue3-table-lite/ts";
	import { usePostStore } from "@/stores";
	import { IPost } from "@models/post";

	const postStore = usePostStore();
	const { isPostsAndPagination, getPostsAndPagination } = storeToRefs(postStore);

	const table = reactive({
		isLoading: false,
		columns: [
			// { label: "Id", field: "id", width: "3%", sortable: true, isKey: true },
			{ label: "Title", field: "title", width: "10%", sortable: true },
			{ label: "Pre Title", field: "preTitle", width: "15%", sortable: true },
			{ label: "Slug", field: "slug", width: "15%", sortable: true, isKey: true },
			{ label: "Content", field: "content", width: "15%", sortable: true },
			{ label: "Comments", field: "comments", width: "15%", sortable: true },
			{ label: "Image Url", field: "imageUrl", width: "15%", sortable: true },
			{ label: "Category", field: "category", width: "15%", sortable: true },
			{ label: "Author", field: "author", width: "15%", sortable: true },
			{ label: "Tags", field: "tags", width: "15%", sortable: true },
			{ label: "Active", field: "isActive", width: "15%", sortable: true },
			{ label: "Create Date", field: "createdAt", width: "15%", sortable: true },
			{ label: "Update Date", field: "updatedAt", width: "15%", sortable: true },
			{ label: "", field: "process", width: "15%", sortable: true }
		],
		rows: [],
		totalRecordCount: 0,
		sortable: { order: "id", sort: "asc" },
		pageNumber: 1,
		pageSize: 5,
		pageOptions: [
			{ value: 5, text: "5" },
			{ value: 10, text: "10" },
			{ value: 15, text: "15" },
			{ value: 20, text: "20" },
			{ value: 25, text: "25" },
			{ value: 30, text: "30" },
			{ value: 35, text: "35" },
			{ value: 40, text: "40" },
			{ value: 45, text: "45" },
			{ value: 50, text: "50" }
		]
	});

	watch([() => isPostsAndPagination.value, () => getPostsAndPagination.value], () => {
		const response: any = getPostsAndPagination.value;
		const rows = response?.data || [];
		table.totalRecordCount = response?.totalCount || 0;
		table.rows = rows.map(({ author, category, comments, content, createdAt, id, imageUrl, isActive, preTitle, slug, tags, title, updatedAt }: IPost) => {
			return {
				// id,
				title,
				preTitle,
				slug,
				content,
				comments,
				imageUrl,
				category: category?.name || "",
				author: author?.name || "",
				tags,
				isActive,
				createdAt,
				updatedAt,
				process: "Ekstra"
			};
		});

		// {
		// 	author : {first_name: "Ersin", last_name: "Biltekin", email: "ersin57@mail.com", name: "Ersin Biltekin",…}
		// 	category : {name: "Html",…}
		// 	comments : []
		// 	content : "<p>Yeni <strong>blog </strong>yayında detay. <span style=\"color: rgb(230, 0, 0);\">Burası </span>ise <u>büyük </u>yazı alanı. <strong>İstediğiniz </strong>yazabilin. <em>detay</em>. </p>"
		// 	createdAt : "2023-02-01T17:41:17.943Z"
		// 	id : "63daa43da854216120eaff3b"
		// 	imageUrl :"uploads/manager/post/1677632555043_0.rhunzlm9k2a_development_image.jpeg"
		// 	isActive :true
		// 	preTitle:"Yeni Blogumuz yayında"
		// 	slug:"yeni-blog-yay-nda"
		// 	tags:[{name: "Html", url: "html", slug: "html", id: "63e445057ea2b2404ab3b8d8"},…]
		// 	title:"Yeni blog yayında"
		// 	updatedAt:"2023-03-10T16:10:08.034Z"
		// }
	});

	const getNowPage = (pageNumber: number) => {
		table.pageNumber = pageNumber;
	};

	const doSearch = (offset: number, limit: number, order: string, sort: string) => {
		table.isLoading = true;

		postStore.getAllWithPagination({ pageNumber: table.pageNumber, size: table.pageSize });
	};

	const tableLoadingFinish = (elements: any) => {
		console.log("elements", elements);
		table.isLoading = false;
	};

	doSearch(0, 10, "id", "asc");
</script>

<style scoped></style>