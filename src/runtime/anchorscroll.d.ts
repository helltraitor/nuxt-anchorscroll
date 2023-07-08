import type { MaybeRefOrGetter } from 'vue'
import type { RouteLocationNormalizedLoaded } from '.nuxt/vue-router'

import type { RuntimeNuxtHooks } from '#app'

type HookKeys = keyof RuntimeNuxtHooks


interface AnchorScrollPluginBuildOptions {
  anchorScroll?: {
    /**
     * Determines WHEN anchor scroll mechanism must be executed.
     *
     * Plugin provides next default key `'page:finish'`.
     *
     * Note: feel free to set any valid nuxt hook key
     * (e.g. `'page:transition:finish'`)
     */
    hooks?: HookKeys[]
  }
}

// ----------------------------------------------------------------------------
// |                         END  PluginBuild  REGION                         |
// ============================================================================



// ============================================================================
// |                         START  PageMeta  REGION                          |
// ----------------------------------------------------------------------------

/**
 * Disable anchor scroll partially for current page
 *
 * When both are true behavior is the same for
 * `disableAnchorScroll` on `true`
 */
interface AnchorScrollPageMetaDisabledOptions {
  /**
   * `undefined`: scroll is enabled for anchor
   *
   * `true`: scroll is disabled for anchor
   */
  toAnchor?: true

  /**
   * `undefined`: scroll is enabled for top
   *
   * `true`: scroll is disabled for top
   */
	toTop?: true
}

interface AnchorScrollPageMetaInjection {
  /**
   * Disable anchor scroll plugin for current page.
   * By default both enabled. Since matched and general functions
   * return scroll to top options and ONLY WHEN target provided
   * it becomes scroll to anchor...
   *
   * The matched functions are not called only when anchor scroll is
   * disabled for both at once (no matter by `true` value or an object
   * with both)
   *
   * `undefined`: both enabled
   *
   * `true`: disable both scroll to anchor and scroll to top
   *
   * `AnchorScrollPageMetaInjectionOptions`: disable one of scrolls
   */
  disableAnchorScroll?: AnchorScrollPageMetaDisabledOptions | true
}

// ----------------------------------------------------------------------------
// |                         END  PageMeta  REGION                            |
// ============================================================================



// ============================================================================
// |                         START  Runtime  REGION                           |
// ----------------------------------------------------------------------------

/**
 * Representation of needed actions in current "situation".
 *
 * By the "situation" word means not only current route,
 * but also invoked hook and application state. So that kind
 * of situation very relies on application state.
 *
 * ## Typical usage
 * The most typical usage is to provide reactive options
 * that depends on header height.
 *
 * ```html
 * <script setup lang="ts">
 * // By default general function provided and uses common.toAnchor and common.toTop
 * // If you don't use SPA and have the preferred layout (see playground / docs for more info)
 * //   probably, you don't need to change most of nuxt-anchorscroll
 * useNuxtApp().$anchorScroll.common.toAnchor = computed(() => {
 *   behavior: 'smooth',
 *
 *   // Use your provided value
 *   offsetTop: -useNuxtApp().$headerHeight,
 *
 *   // Or composable value
 *   offsetTop: -useHeaderHeight(),
 *
 *   // Or plain value, whatever
 *   offsetTop: -100,
 * })
 * </script>
 * ```
 */
export interface AnchorScrollOptions {
  /**
   * `undefined`: use browser default
   *
   * `ScrollBehavior`: use specified behavior
   */
  behavior?: ScrollBehavior

  /**
   * `undefined`: disable scroll on Y axis
   *
   * `number`: use specified offset
   */
  offsetTop?: number

  /**
   * `undefined`: disable scroll on X axis
   *
   * `number`: use specified offset
   */
  offsetLeft?: number
}

export interface AnchorScrollCommonOptions {

  /**
   * `undefined`: use default surfaces
   *
   * `HTMLElement[]`: scroll over all provided surfaces
   */
  surfaces?: HTMLElement[]

  /**
   * This options can be empty in case when you want to scroll not happened
   *
   * `AnchorScrollOptions`: use scroll options for scroll execution
   */
  scrollOptions: AnchorScrollOptions
}

export interface AnchorScrollToTopOptions extends AnchorScrollCommonOptions {}

export interface AnchorScrollToAnchorOptions extends AnchorScrollToTopOptions {
  /**
   * `HTMLElement`: scroll to anchor (by element)
   */
  target: HTMLElement
}

/**
 * This object will be provided to `nuxt-anchorscroll` mechanism.
 *
 * Values will be chosen accordingly `PageMeta.disableAnchorScroll`
 *
 * In case when one of needed values is `undefined`, next matched function
 * will be called and so until general.
 *
 * Note: you can use `PageMeta.disableAnchorScroll` in case
 * when evaluations may be expensive
 */
export interface AnchorScrollVariants {
  toAnchor?: AnchorScrollToAnchorOptions
  toTop?: AnchorScrollToTopOptions
}

type AnchorScrollMatchedFunction = (route: RouteLocationNormalizedLoaded, hook: keyof RuntimeNuxtHooks) => AnchorScrollVariants | false | undefined

interface AnchorScrollPluginRuntimeOptions {
  $anchorScroll?: {
    /**
     * Matched functions being called in order until first `AnchorScrollAction`
     * or `false` will ocurred. If no one result suitable (aforementioned type and value)
     * general function will called.
     *
     * Returned `false` value will mean that no action needed.
     *
     * Note: Set target in returned options for scroll to anchor
     */
    matched: AnchorScrollMatchedFunction[]

    /**
     * Called as the last function when no suitable value provided
     * by matched function.
     *
     * Plugin provides default implementation. Can be overridden
     * or decorated if needed.
     */
    general: AnchorScrollMatchedFunction

    /**
     * Any useful stuff can be bind here.
     *
     * Plugin provides next defaults:
     * ```ts
     * {
     *   toAnchor: {
     *     behavior: 'smooth',
     *     offsetTop: 0,
     *     // No offsetLeft means X axis is disabled
     *   },
     *
     *   toTop: {
     *     behavior: 'instant',
     *     offsetTop: 0,
     *     // No offsetLeft means X axis is disabled
     *   }
     * }
     * ```
     */
    defaults: {
      toAnchor?: MaybeRefOrGetter<AnchorScrollOptions | undefined>
      toTop?: MaybeRefOrGetter<AnchorScrollOptions | undefined>

    /**
     * Default surfaces for scrolling.
     *
     * Plugin provides default variants `html` and `body`
     * as more statistically used.
     *
     * Custom matched and general functions can use storage and composables instead
     */
      surfaces: MaybeRefOrGetter<HTMLElement[]>
    }
  }
}

// ----------------------------------------------------------------------------
// |                         END  Runtime  REGION                             |
// ============================================================================



declare module '@nuxt/schema' {
  interface PublicRuntimeConfig extends AnchorScrollPluginBuildOptions {}

  interface PageMeta extends AnchorScrollPageMetaInjection {}
}

declare module '#app' {
  interface NuxtApp extends AnchorScrollPluginRuntimeOptions {}

  interface PageMeta extends AnchorScrollPageMetaInjection {}
}

export {}
