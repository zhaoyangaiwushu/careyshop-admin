<template>
  <el-table
    v-loading="loading"
    :data="value"
    :highlight-current-row="true">
  </el-table>
</template>

<script>
export default {
  props: {
    // 外部v-model值
    value: {
      type: Array,
      required: true,
      default: () => {}
    },
    // 折扣方式
    type: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
  }
}
</script>
