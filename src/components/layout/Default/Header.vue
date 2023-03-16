<template>
	<!--HEADER-->
	<header id="top-head" class="uk-position-fixed">
		<div class="uk-container uk-container-expand uk-background-primary">
			<nav class="uk-navbar uk-light" data-uk-navbar="mode:click; duration: 250">
				<div class="uk-navbar-left">
					<div class="uk-navbar-item uk-hidden@m">
						<router-link to="/" class="uk-navbar-item uk-logo"><img src="/assets/vue.svg" alt="" class="custom-logo" /> Logo</router-link>
						<router-link to="#" class="skip-to-content">İçeriğe Geç</router-link>
					</div>

					<ul class="uk-navbar-nav uk-visible@m">
						<li>
							<router-link :to="{ path: '/main' }"><span data-uk-icon="icon: home"></span> Home</router-link>
						</li>
						<li class="uk-disabled">
							<router-link :to="{ path: '/accounts' }"><span data-uk-icon="icon: users"></span> Accounts</router-link>
						</li>
						<li>
							<router-link :to="{ path: '#' }"><span data-uk-icon="icon: triangle-down"></span> Settings</router-link>

							<div class="uk-navbar-dropdown">
								<ul class="uk-nav uk-navbar-dropdown-nav">
									<li class="uk-nav-header">YOUR ACCOUNT</li>
									<!-- <li class="uk-disabled">
										<router-link :to="{ path: '/summary' }"><span data-uk-icon="icon: info"></span> Summary</router-link>
									</li>
									<li class="uk-disabled">
										<router-link :to="{ path: '/refresh' }"><span data-uk-icon="icon: refresh"></span> Edit</router-link>
									</li>
									<li class="uk-disabled">
										<router-link :to="{ path: '/settings' }"><span data-uk-icon="icon: settings"></span> Configuration</router-link>
									</li>
									<li class="uk-nav-divider"></li> -->
									<li>
										<router-link :to="{ path: '/profile' }"><span data-uk-icon="icon: image"></span> Your Profile</router-link>
									</li>

									<li class="uk-nav-divider"></li>
									<template v-for="(sI, sIndex) in sidebarItems" :key="sIndex">
										<li :class="{ 'uk-disabled': sI.disabled && !sI.visible }">
											<router-link :to="{ path: sI.to ? sI.to.name : '/' }" :tabindex="sIndex"><span :data-uk-icon="`icon: ${sI.icon}`" class="uk-margin-small-right"></span> {{ sI.title }}</router-link>
										</li>
									</template>

									<li class="uk-nav-divider"></li>
									<li>
										<a @click="emit('logout')"><span data-uk-icon="icon: sign-out"></span> Logout</a>
									</li>
								</ul>
							</div>
						</li>
					</ul>

					<div class="uk-navbar-item uk-visible@s">
						<form @submit.prevent="searchFn" class="uk-search uk-search-default">
							<span data-uk-search-icon></span>
							<input v-model="iSearch" type="search" placeholder="Ara..." class="uk-search-input search-field" />
						</form>
					</div>
				</div>

				<div class="uk-navbar-right">
					<ul class="uk-navbar-nav">
						<li><router-link :to="{ path: '/profile' }" data-uk-tooltip data-uk-icon="icon: user" title="Your Profile"></router-link></li>
						<li class="uk-disabled"><router-link :to="{ path: '/settings' }" data-uk-tooltip data-uk-icon="icon: settings" title="Settings"></router-link></li>
						<li><theme-switcher></theme-switcher></li>
						<li><a @click="emit('logout')" data-uk-icon="icon: sign-out" title="Sign Out" data-uk-tooltip></a></li>
						<li><a data-uk-toggle data-uk-navbar-toggle-icon href="#offcanvas-nav" title="Offcanvas" data-uk-tooltip class="uk-navbar-toggle"></a></li>
					</ul>
				</div>
			</nav>
		</div>
	</header>
	<!--/HEADER-->
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import ThemeSwitcher from "../Shared/ThemeSwitcher.vue";

	const iSearch = ref("");

	const emit = defineEmits(["logout"]);

	const props = defineProps({ sidebarItems: { type: Array<any>, required: true } });

	const searchFn = () => {
		alert(iSearch.value);
	};
</script>

<style scoped></style>