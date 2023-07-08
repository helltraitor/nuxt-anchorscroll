<script setup lang="ts">
const { currentRoute } = useRouter()
const { data } = await useAsyncData(currentRoute.value.path, () => queryContent(currentRoute.value.path).findOne())

onMounted(() => {
  if (currentRoute.value.path.startsWith('/preferred/')) {
    document.documentElement.classList.add('preferred')
    document.documentElement.classList.remove('standard')
  }
  else {
    document.documentElement.classList.add('standard')
    document.documentElement.classList.remove('preferred')
  }
})

const MarkdownComponents = {
  // Use Fixed implementation when user reads explanation for standard and check out fix
  h2: currentRoute.value.path.startsWith('/standard/fixed/') ? 'ProseH2Fixed' : 'ProseH2',
}

definePageMeta({
  layout: 'article',
})
</script>

<template>
  <div
    m-a lt-md:w-90vw md:w-65ch
  >
    <div
      v-if="data"
      text-base line-height-relaxed
      mt-10
      mb-30
    >
      <ContentRendererMarkdown :value="data" tag="div" :components="MarkdownComponents" />
    </div>
    <div v-else>
      Path with route <code>{{ currentRoute.path }}</code> not found
    </div>
  </div>
</template>
