import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: adapter({
			assets: true,
			dynamic_origin: true
		}),
		alias: {
			'@/*': './src/lib'
		}
	}
};

export default config;
