<template>
  <cs-container>
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never"
        v-loading="loading">
        <el-row>
          <el-col class="order-left" :span="8">
            <span>订单信息</span>
          </el-col>

          <el-col :span="15" :push="1">
            <span>订单状态</span>
          </el-col>
        </el-row>

        <div class="cs-pt-10">
          <span>商品列表</span>
        </div>

        <div class="cs-pt-10">
          <span>操作日志</span>
        </div>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
import { getOrderItem } from '@/api/order/order'

export default {
  name: 'order-admin-info',
  props: {
    order_no: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      orderData: {}
    }
  },
  watch: {
    order_no: {
      handler() {
        this.getOrderData()
      },
      immediate: true
    }
  },
  methods: {
    // 获取订单信息
    getOrderData() {
      this.loading = true
      getOrderItem(this.order_no, 1)
        .then(res => {
          this.orderData = res.data || {}
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;
  }

  .order-left {
    border-right: 1px solid $color-border-1;
  }
</style>
