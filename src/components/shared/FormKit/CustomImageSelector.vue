<template>
	<div class="uk-flex uk-flex-column uk-width-full">
		<div class="uk-flex uk-flex-middle uk-position-relative uk-visible-toggle">
			<a
				v-if="!isShowSourceSwitcher"
				uk-icon="icon: pencil"
				title="Image Change"
				data-uk-tooltip
				@click="toggleSelectImagePanel"
				class="uk-form-icon uk-form-icon-flip uk-icon-button uk-button-primary uk-position-z-index uk-invisible-hover uk-custom-icon-hover"
				:class="{ selectorOpened: isShowSelectImagePanel }"></a>

			<div class="uk-flex-1">
				<input :value="props.context._value" @input="handleInput($event)" @focus="handleFocus" @paste="handlePaste" :disabled="true" :class="context.classes.customImage" />
			</div>

			<div v-if="props.context._value" uk-lightbox="animation: slide" class="uk-card">
				<a :href="getApiImageByImageUrl(props.context._value, isExternalImage)" data-attrs="crossorigin: anonymous; width: 1920; height: 1080;" crossorigin="anonymous" :data-caption="props.context.label" class="uk-inline">
					<img :src="getApiImageByImageUrl(props.context._value, isExternalImage)" :alt="props.context.label" crossorigin="anonymous" width="40" height="40" class="uk-border-rounded uk-object-cover" />
				</a>
			</div>
		</div>

		<template v-if="isShowSelectImagePanel">
			<Suspense>
				<template #default>
					<SelectImage @select-image="onHandleSelectImage" :category-name="categoryName"></SelectImage>
				</template>
				<template #fallback>Yükleniyor...</template>
			</Suspense>
		</template>
	</div>
</template>

<script setup lang="ts">
	import type { Ref } from "vue";
	import { ref } from "vue";
	import { defineAsyncComponent } from "vue";
	import { getApiImageByImageUrl } from "@services/file.service";

	const props = defineProps<{ context: any }>();
	const categoryName = props.context.categoryName as string;
	const isShowSourceSwitcher = (props.context.showSourceSwitcher || false) as boolean;

	const isShowSelectImagePanel: Ref<boolean> = ref(false);
	const isExternalImage: Ref<boolean> = ref(isShowSourceSwitcher);

	const SelectImage = defineAsyncComponent({ loader: () => import("@views/FileManagement/SelectImage.vue") });

	const toggleSelectImagePanel = () => {
		isShowSelectImagePanel.value = !isShowSelectImagePanel.value;
	};

	const onHandleSelectImage = (image: any) => {
		isShowSelectImagePanel.value = false;
		const imageUrl = `uploads/manager/${categoryName}/${image.name}.${image.suffix}`;
		props.context.node.input(imageUrl);
	};

	/**
	 * Handle input, advancing or retreating focus.
	 */
	function handleInput(e: any) {
		props.context.node.input(e.target.value);
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
			props.context.value = paste;
			e.target.focus();
		}
	}
</script>

<style lang="scss">
	.uk-custom-icon-hover {
		scale: 0.5;
		translate: 0.5rem -0.5rem;
		transform-origin: top right;

		&.selectorOpened {
			opacity: 0;
			visibility: hidden;
		}

		&:hover {
			scale: 1;
			translate: 0.5rem -0.5rem;
		}
	}

	.formkit-custom-image {
		width: 100%;
		height: 100%;
		min-height: 40px;
		text-indent: 0.5rem;
		border-radius: var(--fk-border-radius) 0 0 var(--fk-border-radius);
		border: none;
	}
</style>