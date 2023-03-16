<template>
	<div class="uk-overflow-auto">
		<BaseTable :headers="headers" :alternating="false" :border-cell="false" :buttons-pagination="false"></BaseTable>

		<br />
		<br />
		<hr />
		<br />
		<br />

		<!-- <BaseTableLite></BaseTableLite> -->
	</div>
</template>

<script lang="ts" setup>
	import BaseTable from "@components/shared/EasyDataTable/BaseTable.vue";
	// import BaseTableLite from "@components/shared/TableLite/BaseTableLite.vue";
	import type { Header, Item, ClickRowArgument } from "vue3-easy-data-table";

	const headers: Header[] = [
		// { text: "Id", value: "id", width: 3, sortable: true },
		{ text: "Title", value: "title", width: 10, sortable: true },
		{ text: "Pre Title", value: "preTitle", width: 15, sortable: true },
		{ text: "Slug", value: "slug", width: 15, sortable: true },
		{ text: "Content", value: "content", width: 15, sortable: true },
		{ text: "Comments", value: "comments", width: 15, sortable: true },
		{ text: "Image Url", value: "imageUrl", width: 15, sortable: true },
		{ text: "Category", value: "category", width: 15, sortable: true },
		{ text: "Author", value: "author", width: 15, sortable: true },
		{ text: "Tags", value: "tags", width: 15, sortable: true },
		{ text: "Active", value: "isActive", width: 15, sortable: true },
		{ text: "Create Date", value: "createdAt", width: 15, sortable: true },
		{ text: "Update Date", value: "updatedAt", width: 15, sortable: true },
		{ text: "", value: "process", width: 15, sortable: true }
	];

	const showRowData = (data: ClickRowArgument) => {
		console.log(JSON.stringify(data));
	};
</script>

<style lang="scss" scoped></style>