<template>
	<!-- LEFT BAR -->
	<aside id="left-col" class="uk-light uk-visible@m">
		<div class="left-logo uk-flex uk-flex-middle uk-flex-center">
			<router-link to="/" class="uk-logo uk-flex uk-flex-middle uk-flex-center"><img src="/assets/BwD.svg" alt="" class="custom-logo uk-margin-small-right" /> BwD Admin</router-link>
			<router-link to="#" class="skip-to-content">İçeriğe Geç</router-link>
		</div>

		<div class="left-content-box content-box-dark">
			<router-link to="/" class="uk-logo uk-flex uk-flex-column uk-flex-middle uk-flex-center"><img src="/assets/BwD.svg" alt="" class="uk-border-circle profile-img" /></router-link>

			<h4 v-if="isMe && getMe" class="uk-text-center uk-margin-remove-vertical text-light">{{ getMe.name }}</h4>

			<div class="mouse-tracker uk-flex uk-margin-auto uk-flex-center">
				<div class="uk-margin-small-right">X: {{ x }}</div>
				<div class="uk-margin-small-left">Y: {{ y }}</div>
			</div>

			<div class="uk-position-relative uk-text-center uk-display-block">
				<a href="#" class="uk-text-small uk-text-muted uk-display-block uk-text-center" data-uk-icon="icon: triangle-down; ratio: 0.7">Admin</a>
				<!-- user dropdown -->
				<div class="uk-dropdown user-drop" data-uk-dropdown="mode: click; pos: bottom-center; animation: uk-animation-slide-bottom-small; duration: 150">
					<ul class="uk-nav uk-dropdown-nav uk-text-left">
						<li>
							<router-link :to="{ path: '/' }"><span data-uk-icon="icon: home"></span> Home</router-link>
						</li>
						<li class="uk-disabled">
							<router-link :to="{ path: '/edit' }"><span data-uk-icon="icon: pencil"></span> Edit</router-link>
						</li>
						<li class="uk-disabled">
							<router-link :to="{ path: '/settings' }"><span data-uk-icon="icon: settings"></span> Configuration</router-link>
						</li>
						<li class="uk-nav-divider"></li>
						<li>
							<router-link :to="{ path: '/profile' }"><span data-uk-icon="icon: image"></span> Your Profile</router-link>
						</li>
						<li class="uk-nav-divider"></li>
						<li>
							<a @click="() => emit('logout')"><span data-uk-icon="icon: sign-out"></span> Logout</a>
						</li>
					</ul>
				</div>
				<!-- /user dropdown -->
			</div>
		</div>

		<div class="left-nav-wrap">
			<ul data-uk-nav class="uk-nav uk-nav-default uk-nav-parent-icon">
				<li class="uk-nav-header">ACTIONS</li>
				<!-- Todo: Bu kısımdaki kod ayrı bir komponent yapılıp, childrenlarda kontrol edilebilir. -->
				<template v-for="(sI, sIndex) in sidebarItems" :key="sIndex">
					<li :class="{ 'uk-disabled': sI.disabled && !sI.visible }">
						<router-link :to="{ path: sI.to ? sI.to.name : '/' }" :tabindex="sIndex"><span :data-uk-icon="`icon: ${sI.icon}`" class="uk-margin-small-right"></span> {{ sI.title }}</router-link>
					</li>
				</template>
				<!-- <li class="uk-parent">
					<router-link :to="{ path: '#posts' }"><span data-uk-icon="icon: album" class="uk-margin-small-right"></span> Posts</router-link>
					<ul class="uk-nav-sub">
						<li>
							<router-link :to="{ path: '/post' }"><span data-uk-icon="icon: list" class="uk-margin-small-right"></span> List</router-link>
						</li>
						<li>
							<router-link :to="{ path: '/new' }"><span data-uk-icon="icon: pencil" class="uk-margin-small-right"></span> New</router-link>
						</li>
					</ul>
				</li> -->
				<li class="uk-parent">
					<router-link :to="{ path: '#templates' }"><span data-uk-icon="icon: copy" class="uk-margin-small-right"></span> Templates</router-link>
					<ul class="uk-nav-sub">
						<li><a title="Article" target="_blank" href="//zzseba78.github.io/Kick-Off/article.html">Article</a></li>
						<li><a title="Album" target="_blank" href="//zzseba78.github.io/Kick-Off/album.html">Album</a></li>
						<li><a title="Cover" target="_blank" href="//zzseba78.github.io/Kick-Off/cover.html">Cover</a></li>
						<li><a title="Cards" target="_blank" href="//zzseba78.github.io/Kick-Off/cards.html">Cards</a></li>
						<li><a title="News Blog" target="_blank" href="//zzseba78.github.io/Kick-Off/newsBlog.html">News Blog</a></li>
						<li><a title="Price" target="_blank" href="//zzseba78.github.io/Kick-Off/price.html">Price</a></li>
						<li><a title="Login" target="_blank" href="//zzseba78.github.io/Kick-Off/login.html">Login</a></li>
						<li><a title="Login-Dark" target="_blank" href="//zzseba78.github.io/Kick-Off/login-dark.html">Login - Dark</a></li>
					</ul>
				</li>
				<li class="uk-parent uk-disabled">
					<router-link :to="{ path: '#reports' }"><span data-uk-icon="icon: warning" class="uk-margin-small-right"></span> Reports</router-link>
					<ul class="uk-nav-sub">
						<li>
							<router-link :to="{ path: '/sub-item-1' }"><span data-uk-icon="icon: list" class="uk-margin-small-right"></span> List</router-link>
						</li>
						<li>
							<router-link :to="{ path: '/sub-item-2' }"><span data-uk-icon="icon: list" class="uk-margin-small-right"></span> New</router-link>
						</li>
					</ul>
				</li>
			</ul>

			<div class="left-content-box uk-margin-top">
				<h5>Daily Reports</h5>

				<div>
					<span class="uk-text-small">Traffic <small>(+50)</small></span>
					<progress value="50" max="100" class="uk-progress"></progress>
				</div>

				<div>
					<span class="uk-text-small">Income <small>(+78)</small></span>
					<progress value="78" max="100" class="uk-progress success"></progress>
				</div>

				<div>
					<span class="uk-text-small">Feedback <small>(-12)</small></span>
					<progress value="12" max="100" class="uk-progress warning"></progress>
				</div>
			</div>
		</div>

		<div class="bar-bottom">
			<ul data-uk-grid class="uk-subnav uk-flex uk-flex-center uk-child-width-1-5">
				<li><router-link :to="{ path: '/' }" data-uk-tooltip="Home" data-uk-icon="icon: home" title="Home" class="uk-icon-link"></router-link></li>
				<li class="uk-disabled"><router-link :to="{ path: '/settings' }" data-uk-tooltip="Settings" data-uk-icon="icon: settings" title="Settings" class="uk-icon-link"></router-link></li>
				<li class="uk-disabled"><router-link :to="{ path: '/social' }" data-uk-tooltip="Social" data-uk-icon="icon: social" title="Social" class="uk-icon-link"></router-link></li>
				<li><a class="uk-icon-link" data-uk-tooltip="Sign out" data-uk-icon="icon: sign-out" @click="emit('logout')"></a></li>
			</ul>
		</div>
	</aside>
	<!-- /LEFT BAR -->
</template>

<script setup lang="ts">
	import { useMouse } from "@src/composables/mouse-tracker";
	import { IUser } from "@models/index";

	const { x, y } = useMouse();
	const emit = defineEmits(["logout"]);

	const props = defineProps({
		sidebarItems: { type: Array<any>, required: true },
		isMe: { type: Boolean, required: true }
	});

	const getMe: any = inject("getMe");
</script>

<style scoped></style>