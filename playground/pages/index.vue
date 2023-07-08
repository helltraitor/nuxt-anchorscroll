<script setup lang="ts">
import '@/assets/css/linked.sass'

import { onMounted, queryContent } from '#imports'

const common_card = await queryContent('/card').findOne()
const preferred_card = await queryContent('/preferred/card').findOne()
const standard_card = await queryContent('/standard/card').findOne()

onMounted(() => {
  document.documentElement.classList.remove('standard')
  document.documentElement.classList.add('preferred')
})
</script>

<template>
  <div m-a>
    <div flex flex-col>
      <div flex flex-row gap-4>
        <NuxtLink to="/preferred/explanation">
          <div class="linked" border="~ solid rounded" p-4 max-w-60ch>
            <ContentRendererMarkdown :value="preferred_card" tag="div" />
          </div>
        </NuxtLink>
        <NuxtLink to="/standard/explanation">
          <div class="linked" border="~ solid rounded" p-4 max-w-60ch>
            <ContentRendererMarkdown :value="standard_card" tag="div" />
          </div>
        </NuxtLink>
      </div>
      <div pointer-events-none ml-a mr-a p-4>
        <ContentRendererMarkdown :value="common_card" tag="div" />
      </div>
    </div>
  </div>
</template>
