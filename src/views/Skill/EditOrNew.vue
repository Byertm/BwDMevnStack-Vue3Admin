<template>
	<div v-if="isErrorSkill">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptySkill" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Skill Name" name="name" help="Yetenek adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="text" label="Skill Url" name="url" help="Yetenek bağlantı adresi giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="cis" category-name="skill" :show-source-switcher="true" label="Skill Url" name="imgUrl" help="Bir yetenek görseli seçiniz" validation="required|length:3" data-validation-visibility="live" />
		<!-- <FormKit type="number" label="Skill Ratio" name="ratio" :min="0" :max="100" help="Yetenek oranı bilgisi giriniz" validation="required|length:1,3" data-validation-visibility="live" /> -->
		<FormKit type="range" label="Skill Ratio" name="ratio" min="0" max="100" help="Yetenek seviyesi/oranı seçiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Skill Is Language" name="isLanguage" />
		<FormKit type="checkbox" label="Skill Is Special" name="isSpecial" />
		<FormKit type="checkbox" label="Skill Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { useSkillStore } from "@/stores";
	import { ISkill } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const skillStore = useSkillStore();

	const formData = ref();

	const { skill, isSkill, isEditingSkill, isErrorSkill, isEmptySkill } = storeToRefs(skillStore);
	const { loading, errors } = toRefs(skill.value);

	const setInitialData = () => {
		formData.value = {};
	};

	watch([() => skill.value.data?.id, () => isEditingSkill.value], () => {
		if (isEditingSkill.value && isSkill.value)
			formData.value = {
				name: skill.value.data?.name,
				url: skill.value.data?.url,
				imgUrl: skill.value.data?.imgUrl,
				ratio: skill.value.data?.ratio,
				isLanguage: skill.value.data?.isLanguage,
				isSpecial: skill.value.data?.isSpecial,
				isActive: skill.value.data?.isActive
			};
		else setInitialData();
	});

	const editSkill = (editedSkill: Partial<ISkill>) => {
		if (isSkill.value && skill.value.data) {
			return skillStore
				.updateSkill({
					...skill.value.data,
					name: editedSkill.name,
					url: editedSkill.url,
					imgUrl: editedSkill.imgUrl,
					ratio: editedSkill.ratio,
					isLanguage: editedSkill.isLanguage,
					isSpecial: editedSkill.isSpecial,
					isActive: editedSkill.isActive
				})
				.then(() => {
					router.push("/skill");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni skill eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
		}
	};

	const newSkill = (skill: Partial<ISkill>) => {
		return skillStore
			.newSkill(skill)
			.then(() => {
				router.push("/skill");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { name, url, imgUrl, ratio, isLanguage, isSpecial, isActive } = fields;

		if (isEditingSkill.value) editSkill({ name, url, imgUrl, ratio, isLanguage, isSpecial, isActive });
		else newSkill({ name, url, imgUrl, ratio, isLanguage, isSpecial, isActive });
	};
</script>

<style scoped></style>