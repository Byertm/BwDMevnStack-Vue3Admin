<template>
	<div data-uk-grid class="uk-grid uk-grid-divider uk-grid-medium uk-child-width-1-2 uk-child-width-1-4@l uk-child-width-1-5@xl uk-hidden">
		<div>
			<span class="uk-text-small"><span data-uk-icon="icon:users" class="uk-margin-small-right uk-text-primary"></span>New Users</span>
			<h1 class="uk-heading-primary uk-margin-remove uk-text-primary">2.134</h1>
			<div class="uk-text-small"><span class="uk-text-success" data-uk-icon="icon: triangle-up">15%</span> more than last week.</div>
		</div>

		<div>
			<span class="uk-text-small"><span data-uk-icon="icon:social" class="uk-margin-small-right uk-text-primary"></span>Social Media</span>
			<h1 class="uk-heading-primary uk-margin-remove uk-text-primary">8.490</h1>
			<div class="uk-text-small"><span class="uk-text-warning" data-uk-icon="icon: triangle-down">-15%</span> less than last week.</div>
		</div>

		<div>
			<span class="uk-text-small"><span data-uk-icon="icon:clock" class="uk-margin-small-right uk-text-primary"></span>Traffic hours</span>
			<h1 class="uk-heading-primary uk-margin-remove uk-text-primary">12.00<small class="uk-text-small">PM</small></h1>
			<div class="uk-text-small"><span class="uk-text-success" data-uk-icon="icon: triangle-up"> 19%</span> more than last week.</div>
		</div>

		<div>
			<span class="uk-text-small"><span data-uk-icon="icon:search" class="uk-margin-small-right uk-text-primary"></span>Week Search</span>
			<h1 class="uk-heading-primary uk-margin-remove uk-text-primary">9.543</h1>
			<div class="uk-text-small"><span class="uk-text-danger" data-uk-icon="icon: triangle-down"> -23%</span> less than last week.</div>
		</div>

		<div class="uk-visible@xl">
			<span class="uk-text-small"><span data-uk-icon="icon:users" class="uk-margin-small-right uk-text-primary"></span>Lorem ipsum</span>
			<h1 class="uk-heading-primary uk-margin-remove uk-text-primary">5.284</h1>
			<div class="uk-text-small"><span class="uk-text-success" data-uk-icon="icon: triangle-up"> 7%</span> more than last week.</div>
		</div>
	</div>

	<hr class="uk-hidden" />

	<div class="uk-alert-primary" uk-alert>
		<a class="uk-alert-close" uk-close></a>
		<p>Bu sayfa aynı zamanda ön yüz projesinde hangi kısımların açılıp kapanacağının seçimini yapacağım kontrollerden oluşacak.</p>
		<p>Ayrıca github projelerininin listesi, star ve izlenme sayısı gibi bilgileri ve grafikleri içerecek.</p>
	</div>

	<hr class="uk-divider-icon" />

	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-2@l">
			<div class="role-wrapper uk-card uk-card-primary">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>AuthUser & Me</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a href="#" class="uk-icon-link sortable-icon" title="Move" data-uk-tooltip data-uk-icon="icon: move"></a>
							<!-- <a href="#" class="uk-icon-link" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog"></a> -->
							<!-- <a href="#" class="uk-icon-link" title="Close" data-uk-tooltip data-uk-icon="icon: close"></a> -->
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div v-if="isLogged">
						<h5 class="uk-text-bold">authUser</h5>
						<p class="json">{{ authUser }}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="uk-width-1-2@l">
			<div class="user-wrapper uk-card uk-card-secondary">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Kullanıcı Bilgileri</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a href="#" class="uk-icon-link sortable-icon" title="Move" data-uk-tooltip data-uk-icon="icon: move"></a>
							<!-- <a href="#" class="uk-icon-link" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog"></a> -->
							<!-- <a href="#" class="uk-icon-link" title="Close" data-uk-tooltip data-uk-icon="icon: close"></a> -->
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div v-if="isMe" class="uk-overflow-auto">
						<table class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-justify uk-scrollspy-inview" data-uk-scrollspy="cls:uk-animation-fade;">
							<thead>
								<tr>
									<th>Key</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(value, key) in userData" :key="key">
									<td class="uk-width-1-5">{{ key }}</td>
									<td class="uk-width-3-5">
										<span class="json">{{ (key === "createdAt" || key === "updatedAt") && typeof value === "string" ? $formatDate.format(value) : value }}</span>
										<!-- <span class="json">{{ value }}</span> -->
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- panel -->
		<div class="uk-width-1-2@l uk-hidden">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Sales Chart</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a href="#" class="uk-icon-link sortable-icon" title="Move" data-uk-tooltip data-uk-icon="icon: move"></a>
							<a href="#" class="uk-icon-link" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog"></a>
							<a href="#" class="uk-icon-link" title="Close" data-uk-tooltip data-uk-icon="icon: close"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="chart-container">
						<canvas id="chart2"></canvas>
					</div>
				</div>
			</div>
		</div>
		<!-- /panel -->

		<!-- panel -->
		<div class="uk-width-1-2@l uk-hidden">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Predictions Chart</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a href="#" class="uk-icon-link sortable-icon" title="Move" data-uk-tooltip data-uk-icon="icon: move"></a>
							<a href="#" class="uk-icon-link" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog"></a>
							<a href="#" class="uk-icon-link" title="Close" data-uk-tooltip data-uk-icon="icon: close"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="chart-container">
						<canvas id="chart1"></canvas>
					</div>
				</div>
			</div>
		</div>
		<!-- /panel -->

		<!-- panel -->
		<div class="uk-width-1-1 uk-width-1-3@l uk-width-1-2@xl uk-hidden">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Activity Chart</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a href="#" class="uk-icon-link sortable-icon" title="Move" data-uk-tooltip data-uk-icon="icon: move"></a>
							<a href="#" class="uk-icon-link" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog"></a>
							<a href="#" class="uk-icon-link" title="Close" data-uk-tooltip data-uk-icon="icon: close"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="chart-container">
						<canvas id="chart3"></canvas>
					</div>
				</div>
			</div>
		</div>
		<!-- /panel -->

		<!-- panel -->
		<div class="uk-width-1-2@s uk-width-1-3@l uk-width-1-4@xl uk-hidden">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Distribution Chart</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a href="#" class="uk-icon-link sortable-icon" title="Move" data-uk-tooltip data-uk-icon="icon: move"></a>
							<a href="#" class="uk-icon-link" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog"></a>
							<a href="#" class="uk-icon-link" title="Close" data-uk-tooltip data-uk-icon="icon: close"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="chart-container">
						<canvas id="chart4"></canvas>
					</div>
				</div>
			</div>
		</div>
		<!-- /panel -->

		<!-- panel -->
		<div class="uk-width-1-2@s uk-width-1-3@l uk-width-1-4@xl uk-hidden">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Population Chart</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a href="#" class="uk-icon-link sortable-icon" title="Move" data-uk-tooltip data-uk-icon="icon: move"></a>
							<a href="#" class="uk-icon-link" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog"></a>
							<a href="#" class="uk-icon-link" title="Close" data-uk-tooltip data-uk-icon="icon: close"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="chart-container">
						<canvas id="chart5"></canvas>
					</div>
				</div>
			</div>
		</div>
		<!-- /panel -->
	</div>
</template>

<script setup lang="ts">
	import { useAuthStore, useUserStore } from "@/stores";
	import { IUser } from "@models/user";
	import toast from "@utils/toast";

	const userData: Ref<IUser> = ref({} as IUser);

	const authStore = useAuthStore();
	const { user: authUser, isLogged } = storeToRefs(authStore);

	const userStore = useUserStore();
	const { getMe, isMe } = storeToRefs(userStore);

	onMounted(async () => {
		try {
			await userStore.getMeData();
			userData.value = { ...getMe.value } as IUser;
		} catch (error: any) {
			toast({ message: `<span uk-icon='icon: ban'></span> ${error.message}.`, status: "danger" });
		}
	});
</script>

<style scoped>
	.json {
		white-space: break-spaces;
		word-break: break-all;
	}
</style>