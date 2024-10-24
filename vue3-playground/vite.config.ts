import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue3 from '@vitejs/plugin-vue'
import {baseBuildConfig, defaultPlugins} from '../vite.base.config'
import tailwindConfig from '../tailwind.config.js';

export const viteVue3Config = defineConfig({
    plugins: [vue3(), ...defaultPlugins],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            'vue': resolve(__dirname, '../node_modules/vue/dist/vue.runtime.esm-browser.js'),
            'vue-demi': resolve(__dirname, '../node_modules/vue-demi/lib/v3/index.mjs'),
        },
    },
    css: {
        postcss: {
            plugins: [
                require('tailwindcss')(tailwindConfig),
                require('autoprefixer'),
            ],
        },
    },
    ...baseBuildConfig,
})

export default viteVue3Config
