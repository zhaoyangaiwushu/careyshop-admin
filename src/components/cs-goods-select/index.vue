<template>
  <el-dialog
    title="商品选取"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="700px">
  </el-dialog>
</template>

<script>
export default {
  name: 'cs-goods-select',
  // components: {
  //   'PageFooter': () => import('@/layout/header-aside/components/footer')
  // },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: true,
      confirmLoading: false
    }
  }
}
</script>
