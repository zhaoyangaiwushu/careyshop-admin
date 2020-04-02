<template>
  <cs-container :is-back-to-top="true" parent-path="order-admin-list">
    <template v-if="orderData">
      <div class="print-main" ref="print">
        <template v-if="type === 'order'">
          <div v-for="(item, index) in orderData" :key="index" class="print-order">
            <table style="border-top: none;">
              <tr>
                <th><img :src="logo" alt=""></th>
                <th style="width: 250px;" valign="bottom">买家账号：{{item.get_user.username}}</th>
              </tr>
            </table>

            <table>
              <tr>
                <th>订单号：{{item.order_no}}</th>
                <th style="width: 250px;">创建日期：{{item.create_time}}</th>
              </tr>
            </table>
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
import { getSettingList } from '@/api/config/setting'
import util from '@/utils/util'

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
      logo: ''
    }
  },
  activated() {
    if (!this.orderData) {
      this.$router.push({ name: 'index' })
      this.handleClose()
    }
  },
  mounted() {
    getSettingList('system_info', 'logo')
      .then(res => {
        if (res.data.logo && res.data.logo.value) {
          this.logo = util.checkUrl(res.data.logo.value)
        } else {
          this.logo = './image/print/logo.png'
        }
      })
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
    font: 12px/1.5 "宋体", Arial, Helvetica, sans-serif;
  }

  .print-order {
    padding: 20px;
    min-height: 1000px;
  }

  .print-order table {
    width: 100%;
    border-top: 1px solid #aaa;
    text-align: left;
  }

  .print-order table tr th,
  .print_area table tr td {
    padding: 4px 5px;
  }

  .print_area table tr td ul li {
    list-style: none;
  }
</style>
