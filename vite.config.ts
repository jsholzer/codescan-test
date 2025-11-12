import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// this is a dumb change!
export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
