// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from '@astrojs/cloudflare';
import '@fontsource/lato';


// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    }, 
    output: 'server',
    adapter: cloudflare()
});
