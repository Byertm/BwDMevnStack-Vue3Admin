<template>
	<component :is="layout">
		<router-view />

		<!-- <router-view v-slot="{ Component }">
			<transition name="slide-left">
				<component :is="Component" />
			</transition>
		</router-view> -->
	</component>
</template>

<style lang="scss">
	.bounce-enter-active {
		animation: bounce-in 0.5s;
	}

	.bounce-leave-active {
		animation: bounce-in 0.5s reverse;
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.25);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes rotate {
		0% {
			opacity: 0;
			transform: scale(0) rotate(-180deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(0deg);
		}
	}

	.rotate-enter-active {
		animation: rotate 0.2s;
	}

	.rotate-leave-active {
		animation: rotate 0.2s reverse;
	}
</style>

<style lang="scss">
	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateX(20px);
		opacity: 0;
	}

	.slide-left-enter-active {
		transition: translate 0.3s ease-out, opacity 0.3s ease-out;
	}

	.slide-left-leave-active {
		transition: translate 0.3s cubic-bezier(1, 0.5, 0.8, 1), opacity 0.3s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-left-enter-from,
	.slide-left-leave-to {
		translate: 0 20px;
		opacity: 0;
	}
</style>

<style lang="scss">
	.json {
		white-space: break-spaces;
		word-break: break-all;
	}
</style>

<script setup lang="ts">
	import DefaultLayout from "@layouts/Default.vue";

	const layout = ref();
	const route = useRoute();

	watch(
		() => route.meta?.layout as string | undefined,
		async (metaLayout) => {
			try {
				// console.log("metaLayout", metaLayout);
				const component = metaLayout && (await import(/* @vite-ignore */ `./layouts/${metaLayout}.vue`));
				layout.value = markRaw(component?.default || DefaultLayout);
			} catch (e) {
				layout.value = markRaw(DefaultLayout);
			}
		},
		{ immediate: true }
	);
</script>

<style lang="scss">
	// 1. Your custom variables and variable overwrites.
	$global-link-color: #da7d02;

	// 2. Import default variables and available mixins.
	// @import "~/node_modules/uikit/src/scss/variables-theme";
	// @import "~/node_modules/uikit/src/scss/mixins-theme";

	// 3. Your custom mixin overwrites.
	// @mixin hook-card() {
	// 	color: #000;
	// }

	// 4. Import UIkit.
	// @import "~/node_modules/uikit/src/scss/uikit-theme";

	// Some font smoothing
	html {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}
</style>