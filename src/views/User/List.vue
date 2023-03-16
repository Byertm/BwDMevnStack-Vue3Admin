<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Users</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalUser" title="New User" data-uk-tooltip data-uk-icon="icon: pencil" @click="newUser" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorUsers">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyUsers" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isUsers" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>User Name</th>
										<th>User First Name</th>
										<th>User Last Name</th>
										<th>User EMail</th>
										<th>User Roles</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="user in users" :key="user.id">
										<td class="uk-width-2-5">{{ user.name }}</td>
										<td class="uk-width-2-5">{{ user.first_name }}</td>
										<td class="uk-width-2-5">{{ user.last_name }}</td>
										<td class="uk-width-2-5">{{ user.email }}</td>
										<td class="uk-width-2-5">{{ getUserRoles(user.roles) }}</td>
										<td class="uk-width-1-5">
											<div @click="setUserStatus(user)">
												<span v-if="user.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(user.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(user.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a href="#modalUser" uk-toggle title="Düzenle" data-uk-tooltip data-uk-icon="icon: pencil" @click="editUser(user.id)" class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="deleteUser(user.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="modalUser" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">Add User</h2>
			</div>

			<div class="uk-modal-body">
				<Suspense>
					<template #default>
						<NewOrEdit></NewOrEdit>
					</template>
					<template #fallback>Yükleniyor</template>
				</Suspense>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import type { Ref } from "vue";
	import { defineAsyncComponent, ref, watch } from "vue";
	import { useUserStore, useRoleStore } from "@/stores";
	import { IRole, IUser } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/User/EditOrNew.vue") });

	const roleList: Ref<any[]> = ref([]);

	const userStore = useUserStore();
	const roleStore = useRoleStore();
	const { isUsers, isEmptyUsers, getUsers: users, isErrorUsers, getUsersErrors: errors } = storeToRefs(userStore);
	const { isRoles, getRoles: roles } = storeToRefs(roleStore);
	userStore.getAll();

	const setRoleList = () => roles.value && (roleList.value = roles.value);

	watch([() => roles.value, () => isRoles.value], () => setRoleList());

	const getUserRoles = (userRoles: Array<Partial<IRole>> | null | undefined) => {
		return !!userRoles && !!userRoles?.length ? userRoles.map((role) => role.name).join(", ") || "Rol Bulunamadı" : "Rol Bulunamadı";
	};

	const setUserStatus = async (post: Partial<IUser>) => {
		await userStore.updateUser({ ...post, isActive: !post.isActive });
	};

	const newUser = async () => {
		await userStore.updateEditingId(null);
	};

	const editUser = async (id: string) => {
		await userStore.updateEditingId(id);
		await userStore.getById(id);
	};

	const deleteUser = async (id: string) => {
		await userStore
			.delete(id)
			.then((v) => {
				if (v) toast({ message: `<span uk-icon='icon: check'></span> İsteğiniz başarıyla gerçekleştirildi.`, status: "success" });
				else toast({ message: `<span uk-icon='icon: ban'></span> İsteğiniz sırasında bir hata oluştu.`, status: "danger" });
			})
			.catch(() => {
				// toast({ message: `<span uk-icon='icon: ban'></span> ${errors.value.forEach((e) => e.message)}.`, status: "danger" });
				toast({ message: `<span uk-icon='icon: ban'></span> İsteğiniz yapılırken bir hata oluştu.`, status: "danger" });
			});
	};
</script>

<style scoped></style>