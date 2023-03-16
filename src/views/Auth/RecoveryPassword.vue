<template>
	<div class="uk-width-medium uk-padding-small uk-position-z-index" uk-scrollspy="cls: uk-animation-fade">
		<div class="uk-text-center uk-margin">
			<!-- <img alt="Logo" src="//zzseba78.github.io/Kick-Off/img/login-logo.svg" /> -->
			<img alt="Logo" src="/assets/BwD.svg" />
		</div>

		<!-- recover password -->
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
					<label><input class="uk-checkbox" type="checkbox" /> Keep me logged in</label>
				</div>

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
		<!-- /recover password -->

		<!-- <BwdEditOrNewForm :schema="schemaBwd" title="" @submit-form="onSubmitForm"></BwdEditOrNewForm> -->

		<hr class="uk-divider-icon" />

		<!-- action buttons -->
		<div>
			<div class="uk-text-center">
				<router-link :to="{ path: '/register' }" data-uk-tooltip title="Back to Login">Register</router-link>
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
	import { Form, Field } from "vee-validate";
	import BwdEditOrNewForm from "@components/shared/Form/BwdEditOrNewForm.vue";

	import { useAuthStore } from "@/stores";
	import router from "@router/index";
	import toast from "@utils/toast";
	import { IFormSchema } from "@components/shared/Form/IBwdInput";

	const authStore = useAuthStore();

	// redirect to home if already logged in
	if (!!authStore.user) router.push("/");

	const schema = object().shape({
		email: string().email().required("Email is required")
	});

	const schemaBwd: IFormSchema = {
		fields: [
			{
				id: `iEmailId`,
				name: `iEmail`,
				type: `email`,
				label: "E-Posta",
				value: "",
				rules: string().required("E-Posta alanı gerekli!").email("Geçerli bir e-posta adresi giriniz."),
				placeholder: "E-Posta adresi giriniz",
				className: "bwd-input bwd-fc"
			},
			{ id: `iSubmitId`, name: `iSubmit`, type: `submit`, label: "Gönder", value: "Gönder", placeholder: "", successMessage: "", className: "bwd-submit" }
		]
	};

	const onSubmitForm = (values: any) => {
		console.log(values);
		alert(values);
	};

	function onSubmit(values: any, { setErrors }: any) {
		const { email } = values;
		return authStore
			.recoveryPassword(email)
			.then(() => {

				toast({ message: `<span uk-icon='icon: check'></span> İsteğiniz başarıyla iletildi!`, status: "success" });
			})
			.catch((error) => setErrors({ apiError: error }));
	}
</script>

<style scoped></style>