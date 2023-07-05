import { toValue } from 'vue'

import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig, useRoute } from '#app'

const anchorScrollHook = () => {
  const { toAnchor, toTop } = useNuxtApp().$anchorScroll ?? {}

  const currentHash = toValue(toAnchor?.hash) ?? useRoute().hash

  if (toValue(useRoute().meta.anchorScrollToAnchor) && currentHash) {
    let anchorElement: HTMLElement | null = null

    try {
      anchorElement = document.querySelector(currentHash)
    }
    catch (error) {
      console.error('[AnchorScroll]: While select element from document, next error occurred:', error)
    }

    if (anchorElement) {
      const { left: elementLeft, top: elementTop } = anchorElement.getBoundingClientRect()
      const { behavior, offsetTop, offsetLeft } = toValue(toAnchor?.scroll) ?? {}

      const offsetLeftUnwrapped = toValue(offsetLeft)
      const offsetTopUnwrapped = toValue(offsetTop)

      const scrollByAnchor = {
        behavior: toValue(behavior),
        ...(offsetLeftUnwrapped === undefined ? {} : {left: elementLeft + offsetLeftUnwrapped}),
        ...(offsetTopUnwrapped === undefined ? {} : {top: elementTop + offsetTopUnwrapped}),
      }

      document.scrollingElement?.scrollBy(scrollByAnchor)
      document.body.scrollBy(scrollByAnchor)

      // Return only if anchor is worked
      return
    }
  }

  if (toValue(useRoute().meta.anchorScrollToTop)) {
    const { behavior, offsetTop, offsetLeft } = toValue(toTop?.scroll) ?? {}

    const offsetLeftUnwrapped = toValue(offsetLeft)
    const offsetTopUnwrapped = toValue(offsetTop)

    const scrollToTop = {
      behavior: toValue(behavior),
      ...(offsetLeftUnwrapped === undefined ? {} : { left: offsetLeftUnwrapped }),
      ...(offsetTopUnwrapped === undefined ? {} : { top: offsetTopUnwrapped }),
    }

    document.scrollingElement?.scrollTo(scrollToTop)
    document.body.scrollTo(scrollToTop)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const {
    hooks = [],
  } = useRuntimeConfig().public.anchorScroll ?? {}

  for (const hook of hooks)
    nuxtApp.hook(hook, anchorScrollHook)
})
