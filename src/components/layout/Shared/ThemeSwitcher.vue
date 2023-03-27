<template>
	<a @click="toggleTheme">
		<span v-if="userTheme === 'dark'" data-uk-tooltip data-uk-icon="icon: eye" title="Light Mode"></span>
		<span v-if="userTheme === 'light'" data-uk-tooltip data-uk-icon="icon: eye-slash" title="Dark Mode"></span>
	</a>
</template>

<script setup lang="ts">
	export type UserTheme = "light" | "dark";

	const setTheme = (theme: UserTheme) => {
		localStorage.setItem("user-theme", theme);
		userTheme.value = theme;
		document.documentElement.className = theme;
	};

	const getTheme = (): UserTheme => {
		return localStorage.getItem("user-theme") as UserTheme;
	};

	const toggleTheme = (e: Event): void => {
		e.preventDefault();
		const activeTheme = localStorage.getItem("user-theme");
		if (activeTheme === "light") setTheme("dark");
		else setTheme("light");
	};

	const getMediaPreference = (): UserTheme => {
		const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (hasDarkPreference) return "dark";
		else return "light";
	};

	const userTheme = ref<UserTheme>(getTheme() || getMediaPreference());

	onMounted(() => setTheme(userTheme.value));
</script>