<template>
	<div class="uk-margin">
		<ul uk-margin class="uk-pagination uk-flex-center">
			<li :class="{ 'uk-disabled': !paginationOptions.hasPrev }">
				<a data-uk-tooltip title="Önceki Sayfa" @click="prevPage"><span uk-pagination-previous></span></a>
			</li>

			<template v-for="page of paginationOptions.totalPages" :key="page">
				<li :class="{ 'uk-active': paginationOptions.pageNumber === page, '-uk-disabled': paginationOptions.pageNumber === page }">
					<a v-html="page" :data-uk-tooltip="paginationOptions.pageNumber === page ? 'Aktif Sayfa' : null" @click="() => goToPage(page)"></a>
				</li>
			</template>

			<li :class="{ 'uk-disabled': !paginationOptions.hasNext }">
				<a data-uk-tooltip title="Sonraki Sayfa" @click="nextPage"><span uk-pagination-next></span></a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	export type TPaginationOptions = { pageNumber: number; size: number; hasNext: boolean; hasPrev: boolean; totalCount: number; totalPages: number };

	const paginationInitialOptions: TPaginationOptions = { pageNumber: 1, size: 5, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false };

	type CustomPaginationProps = { paginationOptions: TPaginationOptions };

	const props = defineProps<CustomPaginationProps>();

	const changeEmitName = "refreshData";
	const emits = defineEmits<{ (e: typeof changeEmitName, options: TPaginationOptions): void }>();

	const prevPage = () => {
		if (props.paginationOptions.hasPrev) {
			props.paginationOptions.pageNumber -= 1;
			emits(changeEmitName, props.paginationOptions);
			// postStore.getAllWithPagination({ ...paginationOptions });
		}
	};

	const nextPage = () => {
		if (props.paginationOptions.hasNext) {
			props.paginationOptions.pageNumber += 1;
			emits(changeEmitName, props.paginationOptions);
			// postStore.getAllWithPagination({ ...paginationOptions });
		}
	};

	const goToPage = (page: number) => {
		if (page !== props.paginationOptions.pageNumber) {
			props.paginationOptions.pageNumber = page;
			emits(changeEmitName, props.paginationOptions);
			// postStore.getAllWithPagination({ ...paginationOptions });
		}
	};
</script>

<style scoped></style>