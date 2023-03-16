<template>
	<!-- CONTENT -->
	<div id="content" data-uk-height-viewport="expand: true">
		<div class="uk-container uk-container-expand">
			<slot name="default"></slot>

			<!-- <router-view v-slot="{ Component }">
				<transition name="committee" appear>
					<component :is="Component" />
				</transition>
			</router-view> -->

			<Footer></Footer>
		</div>
	</div>
	<!-- /CONTENT -->
</template>

<script setup lang="ts">
	import Footer from "@components/layout/Default/Footer.vue";
</script>

<style lang="scss">
	.committee-enter-from {
		opacity: 0;
		transform: translateX(-3rem);
	}

	.committee-enter-active {
		transition: all 0.5s ease-in;
	}

	.committee-enter-to {
		opacity: 1;
		transform: translateX(0);
	}
</style>

<style scoped></style>