<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Comments</h4></div>

						<div class="uk-width-1-6">
							<select aria-label="Select" v-model="selectedPost" class="uk-select">
								<!-- <option selected disabled>Bir Post Seçiniz</option> -->
								<option selected :value="null">Tümü</option>
								<option v-for="post in postList" :key="post.id" :value="post">{{ post.title }}</option>
							</select>
						</div>

						<div class="uk-width-expand uk-text-right panel-icons">
							<a uk-toggle href="#modalComment" title="New Comment" data-uk-tooltip data-uk-icon="icon: pencil" @click="newComment" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorComments">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyComments" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isComments" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<!-- <th>Post Title</th> -->
										<th>Comment</th>
										<th>Banned</th>
										<th>Hidden</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="comment in categories" :key="comment.id">
										<!-- <td class="uk-width-2-5">{{ comment.postId }}</td> -->
										<td class="uk-width-2-5">{{ comment.comment }}</td>
										<td class="uk-width-1-5">
											<div @click="() => setCommentBannedStatus(comment)">
												<span v-if="comment.isBanned" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">
											<div @click="() => setCommentHiddenStatus(comment)">
												<span v-if="comment.isHidden" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">
											<div @click="() => setCommentStatus(comment)">
												<span v-if="comment.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(comment.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(comment.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalComment"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="() => editComment(comment.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="() => deleteComment(comment.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
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

	<div id="modalComment" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingComment ? "Edit" : "Add" }} Comment</h2>
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
	import { useCommentStore, usePostStore } from "@/stores";
	import { IComment, IPost } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Comment/EditOrNew.vue") });

	const postList: Ref<IPost[]> = ref([]);
	const selectedPost: Ref<IPost | null> = ref(null);

	const postStore = usePostStore();
	const commentStore = useCommentStore();
	const { getPosts, isPosts } = storeToRefs(postStore);
	const { isComments, isEditingComment, isEmptyComments, getComments: categories, isErrorComments, getCommentsErrors: errors } = storeToRefs(commentStore);
	commentStore.getAll();

	if (!isPosts.value) postStore.getAll();

	const setPostList = () => (postList.value = getPosts.value ? [...getPosts.value] : []);

	const handlePostChange = (post: IPost) => alert(JSON.stringify(post));

	watch([() => getPosts.value, () => isPosts.value], () => setPostList());

	watch([() => selectedPost.value, () => selectedPost.value?.id], () => (selectedPost.value?.id ? commentStore.getAllByPostId(selectedPost.value.id) : commentStore.getAll()));

	const setCommentBannedStatus = async (comment: Partial<IComment>) => {
		await commentStore.updateComment({ ...comment, isBanned: !comment.isBanned });
	};

	const setCommentHiddenStatus = async (comment: Partial<IComment>) => {
		await commentStore.updateComment({ ...comment, isHidden: !comment.isHidden });
	};

	const setCommentStatus = async (comment: Partial<IComment>) => {
		await commentStore.updateComment({ ...comment, isActive: !comment.isActive });
	};

	const newComment = async () => {
		await commentStore.updateEditingId(null);
	};

	const editComment = async (id: string) => {
		await commentStore.updateEditingId(id);
		await commentStore.getById(id);
	};

	const deleteComment = async (id: string) => {
		await commentStore
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