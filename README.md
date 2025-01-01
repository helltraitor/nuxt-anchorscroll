# nuxt-anchorscroll

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This module provides scroll implementation (scroll to top and scroll to anchor element).
Originally it was intended for anchor scrolling that's why it's called `nuxt-anchorscroll`

- [Online playground](https://stackblitz.com/github/helltraitor/nuxt-anchorscroll?file=playground%2Fapp.vue)

## Features

- Configured out of the box
- Supports both kinds of layouts*
- Extendable

### Configured out of the box

1. For top scroll - scroll instantly, until top with zero offset, ignore `x` axis
2. For anchor scroll - scroll smoothly, until top element with zero offset, ignore `x` axis
3. Surfaces - `html` and `body` elements
4. General function - scroll to anchor if element exist (uses `route.hash` as selector),
   otherwise to top - respects page meta `nuxt-anchorscroll` options

### Supports both kinds of layouts*

In common case, you use cropped html or full html. In first case (you can check this now)
scroll to anchor will not work. If it so, you can have a minimal setup.

But in case if anchor scroll is handled (by browser), you need additional setup -
full explanation in module playground.

### Extendable

Anchor scroll can be specified for needed route via `matched` field of `NuxtApp.$anchorScroll`
runtime configuration (default configuration setups before `script setup`)

```ts
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
        toAnchor: {
          target: targetElement as HTMLElement,
          scrollOptions: toValue(useNuxtApp().$anchorScroll?.defaults?.toAnchor) ?? {},
        },
      }
    }
  }
})
```

Also your matched function can specify different surfaces for scrolling.

```ts
nuxtApp.$anchorScroll!.matched.push(({ path, hash }) => {
  // Exit when route is not represent fixed example
  if (!path.startsWith('/scrollable'))
    return undefined

  const surfaces = [...document.querySelectorAll('#exited-scrollable-surface')]

  return {
    toAnchor: {
      surfaces,
      scrollOptions: {
        /* ... */
      },
    },
    toTop: {
      surfaces,
      scrollOptions: {
        /* ... */
      },
    }
  }
})
```

## Quick Setup

1. Add `nuxt-anchorscroll` dependency to your project

Use your favorite package manager (I prefer yarn)

```bash
yarn add -D nuxt-anchorscroll

pnpm add -D nuxt-anchorscroll

npm install --save-dev nuxt-anchorscroll
```

Or install it via `nuxi module`

```bash
npx nuxi@latest module add nuxt-anchorscroll
```

2. Add `nuxt-anchorscroll` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-anchorscroll',
  ]
})
```

3. Additionally, if you are using transitions, probably you also want to scroll on different hook

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-anchorscroll',
  ],

  anchorscroll: {
    hooks: [
      // Or any valid hook if needed
      // Default is `page:finish`
      'page:transition:finish',
    ],
  },
})
```

4. Additionally, if you using standard layout, see playground explanation.

That's it! You can now use `nuxt-anchorscroll` in your Nuxt app ✨

## Composable

Most probably that you want to scroll to anchor ro to top on click. That's possible via `useAnchorScroll` composable

```ts
// Default to top is instant
const { scrollToAnchor, scrollToTop } = useAnchorScroll({
  toTop: {
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: 0,
    }
  },
})
```

And use it in template

```html
<template>
  <div
    class="box"
    mt-12
    flex flex-row gap-4 align-baseline
  >
    <h2
      :id="id"
      text-3xl font-extrabold
    >
      <slot />
    </h2>
    <NuxtLink
      :href="`#${id}`"
      mb-a mt-a
      text-xl
      @click="scrollToAnchor(id)"
    >
      #
    </NuxtLink>
  </div>
</template>
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-anchorscroll/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-anchorscroll

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-anchorscroll.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-anchorscroll

[license-src]: https://img.shields.io/npm/l/nuxt-anchorscroll.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-anchorscroll

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
