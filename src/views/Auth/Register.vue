<template>
	<div class="uk-width-medium uk-padding-small uk-position-z-index" uk-scrollspy="cls: uk-animation-fade">
		<div class="uk-text-center uk-margin">
			<!-- <img alt="Logo" src="//zzseba78.github.io/Kick-Off/img/login-logo.svg" /> -->
			<img alt="Logo" src="/assets/BwD.svg" />
		</div>

		<!-- login -->
		<Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }" class="toggle-class">
			<fieldset class="uk-fieldset">
				<div class="uk-margin-small">
					<div class="uk-inline uk-width-1-1">
						<label class="uk-form-label uk-hidden">Email</label>
						<span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"></span>
						<Field name="email" type="email" class="uk-input uk-border-pill" :class="{ 'uk-form-danger': errors.email }" />
					</div>
					<div class="invalid-feedback">{{ errors.email }}</div>
				</div>

				<div class="uk-margin-small">
					<div class="uk-inline uk-width-1-1">
						<label class="uk-form-label uk-hidden">Username</label>
						<span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
						<Field name="username" type="text" class="uk-input uk-border-pill" :class="{ 'uk-form-danger': errors.username }" />
					</div>
					<div class="invalid-feedback">{{ errors.username }}</div>
				</div>

				<div class="uk-margin-small">
					<div class="uk-inline uk-width-1-1">
						<label class="uk-form-label uk-hidden">First Name</label>
						<span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
						<Field name="first_name" type="text" class="uk-input uk-border-pill" :class="{ 'uk-form-danger': errors.first_name }" />
					</div>
					<div class="invalid-feedback">{{ errors.first_name }}</div>
				</div>

				<div class="uk-margin-small">
					<div class="uk-inline uk-width-1-1">
						<label class="uk-form-label uk-hidden">Last Name</label>
						<span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
						<Field name="last_name" type="text" class="uk-input uk-border-pill" :class="{ 'uk-form-danger': errors.last_name }" />
					</div>
					<div class="invalid-feedback">{{ errors.last_name }}</div>
				</div>

				<div class="uk-margin-small">
					<div class="uk-inline uk-width-1-1">
						<label class="uk-form-label uk-hidden">Password</label>
						<span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
						<Field name="password" type="password" class="uk-input uk-border-pill" :class="{ 'uk-form-danger': errors.password }" />
					</div>
					<div class="invalid-feedback">{{ errors.password }}</div>
				</div>

				<!-- <div class="uk-margin-small">
					<label><input class="uk-checkbox" type="checkbox" /> Keep me logged in</label>
				</div> -->

				<div class="uk-margin-small">
					<button :disabled="isSubmitting" class="uk-button uk-button-primary uk-border-pill uk-width-1-1">
						<span v-show="isSubmitting" uk-spinner="ratio: 0.8"></span>
						Login
					</button>
				</div>

				<hr v-if="errors.apiError" class="uk-divider-icon" />

				<div v-if="errors.apiError" uk-alert class="uk-alert-danger">
					<a uk-close class="uk-alert-close"></a>
					<p>{{ errors.apiError }}</p>
				</div>
			</fieldset>
		</Form>
		<!-- /login -->

		<hr class="uk-divider-icon" />

		<!-- action buttons -->
		<div>
			<div class="uk-text-center">
				<router-link :to="{ path: '/forgot-password' }" data-uk-tooltip title="Forgot your password?">Forgot your password?</router-link>
				<router-link :to="{ path: '/login' }" data-uk-tooltip title="Back to Login">Back to Login</router-link>
				<!-- <a class="uk-link-reset uk-text-small toggle-class" data-uk-toggle="target: .toggle-class ;animation: uk-animation-fade">Forgot your password?</a>
					<a class="uk-link-reset uk-text-small toggle-class" data-uk-toggle="target: .toggle-class ;animation: uk-animation-fade" hidden><span data-uk-icon="arrow-left"></span> Back to Login</a> -->
			</div>
		</div>
		<!-- action buttons -->
	</div>
</template>

<script setup lang="ts">
	import { object, string } from "yup";
	import { useRoute } from "vue-router";
	import { Form, Field } from "vee-validate";
	import { useAuthStore } from "@/stores";
	import router from "@router/index";
	import toast from "@utils/toast";

	const route = useRoute();
	const authStore = useAuthStore();

	// redirect to home if already logged in
	if (!!authStore.user) router.push("/");

	const schema = object().shape({
		email: string().email().required().label("Email"),
		username: string().required().label("Username"),
		first_name: string().required().label("Firstname"),
		last_name: string().required().label("Lastname"),
		password: string().required().label("Password")
	});

	function onSubmit(values: any, { setErrors }: any) {
		const { email, username, first_name, last_name, password } = values;
		return authStore
			.register(email, username, first_name, last_name, password)
			.then(() => {

				router.push((route?.query?.returnUrl as string | undefined) || "/");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla giriş yaptınız!`, status: "success" });
			})
			.catch((error) => setErrors({ apiError: error }));
	}
</script>

<style scoped></style>