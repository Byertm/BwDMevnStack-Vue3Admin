import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@stores/index';

const authRoutes: Array<RouteRecordRaw> = [
	{ path: '/profile', name: 'profile', component: () => import('@views/Auth/Profile.vue') },
	{ path: '/forgot-password', name: 'RecoveryPassword', component: () => import('@views/Auth/RecoveryPassword.vue'), meta: { layout: 'Auth' } },
	{ path: '/login', name: 'login', component: () => import('@views/Auth/Login.vue'), meta: { layout: 'Auth' } },
	{ path: '/register', name: 'register', component: () => import('@views/Auth/Register.vue'), meta: { layout: 'Auth' } }
];

const categoryRoutes: Array<RouteRecordRaw> = [
	{
		path: '/category',
		name: 'category',
		alias: '/category/list',
		children: [
			{ path: '', name: 'categoryList', component: () => import('@views/Category/List.vue') }
			// { path: '/new', name: 'newCategory', component: () => import('@views/Category/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateCategory', component: () => import('@views/Category/EditOrNew.vue') }
		]
	}
];

const commentRoutes: Array<RouteRecordRaw> = [
	{
		path: '/comment',
		name: 'comment',
		alias: '/comment/list',
		children: [
			{ path: '', name: 'commentList', component: () => import('@views/Comment/List.vue') }
			// { path: '/new', name: 'newComment', component: () => import('@views/Comment/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateComment', component: () => import('@views/Comment/EditOrNew.vue') }
		]
	}
];

const educationRoutes: Array<RouteRecordRaw> = [
	{
		path: '/education',
		name: 'education',
		alias: '/education/list',
		children: [
			{ path: '', name: 'educationList', component: () => import('@views/Education/List.vue') }
			// { path: '/new', name: 'newEducation', component: () => import('@views/Education/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateEducation', component: () => import('@views/Education/EditOrNew.vue') }
		]
	}
];

const experienceRoutes: Array<RouteRecordRaw> = [
	{
		path: '/experience',
		name: 'experience',
		alias: '/experience/list',
		children: [
			{ path: '', name: 'experienceList', component: () => import('@views/Experience/List.vue') }
			// { path: '/new', name: 'newExperience', component: () => import('@views/Experience/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateExperience', component: () => import('@views/Experience/EditOrNew.vue') }
		]
	}
];

const postRoutes: Array<RouteRecordRaw> = [
	{
		path: '/post',
		name: 'Post',
		alias: '/post/list',
		children: [
			{ path: '', name: 'postList', component: () => import('@views/Post/List.vue') }
			// { path: '/new', name: 'newPost', component: () => import('@views/Post/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updatePost', component: () => import('@views/Post/EditOrNew.vue') }
		]
	}
];

const projectRoutes: Array<RouteRecordRaw> = [
	{
		path: '/project',
		name: 'project',
		alias: '/project/list',
		children: [
			{ path: '', name: 'projectList', component: () => import('@views/Project/List.vue') }
			// { path: '/new', name: 'newProject', component: () => import('@views/Project/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateProject', component: () => import('@views/Project/EditOrNew.vue') }
		]
	}
];

const roleRoutes: Array<RouteRecordRaw> = [
	{
		path: '/role',
		name: 'Role',
		alias: '/post/list',
		children: [
			{ path: '', name: 'roleList', component: () => import('@views/Role/List.vue') }
			// { path: '/new', name: 'newRole', component: () => import('@views/Role/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateRole', component: () => import('@views/Role/EditOrNew.vue') }
		]
	}
];

const skillRoutes: Array<RouteRecordRaw> = [
	{
		path: '/skill',
		name: 'skill',
		alias: '/skill/list',
		children: [
			{ path: '', name: 'skillList', component: () => import('@views/Skill/List.vue') }
			// { path: '/new', name: 'newSkill', component: () => import('@views/Skill/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateSkill', component: () => import('@views/Skill/EditOrNew.vue') }
		]
	}
];

const tagRoutes: Array<RouteRecordRaw> = [
	{
		path: '/tag',
		name: 'tag',
		alias: '/tag/list',
		children: [
			{ path: '', name: 'tagList', component: () => import('@views/Tag/List.vue') }
			// { path: '/new', name: 'newTag', component: () => import('@views/Tag/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateTag', component: () => import('@views/Tag/EditOrNew.vue') }
		]
	}
];

