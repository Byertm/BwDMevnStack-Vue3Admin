<template>
	<div>{{ route?.meta?.title || "Page" }}</div>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";

	const route = useRoute();
</script>

<style lang="scss" scoped></style>