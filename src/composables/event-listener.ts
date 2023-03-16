import { onMounted, onUnmounted } from 'vue';

export function useEventListener(target: (Window & typeof globalThis) | Element | HTMLElement, event: string, callback: (event?: any) => any) {
	// if you want, you can also make this
	// support selector strings as target
	onMounted(() => target.addEventListener(event, callback));
	onUnmounted(() => target.removeEventListener(event, callback));
}