<template>
  <cs-container parent-path="order-admin-list">
    <template v-if="orderData">
      <div class="print-main" ref="print">
        <template v-if="type === 'order'">
          <div
            v-for="(item, index) in orderData"
            :key="index"
            class="print-order">
            <span>{{item.order_no}}</span>
          </div>
        </template>

        <template v-if="type === 'out'">
          <span>出库单打印</span>
        </template>

        <template v-if="type === 'delivery'">
          <span>发货单打印</span>
        </template>
      </div>

      <template ref="footer" slot="footer">
        <div style="margin: -10px 0;">
          <el-button
            type="primary"
            size="small"
            @click="$print($refs.print)">打印</el-button>

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
  name: 'order-admin-print',
  props: {
    type: {
      type: String,
      required: false
    },
    orderData: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
    }
  },
  activated() {
    if (!this.orderData) {
      this.$router.push({ name: 'index' })
      this.handleClose()
    }
  },
  methods: {
    ...mapActions('careyshop/page', [
      'close'
    ]),
    // 关闭当前窗口
    handleClose() {
      this.close({
        tagName: this.$route.fullPath
      })
    }
  }
}
</script>

<style scoped>
  .print-main {
    background: #FFFFFF;
  }
  .print-order {
    padding: 20px;
    min-height: 1000px;
  }
</style>
