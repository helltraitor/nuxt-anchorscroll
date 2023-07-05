import {
  presetAttributify as PresetAttributify,
  presetUno as PresetUno,
} from 'unocss'

export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@unocss/nuxt',
  ],
  devtools: { enabled: true },
  unocss: {
    presets: [
      PresetAttributify(),
      PresetUno(),
    ],
  },
})
