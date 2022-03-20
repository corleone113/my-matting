import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	base: '',
	resolve: {
		alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
	},
	plugins: [vue()],
	build: {
		assetsDir: '.',
		outDir: 'docs',
	},
});
