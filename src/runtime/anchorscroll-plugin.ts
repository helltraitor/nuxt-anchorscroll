import { toValue } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import type { RuntimeNuxtHooks } from 'nuxt/app'
import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app'

import type { AnchorScrollVariants } from './anchorscroll'

const generalAnchorScroll = ({ hash }: RouteLocationNormalizedLoaded): AnchorScrollVariants => {
  const scrollVariants: AnchorScrollVariants = {
    toTop: {
      scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults.toTop) || {},
    },
  }

  if (hash !== '') {
    try {
      const target = document.querySelector(hash) as HTMLElement | null

      if (!target) {
        console.error(`[AnchorScroll]: unable to find element with selector '${hash}'`)
        return scrollVariants
      }

      scrollVariants.toAnchor = {
        target,
        scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults.toAnchor) ?? {},
      }
    }
    catch (error) {
      // In case of error, exit anchor branch
      console.error(`[AnchorScroll]: unable to get element for selector '${hash}':`, error)
    }
  }

  return scrollVariants
}

const anchorScrollExecutor = (hook: keyof RuntimeNuxtHooks) => {
  const nuxtApp = useNuxtApp()

  const currentRoute = nuxtApp.$router.currentRoute
  const disableAnchorScroll = currentRoute.value.meta.disableAnchorScroll ?? {}

  const {
    toAnchor: disableToAnchor = false,
    toTop: disableToTop = false,
  } = disableAnchorScroll === true ? { toAnchor: true, toTop: true } : disableAnchorScroll

  if (disableToAnchor && disableToTop)
    return

  const allMatched = [...nuxtApp?.$anchorScroll?.matched ?? [], generalAnchorScroll]

  for (const matched of allMatched) {
    const maybeAnchorScrollAlternatives = matched(currentRoute.value, hook)
    if (maybeAnchorScrollAlternatives === false)
      return

    const { toAnchor, toTop } = maybeAnchorScrollAlternatives ?? {}

    if (!disableToAnchor && toAnchor) {
      const {
        target,
        scrollOptions: { behavior, offsetLeft, offsetTop },
        surfaces = toValue(nuxtApp.$anchorScroll?.defaults.surfaces) ?? [],
      } = toAnchor

      const { top, left } = target.getBoundingClientRect()

      const scrollToAnchorOptions = {
        behavior,
        ...(offsetLeft !== undefined && { left: left + offsetLeft }),
        ...(offsetTop !== undefined && { top: top + offsetTop }),
      }

      for (const surface of surfaces)
        surface.scrollBy(scrollToAnchorOptions)

      return
    }

    if (!disableToTop && toTop) {
      const {
        scrollOptions: { behavior, offsetLeft, offsetTop },
        surfaces = toValue(nuxtApp.$anchorScroll?.defaults.surfaces) ?? [],
      } = toTop

      const scrollToTopOptions = {
        behavior,
        left: offsetLeft,
        top: offsetTop,
      }

      for (const surface of surfaces)
        surface.scrollTo(scrollToTopOptions)
    }
  }
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
