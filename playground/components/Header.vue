<script setup lang="ts">
import '@/assets/css/linked.sass'

import { computed, ref, useNuxtApp } from '#imports'

const headerElement = ref<HTMLElement | undefined>()
const headerHeight = computed(() => headerElement.value?.clientHeight ?? 0)

useNuxtApp().$headerHeight = headerHeight
</script>

<template>
  <header
    ref="headerElement"
    sticky top-0 z-10 block flex flex-row p-8 backdrop-blur-sm
  >
    <div m-inline-s-5p lt-md:hidden />
    <div m-inline-s-1p md:hidden />

    <div class="label">
      <NuxtLink class="linked" to="/">
        <span lt-md:hidden>nuxt-anchorscroll</span>
        <span md:hidden>as_</span>
      </NuxtLink>
    </div>
    <div style="margin-inline: auto;" />
    <nav text-base>
      <NuxtLink class="linked" to="/preferred/explanation">
        Preferred
      </NuxtLink>
      <NuxtLink class="linked" to="/standard/explanation">
        Standard
      </NuxtLink>
      <NuxtLink class="linked" href="https://github.com/helltraitor/nuxt-anchorscroll" target="_blank">
        <span lt-md:hidden>GitHub</span>
        <div i-carbon:logo-github md:hidden title="GitHub" />
      </NuxtLink>
      <NuxtLink class="linked" to="https://helltraitor.github.io/blog">
        <span lt-md:hidden>Blog</span>
        <div i-carbon:blog md:hidden title="Blog" />
      </NuxtLink>
    </nav>

    <div m-inline-e-5p lt-md:hidden />
    <div m-inline-e-1p md:hidden />
  </header>
</template>

<style scoped lang="sass">
.label
  font-family: 'Courier New', Courier, monospace
  font-size: 22px

nav
  display: grid
  grid-auto-flow: column
  grid-template-columns: auto max-content
  gap: 1.2rem
  box-sizing: border-box

  *
    align-self: center
    margin: auto
    backface-visibility: hidden
</style>
