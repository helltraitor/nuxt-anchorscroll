# What is preferred layout?
By "preferred" layout I mean a page that use cropped html and extends page by its inner elements.

As I understand that is the most popular way to use `html\css` layout for advanced web programming.

Pros of using preferred layout:
1. Crop page allows to have more control of element sizes.
2. Less additional setup for any needs.

Cons of using preferred layout:
1. Required to reimplement some stuff on rare cases (such as anchorscroll, but I made this for you `:D`)

## How to setup preferred layout
First of all, you need to choose your root element. In most cases it's your application root.

As for nuxt it's `div#__nuxt`, so our `css` must:
1. Fix html sizes for having full space of page (required for cases when elements is not enough for occupy full page but centering required)
2. Body must pass this sizes to inner element (can be achieved via flex or setting same sizes)
3. Inner html must have at least parent sizes

Here is some opinionated setup for this case:
```scss
html {
  height: 100vh;
  width: 100vw;

  overflow: hidden;

  // Body is used as surface
  body {
    height: 100%;
    width: 100%;

    margin: 0;

    overflow-y: scroll;
    overflow-x: hidden;

    div#__nuxt {
      min-width: 100%;
      min-height: 100%;

      display: flex;
    }
  }
}
```

I choose to always show y-scroll on my pages because of header. You can freely experiment with this setup.

## Setup `nuxt-anchorscroll` for preferred layout
In first order, we need to set header offset if our header exist (or may occupy useful space on page and overlap inner elements)

```ts
nuxtApp.$anchorScroll!.defaults.toAnchor = () => ({
  behavior: 'smooth',
  // No offsetLeft means no scroll on X axis
  offsetTop: -(toValue(useNuxtApp().$headerHeight) ?? 0) * 1.2,
})
```

I use `offsetTop` equal to `headerHeight` + `20%` (for having some space above target element)

So for scrolling to anchor on page loading that is all requirements!
By default any page scroll to anchor or top (when unable to find anchor element)

That can be disabled by setting page meta:

```ts
// Disable all scrolls
definePageMeta({
  disableAnchorScroll: true,
})

// Disable, for example anchor
definePageMeta({
  disableAnchorScroll: {
    toAnchor: true,
  }
})
```

## Scroll to element by click
As you may note, all heading in this document (except first) have `#` sign that allow to scroll on this element.

What you need is to use provided composable and apply it on click event for needed element

```ts
const { scrollToAnchor, scrollToTop } = useAnchorScroll()

// In case if you want to change offset or surfaces, you may pass a new options
const { scrollToAnchor, scrollToTop } = useAnchorScroll({
  scrollOptions: {
    behavior: 'smooth',
    offsetTop: 0,
  }
})

// Or set different ones for both
const { scrollToAnchor, scrollToTop } = useAnchorScroll({
  toAnchor: {
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: 0,
    },
  }
  // And default for scrollToTop
})
```

Note that `useAnchorScroll` supports reactive value over passed one (no its field)

```ts
// useDynamicSurfaces() => MaybeRefOrGetter<AnchorScrollDeterminedOptions | AnchorScrollActionNoTarget | undefined>
const { scrollToAnchor } = useAnchorScroll(useDynamicSurfaces())
```

And then apply action on click for trigger element to target

```html
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
```

By default `scrollToAnchor` expects `id`, but supports a reactive value over `string` (id), element, or its options (string for selector `sr` and `id`)

That all what you need for using `nuxt-anchorscroll` for preferred layout.
