# What is standard layout
By "standard" layout I mean a page that takes at least available size and extends it directly by providing element.

As I assume, that way of using `html\css` layout may lead to unintended consequences.

And that statement is fully true for `nuxt-anchorscroll`.
This page represents the using of `nuxt-anchorscroll` module with standard layout that is NOT PREPARED for this (be patient and you will receive solution for standard layout).

Pros of using standard layout:
1. More clearly when elements are using available space.

Cons of using standard layout:
1. Some things works not like devs wanted (e.g. anchor scroll)

## Hot to setup standard layout
All you need is just set minimal size to full available and pass them to children.

```scss
html {
  min-height: 100%;
  min-width: 100%;

  body {
    height: 100%;
    width: 100%;

    margin: 0;

    div#__nuxt {
      height: 100%;
      width: 100%;

      display: flex;
    }
  }
}
```

I don't use this layout for my personal blog nor as default for this playground docs (But I replace preferred layout with the standard for this page).

You can read preferred layout explanation because for this page is similar.

## How to fix anchor for standard layout
Fix is interested and not trivial. It can be applied only if you fully control all anchors on page.

[`Read fix documentation (click on me)`](/standard/fixed/explanation)
