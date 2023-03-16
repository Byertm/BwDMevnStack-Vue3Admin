<template>
	<VeeForm @invalid-submit="veeOnInvalidSubmit" :initial-values="initialValues" @submit="veeSubmit">
		<h2 v-if="title">{{ title }}</h2>

		<template v-for="(field, idx) in schema.fields" :key="field.name">
			<BwDInput
				:id="field.id ? field.id : `iInput_${idx}`"
				:type="field.type"
				:name="field.name"
				:value="field.value"
				:rows="field.rows"
				:cols="field.cols"
				:label="field.label"
				:rules="field.rules"
				:placeholder="field.placeholder"
				:success-message="field.successMessage"
				:class-name="field.className"></BwDInput>
		</template>
	</VeeForm>
</template>

<script setup lang="ts">
	import { toRefs } from "vue";
	import { Form as VeeForm } from "vee-validate";
	import BwDInput from "@components/shared/Form/BwDInput.vue";

	const props = defineProps({
		title: { type: String, default: "" },
		schema: { type: Object, required: true }
	});

	const { schema } = toRefs(props);

	// const rulesSchema = toRefs(schema.value.fields.map((f: any) => f.rules));

	const initialValues = {};

	// const { values, handleSubmit, meta } = useForm({
	// 	initialValues: {
	// 		iUsername: "Biltekin"
	// 	}
	// });

	// watch(values, (newValues) => {
	// 	emit("change", newValues);
	// });

	const changeEmitName = "submitForm";
	const emits = defineEmits<{ (e: typeof changeEmitName, id: string): void }>();
	// const onInput = (event: Event) => {
	// 	const target = event.target as HTMLInputElement;
	// 	emits(changeEmitName, target.value);
	// };

	const veeSubmit = (values: any) => {
		console.log(values);
		// alert(values);
		emits(changeEmitName, values);
	};

	function veeOnInvalidSubmit() {
		const submitBtn = document.querySelector(".bwd-submit") as HTMLButtonElement;
		submitBtn.classList.add("invalid");
		setTimeout(() => {
			submitBtn.classList.remove("invalid");
		}, 1000);
	}
</script>

<style lang="scss" scoped>
	form {
		margin: 0px auto;
		padding-bottom: 60px;

		// :root {
		--primary-color: #0071fe;
		--error-color: #f23648;
		--error-bg-color: #fddfe2;
		--success-color: #21a67a;
		--success-bg-color: #e0eee4;
		// }
	}

	.bwd-submit {
		background: var(--primary-color);
		outline: none;
		border: none;
		color: #fff;
		font-size: 18px;
		padding: 10px 15px;
		display: block;
		width: 100%;
		border-radius: 7px;
		margin-top: 40px;
		transition: scale 0.3s ease-in-out, translate 0.3s ease-in-out;
		cursor: pointer;

		&.invalid {
			animation: shake 0.5s;
			/* When the animation is finished, start again */
			animation-iteration-count: infinite;
		}

		&:hover {
			scale: 1.1;
		}
	}

	@keyframes shake {
		0% {
			translate: 1px 1px;
		}
		10% {
			translate: -1px -2px;
		}
		20% {
			translate: -3px 0px;
		}
		30% {
			translate: 3px 2px;
		}
		40% {
			translate: 1px -1px;
		}
		50% {
			translate: -1px 2px;
		}
		60% {
			translate: -3px 1px;
		}
		70% {
			translate: 3px 1px;
		}
		80% {
			translate: -1px -1px;
		}
		90% {
			translate: 1px 2px;
		}
		100% {
			translate: 1px -2px;
		}
	}
</style>