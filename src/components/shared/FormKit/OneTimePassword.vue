<template>
	<input v-for="index in digits" maxlength="1" :class="context.classes.digit" :value="tmp[index - 1] || ''" @input="handleInput(index - 1, $event)" @focus="handleFocus" @paste="handlePaste" />
</template>

<script setup lang="ts">
	const props = defineProps<{ context: any }>();

	const digits = Number(props.context.digits);
	const tmp = ref(props.context.value || "");

	/**
	 * Handle input, advancing or retreating focus.
	 */
	function handleInput(index: number, e: any) {
		const prev = tmp.value;

		if (tmp.value.length <= index) tmp.value = "" + tmp.value + e.target.value;
		else tmp.value = "" + tmp.value.substr(0, index) + e.target.value + tmp.value.substr(index + 1);

		const inputs = e.target.parentElement.querySelectorAll("input");

		if (index < digits - 1 && tmp.value.length >= prev.length) inputs.item(index + 1).focus();
		else if (index > 0 && tmp.value.length < prev.length) inputs.item(index - 1).focus();

		if (tmp.value.length === digits) props.context.node.input(tmp.value);
		else if (tmp.value.length < digits && props.context.value !== "") props.context.node.input("");
	}

	/**
	 * On focus, select the text in our input.
	 */
	function handleFocus(e: any) {
		e.target.select();
	}

	/**
	 * Handle the paste event.
	 */
	function handlePaste(e: any) {
		const paste = e.clipboardData.getData("text");
		if (typeof paste === "string") {
			tmp.value = paste.substr(0, digits);
			const inputs = e.target.parentElement.querySelectorAll("input");
			inputs.item(tmp.value.length - 1).focus();
		}
	}
</script>