<template>
	<div v-if="isMe" class="eb-page-container">
		<div class="uk-grid-large uk-grid" uk-grid="">
			<div class="uk-width-1-4@m uk-first-column">
				<div class="uk-box-shadow-small uk-border-rounded uk-padding">
					<div class="uk-block uk-margin-remove uk-text-center">
						<img class="uk-border-rounded uk-box-shadow-small uk-width-1-2" src="/assets/BwD.svg" />
					</div>

					<div class="uk-margin uk-text-center">
						<p class="uk-text-bold uk-margin-remove">{{ getMe.name }}</p>
						<p class="uk-text-muted uk-text-small uk-margin-remove">Administrator</p>
					</div>

					<hr />

					<ul class="uk-list uk-text-small">
						<li class="uk-disabled"><router-link :to="{ path: '/settings' }" data-uk-tooltip="My Profile" data-uk-icon="icon: user" title="My Profile" class="uk-link-secondary uk-icon-link"> My Profile</router-link></li>
						<li class="uk-disabled"><router-link :to="{ path: '/favorites' }" data-uk-tooltip="Favorites" data-uk-icon="icon: star" title="Favorites" class="uk-link-secondary uk-icon-link"> Favorites</router-link></li>
						<li class="uk-disabled">
							<router-link :to="{ path: '/change-password' }" data-uk-tooltip="Change Password" data-uk-icon="icon: lock" title="Change Password" class="uk-link-secondary uk-icon-link"> Change Password</router-link>
						</li>
					</ul>

					<hr />

					<a @click="logout" class="uk-button uk-button-default uk-text-truncate uk-border-rounded uk-width-1-1">
						<i class="fas fa-lock uk-margin-small-right"></i>
						Log Out
					</a>
				</div>
			</div>

			<div class="uk-width-expand@m">
				<h5 class="uk-heading-line"><span>My Profile</span></h5>

				<form @submit.prevent="updateProfile" uk-grid class="uk-child-width-1-1 uk-child-width-1-2@s uk-grid">
					<div class="uk-first-column">
						<label class="uk-form-label" for="">First Name</label>
						<div class="uk-form-controls">
							<input :value="getMe.first_name" type="text" class="uk-input uk-border-rounded" />
						</div>
					</div>

					<div>
						<label class="uk-form-label" for="">Last Name</label>
						<div class="uk-form-controls">
							<input :value="getMe.last_name" type="text" class="uk-input uk-border-rounded" />
						</div>
					</div>

					<!-- <div class="uk-grid-margin uk-first-column">
						<label class="uk-form-label" for="">Phone</label>
						<div class="uk-form-controls">
							<input :value="me.phone" type="text" class="uk-input uk-border-rounded" />
						</div>
					</div> -->

					<div v-if="roleStore.isRoles" class="uk-grid-margin uk-first-column">
						<label class="uk-form-label" for="">Roles</label>
						<select aria-label="Select" multiple class="uk-select">
							<option v-for="role in roles" :key="role.id">{{ role.name }}</option>
						</select>
					</div>

					<div class="uk-grid-margin">
						<label class="uk-form-label" for="">Email</label>
						<div class="uk-form-controls">
							<input :value="getMe.email" type="email" class="uk-input uk-border-rounded" />
						</div>
					</div>

					<input type="hidden" name="id" :value="getMe.id" />

					<!-- <div class="uk-width-1-1 uk-grid-margin">
						<label class="uk-form-label" for="">About Me</label>
						<div class="uk-form-controls">
							<textarea class="uk-textarea uk-border-rounded uk-padding-small" rows="5">Maecenas quis consequat libero, a feugiat eros. Nunc ut lacinia tortor morbi ultricies laoreet ullamcorper phasellus semper</textarea>
						</div>
					</div> -->

					<div class="uk-grid-margin uk-first-column">
						<button type="submit" class="uk-button uk-button-primary uk-border-rounded">Save Changes</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useAuthStore, useUserStore, useRoleStore } from "@/stores";
	import { IRole } from "@models/role";

	const authStore = useAuthStore();
	const userStore = useUserStore();
	const roleStore = useRoleStore();
	const { getRoles, isRoles } = storeToRefs(roleStore);
	const { getMe, isMe } = storeToRefs(userStore);

	const router = useRouter();

	const roles = ref<IRole[]>([]);
	const filteredRoles = ref<IRole[]>([]);

	if (authStore.isNotAuth && !isMe) router.push("/login");

	const logout = () => {
		authStore.logout();
	};

	const updateProfile = () => {};

	watch([() => getRoles.value, () => isRoles.value], (_newValue) => {
		roles.value = getRoles.value || [];
	});

	watch([() => getMe.value, () => isMe.value], (_newValue) => {
		filteredRoles.value = isRoles.value ? getRoles.value.filter((role: IRole) => (isMe.value && getMe.value?.roles ? getMe.value.roles?.findIndex((meRole) => role.id === meRole) > -1 : false)) : [];
	});

	// const getPostTags = (postTags: Partial<ITag>[] | null | undefined) => {
	// 	return !!postTags && !!postTags?.length
	// 		? Array.from(tagList.value)
	// 				.filter((tag) => postTags.findIndex((postTag) => postTag.id === tag.id) > -1)
	// 				.map((tag: Partial<ITag>) => tag.name)
	// 				.join(", ") || "Etiket Bulunamadı"
	// 		: "-";
	// };

	onBeforeMount(() => {
		roleStore.getAll();
	});
</script>

<style scoped></style>