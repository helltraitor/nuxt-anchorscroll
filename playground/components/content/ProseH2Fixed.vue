<script setup lang="ts">
import { useAnchorScroll } from '#imports'

interface ProseH1Properties {
  id: string
}

const { id } = defineProps<ProseH1Properties>()

const { scrollToAnchor } = useAnchorScroll()

const fixedId = `fixed-${id}`
</script>

<template>
  <div
    class="box"
    mt-12
    flex flex-row gap-4 align-baseline
  >
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
  </div>
</template>

<style scoped lang="sass">
.box
  &:hover
    a
      opacity: 0.4

a
  opacity: 0.2
  transition: 300ms opacity ease-in-out

a:hover
  opacity: 0.6 !important
</style>
