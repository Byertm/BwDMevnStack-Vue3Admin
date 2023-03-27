<template>
	<div>
		<BwdFormWrapper :schema="reactiveSchema" :title="title" @submitForm="submitForm"></BwdFormWrapper>
	</div>
</template>

<script setup lang="ts">
	import BwdFormWrapper from "./BwdFormWrapper.vue";
	import { IFormSchema } from "./IBwdInput";

	const props = defineProps({
		schema: { type: Object, required: true },
		title: { type: String, default: "" }
	});

	const schema: IFormSchema = props.schema;
	const reactiveSchema = ref(schema);

	const changeEmitName = "submitForm";
	const emits = defineEmits<{ (e: typeof changeEmitName, id: string): void }>();

	const submitForm = (values: any) => {
		emits(changeEmitName, values);
	};
</script>

<style scoped></style>