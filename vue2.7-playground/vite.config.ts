import { resolve } from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import { baseBuildConfig, defaultPlugins } from '../vite.base.config'
import tailwindConfig from '../tailwind.config.js';

export const viteVue2Config = defineConfig({
  plugins: [vue2(), ...defaultPlugins],
  server: {
    port: 2700,
  },
  resolve: {
    alias: {
      'vue': resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
      'vue-demi': resolve(__dirname, '../node_modules/vue-demi/lib/v2.7/index.mjs'),
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
  build: {
    ...(baseBuildConfig as UserConfig).build,
    outDir: resolve(__dirname, '../dist/v2.7'),
  },
})

export default viteVue2Config
