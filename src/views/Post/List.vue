<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>Posts</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<!-- <a href="#" title="Move" data-uk-tooltip data-uk-icon="icon: move" class="uk-icon-link sortable-icon"></a> -->
							<!-- <a href="#" title="Configuration" data-uk-tooltip data-uk-icon="icon: cog" class="uk-icon-link"></a> -->
							<!-- <a href="#" title="Close" data-uk-tooltip data-uk-icon="icon: close" class="uk-icon-link"></a> -->
							<a uk-toggle href="#modalPost" title="New Post" data-uk-tooltip data-uk-icon="icon: pencil" @click="newPost" class="uk-icon-button uk-button-primary"></a>
						</div>
					</div>
				</div>

				<div class="uk-card-body">
					<div class="uk-flex uk-flex-column uk-flex-center">
						<div v-if="isErrorPosts">
							<div v-for="err in errors" uk-alert class="uk-alert-warning">
								<a class="uk-alert-close" uk-close></a>
								<p>{{ err.message }}</p>
							</div>
						</div>

						<div v-if="isEmptyPosts" uk-alert class="uk-alert-warning">
							<a class="uk-alert-close" uk-close></a>
							<p>Veri bulunamadı</p>
						</div>

						<div v-if="isPosts" class="uk-overflow-auto">
							<table data-uk-scrollspy="cls:uk-animation-fade;" class="uk-table uk-table-middle uk-table-divider uk-table-small uk-table-striped uk-table-justify uk-scrollspy-inview">
								<thead>
									<tr>
										<th>Post Title</th>
										<!-- <th>Post Slug</th> -->
										<th>Post Pre Title</th>
										<!-- <th>Post Content</th> -->
										<th>Post Image Url</th>
										<th>Category</th>
										<th>Author</th>
										<th>Tags</th>
										<th>Active</th>
										<th>Created Date</th>
										<th>Updated Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="post in posts" :key="post.id">
										<td class="uk-width-2-5">{{ post.title }}</td>
										<!-- <td class="uk-width-2-5">{{ post.slug }}</td> -->
										<td class="uk-width-2-5">{{ post.preTitle }}</td>
										<!-- <td class="uk-width-2-5">{{ post.content }}</td> -->
										<td class="uk-width-2-5">
											<div v-if="post.imageUrl" uk-lightbox="animation: slide" class="uk-card">
												<a :href="getApiImageByImageUrl(post.imageUrl)" data-attrs="crossorigin: anonymous; width: 1920; height: 1080;" crossorigin="anonymous" :data-caption="post.title" class="uk-inline">
													<img
														:src="getApiImageByImageUrl(post.imageUrl)"
														:alt="post.title"
														data-uk-tooltip
														:title="post.title"
														crossorigin="anonymous"
														width="50"
														height="50"
														class="uk-border-rounded uk-object-cover" />
												</a>
											</div>
										</td>
										<td class="uk-width-2-5">{{ post.category?.name }}</td>
										<td class="uk-width-2-5">{{ post.author?.name }}</td>
										<td class="uk-width-2-5">{{ getPostTags(post?.tags) }}</td>
										<td class="uk-width-1-5">
											<div @click="() => setPostStatus(post)">
												<span v-if="post.isActive" data-uk-icon="icon:check; ratio:1.2" class="uk-text-success uk-icon"> </span>
												<span v-else data-uk-icon="icon:close; ratio:1.2" class="uk-text-danger uk-icon"> </span>
											</div>
										</td>
										<td class="uk-width-1-5">{{ $formatDate.format(post.createdAt) || null }}</td>
										<td class="uk-width-1-5">{{ $formatDate.format(post.updatedAt) || null }}</td>
										<td class="uk-width-1-5">
											<div class="uk-button-group">
												<a
													href="#modalPost"
													uk-toggle
													title="Düzenle"
													data-uk-tooltip
													data-uk-icon="icon: pencil"
													@click="() => editPost(post.id)"
													class="uk-icon-button uk-button-secondary uk-margin-small-right"></a>
												<a @click="() => deletePost(post.id)" title="Sil" data-uk-tooltip uk-icon="trash" class="uk-icon-button uk-button-danger"></a>
											</div>
										</td>
									</tr>
								</tbody>
							</table>

							<CustomPagination :pagination-options="paginationOptions" @refresh-data="refreshData"></CustomPagination>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="modalPost" uk-modal class="-uk-modal-full uk-modal-container">
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default -uk-modal-close-full"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">{{ isEditingPost ? "Edit" : "Add" }} Post</h2>
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
	import type { TPaginationOptions } from "@components/shared/Pagination/CustomPagination.vue";
	import CustomPagination from "@components/shared/Pagination/CustomPagination.vue";
	import { getApiImageByImageUrl } from "@services/file.service";
	import { usePostStore, useTagStore } from "@/stores";
	import { IPost, ITag } from "@models/index";
	import toast from "@utils/toast";

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/Post/EditOrNew.vue") });

	const tagList: Ref<ITag[]> = ref([]);

	const postList: Ref<IPost[]> = ref([]);

	const paginationInitialOptions: TPaginationOptions = { pageNumber: 1, size: 5, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false };

	const paginationOptions: TPaginationOptions = reactive({ ...paginationInitialOptions });

	const postStore = usePostStore();
	const tagStore = useTagStore();

	// const { isPosts, isEmptyPosts, getPosts: posts, isErrorPosts, getPostsErrors: errors, isEditingPost } = storeToRefs(postStore);
	const {
		isPostsAndPagination: isPosts,
		isEmptyPostsAndPagination: isEmptyPosts,
		getPostsAndPagination,
		getPostsAndPaginationData: posts,
		isErrorPostsAndPagination: isErrorPosts,
		getPostsAndPaginationErrors: errors,
		isEditingPost
	} = storeToRefs(postStore);
	const { isTags, isEmptyTags, getTags: tags } = storeToRefs(tagStore);

	// if (!isPosts.value) postStore.getAll();
	if (!isPosts.value) postStore.getAllWithPagination({ ...paginationOptions });

	const setOptions = (postsAndPagination: any) => {
		paginationOptions.hasNext = postsAndPagination?.hasNext || false;
		paginationOptions.hasPrev = postsAndPagination?.hasPrev || false;
		paginationOptions.pageNumber = postsAndPagination?.pageNumber || 1;
		paginationOptions.size = postsAndPagination?.size || 5;
		paginationOptions.totalCount = postsAndPagination?.totalCount || 0;
		paginationOptions.totalPages = postsAndPagination?.totalPages || 0;
	};

	const setPostList = () => (postList.value = (posts.value as IPost[]) || []);

	const setTagList = () => tags.value && (tagList.value = tags.value);

	watch([() => posts.value, () => isPosts.value], () => posts.value && setPostList());

	watch([() => getPostsAndPagination.value], () => {
		const postsAndPagination: any = getPostsAndPagination.value;
		setOptions(postsAndPagination || { ...paginationInitialOptions });
	});

	watch([() => posts.value, () => isPosts.value], () => setPostList());

	watch([() => tags.value, () => isTags.value], () => setTagList());

	const refreshData = ($event: TPaginationOptions) => {
		setOptions($event);
		postStore.getAllWithPagination({ ...paginationOptions });
	};

	const getPostTags = (postTags: Partial<ITag>[] | null | undefined) => {
		return !!postTags && !!postTags?.length
			? Array.from(tagList.value)
					.filter((tag) => postTags.findIndex((postTag) => postTag.id === tag.id) > -1)
					.map((tag: Partial<ITag>) => tag.name)
					.join(", ") || "Etiket Bulunamadı"
			: "-";
	};

	const setPostStatus = async (post: Partial<IPost>) => {
		await postStore.updatePost({ ...post, author: post.author?.id, category: post.category?.id, isActive: !post.isActive });
	};

	const newPost = async () => {
		await postStore.updateEditingId(null);
	};

	const editPost = async (id: string) => {
		await postStore.updateEditingId(id);
		await postStore.getById(id);
	};

	const deletePost = async (id: string) => {
		await postStore
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