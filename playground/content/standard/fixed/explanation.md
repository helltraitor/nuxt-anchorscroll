# How to fix standard layout

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Click on me -->

## Okay, let's get started
Note: you can click on current `#` and reload page to see smooth animation on loading.

The bad news that is possible only if you CREATE this elements, or can REPLACE ALL anchors by mangled ones.

For rendering this page used alternative `ProseH2Fixed.vue` element. In contrast to already existed `ProseH2.vue`, this element define anchor in the next way:

```ts
const fixedId = `fixed-${id}`
```

```html
<h2
  :id="fixedId"
  text-3xl font-extrabold
>
  <slot />
</h2>
<!-- NOTE ID IS ORIGINAL -->
<NuxtLink
  :href="`#${id}`"
  mb-a mt-a
  text-xl
  @click="scrollToAnchor(fixedId)"
>
  #
</NuxtLink>
```

That's all. Just set hash that you want to be seen, and use mangled one for exact element.

## What about reloading
For fixing this issue I created matched system in `nuxt-anchorscroll`

You can replace default general function and provide your own implementation, but for this playground, I added SPECIALIZATION.

Let's take a look
```ts
// Add route specialization for fixed solution
nuxtApp.$anchorScroll!.matched.push(({ path, hash }) => {
  // Exit when route is not represent fixed example
  if (!path.startsWith('/standard/fixed'))
    return undefined

  if (hash) {
    // All anchor element on this route is mangled
    const targetSelector = `#fixed-${hash.slice(1)}`
    const targetElement = document.querySelector(targetSelector)
    if (targetElement) {
      return {
        target: targetElement as HTMLElement,
        scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults?.toAnchor) ?? {}
      }
    }
    // In case when no target found, fallback to top
  }

  return {
    scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults?.toTop) ?? {}
  }
})
```

This is code from setup script of this `app.vue`. The `$anchorScroll` is provided by plugin and must exist at this stage, so you don't have to write matched extension in any special hook.

This function can be simplified in case if you want to use general function for fallback:

```ts
nuxtApp.$anchorScroll!.matched.push(({ path, hash }) => {
  // Exit when route is not represent fixed example
  if (!hash || !path.startsWith('/standard/fixed'))
    return undefined

  // All anchor element on this route is mangled
  const targetSelector = `#fixed-${hash.slice(1)}`
  const targetElement = document.querySelector(targetSelector)

  if (!targetElement)
    return undefined

  return {
    target: targetElement as HTMLElement,
    scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults?.toAnchor) ?? {}
  }
})
```

Matched function can return the following values:
1. `undefined` in case when function don't match (next function will be called)
2. `false` in case when function matched but no action needed (no scroll to top or anchor)
3. scrollToTop or scrollToAnchor options (read next)

The `scrollTo*` must specify `scrollOptions` and can specify `target` and `surfaces`. In case when target specified, `scrollToTop` becomes `scrollToAnchor`:

```ts
return {
  target: realHtmlElement,
  scrollOptions: {
    // Any what you like
  }
}
```
