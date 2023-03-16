<template>
	<main class="auth uk-cover-container uk-background-secondary uk-flex uk-flex-center uk-flex-middle uk-height-viewport uk-overflow-hidden uk-light" data-uk-height-viewport>
		<!-- overlay -->
		<div class="uk-position-cover uk-overlay-primary"></div>
		<!-- /overlay -->

		<!-- Content -->
		<slot />
		<!-- Content -->

		<Footer />
	</main>
</template>

<script setup lang="ts">
	import Footer from "@components/layout/Auth/Footer.vue";

	// import UIkit from "uikit";
	// import { onBeforeMount, onBeforeUnmount } from "vue";

	// const wrapperElementAttrAndClassProps = (addOrRemove: boolean) => {
	// 	const el = document.querySelector("#app"); // document.body
	// 	if (!!el) {
	// 		if (addOrRemove) {
	// 			el.classList.value = "auth uk-cover-container uk-background-secondary uk-flex uk-flex-center uk-flex-middle uk-height-viewport uk-overflow-hidden uk-light";
	// 			el.setAttribute("data-uk-height-viewport", "");
	// 			// UIkit.heightMatch(el, {});
	// 		} else {
	// 			el.classList.value = "";
	// 			el.removeAttribute("data-uk-height-viewport");
	// 		}
	// 	}
	// };

	// onBeforeMount(() => {
	// 	wrapperElementAttrAndClassProps(true);
	// });

	// onBeforeUnmount(() => {
	// 	wrapperElementAttrAndClassProps(false);
	// });
</script>

<style>
	:root {
		--clr-danger: #f0506e;
	}

	.uk-form-danger,
	.uk-form-danger:focus {
		color: var(--clr-danger) !important;
		border-color: var(--clr-danger) !important;
	}

	.invalid-feedback {
		color: var(--clr-danger);
		text-indent: 1rem;
	}
</style>

<style lang="scss" scoped>
	/* Background Image Media Queries */
	main.auth {
		background-image: url("//picsum.photos/640/700/?image=1044");
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	@media screen and (min-width: 640px) {
		main.auth {
			background-image: url("//picsum.photos/960/700/?image=1044");
		}
	}

	@media screen and (min-width: 960px) {
		main.auth {
			background-image: url("//picsum.photos/1200/900/?image=1044");
		}
	}

	@media screen and (min-width: 1200px) {
		main.auth {
			background-image: url("//picsum.photos/1600/950/?image=1044");
		}
	}

	@media screen and (min-width: 1600px) {
		main.auth {
			background-image: url("//picsum.photos/2000/1050/?image=1044");
		}
	}
</style>