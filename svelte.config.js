import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { optimizeCss, optimizeImports } from "carbon-preprocess-svelte";


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [ vitePreprocess(), optimizeCss(), optimizeImports()],

	kit: {
		adapter: adapter()
	}
};

export default config;
