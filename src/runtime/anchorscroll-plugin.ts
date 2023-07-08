import type { AnchorScrollAction } from './anchorscroll'
import type { RouteLocationNormalizedLoaded } from '.nuxt/vue-router'

import { type RuntimeNuxtHooks, defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from '#app'

const generalAnchorScroll = (route: RouteLocationNormalizedLoaded): AnchorScrollAction => {
  if (route.hash !== '') {
    try {
      const target = document.querySelector(route.hash) as HTMLElement | null
      if (target) {
        return {
          target,
          scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults.toAnchor) ?? {},
        }
      }

      // In case of null, exit anchor branch
      console.error(`[AnchorScroll]: unable to find element with selector '${route.hash}'`)
    }
    catch (error) {
      // In case of error, exit anchor branch
      console.error(`[AnchorScroll]: unable to get element for selector '${route.hash}':`, error)
    }
  }

  // No hash or anchor is not found
  return {
    scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults.toTop) || {},
  }
}

const anchorScrollExecutor = (hook: keyof RuntimeNuxtHooks) => {
  const nuxtApp = useNuxtApp()

  const { currentRoute } = useRouter()
  const disableAnchorScroll = currentRoute.value.meta.disableAnchorScroll ?? {}

  const {
    toAnchor: disableToAnchor = false,
    toTop: disableToTop = false,
  } = disableAnchorScroll === true ? { toAnchor: true, toTop: true } : disableAnchorScroll

  if (disableToAnchor && disableToTop)
    return

  let maybeAnchorScrollAction: AnchorScrollAction | false | undefined
  nuxtApp.$anchorScroll?.matched?.find((matched) => {
    maybeAnchorScrollAction = matched(currentRoute.value, hook)
    return maybeAnchorScrollAction !== undefined
  })

  if (maybeAnchorScrollAction === undefined)
    maybeAnchorScrollAction = nuxtApp.$anchorScroll?.general(currentRoute.value, hook)

  if (maybeAnchorScrollAction === undefined) {
    console.warn(`[AnchorScroll]: unable to get scroll action for hook '${hook}' and next route`, currentRoute.value)
    return
  }

  // Match, no action needed
  if (maybeAnchorScrollAction === false)
    return

  const {
    target,
    scrollOptions,
    surfaces = toValue(nuxtApp.$anchorScroll?.defaults?.surfaces),
  } = maybeAnchorScrollAction

  // Action is anchor
  if (target !== undefined) {
    // But scroll is disabled
    if (disableToAnchor)
      return

    const { top, left } = target.getBoundingClientRect()

    const scrollToAnchorOptions = {
      behavior: scrollOptions.behavior,
      ...(scrollOptions.offsetLeft !== undefined && { left: left + scrollOptions.offsetLeft }),
      ...(scrollOptions.offsetTop !== undefined && { top: top + scrollOptions.offsetTop }),
    }

    for (const surface of surfaces ?? [])
      surface.scrollBy(scrollToAnchorOptions)

    // At this moment
    return
  }

  // Action is top
  // But scroll is disabled
  if (disableToTop)
    return

  const scrollToTopOptions = {
    behavior: scrollOptions.behavior,
    left: scrollOptions.offsetLeft,
    top: scrollOptions.offsetTop,
  }

  for (const surface of surfaces ?? [])
    surface.scrollTo(scrollToTopOptions)
}

export default defineNuxtPlugin((nuxtApp) => {
  const {
    hooks = [],
  } = useRuntimeConfig().public.anchorScroll ?? {}

  // const uninitSurface = Symbol() as any as HTMLElement

  useNuxtApp().$anchorScroll = {
    matched: [],
    general: generalAnchorScroll,
    defaults: {
      toAnchor: {
        behavior: 'smooth',
        offsetTop: 0,
      },
      toTop: {
        behavior: 'instant',
        offsetTop: 0,
      },
      surfaces: () => [document.documentElement, document.body],
    },
  }

  for (const hook of hooks)
    nuxtApp.hook(hook, () => anchorScrollExecutor(hook))
})
