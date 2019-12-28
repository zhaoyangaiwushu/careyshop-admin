<template>
  <cs-container :is-back-to-top="true" parent-path="goods-admin-list">
    <template v-if="goods_id">
      <page-edit
        ref="update"
        state="update"
        :loading.sync="loading"
        :confirm-loading.sync="confirmLoading"
        @close="handleClose">
      </page-edit>

      <template ref="footer" slot="footer">
        <div style="margin: -10px 0;">
          <el-button
            type="primary"
            size="small"
            :disabled="loading"
            :loading="confirmLoading"
            @click="handleConfirm">确定</el-button>

          <el-button
            size="small"
            @click="handleClose">取消</el-button>
        </div>
      </template>
    </template>
  </cs-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'goods-admin-update',
  components: {
    'PageEdit': () => import('./components/PageEdit')
  },
  props: {
    goods_id: {
      type: [Number, String],
      required: false
    }
  },
  data() {
    return {
      loading: true,
      confirmLoading: false
    }
  },
  activated() {
    if (!this.goods_id) {
      this.$router.push({ name: 'index' })
      this.handleClose()
    }
  },
  methods: {
    ...mapActions('careyshop/page', [
      'close'
    ]),
    // 请求提交
    handleConfirm() {
      this.$refs.update.handleConfirm()
    },
    // 关闭当前窗口
    handleClose() {
      this.close({
        tagName: this.$route.fullPath
      })
    }
  }
}
</script>
