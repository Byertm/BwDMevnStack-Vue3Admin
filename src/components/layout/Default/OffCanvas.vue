<template>
	<!-- OFFCANVAS -->
	<div id="offcanvas-nav" data-uk-offcanvas="flip: true; overlay: true">
		<div class="uk-offcanvas-bar uk-offcanvas-bar-animation uk-offcanvas-slide">
			<button type="button" data-uk-close class="uk-offcanvas-close uk-close uk-icon"></button>

			<ul class="uk-nav uk-nav-default">
				<li class="uk-active"><a href="#">Aktif</a></li>
				<li class="uk-parent">
					<router-link :to="{ path: '#' }"><span data-uk-icon="icon: warning" class="uk-margin-small-right"></span> Üst Menü</router-link>
					<ul class="uk-nav-sub">
						<router-link :to="{ path: '/sub-item-1' }"><span data-uk-icon="icon: list" class="uk-margin-small-right"></span> Alt Menü</router-link>
						<router-link :to="{ path: '/sub-item-2' }"><span data-uk-icon="icon: list" class="uk-margin-small-right"></span> Alt Menü</router-link>
					</ul>
				</li>
				<li class="uk-nav-header">Header</li>
				<li>
					<router-link :to="{ path: '#js-options' }"><span data-uk-icon="icon: table" class="uk-margin-small-right"></span> Item</router-link>
				</li>
				<li>
					<router-link :to="{ path: '#js-options' }"><span data-uk-icon="icon: thumbnails" class="uk-margin-small-right"></span> Item</router-link>
				</li>
				<li class="uk-nav-divider"></li>
				<li>
					<router-link :to="{ path: '#js-options' }"><span data-uk-icon="icon: trash" class="uk-margin-small-right"></span> Item</router-link>
				</li>
			</ul>

			<h3>Title</h3>

			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
				consequat.
			</p>
		</div>
	</div>
	<!-- /OFFCANVAS -->
</template>

<script setup lang="ts"></script>

<style scoped></style>