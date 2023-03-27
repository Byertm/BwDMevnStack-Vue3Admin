<template>
	<div class="custom-wang-wrapper">
		<Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" class="custom-wang-toolbar" />
		<Editor
			v-model="context._value"
			:defaultConfig="editorConfig"
			:mode="mode"
			@onCreated="handleCreated"
			@onChange="handleChange"
			@onFocus="handleFocus"
			@onDestroyed="handleDestroyed"
			class="custom-wang"
			:class="context.classes.customWang"
			style="" />
	</div>
</template>

<script setup lang="ts">
	import "@wangeditor/editor/dist/css/style.css"; // import css

	import type { ShallowRef } from "@vue/reactivity";
	import { i18nAddResources, i18nChangeLanguage, i18nGetResources, IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
	import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

	const props = defineProps<{ context: any }>();

	// i18nAddResources("tr", { header: { title: "başlık", text: "metin" } });
	// const resources = i18nGetResources("tr");
	// const resources = i18nGetResources("en");
	i18nChangeLanguage("en");

	const editorRef: ShallowRef<any> = shallowRef();
	const editorConfig: Partial<IEditorConfig> = { placeholder: "Type here..." };
	const allToolbarConfigKeys = [
		"bold",
		"underline",
		"italic",
		"through",
		"code",
		"sub",
		"sup",
		"clearStyle",
		"color",
		"bgColor",
		"fontSize",
		"fontFamily",
		"indent",
		"delIndent",
		"justifyLeft",
		"justifyRight",
		"justifyCenter",
		"justifyJustify",
		"lineHeight",
		"insertImage",
		"deleteImage",
		"editImage",
		"viewImageLink",
		"imageWidth30",
		"imageWidth50",
		"imageWidth100",
		"divider",
		"emotion",
		"insertLink",
		"editLink",
		"unLink",
		"viewLink",
		"codeBlock",
		"blockquote",
		"headerSelect",
		"header1",
		"header2",
		"header3",
		"header4",
		"header5",
		"todo",
		"redo",
		"undo",
		"fullScreen",
		"enter",
		"bulletedList",
		"numberedList",
		"insertTable",
		"deleteTable",
		"insertTableRow",
		"deleteTableRow",
		"insertTableCol",
		"deleteTableCol",
		"tableHeader",
		"tableFullWidth",
		"insertVideo",
		"uploadVideo",
		"editVideoSize",
		"uploadImage",
		"codeSelectLang"
	];
	const toolbarConfig: Partial<IToolbarConfig> = { excludeKeys: ["insertVideo", "uploadVideo", "editVideoSize"] };
	const mode: "default" | "simple" = "simple";

	const isEmptyEditor = (eValue: string): boolean => eValue === "" || eValue === "<p><br></p>";

	const handleCreated = (editor: IDomEditor) => {
		editorRef.value = editor; // record editor instance
	};

	const handleChange = (editor: IDomEditor) => {
		// editor's content or selection changed
		// console.log({ children: editor.children, html: editor.getHtml(), isEmpty: editor.isEmpty() });
		props.context.node.input(editor.isEmpty() && isEmptyEditor(editor.getHtml()) ? "" : editor.getHtml());
	};

	/**
	 * On focus, select the text in our editor.
	 */
	function handleFocus(editor: IDomEditor) {}
	function handleDestroyed(editor: IDomEditor) {}

	/**
	 * Handle the paste event.
	 */
	function handlePaste(editor: IDomEditor, event: any, cb: (i: boolean) => void) {
		// const html = event.clipboardData.getData('text/html') // get paste html
		// const text = event.clipboardData.getData('text/plain') // get paste text
		// const rtf = event.clipboardData.getData('text/rtf') // get paste rtf data (word, wsp...)

		const paste = event.clipboardData.getData("text");
		if (typeof paste === "string") {
			// props.context.value = paste;
			console.log("ClipboardEvent is paste event data", event);

			// Insert your custom text
			editor.insertText("xxx");
			event.preventDefault();
			cb(false);
		}
	}

	onMounted(() => {
		if (props.context._value) editorRef.value = props.context._value || "";
	});

	onBeforeUnmount(() => {
		const editor = editorRef.value;
		if (!!editor) editor.destroy();
	});
</script>

<style lang="scss">
	.custom-wang {
		height: 500px;
		max-height: 800px;
		overflow-y: hidden;

		&-wrapper {
			display: flex;
			flex-direction: column;
			gap: 0.01rem;
			flex: 1;
		}

		&-toolbar {
			border-bottom: 1px solid #f0f0f0;
		}
	}
</style>