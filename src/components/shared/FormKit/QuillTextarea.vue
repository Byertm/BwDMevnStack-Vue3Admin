<template>
	<div class="custom-quill-wrapper">
		<!-- <QuillEditor toolbar="minimal" theme="snow" v-model="context._value" @text-change="onTextChange($event)" @selection-change="onTextChange($event)" @editor-change="onTextChange($event)" @input="handleInput($event)" @focus="handleFocus" @paste="handlePaste" :class="context.classes" /> -->
		<QuillEditor
			ref="quill"
			toolbar="essential"
			content-type="html"
			theme="snow"
			placeholder="İçerik giriniz..."
			v-model:content="context._value"
			@focus="handleFocus"
			@update:content="handleChange($event)"
			@ready="handleEditorReady($event)"
			:class="context.classes.customQuill" />
	</div>
</template>

<script setup lang="ts">
	import { QuillEditor } from "@vueup/vue-quill";
	import { ref } from "vue";
	import { onDeactivated } from "vue";

	const props = defineProps<{ context: any }>();

	const quill = ref<typeof QuillEditor | null>(null);

	/**
	 * Handle editor ready.
	 */
	function handleEditorReady(e: any) {
		if (props.context._value) e.container.querySelector(".ql-blank").innerHTML = props.context._value;
	}

	const isEmptyEditor = (qValue: any) => {
		return qValue?.getText?.() === "\n" && qValue?.getHTML?.() === "<p><br></p>";
	};

	/**
	 * Handle editor text change.
	 */
	function handleChange(e: string) {
		// if (isEmptyEditor(quill.value)) console.log("quill.value", quill.value);
		props.context.node.input(isEmptyEditor(quill.value) ? "" : e);
	}

	/**
	 * On focus, select the text in our editor.
	 */
	function handleFocus(e: any) {
		// debugger;
		// e.target.select();
	}

	/**
	 * Handle the paste event.
	 */
	function handlePaste(e: any) {
		const paste = e.clipboardData.getData("text");
		if (typeof paste === "string") {
			props.context.value = paste;
			e.target.focus();
		}
	}

	onDeactivated(() => {
		// debugger;
		quill?.value?.setHTML?.("");
	});
</script>

<style lang="scss">
	.custom-quill-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>