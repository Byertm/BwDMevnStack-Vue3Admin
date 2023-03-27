<template>
	<div class="uk-grid uk-grid-medium" data-uk-grid uk-sortable="handle: .sortable-icon">
		<div class="uk-width-1-1">
			<div class="uk-card uk-card-default uk-card-small uk-card-hover">
				<div class="uk-card-header">
					<div class="uk-grid uk-grid-small">
						<div class="uk-width-auto"><h4>File Management</h4></div>
						<div class="uk-width-expand uk-text-right panel-icons">
							<a title="Search And Go To Directory" data-uk-tooltip data-uk-icon="icon: search" @click="handleSearch" class="uk-icon-button uk-margin-right uk-button-default"></a>
							<a title="New Directory" data-uk-tooltip data-uk-icon="icon: folder" @click="handleNewDirectory" class="uk-icon-button uk-margin-right uk-button-primary"></a>
							<!-- <a title="New File" data-uk-tooltip data-uk-icon="icon: file" @click="handleNewFile" class="uk-icon-button uk-button-secondary"></a> -->
							<!-- <a uk-toggle href="#modalFileManagement" title="New File Or Directory" data-uk-tooltip data-uk-icon="icon: pencil" @click="newFileOrDirectory" class="uk-icon-button uk-button-primary"></a> -->
						</div>
					</div>
				</div>

				<template v-if="showContextMenu">
					<ul ref="rightCM" class="right-click-menu" :style="{ top: contextMenuOptions.top, left: contextMenuOptions.left }">
						<!-- <li v-if="selectedElementIsDirectory" @click="() => newFileOrDirectory('file')"><a title="New File" data-uk-tooltip data-uk-icon="icon: pencil" class="uk-icon-button uk-button-primary"></a> <span>New File</span></li> -->
						<li v-if="selectedElementIsDirectory" @click="() => newFileOrDirectory('directory')">
							<a title="New Directory" data-uk-tooltip data-uk-icon="icon: pencil" class="uk-icon-button uk-button-secondary"></a><span>New Directory</span>
						</li>
						<li v-if="selectedElementIsFile" @click="handleRenameFile"><a title="" data-uk-tooltip data-uk-icon="icon: pencil" class="uk-icon-button uk-button-secondary"></a><span>New Directory</span></li>
						<li @click="handleDelete"><a title="Delete" data-uk-tooltip data-uk-icon="icon: pencil" class="uk-icon-button uk-button-danger"></a><span>Delete</span></li>
					</ul>
				</template>

				<div class="uk-card-body">
					<!-- <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
						<img v-if="fileImage" style="" :src="fileImage" alt="" class="img-file" />

						<div class="js-upload uk-placeholder uk-text-center">
							<span uk-icon="icon: cloud-upload"></span>
							<span class="uk-text-middle">Attach binaries by dropping them here or</span>
							<div uk-form-custom>
								<input type="file" multiple />
								<input type="file" aria-label="File" accept="image/*" @change="handleImage" class="uk-input" />
								<span class="uk-link">selecting one</span>
							</div>
						</div>

						<progress id="js-progressbar" class="uk-progress" value="0" max="100" hidden></progress>
					</div> -->

					<div class="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
						<div class="back">
							<button type="button" @click="arrowBack" class="uk-button uk-button-default">
								<span data-uk-icon="icon: chevron-left"></span>
								<span> Geri Dön</span>
							</button>
						</div>

						<div class="breadcrumb">
							<template v-for="(p, i) in pwd" :key="i">
								<span @click="findPath(i)">{{ p }} {{ i !== pwd.length - 1 ? " / " : "" }}</span>
							</template>
						</div>

						<div class="uk-flex uk-position-relative uk-visible-toggle">
							<img v-if="fileImage" :title="fileTitle" uk-tooltip :src="fileImage" :alt="fileTitle" class="img-file" />
							<div class="uk-position-absolute uk-position-small uk-position-center-left-out uk-invisible-hover img-wrapper">
								<img v-if="fileImage" :title="fileTitle" uk-tooltip :src="fileImage" :alt="fileTitle" class="" />
							</div>

							<!-- <div v-if="fileImage" :title="fileTitle" uk-tooltip :data-src="fileImage" uk-img class="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light img-file"></div> -->

							<div v-if="!fileImage" uk-form-custom class="js-upload">
								<span class="uk-form-icon" uk-icon="icon: file"></span>
								<input type="file" aria-label="File" accept="image/*" @change="handleImage" class="uk-input" />
								<button class="uk-button uk-button-default" type="button" tabindex="-1">Select</button>
							</div>

							<button v-if="fileImage" class="uk-button uk-button-default" type="button" @click="fileReset" tabindex="-1">Reset</button>
						</div>

						<div class="uk-inline">
							<span class="uk-form-icon" uk-icon="icon: search"></span>
							<input type="text" v-model="search" aria-label="Model" @keydown.enter="handleSearch" class="uk-input" />
						</div>
					</div>

					<div uk-grid uk-lightbox="animation: slide" @click.self="leftClick" @contextmenu.prevent="rightClick($event)" class="uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l uk-text-center">
						<div v-for="(file, i) in files" :key="i" @click.self="leftClick" class="files-wrapper">
							<div @click.self="leftClick" class="uk-card uk-card-default uk-card-body uk-position-relative">
								<template v-if="file.type === 'file'" :name="file.name" :suffix="file.suffix" :size="file.size" class="file">
									<div :name="file.name" :suffix="file.suffix" :size="file.size" @click.left="($event) => fileLeftClick($event, file)" @click.right="($event) => fileRightClick($event, file)">
										<div class="uk-card-header">
											<span data-uk-icon="icon: file; ratio: 1.2" class="uk-position-small uk-position-top-left"></span>
											<span class="uk-position-small uk-position-static">{{ file.type }}</span>
											<span class="uk-position-small uk-position-top-right">{{ file.suffix }}</span>
										</div>

										<div class="uk-card-body">
											<a :href="getImageUrlFromFile(file)" data-attrs="crossorigin: anonymous; width: 1920; height: 1080;" crossorigin="anonymous" :data-caption="`${file.name}.${file.suffix}`" class="uk-inline">
												<img :alt="file.suffix" :title="file.name" :src="getImageUrlFromFile(file)" crossorigin="anonymous" class="uk-image" />
											</a>
										</div>
									</div>
								</template>

								<template v-if="file.type === 'directory'" class="directory">
									<div :name="file.name" @click.left="($event) => fileLeftClick($event, file)" @click.right="($event) => fileRightClick($event, file)">
										<div class="uk-card-header">
											<span data-uk-icon="icon: folder; ratio: 1.2" class="uk-position-small uk-position-top-left"></span>
											<span class="uk-position-small uk-position-static">{{ file.type }}</span>
											<span class="uk-position-small uk-position-top-right">{{ file.suffix }}</span>
										</div>

										<div class="uk-card-body">
											<span class="uk-text-break">{{ file.name }}</span>
										</div>
									</div>
								</template>

								<div v-if="file.size" class="uk-card-footer">
									<span class="uk-text-break json">{{ file.size }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="modalFileManagement" uk-modal>
		<div class="uk-modal-dialog">
			<button type="button" uk-close class="uk-modal-close-default"></button>

			<div class="uk-modal-header">
				<h2 class="uk-modal-title">Add File Or Directory</h2>
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
	import { IFile, IFileAndAttrs, TFileAttrs, TFileType, TSelectedElement } from "@models/file";
	// import { useCategoryStore } from "@/stores";
	// import { ICategory } from "@models/index";
	import { useFileStore } from "@/stores";
	import toast from "@utils/toast";

	const fileStore = useFileStore();
	const { isFiles, getFiles, isFilesByPath, getFilesByPath, isErrorFilesByPath, getFilesByPathErrors } = storeToRefs(fileStore);

	const NewOrEdit = defineAsyncComponent({ loader: () => import("@views/FileManagement/EditOrNew.vue") });

	const search: Ref<string> = ref("");
	const path: Ref<string> = ref("");
	const rightCM: Ref<HTMLDivElement | null | undefined> = ref();
	const selectedElement: TSelectedElement = reactive({ path: "", name: "", type: "", suffix: "", size: 0 });
	const showContextMenu: Ref<boolean> = ref(false);
	const contextMenuOptions = reactive({ top: "0px", left: "0px" });
	const fileAndAttrs: Partial<IFileAndAttrs> = reactive({});
	const files: Ref<Array<IFile>> = ref([]);
	const fileImage: Ref<string | null> = ref(null);
	const fileTitle: Ref<string> = ref("");
	const fileAttrs: TFileAttrs = reactive({ lastModified: 0, name: "", size: 0, type: "", webkitRelativePath: "" });

	const pwd = computed(() => path.value.split("/")); // /test => ['', 'test']

	const selectedElementIsFile = computed(() => !!(selectedElement?.type === "file")); // /test => ['', 'test']
	const selectedElementIsDirectory = computed(() => !!(selectedElement?.type === "directory")); // /test => ['', 'test']

	const setFiles = () => (files.value = getFiles.value);

	const setFileByPath = () => (files.value = getFilesByPath.value);

	const setFileByPathErrors = () => {
		if (isErrorFilesByPath.value && getFilesByPathErrors.value?.length)
			getFilesByPathErrors.value.forEach((e) => {
				if (e?.response?.data?.msg === "directory not exists") arrowBack();
			});
	};

	watch([() => isFiles.value, () => getFiles.value], () => setFiles());

	watch([() => isFilesByPath.value, () => getFilesByPath.value], () => setFileByPath());

	watch([() => isErrorFilesByPath.value, () => getFilesByPathErrors.value], () => setFileByPathErrors());

	const getContent = async (_path: string) => {
		path.value = _path;
		await fileStore.getAllByPath(path.value);
		hideContextMenu();
	};

	const uploadImage = () => {
		if (fileImage.value && fileAttrs.name) {
			fileAndAttrs.base64Image = { imgBase64: fileImage.value };
			fileAndAttrs.attrs = { ...fileAttrs } as Partial<TFileAttrs>;
			fileAndAttrs.path = path.value;
			fileAndAttrs.type = selectedElement.type ? (selectedElement.type as TFileType) : "file";

			// { path: path.value, name: fileAttrs.name, imgBase64: fileImage.value }

			fileStore
				.uploadImage(fileAndAttrs)
				.then(() => getContent(path.value))
				.finally(() => fileReset());

			hideContextMenu();
		}
	};

	const getImageUrlFromFile = (selectedFile: TSelectedElement | any) => {
		return fileStore.getImageUrlFromFile(getMiddlePaths(), selectedFile);
	};

	const createFile = (_path: string, file: string) => {
		if (!!search?.value && search?.value?.length > 2)
			fileStore
				.createFile(file, _path)
				.then(() => getContent(path.value))
				// .then((data: any) => {
				// 	debugger;
				// 	console.log("createFile", data);
				// 	getContent(path.value);
				// })
				.catch((e) => {
					console.log({ createFileError: e });
					if (e?.response?.data?.msg?.code === "ENOTEMPTY") toast({ message: `<span uk-icon='icon: ban'></span> Dosya oluştururken bir hata oluştu.`, status: "danger" });
				});
	};

	const createDirectory = (_path: string, directory: string) => {
		if (!!search?.value && search?.value?.length > 2)
			fileStore
				.createDirectory(directory, _path)
				.then(() => getContent(path.value))
				// .then((data: any) => {
				// 	debugger;
				// 	console.log("createDirectory", data);
				// 	getContent(path.value);
				// })
				.catch((e) => {
					if (e?.response?.data?.msg?.code === "ENOTEMPTY") toast({ message: `<span uk-icon='icon: ban'></span> Klasör oluştururken bir hata oluştu.`, status: "danger" });
				});
	};

	const remove = (_path: string, fileOrDir: TFileType) => {
		fileStore
			.delete(_path, fileOrDir)
			.then(() => getContent(path.value))
			.catch((e) => {
				if (e?.response?.data?.msg?.code === "ENOTEMPTY") toast({ message: `<span uk-icon='icon: ban'></span> ${fileOrDir !== "file" ? "Klasör" : "Dosya"} silinirken bir hata oluştu.`, status: "danger" });
			});
	};

	// !Error: Bu kısımda bir sorun var. Breadcrumb kodlaması tekrar yapılacak. findPath ve arrowBack fonksiyonları revize edilecek.
	const findPath = (index: number) => {
		let temp = "";

		for (let i = index; i > -1; i--) {
			temp = pwd.value[i] + " / " + temp;
		}

		console.log({ tmp: temp });

		const tempSlice: string = temp.slice(0, temp.length - 1).trim();
		const newPath: string = tempSlice === "/" ? "" : tempSlice;
		getContent(newPath);
	};

	const arrowBack = () => findPath(pwd.value.length - 2);

	const apiUrl: string = "http://localhost:9000/api/file";

	const fileReset = () => {
		fileImage.value = null;
		fileTitle.value = "";
		fileAttrs.lastModified = 0;
		fileAttrs.name = "";
		fileAttrs.size = 0;
		fileAttrs.type = "";
		fileAttrs.webkitRelativePath = "";
	};

	const createBase64Image = (fileObject: File) => {
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (e?.target?.result) {
				fileImage.value = typeof e.target.result === "string" ? e.target.result : Buffer.from(e.target.result).toString();
				uploadImage();
			}
		};

		reader.addEventListener("error", (_e) => {
			delete fileAndAttrs.file;
		});

		reader.readAsDataURL(fileObject);
	};

	const handleImage = (e: any) => {
		const eTarget = e?.target as HTMLInputElement;

		if (eTarget?.files?.length) {
			const selectedImage = eTarget.files[0]; // get first file
			const { lastModified, name, size, type, webkitRelativePath } = selectedImage;

			fileAttrs.lastModified = lastModified;
			fileAttrs.name = name?.split(".")?.[0] || name;
			fileAttrs.size = size;
			fileAttrs.type = type;
			fileAttrs.webkitRelativePath = webkitRelativePath;

			fileTitle.value = fileAttrs.name || selectedImage.name || "";
			fileAndAttrs.file = selectedImage;
			createBase64Image(selectedImage);
		} else fileReset();
	};

	const getMiddlePaths = () => {
		const newPwd = !!pwd?.value?.filter((p) => !!p)?.join("/") ? pwd.value.filter((p) => !!p).join("/") + "/" : "";
		return newPwd;
	};

	const handleSearch = () => {
		getContent(search.value);
		search.value = "";
	};

	const handleNewDirectory = () => {
		createDirectory(path.value, search.value);
		search.value = "";
	};

	const handleNewFile = () => {
		createFile(path.value, search.value);
		search.value = "";
	};

	const handleRenameFile = () => {
		if (selectedElementIsFile.value && selectedElement?.name) {
			const sElement = { ...selectedElement };
		}
	};

	const handleDelete = (e: MouseEvent) => {
		// console.log("selectedElement", selectedElement);
		if (selectedElement.type !== "") remove(selectedElement.path, selectedElement.type);
		e.preventDefault();
		search.value = "";
	};

	const newFileOrDirectory = (pType: "directory" | "file") => {
		if (!search.value) toast({ message: "Lütfen oluşturmak istediğiniz dizin veya dosya için arama kısmını doldurun!", status: "danger" });
		else {
			let newPath = path.value;
			let searchVal = search.value;

			// if (selectedElement && selectedElement?.type === "directory") newPath = `${newPath}/${selectedElement.path}`;

			if (pType === "directory") createDirectory(newPath, searchVal), getContent(selectedElement.path);
			else if (pType === "file") createFile(newPath, searchVal);

			search.value = "";
		}
	};

	const setMenu = (top: number, left: number) => {
		const { offsetWidth, offsetHeight } = !!rightCM?.value ? rightCM.value : { offsetWidth: 252, offsetHeight: 142 };
		// const largestWidth = window.innerWidth - offsetWidth; // 126
		// const largestHeight = window.innerHeight - offsetHeight; // 71;
		// if (left > largestWidth) left = largestWidth;
		// if (top > largestHeight) top = largestHeight;
		// console.log({ largestWidth: largestWidth, largestHeight: largestHeight, "window.innerWidth": window.innerWidth, "window.innerHeight": window.innerHeight, offsetWidth: offsetWidth, offsetHeight: offsetHeight, top: top, left: left });
		// contextMenuOptions.top = top + "px";
		// contextMenuOptions.left = left + "px";

		contextMenuOptions.top = `${top - offsetHeight - 25}px`;
		contextMenuOptions.left = `${left - offsetWidth - 25}px`;
	};

	const hideContextMenu = () => (showContextMenu.value = false);

	const leftClick = (e: MouseEvent) => {
		if (showContextMenu.value) hideContextMenu();
		// console.log("left event", e);
		setSelectedElementFileAttrs({ path: "", name: "", type: "", suffix: "", size: 0 });

		e.preventDefault();
	};

	const rightClick = (e: MouseEvent) => {
		nextTick(() => {
			showContextMenu.value = true;
			setMenu(e.pageY, e.pageX); //e.y, e.x
		});

		// e.preventDefault();
	};

	const setSelectedElementFileAttrs = (file: any) => {
		const { name, suffix, size, type } = file;
		selectedElement.path = type === "file" ? `${getMiddlePaths()}${name}.${suffix}` : `${getMiddlePaths()}${name}`;
		selectedElement.name = name;
		selectedElement.type = type;
		selectedElement.size = type === "file" ? size : 0;
		selectedElement.suffix = type === "file" ? suffix : "";
		if (file?.type === "directory" && !getMiddlePaths().includes(file.name)) getContent(`${path.value}/${file?.name}`);
	};

	const fileLeftClick = (e: any, file: any) => {
		// console.log({ "left event": e, fileOrDir: file });

		e.preventDefault();
		leftClick(e);
		setSelectedElementFileAttrs(file);
	};

	const fileRightClick = (e: any, file: any) => {
		// console.log({ "right event": e, fileOrDir: file });
		e.preventDefault();
		setSelectedElementFileAttrs(file);
		rightClick(e);
	};

	onMounted(() => {
		fileStore.getAll();
	});
