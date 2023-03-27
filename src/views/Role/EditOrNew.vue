<template>
	<div v-if="isErrorRole">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyRole" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Role Name" name="name" help="Bir rol adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Role Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { useRoleStore } from "@/stores";
	import { IRole } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const roleStore = useRoleStore();

	const formData = ref();

	const { role, isRole, isEditingRole, isErrorRole, isEmptyRole } = storeToRefs(roleStore);
	const { loading, errors } = toRefs(role.value);

	const setInitialData = () => {
		formData.value = {};
	};

	watch([() => role.value.data?.id, () => isEditingRole.value], () => {
		if (isEditingRole.value && isRole.value) formData.value = { name: role.value.data?.name, isActive: role.value.data?.isActive };
		else setInitialData();
	});

	const editRole = (editedRole: Partial<IRole>) => {
		if (isRole.value && role.value.data)
			return roleStore
				.updateRole({ ...role.value.data, name: editedRole.name, isActive: editedRole.isActive })
				.then(() => {
					router.push("/role");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni role eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newRole = (role: Partial<IRole>) => {
		return roleStore
			.newRole(role)
			.then(() => {
				router.push("/role");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { name, isActive } = fields;

		if (isEditingRole.value) editRole({ name, isActive });
		else newRole({ name, isActive });
	};
</script>

<style scoped></style>