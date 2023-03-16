export type NavItemType = {
	to?: {
		[k: string]: string;
	};
	icon?: string;
	title: string;
	htmlBefore?: string;
	htmlAfter?: string;
	disabled?: boolean;
	visible?: boolean;
	children?: Array<NavItemType>;
	isExternal?: boolean;
	_target?: string;
};

export default function (): NavItemType[] {
	return [
		{ to: { name: 'files' }, title: 'Files', htmlBefore: '<span uk-icon="file"></span>', htmlAfter: '', icon: 'file', disabled: false, visible: true },
		{ to: { name: 'main' }, title: 'Main', htmlBefore: '<span uk-icon="home"></span>', htmlAfter: '', icon: 'home', disabled: false, visible: true },
		{ to: { name: 'category' }, title: 'Category', htmlBefore: '<span uk-icon="bookmark"></span>', htmlAfter: '', icon: 'bookmark', disabled: false, visible: true },
		{ to: { name: 'comment' }, title: 'Comment', htmlBefore: '<span uk-icon="comments"></span>', htmlAfter: '', icon: 'comments', disabled: false, visible: true },
		{ to: { name: 'education' }, title: 'Education', htmlBefore: '<span uk-icon="user"></span>', htmlAfter: '', icon: 'user', disabled: false, visible: true },
		{ to: { name: 'experience' }, title: 'Experience', htmlBefore: '<span uk-icon="heart"></span>', htmlAfter: '', icon: 'heart', disabled: false, visible: true },
		{ to: { name: 'post' }, title: 'Post', htmlBefore: '<span uk-icon="pencil"></span>', htmlAfter: '', icon: 'pencil', disabled: false, visible: true },
		{ to: { name: 'project' }, title: 'Project', htmlBefore: '<span uk-icon="thumbnails"></span>', htmlAfter: '', icon: 'thumbnails', disabled: false, visible: true },
		{ to: { name: 'role' }, title: 'Role', htmlBefore: '<span uk-icon="bolt"></span>', htmlAfter: '', icon: 'bolt', disabled: false, visible: true },
		{ to: { name: 'section' }, title: 'Section', htmlBefore: '<span uk-icon="pagekit"></span>', htmlAfter: '', icon: 'pagekit', disabled: false, visible: true },
		{ to: { name: 'skill' }, title: 'Skill', htmlBefore: '<span uk-icon="star"></span>', htmlAfter: '', icon: 'star', disabled: false, visible: true },
		{ to: { name: 'tag' }, title: 'Tag', htmlBefore: '<span uk-icon="tag"></span>', htmlAfter: '', icon: 'tag', disabled: false, visible: true },
		{ to: { name: 'testimonial' }, title: 'Testimonial', htmlBefore: '<span uk-icon="commenting"></span>', htmlAfter: '', icon: 'commenting', disabled: false, visible: true },
		{ to: { name: 'user' }, title: 'Users', htmlBefore: '<span uk-icon="users"></span>', htmlAfter: '', icon: 'users', disabled: false, visible: true },
		{ to: { name: 'testForm' }, title: 'Test Form', htmlBefore: '<span uk-icon="album"></span>', htmlAfter: '', icon: 'album', disabled: true, visible: false },
		{ to: { name: 'testTable' }, title: 'Test Table', htmlBefore: '<span uk-icon="table"></span>', htmlAfter: '', icon: 'table', disabled: true, visible: false },
		{ to: { name: 'errors' }, title: 'Errors', htmlBefore: '<span uk-icon="info"></span>', htmlAfter: '', icon: 'info', disabled: true, visible: false }
	] satisfies NavItemType[];
}