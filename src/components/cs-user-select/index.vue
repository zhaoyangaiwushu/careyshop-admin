<template>
  <div class="user-control" @click="handleShowDlg">
    <slot name="control"/>
  </div>
</template>

<script>
export default {
  name: 'cs-user-select'
}
</script>

<style scoped>
</style>
