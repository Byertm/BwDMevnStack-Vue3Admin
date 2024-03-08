<template>
	<div v-if="!isEmptySite && !isErrorSite" class="eb-page-container">
		<div class="uk-grid-large uk-grid" uk-grid="">
			<div class="uk-width-1-4@m uk-first-column">
				<div class="uk-box-shadow-small uk-border-rounded uk-padding">
					<div class="uk-block uk-margin uk-text-center">
						<img v-if="!site?.logo?.imageUrl" src="/assets/BwD.svg" title="Site logosu belirlemek için tıkla" @click="setSiteLogo" class="uk-border-rounded uk-box-shadow-small uk-width-1-2" />
						<a
							v-if="!!site?.logo?.imageUrl"
							:href="getApiImageByImageUrl(site.logo.imageUrl)"
							data-attrs="crossorigin: anonymous; width: 1920; height: 1080;"
							crossorigin="anonymous"
							:data-caption="site.logo?.text"
							class="uk-inline">
							<img :src="getApiImageByImageUrl(site.logo.imageUrl)" :alt="site.logo?.text" data-uk-tooltip :title="site.logo?.text" crossorigin="anonymous" width="50" height="50" class="uk-border-rounded uk-object-cover" />
						</a>
					</div>

					<div class="uk-margin uk-text-center">
						<p class="uk-text-bold uk-margin">{{ site.logo?.text }}</p>
						<!-- <p class="uk-text-muted uk-text-small uk-margin">Administrator</p> -->
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

					<!-- <a @click="logout" class="uk-button uk-button-default uk-text-truncate uk-border-rounded uk-width-1-1">
						<i class="fas fa-lock uk-margin-small-right"></i>
						Log Out
					</a> -->
				</div>
			</div>

			<div class="uk-width-expand@m">
				<h5 class="uk-heading-line"><span uk-icon="icon: cog"></span> <span>Site Settings</span></h5>

				<form @submit.prevent="updateSiteInformation" uk-grid class="uk-child-width-1-1 uk-child-width-1-2@s uk-grid">
					<ul uk-accordion="multiple: true">
						<li v-if="!!site?.logo" class="uk-open">
							<a href="#" class="uk-accordion-title">Logo Settings</a>
							<div class="uk-accordion-content">
								<div class="uk-first-column">
									<label for="i" class="uk-form-label">Logo Text</label>
									<div class="uk-form-controls">
										<input v-model="site.logo.text" type="text" class="uk-input uk-border-rounded" />
									</div>
								</div>

								<div>
									<label for="i" class="uk-form-label">Logo Image</label>
									<div class="uk-form-controls">
										<!-- <input v-model="site.logo.imageUrl" type="text" class="uk-input uk-border-rounded" /> -->
										<FormKit
											type="cis"
											category-name="site"
											label="Site Logo Image Url"
											v-model="site.logo.imageUrl"
											help="About image select"
											validation=""
											data-validation-visibility="live"
											class="uk-input uk-border-rounded" />
									</div>
								</div>
							</div>
						</li>
						<li v-if="!!site?.owner">
							<a href="#" class="uk-accordion-title">Owner Settings</a>
							<div class="uk-accordion-content">
								<ul uk-accordion="multiple: true; collapsible: false">
									<li>
										<a href="#" class="uk-accordion-title">Owner General Settigs</a>
										<div class="uk-accordion-content">
											<div class="uk-margin">
												<label for="iFirstName" class="uk-form-label">First Name</label>
												<div class="uk-form-controls">
													<input v-model="site.owner.firstName" type="text" class="uk-input uk-border-rounded" />
												</div>
											</div>

											<div class="uk-margin">
												<label for="iLastName" class="uk-form-label">Last Name</label>
												<div class="uk-form-controls">
													<input v-model="site.owner.lastName" type="text" class="uk-input uk-border-rounded" />
												</div>
											</div>

											<div class="uk-margin">
												<label for="iFullName" class="uk-form-label">Full Name</label>
												<div class="uk-form-controls">
													<input v-model="getFullName" type="text" disabled readonly class="uk-input uk-border-rounded" />
												</div>
											</div>

											<div class="uk-margin">
												<label for="iBirthDate" class="uk-form-label">Birth Date</label>
												<div class="uk-form-controls">
													<input v-model="site.owner.birthDate" type="text" class="uk-input uk-border-rounded" />
												</div>
											</div>
										</div>
									</li>
									<li v-if="site.owner?.info?.about || site.owner?.info?.titles">
										<a href="#" class="uk-accordion-title">Owner Information Settings</a>
										<div class="uk-accordion-content">
											<ul uk-accordion="multiple: true; collapsible: false">
												<li v-if="site.owner?.info?.about">
													<a href="#" class="uk-accordion-title">Owner Info About Settigs</a>
													<div class="uk-accordion-content">
														<div class="uk-margin">
															<label for="iFirstName" class="uk-form-label">About Full Text</label>
															<div class="uk-form-controls">
																<input v-model="site.owner.info.about.full" type="text" class="uk-input uk-border-rounded" />
															</div>
														</div>

														<div class="uk-margin">
															<label for="iFirstName" class="uk-form-label">About Short Text</label>
															<div class="uk-form-controls">
																<input v-model="site.owner.info.about.short" type="text" class="uk-input uk-border-rounded" />
															</div>
														</div>

														<div class="uk-margin">
															<label for="iFirstName" class="uk-form-label">About Title</label>
															<div class="uk-form-controls">
																<input v-model="site.owner.info.about.title" type="text" class="uk-input uk-border-rounded" />
															</div>
														</div>

														<div class="uk-margin">
															<label for="iFirstName" class="uk-form-label">About Video Url</label>
															<div class="uk-form-controls">
																<input v-model="site.owner.info.about.videoUrl" type="text" class="uk-input uk-border-rounded" />
															</div>
														</div>

														<div class="uk-margin">
															<label for="iFirstName" class="uk-form-label">About Image Url</label>
															<div class="uk-form-controls">
																<!-- <input v-model="site.owner.info.about.imageUrl" type="text" class="uk-input uk-border-rounded" /> -->
																<FormKit
																	type="cis"
																	category-name="about"
																	label="Site Logo Image Url"
																	v-model="site.owner.info.about.imageUrl"
																	help="About image select"
																	validation=""
																	data-validation-visibility="live"
																	class="uk-input uk-border-rounded" />
															</div>
														</div>
													</div>
												</li>
												<li v-if="site.owner?.info?.titles">
													<a href="#" class="uk-accordion-title">Owner Info Titles Settigs</a>
													<div class="uk-accordion-content">
														<div class="uk-margin">
															<label for="iSocialMedias" class="uk-form-label">Owner Info Titles</label>

															<div class="uk-form-controls">
																<div v-for="(title, tIndex) in site.owner.info.titles" class="uk-margin">
																	<label for="iSocialMedias" class="uk-form-label">Owner Info Titles</label>

																	<div class="uk-form-controls">
																		<input v-model="title.icon" placeholder="Icon" type="text" class="uk-input uk-border-rounded" />
																		<input v-model="title.name" placeholder="Name" type="text" class="uk-input uk-border-rounded" />
																	</div>

																	<button type="button" @click="() => removeTitle(tIndex)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></button>
																</div>

																<button type="button" title="Add Social Media" data-uk-tooltip data-uk-icon="icon: plus" @click="addNewTitle" class="uk-icon-button uk-button-primary"></button>
															</div>
														</div>
													</div>
												</li>
											</ul>
										</div>
									</li>
									<li>
										<a href="#" class="uk-accordion-title">Owner Contacts Settings</a>
										<div class="uk-accordion-content">
											<div v-if="!!site.owner?.contacts?.address" class="uk-margin">
												<label for="iContacts" class="uk-form-label">Contacts</label>
												<div class="uk-form-controls">
													<fieldset>
														<input v-model="site.owner.contacts.address.full" placeholder="Full Address" type="text" class="uk-input uk-border-rounded" />
														<input v-model="site.owner.contacts.address.lonlat" placeholder="Address Longitude Latitude" type="text" class="uk-input uk-border-rounded" />
														<input v-model="site.owner.contacts.address.short" placeholder="Short Address" type="text" class="uk-input uk-border-rounded" />
													</fieldset>
													<input v-model="site.owner.contacts.email" placeholder="E-Mail Address" type="text" class="uk-input uk-border-rounded" />
													<input v-model="site.owner.contacts.phone" placeholder="Phone" type="text" class="uk-input uk-border-rounded" />
													<input v-model="site.owner.contacts.website" placeholder="Web Site Url" type="text" class="uk-input uk-border-rounded" />
												</div>
											</div>
										</div>
									</li>
									<li>
										<a href="#" class="uk-accordion-title">Owner Social Medias Settings</a>
										<div class="uk-accordion-content">
											<div class="uk-margin">
												<label for="iSocialMedias" class="uk-form-label">Social Medias</label>

												<div class="uk-form-controls">
													<div v-for="(sm, smIndex) in site.owner.socialMedias" class="uk-margin">
														<label for="iSocialMedias" class="uk-form-label">Social Medias</label>

														<div class="uk-form-controls">
															<input v-model="sm.icon" placeholder="Icon" type="text" class="uk-input uk-border-rounded" />
															<input v-model="sm.name" placeholder="Name" type="text" class="uk-input uk-border-rounded" />
															<input v-model="sm.url" placeholder="Url" type="text" class="uk-input uk-border-rounded" />
														</div>

														<button type="button" @click="() => removeNewSocialMedia(smIndex)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></button>
													</div>

													<button type="button" title="Add Social Media" data-uk-tooltip data-uk-icon="icon: plus" @click="addNewSocialMedia" class="uk-icon-button uk-button-primary"></button>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</li>
					</ul>

					<input name="id" type="hidden" :value="site.id" />

					<div class="uk-margin">
						<button type="submit" class="uk-button uk-button-primary uk-border-rounded">Save Changes</button>
					</div>
				</form>
			</div>
		</div>

		<div>
			<h4>Site Information - Json</h4>

			<p>getFullName: {{ getFullName }}</p>

			<pre class="json">
				<code>{{ site }}</code>
				<!-- <code>{{ site.owner.contacts }}</code> -->
				<!-- <code>{{ site.owner.socialMedias }}</code> -->
			</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
	// import { useAuthStore, useUserStore, useRoleStore } from "@/stores";
	import { getApiImageByImageUrl } from "@services/file.service";
	import { useSiteStore } from "@/stores";
	import { ISite } from "@models/index";
	import toast from "@utils/toast";

	defineOptions({ name: "Site_ViewOrEdit", inheritAttrs: false });

	// const { getRoles, isRoles } = storeToRefs(roleStore);
	// const { getMe, isMe } = storeToRefs(userStore);
	const siteStore = useSiteStore();
	const { getSite, isSite, isEmptySite, isErrorSite } = storeToRefs(siteStore);

	const router = useRouter();
	if (!isSite.value) siteStore.get();

	let site: ISite = reactive<ISite>({} as ISite);

	const isSiteInfo = computed(() => !!site && !!site.logo && !!site.owner);
	// const getFullName = computed(() => (!!((site.owner?.firstName || false) || (site.owner?.lastName || false)) ? `${site?.owner?.firstName || ""} ${site?.owner?.lastName || ""}` : ``));
	const getFullName = computed(() => `${site.owner?.firstName || ""} ${site.owner?.lastName || ""}`);

	const removeTitle = (tIndex: number) => {
		if (site.owner?.info?.titles) site.owner.info.titles = [...site.owner.info?.titles?.filter((t, tIndex) => tIndex !== tIndex)];
	};

	const addNewTitle = () => {
		site.owner?.info?.titles?.push({ icon: "", name: "" });
	};
	const removeNewSocialMedia = (smIndex: number) => {
		if (site.owner?.socialMedias) site.owner.socialMedias = [...site.owner.socialMedias?.filter((sm, sIndex) => sIndex !== smIndex)];
	};

	const addNewSocialMedia = () => {
		site.owner?.socialMedias?.push({ icon: "", name: "", url: "" });
	};

	const setSiteLogo = () => {
		alert("Çok hızlısın ama daha hazırlıkları bitirmedik :(");
	};

	// if (authStore.isNotAuth && !isMe) router.push("/login");

	// const logout = () => {
	// 	authStore.logout();
	// };

	const updateSiteInformation = async () => {
		await siteStore
			.updateSite(site)
			.then((result: boolean) => {
				if (result) toast({ message: `<span uk-icon='icon: check'></span> Site bilgileri başarıyla düzenlendi.`, status: "success" });
				else toast({ message: `<span uk-icon='icon: ban'></span> Site bilgileri güncellenirlen bir hata oluştu.`, status: "danger" });
			})
			.catch(() => {
				toast({ message: `<span uk-icon='icon: ban'></span> İsteğiniz işlem yapılırken bir hata oluştu.`, status: "danger" });
			})
			.finally(() => router.push("/"));
	};

	watchEffect(() => {
		if (site.owner?.fullName) site.owner.fullName = `${site.owner?.firstName} ${site.owner?.lastName}`;
		// site = { ...site, owner: { ...site.owner, fullName: `${site.owner?.firstName} ${site.owner?.lastName}` } };
	});

	watch([() => getSite.value, () => isSite.value], () => {
		site = { ...site, ...getSite.value };
	});

	onBeforeMount(() => {
		if (!isSite.value) siteStore.get();
	});
</script>

<style lang="scss" scoped>
	.uk-accordion {
		&-content > .uk-accordion {
			margin-left: 1.5rem;
		}

		&-title {
			background-color: #3399ff;
			color: #ffffff;
			padding: 0.5rem;
			border-radius: 0.25rem;
		}

		&-content {
			background-color: rgba(0, 0, 0, 0.05);
			margin: 0;
			padding: 1rem;
		}
	}
</style>