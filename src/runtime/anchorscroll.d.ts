import type { MaybeRefOrGetter } from 'vue'
import type { RuntimeNuxtHooks } from '#app'

type HookKeys<T> = keyof T & string

export interface ScrollOptions {
  behavior?: MaybeRefOrGetter<ScrollBehavior>
  offsetTop?: MaybeRefOrGetter<number | undefined>
  offsetLeft?: MaybeRefOrGetter<number | undefined>
}

interface AnchorScrollPageMetaInjection {
  /**
   * Scrolls to anchor if hash provided and element exist on page. Otherwise does nothing
   */
  anchorScrollToAnchor?: MaybeRefOrGetter<boolean>

  /**
   * Scrolls to top when [`scrollToAnchor`](AnchorScrollPageMetaInjection.scrollToAnchor) is not provided.
   * When it is and scroll to anchor failed (when element is not exist or hash is incorrect), then scrolls to top.
   */
  anchorScrollToTop?: MaybeRefOrGetter<boolean>
}

interface AnchorScrollPluginBuildOptions {
  anchorScroll?: {
    hooks?: HookKeys<RuntimeNuxtHooks>[]
  }
}

interface AnchorScrollPluginRuntimeOptions {
  $anchorScroll?: {
    toAnchor?: {
      hash?: MaybeRefOrGetter<string>
      scroll?: MaybeRefOrGetter<ScrollOptions>
    }
    toTop?: {
      scroll?: MaybeRefOrGetter<ScrollOptions>
    }
  }
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig extends AnchorScrollPluginBuildOptions {}
}

declare module '#app' {
  interface NuxtApp extends AnchorScrollPluginRuntimeOptions {}

  interface PageMeta extends AnchorScrollPageMetaInjection {}
}

export {}
