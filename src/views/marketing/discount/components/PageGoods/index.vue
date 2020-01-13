<template>
  <div>
  </div>
</template>

<script>
export default {
  props: {
    // 外部v-model值
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    // 折扣方式
    type: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
