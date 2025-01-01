import {
  presetAttributify as PresetAttributify,
  presetIcons as PresetIcons,
  presetUno as PresetUno,
} from 'unocss'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

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

  imports: {
    autoImport: false,
  },

  unocss: {
    presets: [
      PresetAttributify(),
      PresetIcons({
        prefix: 'i-',
        scale: 1.2,
        warn: true,
      }),
      PresetUno(),
    ],
  },

  compatibilityDate: '2025-01-01',
})
