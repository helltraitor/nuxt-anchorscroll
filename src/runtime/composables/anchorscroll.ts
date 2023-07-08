import { type MaybeRefOrGetter, computed, toValue } from 'vue'
import { useNuxtApp } from 'nuxt/app'

import type { AnchorScrollCommonOptions, AnchorScrollVariants } from '../anchorscroll'

type AnchorScrollComposableOptions = AnchorScrollVariants | AnchorScrollCommonOptions | undefined

interface ScrollToAnchorOptions {
  /**
   * Id of the element on page. First # is stripped
   */
  id?: MaybeRefOrGetter<string>
  /**
   * Selector of element on page
   */
  sr?: MaybeRefOrGetter<string>
}

interface AnchorScrollComposables {
  /**
   * The function for scroll to anchor. The anchor can be reactive element or its id.
   * The function can be used within the [`scrollToTop`](AnchorScrollComposables.scrollToTop)
   * ```html
   * <div @click="scrollToAnchor(id) || scrollToTop()">
   *   <!-- Scroll to anchor or to top when its not found -->
   * </div>
   * ```
   *
   * @param id Reactive element or id value. First # is stripped. Can be reactive [`ScrollToAnchorOptions`](ScrollToAnchorOptions)
   * @returns [`true`](true) when scroll to anchor succeed, otherwise [`false`](false)
   */
  scrollToAnchor: (id: MaybeRefOrGetter<ScrollToAnchorOptions | HTMLElement | string>) => boolean

  /**
   * The function for scroll to top. Can be used as shortcut
   */
  scrollToTop: () => void
}

/**
 * Produce composables with provided settings (can be reactive).
 */
export const useAnchorScroll = (options: MaybeRefOrGetter<AnchorScrollComposableOptions> = {}): AnchorScrollComposables => {
  const toAnchorSurfaces = computed(() => {
    const unwrappedOptions = toValue(options)
    return (
      (unwrappedOptions as AnchorScrollCommonOptions | undefined)?.surfaces
      ?? (unwrappedOptions as AnchorScrollVariants | undefined)?.toAnchor?.surfaces
      ?? toValue(useNuxtApp().$anchorScroll?.defaults.surfaces)
      ?? []
    )
  })

  const toAnchorScrollOptions = computed(() => {
    const unwrappedOptions = toValue(options)
    return (
      (unwrappedOptions as AnchorScrollCommonOptions | undefined)?.scrollOptions
      ?? (unwrappedOptions as AnchorScrollVariants | undefined)?.toAnchor?.scrollOptions
      ?? toValue(useNuxtApp().$anchorScroll?.defaults?.toAnchor)
    )
  })

  const toTopSurfaces = computed(() => {
    const unwrappedOptions = toValue(options)
    return (
      (unwrappedOptions as AnchorScrollCommonOptions | undefined)?.surfaces
      ?? (unwrappedOptions as AnchorScrollVariants | undefined)?.toTop?.surfaces
      ?? toValue(useNuxtApp().$anchorScroll?.defaults.surfaces)
      ?? []
    )
  })

  const toTopScrollOptions = computed(() => {
    const unwrappedOptions = toValue(options)
    return (
      (unwrappedOptions as AnchorScrollCommonOptions | undefined)?.scrollOptions
      ?? (unwrappedOptions as AnchorScrollVariants | undefined)?.toTop?.scrollOptions
      ?? toValue(useNuxtApp().$anchorScroll?.defaults?.toTop)
    )
  })

  return {
    scrollToAnchor(target) {
      const maybeElement = toValue(target)

      let anchorElement: HTMLElement | null = null

      if (typeof maybeElement === 'string') {
        anchorElement = document.getElementById(maybeElement.replace(/^#/, ''))
      }
      else if (maybeElement instanceof HTMLElement) {
        anchorElement = maybeElement
      }
      else {
        const elementId = toValue(maybeElement.id)
        const elementSelector = toValue(maybeElement.sr)

        if (elementId) {
          anchorElement = document.getElementById(elementId.replace(/^#/, ''))
        }
        else if (elementSelector) {
          try {
            anchorElement = document.querySelector(elementSelector)
          }
          catch (error) {
            console.error('[useAnchorScroll]: While select element from document, next error occurred:', error)
          }
        }
        else {
          console.error(
            '[useAnchorScroll]: Wrong object provided to scrollToAnchor composable:',
            'either \'id\' and \'sr\' (selector) are not provided in object',
            maybeElement,
          )
        }
      }

      if (!anchorElement)
        return false

      const { top, left } = anchorElement.getBoundingClientRect()

      const { behavior, offsetLeft, offsetTop } = toValue(toAnchorScrollOptions) ?? {}

      const scrollToAnchorOptions = {
        behavior,
        ...(offsetLeft !== undefined && { left: left + offsetLeft }),
        ...(offsetTop !== undefined && { top: top + offsetTop }),
      }

      for (const surface of toValue(toAnchorSurfaces))
        surface.scrollBy(scrollToAnchorOptions)

      return true
    },

    scrollToTop() {
      const { behavior, offsetLeft, offsetTop } = toValue(toTopScrollOptions) ?? {}

      const scrollToTopOptions = {
        behavior,
        left: offsetLeft,
        top: offsetTop,
      }

      for (const surface of toValue(toTopSurfaces))
        surface.scrollTo(scrollToTopOptions)
    },
  }
}
