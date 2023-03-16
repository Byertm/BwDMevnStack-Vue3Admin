<template>
	<div class="container-fluid main-content-container px-4 pb-4">
		<!-- Error -->
		<div class="error">
			<div class="error__content uk-flex uk-flex-column uk-flex-center uk-flex-middle">
				<h2>500</h2>
				<h3>Something went wrong!</h3>
				<p>There was a problem on our end. Please try again later.</p>
				<router-link to="/" class="uk-button uk-button-link">
					<span uk-icon="home"></span>
					<span> Go Back</span>
				</router-link>
			</div>
		</div>
	</div>
</template>