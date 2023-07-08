<script setup lang="ts">
import '@/assets/css/preferred.sass'
import '@/assets/css/standard.sass'

const nuxtApp = useNuxtApp()

// Set custom anchor with Y axis scrolling to dynamic offset
nuxtApp.$anchorScroll!.defaults.toAnchor = () => ({
  behavior: 'smooth',
  offsetTop: -(toValue(useNuxtApp().$headerHeight) ?? 0) * 1.2,
})

// Add route specialization for fixed solution
// See docs for explanation
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

onMounted(() => {
  document.documentElement.classList.remove('standard')
  document.documentElement.classList.remove('preferred')
})

useSeoMeta({
  title: 'nuxt-anchorscroll'
})
</script>

<template>
  <div class="font-sass nuxt-layout" flex flex-grow>
    <NuxtLayout>
      <div class="font-sass nuxt-page" flex flex-grow>
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<style lang="sass">
a
  color: inherit
  font-weight: inherit
  text-decoration: none

html
  font-family: Inter
</style>
