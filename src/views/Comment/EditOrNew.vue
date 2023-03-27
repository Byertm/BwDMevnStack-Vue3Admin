<template>
	<div v-if="isErrorComment">
		<div v-for="err in errors" uk-alert class="uk-alert-warning">
			<a class="uk-alert-close" uk-close></a>
			<p>{{ err.message }}</p>
		</div>
	</div>

	<div v-if="isEmptyComment" uk-alert class="uk-alert-danger">
		<a class="uk-alert-close" uk-close></a>
		<p>Veri bulunamadı</p>
	</div>

	<div v-if="loading" uk-alert class="uk-alert-info">
		<p>Yükleniyor...</p>
	</div>

	<FormKit type="form" v-model="formData" :actions="false" @submit="formKitSubmit">
		<FormKit type="text" label="Comment" name="comment" help="Bir kategori adı giriniz" validation="required|length:3,50" data-validation-visibility="live" />
		<FormKit type="select" label="Post Select" :options="postList" name="postId" help="İçerik seçimi yapabilirsiniz" validation="required" data-validation-visibility="live" />
		<FormKit type="checkbox" label="Comment Is Banned" name="isBanned" />
		<FormKit type="checkbox" label="Comment Is Hidden" name="isHidden" />
		<FormKit type="checkbox" label="Comment Is Active" name="isActive" />
		<FormKit type="submit">Gönder</FormKit>
	</FormKit>
</template>

<script setup lang="ts">
	import { useCommentStore, usePostStore } from "@/stores";
	import { FormKitOptionsList } from "@formkit/inputs";
	import { IComment } from "@models/index";
	import router from "@router/index";
	import toast from "@utils/toast";

	const commentStore = useCommentStore();
	const postStore = usePostStore();

	const formData = ref();
	const postList: Ref<FormKitOptionsList> = ref([]);

	const { comment, isComment, isEditingComment, isErrorComment, isEmptyComment } = storeToRefs(commentStore);
	const { getPosts, isPosts } = storeToRefs(postStore);
	const { loading, errors } = toRefs(comment.value);

	postStore.getAll();

	const setPostList = () => {
		postList.value = [
			...getPosts.value.map((post) => {
				return { label: post.title, value: post.id, attrs: { disabled: false } };
			})
		];
	};

	const setInitialData = () => {
		formData.value = {};
		setPostList();
	};

	watch([() => getPosts.value, () => isPosts.value], () => setPostList());

	watch([() => comment.value.data?.id, () => isEditingComment.value], () => {
		if (isEditingComment.value && isComment.value)
			formData.value = {
				postId: comment.value.data?.postId,
				comment: comment.value.data?.comment,
				isBanned: comment.value.data?.isBanned,
				isHidden: comment.value.data?.isHidden,
				isActive: comment.value.data?.isActive
			};
		else setInitialData();
	});

	const editComment = (editedComment: Partial<IComment>) => {
		if (isComment.value && comment.value.data)
			return commentStore
				.updateComment({
					...comment.value.data,
					comment: editedComment.comment,
					isBanned: editedComment.isBanned,
					isHidden: editedComment.isHidden,
					isActive: editedComment.isActive
				})
				.then(() => {
					router.push("/comment");
					toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni comment eklediniz!`, status: "success" });
				})
				.catch((error) => {
					toast({ message: `Bir hata oluştu!`, status: "danger" });
				})
				.finally(() => setInitialData());
	};

	const newComment = (comment: Partial<IComment>) => {
		return commentStore
			.newComment(comment)
			.then(() => {
				router.push("/comment");
				toast({ message: `<span uk-icon='icon: check'></span> Başarıyla yeni post eklediniz!`, status: "success" });
			})
			.catch((error) => {
				toast({ message: `Bir hata oluştu!`, status: "danger" });
			})
			.finally(() => setInitialData());
	};

	const formKitSubmit = (fields: any) => {
		const { comment, postId, isBanned, isHidden, isActive } = fields;

		if (isEditingComment.value) editComment({ comment, postId, isBanned, isHidden, isActive });
		else newComment({ comment, postId, isBanned, isHidden, isActive });
	};
</script>

<style scoped></style>