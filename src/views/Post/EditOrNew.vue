<template>
	<div v-if="isErrorPost">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyPost" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<!-- <div v-for="cat in getMainPosts" uk-alert class="uk-alert-info">
		<a class="uk-alert-close" uk-close></a>
		<p>{{ cat.name }}</p>
	</div> -->

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Post Title" name="title" help="İçerik başlığı giriniz" validation="required|length:3,250" data-validation-visibility="live" />
		<FormKit type="text" label="Post Pre Title" name="preTitle" help="İçerik alt başlığı giriniz" validation="required|length:3,150" data-validation-visibility="live" />
		<!-- <FormKit type="qt" label="Post Content" name="content" help="İçerik açıklaması giriniz" validation="required|length:3,500" data-validation-visibility="live" /> -->
		<FormKit type="we" label="Post Content" name="content" help="İçerik açıklaması giriniz" validation="required|length:3,500" data-validation-visibility="live" />
		<FormKit type="cis" category-name="post" label="Post Image Url" name="imageUrl" help="Bir içerik görseli seçiniz" validation="required|length:3,500" data-validation-visibility="live" />
		<FormKit type="select" label="Author" name="author" :options="userList" help="İçerik yazarı seçiniz" validation="" data-validation-visibility="live" />
		<FormKit type="select" label="Category" :options="categoryList" name="category" help="Kategori seçiniz" validation="" data-validation-visibility="live" />
		<!-- <FormKit type="select" label="Category" name="categoryId" help="İçerik kategorisi seçiniz" validation="" data-validation-visibility="live" /> -->
		<FormKit type="select" label="Post Tags" name="tags" :options="tagList" :multiple="true" help="İçerik etiketleri seçiniz" validation="" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Active" name="isActive" validation="" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>

	<!-- <span>formData {{ formData }}</span> -->
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import type { Ref } from "vue";
	import { ref, toRefs } from "vue";
	import { watch } from "vue";
	import { FormKitOptionsList } from "@formkit/inputs";
	import { useCategoryStore, usePostStore, useTagStore, useUserStore } from "@/stores";
	import { IPostRequest } from "@models/post";
	// import { IPost } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const postStore = usePostStore();
	const categoryStore = useCategoryStore();
	const tagStore = useTagStore();
	const userStore = useUserStore();

	const formData = ref({});
	const categoryList: Ref<FormKitOptionsList> = ref([]);
	const tagList: Ref<FormKitOptionsList> = ref([]);
	const userList: Ref<FormKitOptionsList> = ref([]);

	const { post, isPost, isEditingPost, isErrorPost, isEmptyPost, mainPosts, isMainPosts } = storeToRefs(postStore);
	const { getCategories, isCategories } = storeToRefs(categoryStore);
	const { getTags, isTags } = storeToRefs(tagStore);
	const { getUsers, isUsers } = storeToRefs(userStore);
	const { loading, errors } = toRefs(post.value);

	const setCategoryList = () => {
		if (getCategories.value)
			categoryList.value = [
				// { label: "Üst Kategori", value: null, attrs: { disabled: false } },
				...getCategories?.value?.map((category) => {
					return { label: category.name, value: category.id, attrs: { disabled: false } };
				})
			];
	};

	const setTagList = () => {
		if (getTags.value)
			tagList.value = [
				...getTags?.value?.map((tag) => {
					return { label: tag.name, value: tag.id, attrs: { disabled: false } };
				})
			];
	};

	const setUserList = () => {
		if (getUsers.value)
			userList.value = [
				...getUsers?.value?.map((user) => {
					return { label: user.name, value: user.id, attrs: { disabled: false } };
				})
			];
	};

	setCategoryList();

	setTagList();

	setUserList();

	const setInitialData = () => {
		formData.value = {};

		setCategoryList();

		setTagList();

		setUserList();
	};

	watch([() => getCategories.value, () => isCategories.value], () => setCategoryList());

	watch([() => getTags.value, () => isTags.value], () => setTagList());

	watch([() => getUsers.value, () => isUsers.value], () => setUserList());

	watch([() => post.value.data?.id, () => isEditingPost.value], () => {
		if (isEditingPost.value && isPost.value)
			formData.value = {
				title: post.value.data?.title,
				preTitle: post.value.data?.preTitle,
				content: post.value.data?.content,
				imageUrl: post.value.data?.imageUrl,
				author: post.value.data?.author || null,
				category: post.value.data?.category || null,
				tags: post.value.data?.tags || [],
				isActive: post.value.data?.isActive
			};
		else setInitialData();
	});

	// postStore.getAllTopPosts();
	categoryStore.getAll();
	tagStore.getAll();
	userStore.getAll();

	const editPost = (editedPost: Partial<IPostRequest>) => {
		if (isPost.value && post.value.data)
			return postStore
				.updatePost({
					...post.value.data,
					title: editedPost.title,
					preTitle: editedPost.preTitle,
					content: editedPost.content,
					imageUrl: editedPost.imageUrl,
					author: editedPost.author,
					category: editedPost.category,
					tags: editedPost.tags,
					isActive: editedPost.isActive
				})
				.then(() => {
					router.push("/post");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newPost = (post: Partial<IPostRequest>) => {
		return postStore
			.newPost(post)
			.then(() => {
				router.push("/post");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { title, preTitle, content, isActive, tags, imageUrl, category, author, createUserId } = fields;

		if (isEditingPost.value) editPost({ title, preTitle, content, isActive, tags, imageUrl, category, author, createUserId });
		else newPost({ title, preTitle, content, isActive, tags, imageUrl, category, author, createUserId });
	};
</script>

<style scoped></style>