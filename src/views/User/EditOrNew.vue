<template>
	<div v-if="isErrorUser">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyUser" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="User First Name" name="first_name" help="Kullanıcı ismini giriniz" validation="required|length:3,250" data-validation-visibility="live" />
		<FormKit type="text" label="User Last Name" name="last_name" help="Kullanıcı soyadı giriniz" validation="required|length:3,250" data-validation-visibility="live" />
		<FormKit type="text" label="User Email" name="email" help="Kullanıcı e-posta giriniz" validation="required|length:3,250" data-validation-visibility="live" />
		<FormKit type="select" label="User Roles" name="roles" :options="roleList" :multiple="true" help="İçerik etiketleri seçiniz" validation="" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Active" name="isActive" validation="" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { FormKitOptionsList } from "@formkit/inputs";
	import { useRoleStore, useUserStore } from "@/stores";
	import { IUser } from "@models/user";
	import router from "@router/index";
	import toast from "@utils/toast";

	const roleStore = useRoleStore();
	const userStore = useUserStore();

	const formData: Ref<Partial<IUser>> = ref({});
	const roleList: Ref<FormKitOptionsList> = ref([]);

	const { getRoles, isRoles } = storeToRefs(roleStore);
	const { user, getUser, isUser, isEditingUser, isErrorUser, isEmptyUser } = storeToRefs(userStore);
	const { loading, errors } = toRefs(user.value);

	const setRoleList = () => {
		if (getRoles.value)
			roleList.value = [
				...getRoles?.value?.map((role) => {
					return { label: role.name, value: { id: role.id, name: role.name }, attrs: { disabled: false } };
				})
			];
	};

	const setInitialData = () => {
		formData.value = {};

		setRoleList();
	};

	const setUser = () => {
		if (isEditingUser.value && isUser.value)
			formData.value = {
				first_name: getUser.value?.first_name,
				last_name: getUser.value?.last_name,
				email: getUser.value?.email,
				roles: getUser.value?.roles,
				isActive: getUser.value?.isActive
			};
		else setInitialData();
	};

	setRoleList();

	watch([() => getRoles.value, () => isRoles.value], () => setRoleList());

	watch([() => getUser.value?.id, () => isEditingUser.value], () => setUser());

	if (!isRoles.value) roleStore.getAll();

	const editUser = (editedUser: Partial<IUser>) => {
		if (isUser.value && getUser.value)
			return userStore
				.updateUser({
					...getUser.value,
					first_name: editedUser.first_name,
					last_name: editedUser.last_name,
					email: editedUser.email,
					roles: editedUser.roles,
					isActive: editedUser.isActive
				})
				.then(() => {
					router.push("/user");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni kullanıcı eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newUser = (user: Partial<IUser>) => {
		return userStore
			.newUser(user)
			.then(() => {
				router.push("/user");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni kullanıcı eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { first_name, last_name, email, roles, isActive } = fields;

		if (isEditingUser.value) editUser({ first_name, last_name, email, roles, isActive });
		else newUser({ first_name, last_name, email, roles, isActive });
	};
</script>

<style scoped></style>