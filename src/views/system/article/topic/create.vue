<template>
  <cs-container :is-back-to-top="true" :is-back="true">
    <page-edit
      state="create"
      :loading="loading">
    </page-edit>
  </cs-container>
</template>

<script>
export default {
  name: 'system-topic-create',
  components: {
    'PageEdit': () => import('./components/PageEdit')
  },
  data() {
    return {
      // 加载状态
      loading: false
    }
  }
}
</script>