</script>

<style lang="scss" scoped>
	.files {
		&-wrapper {
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;

			.uk-card {
				background-color: #fff;
				color: #666;
				box-shadow: 0 5px 15px rgb(0 0 0 / 8%);

				.uk-image {
					width: 100%;
					height: 200px;
					max-width: 200px;
					max-height: 200px;
					object-fit: cover;
					object-fit: scale-down;
				}
			}
		}
	}

	.img {
		&-wrapper {
			max-width: 20em;
			background: #f0f0f0;
			border-radius: 1rem;
			z-index: 1;

			&:not(&:empty) {
				padding: 0.5rem;
			}

			img {
				border-radius: 0.5rem;
			}
		}

		&-file {
			max-width: 5em;
			max-height: 5em;
		}
	}

	.right-click-menu {
		background: #fafafa;
		border: 1px solid #bdbdbd;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
		display: block;
		list-style: none;
		margin: 0;
		padding: 0;
		position: absolute;
		width: 250px;
		z-index: 999999;

		li {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			gap: 0.5rem;
			margin: 0;
			padding: 5px 35px;
			border-bottom: 1px solid #e0e0e0;
			cursor: pointer;

			&:last-child {
				border-bottom: none;
			}

			&:hover {
				background: #1e88e5;
				color: #fafafa;
			}
		}
	}
</style>