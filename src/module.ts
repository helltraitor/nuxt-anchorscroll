import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'

import type { RuntimeNuxtHooks } from '#app'

type HookKeys<T> = keyof T

export interface ModuleOptions {
  hooks: HookKeys<RuntimeNuxtHooks>[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-anchorscroll',
    configKey: 'anchorscroll',
    compatibility: {
      nuxt: '^3.0.0',
    },
    version: '1.0.0-rc.1',
  },
  defaults: {
    hooks: ['page:finish'],
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.anchorScroll = { ...options }

    addPlugin(resolver.resolve('./runtime/anchorscroll-plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))
  }
})
