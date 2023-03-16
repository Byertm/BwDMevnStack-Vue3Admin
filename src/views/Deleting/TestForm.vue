<template>
	<div class="uk-width-medium uk-padding-small uk-position-z-index" uk-scrollspy="cls: uk-animation-fade">
		<div>{{ route?.meta?.title || "Test Form" }}</div>

		<BwdEditOrNewForm :schema="schema" title="Test Form" @submit-form="onSubmitForm"></BwdEditOrNewForm>
	</div>
</template>

<script setup lang="ts">
	import { string } from "yup";
	import { useRoute } from "vue-router";
	import BwdEditOrNewForm from "@components/shared/Form/BwdEditOrNewForm.vue";
	import { IFormSchema } from "@components/shared/Form/IBwdInput";

	const schema: IFormSchema = {
		fields: [
			{
				id: `iNameId`,
				name: `iName`,
				type: `text`,
				label: "Ad",
				value: "",
				rules: string().required("Ad alanı gerekli!").min(3, "Minimum 3 karakter").max(50, "Maximum 50 karakter"),
				placeholder: "Ad giriniz",
				className: "bwd-input bwd-fc"
			},
			{
				id: `iSurnameId`,
				name: `iSurname`,
				type: `text`,
				label: "Soyad",
				value: "",
				rules: string().required("Soyad alanı gerekli!").min(3, "Minimum 3 karakter").max(50, "Maximum 50 karakter"),
				placeholder: "Soyad giriniz",
				className: "bwd-input bwd-fc"
			},
			{
				id: `iUsernameId`,
				name: `iUsername`,
				type: `text`,
				label: "Kullanıcı Adı",
				value: "",
				rules: string().required("Kullanıcı adı alanı gerekli!").min(3, "Minimum 3 karakter").max(50, "Maximum 50 karakter"),
				placeholder: "Kullanıcı adı giriniz",
				className: "bwd-input bwd-fc"
			},
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
			{
				id: `iPasswordId`,
				name: `iPassword`,
				type: `password`,
				label: "Parola",
				value: "",
				rules: string().required("Parola alanı gerekli!").min(6, "Minimum 6 karakter").max(50, "Maximum 50 karakter"),
				placeholder: "Parola giriniz",
				className: "bwd-input bwd-fc"
			},
			{
				id: `iPasswordRepeatId`,
				name: `iPasswordRepeat`,
				type: `password`,
				label: "Parola Tekrar",
				value: "",
				rules: string().required("Parola tekrar alanı gerekli!").min(6, "Minimum 6 karakter").max(50, "Maximum 50 karakter"),
				placeholder: "Parola tekrarı giriniz",
				className: "bwd-input bwd-fc"
			},
			{
				id: `iExpalinationId`,
				name: `iExpalination`,
				type: `textarea`,
				label: "Açıklama",
				value: "",
				rows: 15,
				rules: string().optional().min(6, "Minimum 6 karakter").max(50, "Maximum 50 karakter"),
				placeholder: "Açıklama giriniz",
				className: "bwd-input bwd-fc"
			},
			{ id: `iSubmitId`, name: `iSubmit`, type: `submit`, label: "Gönder", value: "Gönder", placeholder: "", successMessage: "", className: "bwd-submit" }
		]
	};

	const route = useRoute();

	const onSubmitForm = (values: any) => {
		// console.log(values);
		alert(JSON.stringify(values, null, 2));
	};
</script>

<style scoped></style>