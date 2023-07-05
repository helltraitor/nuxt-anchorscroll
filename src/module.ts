import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'

import type { RuntimeNuxtHooks } from '#app'

type HookKeys<T> = keyof T & string

export interface ModuleOptions {
  hooks: HookKeys<RuntimeNuxtHooks>[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-anchorscroll',
    configKey: 'anchorscroll'
  },
  defaults: {
    hooks: ['page:finish'],
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.anchorScroll = { ...options }

    addPlugin(resolver.resolve('./runtime/anchorscroll.client'))
    addImportsDir(resolver.resolve('./runtime/types'))
    addImportsDir(resolver.resolve('./runtime/composables'))
  }
})
