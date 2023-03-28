<template>
	<Header :sidebar-items="sidebarItems" @logout="logout"></Header>

	<Aside :sidebar-items="sidebarItems" :is-me="isMe" @logout="logout"></Aside>

	<Content>
		<slot name="default"></slot>
	</Content>

	<OffCanvas></OffCanvas>
</template>

<script setup lang="ts">
	import getSidebarItems from "@/data/sidebar-nav-items";
	import { useAuthStore, useUserStore } from "@/stores";
	import Header from "@components/layout/Default/Header.vue";
	import Aside from "@components/layout/Default/Aside.vue";
	import Content from "@components/layout/Default/Content.vue";
	import OffCanvas from "@components/layout/Default/OffCanvas.vue";

	const authStore = useAuthStore();
	const userStore = useUserStore();
	const { getMe, isMe } = storeToRefs(userStore);

	provide("getMe", getMe);

	const sidebarItems = getSidebarItems();

	const logout = () => {
		authStore.logout();
	};
</script>

<style lang="scss">
	:root {
		--background-color-primary: #ebebeb;
		--background-color-secondary: #fafafa;
		--accent-color: #cacaca;
		--text-primary-color: #222;
		--element-size: 4rem;
	}

	/* Define styles for the root window with dark - mode preference */
	:root.dark {
		--background-color-primary: #1e1e1e;
		--background-color-secondary: #2d2d30;
		--accent-color: #3f3f3f;
		--text-primary-color: #ddd;
	}

	/* -- Top navigation -- */
	#top-head {
		top: 0;
		left: 0;
		right: 0;
		z-index: 9;
	}

	.skip-to-content {
		position: absolute;
		overflow: hidden;
		width: 1px;
		height: 1px;
		padding: 0;
		border: 0;
		margin: -1px;
		clip: rect(0, 0, 0, 0);
		visibility: inherit;
		white-space: nowrap;

		&:focus {
			z-index: 9999;
			top: 0;
			left: 0;
			display: -webkit - box;
			display: -ms - flexbox;
			display: flex;
			width: auto;
			height: 2.8rem;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center;
			padding: 0 1rem;
			border: 4px solid #0f62fe;
			background-color: #161616;
			clip: auto;
			color: #f4f4f4;
			outline: none;

			@media screen and (min-width: 500px) {
				padding: 0 4.55rem;
			}
		}
	}

	/* Smaller Header */
	.uk-navbar-nav > li > a,
	.uk-navbar-item,
	.uk-navbar-toggle {
		/* navbar height */
		font-size: 0.85rem;
		min-height: 52px;
		padding: 0 8px;
	}

	.navbar-logo {
		background-color: #222a30;
		margin-left: -12px;
	}

	/* Left bar */
	#left-col {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		overflow-x: hidden;
		overflow-y: auto;
		background-color: #222a30;
		width: 240px;
		z-index: 2;
		transition: height 0.3s ease-out;
	}

	/* Left bar links */
	#left-col ul.uk-nav-default > li > a {
		padding: 8px 20px;
		border-left: 2px solid transparent;
		transition: all 0.15s ease-out;
	}

	#left-col ul.uk-nav-default li.uk-nav-header {
		padding: 20px 20px 8px 20px;
	}

	#left-col ul.uk-nav-default > li > a.uk-active,
	#left-col ul.uk-nav-default > li > a:hover,
	#left-col ul.uk-nav-default > li.uk-open > a,
	#left-col ul.uk-nav-default > li.uk-open > a.uk-active {
		border-left: 2px solid #39f;
		padding-left: 30px;
		color: white;
		background-color: rgba(0, 0, 0, 0.1);
	}

	#left-col ul.uk-nav-default li .uk-nav-sub {
		padding-left: 34px;
	}

	#left-col .uk-dropdown.user-drop {
		min-width: 160px;
		max-width: 160px;
		padding: 0.75rem;
	}

	/* Drop arrow */
	#left-col .uk-dropdown.user-drop:after {
		bottom: 100%;
		left: 50%;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		border-color: rgba(255, 255, 255, 0);
		border-bottom-color: #fff;
		border-width: 4px;
		margin-left: -4px;
	}

	.left-content-box {
		padding: 0.75rem 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		margin-bottom: -1px;
	}

	.left-nav-wrap {
		padding-bottom: 60px;
	}

	.content-box-dark {
		background-color: rgba(0, 0, 0, 0.09);
	}

	.text-light {
		font-weight: 200;
		font-size: 1.25rem;
	}

	.bar-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		padding: 15px 0;
		background-color: #222a30;
		position: fixed;
		left: 0;
		right: 0;
		z-index: 3;
		bottom: 0;
		width: 240px;
	}

	.left-logo {
		/* navbar height */
		height: 52px;
		line-height: 52px;
		padding: 0 20px;
	}

	.custom-logo {
		height: 32px;
	}

	.profile-img {
		width: 60px;
		margin: 0 auto 10px auto;
		display: block;
	}

	.panel-icons {
		margin: 0 4px;
	}

	.uk-tooltip {
		background-color: white;
		color: #242c33;
		box-shadow: 0 2px 12px rgba(50, 50, 50, 0.1);
	}

	#content {
		margin-top: 52px;
		padding: 30px 0 0 0;
		// background-color: #f7f7f7;
		background-color: var(--background-color-primary);
		margin-left: 0;
		transition: margin 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	// .uk-card-default {
	// 	background-color: #fff;
	// 	color: #666;
	// 	background-color: var(--background-color-primary);
	// 	color: var(--text-primary-color);
	// 	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
	// }

	.uk-card-default {
		&,
		&.uk-card-hover:hover {
			background-color: var(--background-color-secondary);
		}
	}

	.uk-table-striped tbody tr:nth-of-type(odd),
	.uk-table-striped > tr:nth-of-type(odd) {
		background-color: var(--background-color-primary);
	}

	.uk-card-default,
	.uk-modal-dialog,
	.uk-modal-header {
		background-color: var(--background-color-secondary);
		color: var(--text-primary-color);
	}

	.uk-button-default,
	.uk-h1,
	.uk-h2,
	.uk-h3,
	.uk-h4,
	.uk-h5,
	.uk-h6,
	.uk-heading-2xlarge,
	.uk-heading-large,
	.uk-heading-medium,
	.uk-heading-small,
	.uk-heading-xlarge,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: var(--text-primary-color);
	}

	.uk-modal-container,
	.uk-modal-full {
		.formkit-wrapper,
		.formkit-fieldset {
			max-width: none;
		}
	}

	@media screen and (min-width: 960px) {
		#content {
			/* equal to left-col width */
			margin-left: 240px;
		}

		#top-head {
			/* equal to left-col width */
			left: 240px;
		}
	}

	#top-head [class*="uk-navbar-dropdown-bottom"] {
		margin-top: 0;
	}

	/* Search nav */
	.search-field {
		width: 140px;
		-webkit-transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.search-field:focus {
		width: 200px;
		border-color: #fff !important;
	}

	.uk-card {
		box-shadow: none;
	}

	.uk-heading-primary {
		letter-spacing: -0.032em;
		font-weight: 300;
	}

	/* Smooth shadow transition */
	.uk-card {
		-webkit-transition: box-shadow 0.55s cubic-bezier(0.4, 0, 0.2, 1);
		transition: box-shadow 0.55s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Progress */
	.uk-progress {
		height: 3px;
		margin-bottom: 0.5rem;
		background-color: rgba(0, 0, 0, 0.23);
	}

	* + .uk-progress {
		margin-top: 0.25rem;
	}

	.uk-progress.warning::-webkit-progress-value {
		background-color: #faa05a;
	}

	.uk-progress.warning::-moz-progress-bar {
		background-color: #faa05a;
	}

	.uk-progress.warning::-ms-fill {
		background-color: #faa05a;
	}

	.uk-progress.success::-webkit-progress-value {
		background-color: #32d296;
	}

	.uk-progress.success::-moz-progress-bar {
		background-color: #32d296;
	}

	.uk-progress.success::-ms-fill {
		background-color: #32d296;
	}

	/* Charts */
	.chart-container {
		position: relative;
		height: 300px;
		margin: 0 auto;
	}
</style>