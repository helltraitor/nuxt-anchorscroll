import { type MaybeRefOrGetter, type Ref, computed, toValue } from "vue"
import type { ScrollOptions } from "../anchorscroll"
import { useNuxtApp } from "nuxt/app"

interface AnchorScrollDeterminedOptions {
  toAnchor?: MaybeRefOrGetter<ScrollOptions>
  toTop?: MaybeRefOrGetter<ScrollOptions>
}

interface AnchorScrollComposableOptions extends AnchorScrollDeterminedOptions {
  common?: MaybeRefOrGetter<ScrollOptions>
}

type AnchorScrollComposableValue = AnchorScrollComposableOptions | ScrollOptions | undefined

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
 * Repack any composable value as pair of determined ones
 */
const selectScrollOptions = (options: MaybeRefOrGetter<AnchorScrollComposableValue> = undefined): AnchorScrollDeterminedOptions => {
  return {
    toAnchor: computed(() => {
      const optionsValue = toValue(options)
      if (typeof optionsValue === 'undefined') {
        return useNuxtApp().$anchorScroll?.toAnchor?.scroll
      }

      const maybeScrollOptions = optionsValue as ScrollOptions
      if (maybeScrollOptions.behavior || maybeScrollOptions.offsetLeft || maybeScrollOptions.offsetTop) {
        return maybeScrollOptions
      }

      const composablesOptions = optionsValue as AnchorScrollComposableOptions
      return composablesOptions.toAnchor ?? composablesOptions.common ?? useNuxtApp().$anchorScroll?.toAnchor?.scroll
    }) as Ref<ScrollOptions>,

    toTop: computed(() => {
      const optionsValue = toValue(options)
      if (typeof optionsValue === 'undefined') {
        return useNuxtApp().$anchorScroll?.toTop?.scroll
      }

      const maybeScrollOptions = optionsValue as ScrollOptions
      if (maybeScrollOptions.behavior || maybeScrollOptions.offsetLeft || maybeScrollOptions.offsetTop) {
        return maybeScrollOptions
      }

      const composablesOptions = optionsValue as AnchorScrollComposableOptions
      return composablesOptions.toTop ?? composablesOptions.common ?? useNuxtApp().$anchorScroll?.toTop?.scroll
    }) as Ref<ScrollOptions>
  }
}

/**
 * Produce composables with provided settings (can be reactive).
 */
export const useAnchorScroll = (options: MaybeRefOrGetter<AnchorScrollComposableValue>): AnchorScrollComposables => {
  const { toAnchor, toTop } = selectScrollOptions(options)

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

      const { top: elementTop, left: elementLeft } = anchorElement.getBoundingClientRect()

      const { behavior, offsetLeft, offsetTop } = toValue(toAnchor) ?? {}

      const offsetLeftUnwrapped = toValue(offsetLeft)
      const offsetTopUnwrapped = toValue(offsetTop)

      const scrollByAnchor = {
        behavior: toValue(behavior),
        ...(offsetLeftUnwrapped === undefined ? {} : {left: elementLeft + offsetLeftUnwrapped}),
        ...(offsetTopUnwrapped === undefined ? {} : {top: elementTop + offsetTopUnwrapped}),
      }

      document.scrollingElement?.scrollBy(scrollByAnchor)
      document.body.scrollBy(scrollByAnchor)

      return true
    },

    scrollToTop() {
      const { behavior, offsetLeft, offsetTop } = toValue(toTop) ?? {}

      const offsetLeftUnwrapped = toValue(offsetLeft)
      const offsetTopUnwrapped = toValue(offsetTop)

      const scrollToTop = {
        behavior: toValue(behavior),
        ...(offsetLeftUnwrapped === undefined ? {} : { left: offsetLeftUnwrapped }),
        ...(offsetTopUnwrapped === undefined ? {} : { top: offsetTopUnwrapped }),
      }

      document.scrollingElement?.scrollTo(scrollToTop)
      document.body.scrollTo(scrollToTop)
    },
  }
}
