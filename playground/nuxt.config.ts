import {
  presetAttributify as PresetAttributify,
  presetUno as PresetUno,
} from 'unocss'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
    '../src/module',
  ],
  devtools: { enabled: true },
  content: {
    highlight: {
      preload: [
        'js',
        'ts',
        'scss',
      ],
      theme: {
        default: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
  },
  unocss: {
    presets: [
      PresetAttributify(),
      PresetUno(),
    ],
  },
})
