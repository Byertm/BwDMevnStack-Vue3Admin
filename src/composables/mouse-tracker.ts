// mouse.js
import { ref } from 'vue';
import { useEventListener } from '@src/composables/event-listener';

// by convention, composable function names start with "use"
export function useMouse() {
	// state encapsulated and managed by the composable
	const x = ref(0);
	const y = ref(0);

	useEventListener(window, 'mousemove', (event: MouseEvent) => {
		x.value = event.pageX;
		y.value = event.pageY;
	});

	// expose managed state as return value
	return { x, y };
}