const testimonialRoutes: Array<RouteRecordRaw> = [
	{
		path: '/testimonial',
		name: 'testimonial',
		alias: '/testimonial/list',
		children: [
			{ path: '', name: 'testimonialList', component: () => import('@views/Testimonial/List.vue') }
			// { path: '/new', name: 'newTestimonial', component: () => import('@views/Testimonial/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateTestimonial', component: () => import('@views/Testimonial/EditOrNew.vue') }
		]
	}
];

const userRoutes: Array<RouteRecordRaw> = [
	{
		path: '/user',
		name: 'user',
		alias: '/user/list',
		children: [
			{ path: '', name: 'userList', component: () => import('@views/User/List.vue') }
			// { path: '/new', name: 'newUser', component: () => import('@views/User/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateUser', component: () => import('@views/User/EditOrNew.vue') }
		]
	}
];

const fileManagementRoutes: Array<RouteRecordRaw> = [
	{
		path: '/files',
		name: 'files',
		alias: '/files/list',
		children: [
			{ path: '', name: 'fileManagement', component: () => import('@views/FileManagement/List.vue') }
			// { path: '/new', name: 'newFileOrDirectory', component: () => import('@views/FileManagement/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateFileOrDirectory', component: () => import('@views/FileManagement/EditOrNew.vue') }
		]
	}
];

const sectionManagementRoutes: Array<RouteRecordRaw> = [
	{
		path: '/section',
		name: 'section',
		alias: '/section/list',
		children: [
			{ path: '', name: 'sectionManagement', component: () => import('@views/Section/List.vue') }
			// { path: '/new', name: 'newSection', component: () => import('@views/Section/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateSection', component: () => import('@views/Section/EditOrNew.vue') }
		]
	}
];

const siteManagementRoutes: Array<RouteRecordRaw> = [
	{
		path: '/site',
		name: 'site',
		alias: '/site/view',
		children: [
			{ path: '', name: 'siteViewOrEdit', component: () => import('@views/Site/ViewOrEdit.vue') }
			// { path: '', name: 'siteManagement', component: () => import('@views/Site/List.vue') }
			// { path: '/new', name: 'newSite', component: () => import('@views/Site/EditOrNew.vue') },
			// { path: '/update/:id', name: 'updateSite', component: () => import('@views/Site/EditOrNew.vue') }
		]
	}
];

const deletingRoutes: Array<RouteRecordRaw> = [
	{ path: '/example', name: 'exampleForm', component: () => import('@views/Deleting/ExampleForm.vue'), meta: { layout: 'Default', title: 'Test Form' } },
	{ path: '/testForm', name: 'testForm', component: () => import('@views/Deleting/TestForm.vue'), meta: { layout: 'Default', title: 'Test Form' } },
	{ path: '/testTable', name: 'testTable', component: () => import('@views/Deleting/TestTable.vue'), meta: { layout: 'Default', title: 'Test Table' } },
	{ path: '/users', name: 'users', component: () => import('@views/Deleting/Page.vue'), meta: { layout: 'Default', title: 'Users' } }
];

const routes: Array<RouteRecordRaw> = [
	{ path: '/', alias: '/main', name: 'main', component: () => import('@views/Main/Content.vue') },

	...authRoutes,
	...categoryRoutes,
	...commentRoutes,
	...educationRoutes,
	...experienceRoutes,
	...postRoutes,
	...projectRoutes,
	...roleRoutes,
	...skillRoutes,
	...tagRoutes,
	...testimonialRoutes,
	...userRoutes,
	...fileManagementRoutes,
	...sectionManagementRoutes,
	...siteManagementRoutes,
	...deletingRoutes,

	{ path: '/errors', name: 'errors', component: () => import('@views/Errors.vue'), meta: { layout: 'Cover' } },
	{ path: '/:pathMatch(.*)*', redirect: '/errors' }
];

const router = createRouter({
	routes,
	// linkActiveClass: '-uk-active',
	linkExactActiveClass: 'uk-active',
	history: createWebHistory(),
	scrollBehavior(to, _from, savedPosition) {
		// always scroll to top
		if (savedPosition) return savedPosition;
		if (to.hash) return { el: to.hash, behavior: 'smooth' };
		else return { top: 0, behavior: 'smooth' };

		// return new Promise((resolve, reject) => {
		// 	setTimeout(() => {
		// 		resolve({ left: 0, top: 0, behavior: 'smooth' });
		// 	}, 500);
		// });
	}
});

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
	const publicPages = ['/login', '/register', '/forgot-password'];
	const authRequired = !publicPages.includes(to.path);
	const authStore = useAuthStore();

	if (authRequired && !authStore.user) next({ path: '/login', query: { returnUrl: to.path } }); // to.href
	else next();
});

export { routes, router };

export default router;