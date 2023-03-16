<template>
	<template v-if="isInput || isTextarea">
		<div v-bind:class="className" :class="{ 'has-error': !!errorMessage, success: meta.valid }">
			<label :for="!!id ? id : name">{{ label }}</label>
			<template v-if="isInput"><input :id="!!id ? id : name" :name="name" :type="type" :value="inputValue" @input="handleChange" @blur="handleBlur" /></template>
			<template v-else-if="isTextarea"><textarea :id="!!id ? id : name" :name="name" :type="type" :value="inputValue" :rows="rows" :cols="cols" @input="handleChange" @blur="handleBlur" /></template>

			<p v-show="errorMessage || meta.valid" class="help-message">{{ errorMessage || successMessage }}</p>
		</div>
	</template>
	<template v-else-if="isButton && (type === 'submit' || type === 'button' || type === 'reset')">
		<button :type="type" v-bind:class="className || 'bwd-submit'">{{ label }}</button>
	</template>
</template>

<script lang="ts" setup>
	import { computed, ref, toRef } from "vue";
	import { watch } from "vue";
	import { useField } from "vee-validate";

	const props = defineProps({
		id: { type: String, default: "" },
		type: { type: String, default: "text" },
		value: { type: String, default: "" },
		rules: { type: Object },
		name: { type: String, required: true },
		label: { type: String, required: true },
		successMessage: { type: String, default: "" },
		placeholder: { type: String, default: "" },
		className: { type: String, default: "bwd-fc" },

		//Textarea
		rows: { type: Number, default: null },
		cols: { type: Number, default: null }
	});

	const type = toRef(props, "type");
	const name = toRef(props, "name");
	// const rows = toRef(props, "rows");
	// const cols = toRef(props, "cols");
	const className = toRef(props, "className");
	// console.log("rows", props.rows);
	// console.log("cols", props.cols);

	const isType = computed(() => !!type);
	const isButton = computed(() => isType && ["submit", "reset", "button"].includes(type.value));
	const isButtonControl = ref(false);
	const isInput = computed(() => isType && ["text", "email", "search", "password"].includes(type.value));
	const isTextarea = computed(() => isType && ["textarea"].includes(type.value));

	watch(type, () => {
		isButtonControl.value = type.value === "submit" || type.value === "button" || type.value === "reset";
	});

	const { value: inputValue, errorMessage, meta, handleBlur, handleChange } = useField(props.name, props.rules, { initialValue: props.value });
</script>

<style lang="scss" scoped>
	.bwd-fc {
		--primary-color: #0071fe;
		--error-color: #f23648;
		--error-bg-color: #fddfe2;
		--success-color: #21a67a;
		--success-bg-color: #e0eee4;

		&,
		& *,
		& *::before,
		& *::after {
			box-sizing: border-box;
		}

		position: relative;
		margin-bottom: calc(1em * 1.5);
		width: 100%;

		label {
			display: block;
			width: 100%;
			margin-bottom: 4px;
		}

		input,
		textarea {
			width: 100%;
			background-color: #f2f5f7;
			padding: 15px 10px;
			outline: none;
			border-radius: 5px;
			border: 2px solid transparent;
			transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out, background-color 0.3s ease-in-out;

			&:focus {
				border-color: var(--primary-color);
			}
		}

		textarea {
			min-height: 100px;
		}

		.help-message {
			position: absolute;
			bottom: calc(-1.5 * 1em);
			left: 0;
			margin: 0;
			font-size: 14px;
		}

		&.has-error {
			input,
			textarea {
				background-color: var(--error-bg-color);
				color: var(--error-color);

				&:focus {
					border-color: var(--error-color);
				}
			}

			.help-message {
				color: var(--error-color);
			}
		}

		&.success {
			input,
			textarea {
				background-color: var(--success-bg-color);
				color: var(--success-color);

				&:focus {
					border-color: var(--success-color);
				}
			}

			.help-message {
				color: var(--success-color);
			}
		}
	}
</style>