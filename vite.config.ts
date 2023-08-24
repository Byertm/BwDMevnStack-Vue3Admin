import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
			imports: ['vue', 'vue-router', 'pinia', { from: 'vue-router', imports: ['RouteLocationRaw'], type: true }],
			dts: true,
			cache: false,
			vueTemplate: true,
			eslintrc: { enabled: true }
		})
	],
	resolve: {
		alias: {
			'@components': fileURLToPath(new URL('./src/components', import.meta.url)),
			'@services': fileURLToPath(new URL('./src/services', import.meta.url)),
			'@helpers': fileURLToPath(new URL('./src/helpers', import.meta.url)),
			'@plugins': fileURLToPath(new URL('./src/plugins', import.meta.url)),
			'@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
			'@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
			'@router': fileURLToPath(new URL('./src/router', import.meta.url)),
			'@models': fileURLToPath(new URL('./src/models', import.meta.url)),
			'@views': fileURLToPath(new URL('./src/views', import.meta.url)),
			'@public': fileURLToPath(new URL('./public', import.meta.url)),
			'@types': fileURLToPath(new URL('./src/types', import.meta.url)),
			'@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
			'@data': fileURLToPath(new URL('./src/data', import.meta.url)),
			'@dist': fileURLToPath(new URL('./dist', import.meta.url)),
			'@src': fileURLToPath(new URL('./src', import.meta.url)),
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'~': fileURLToPath(new URL('./', import.meta.url)),
			'@nodemodules': fileURLToPath(new URL('./nodemodules', import.meta.url))
		}
	},
	server: {
		open: false,
		// cors: false,
		// proxy: {
		// 	'/api': {
		// 		target: 'http://localhost:9000/',
		// 		changeOrigin: true,
		// 		secure: false,
		// 		rewrite: (path) => path.replace(/^\/api/, '')
		// 	}
		// }
	}
});