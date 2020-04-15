<template>
  <cs-container>
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never"
        v-loading="loading">
        <el-row>
          <el-col class="order-left" :span="8">
            <p>订单信息</p>
          </el-col>

          <el-col :span="15" :push="1">
            <p>订单状态</p>
            <el-steps
              :active="tradeStatus.active"
              :finish-status="tradeStatus.status"
              :process-status="tradeStatus.current"
              :align-center="true">
              <el-step
                v-for="(value, index) of tradeStatus.step"
                :key="index"
                :icon="value.icon"
                :title="value.title"/>
            </el-steps>
          </el-col>
        </el-row>

        <el-collapse :value="['goods', 'log']">
          <el-collapse-item title="商品列表" name="goods">
            <el-table
              style="margin-top: -15px;"
              :data="orderData.get_order_goods"
              :summary-method="getSummaries"
              :show-summary="true">
              <el-table-column
                label="商品名称"
                min-width="300">
                <template slot-scope="scope">
                  <el-image
                    class="goods-image"
                    @click="handleViewGoods(scope.row.goods_id)"
                    :src="scope.row.goods_image | getPreviewUrl"
                    fit="contain"
                    lazy>
                  </el-image>

                  <div class="goods-info">
                    <div
                      :title="scope.row.goods_name"
                      @click="handleViewGoods(scope.row.goods_id)"
                      class="name">{{scope.row.goods_name}}</div>

                    <p class="specs">{{scope.row.key_value || '-'}}</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                label="单价">
                <template slot-scope="scope">
                  {{scope.row.shop_price | getNumber}}
                </template>
              </el-table-column>

              <el-table-column
                prop="qty"
                label="数量">
              </el-table-column>

              <el-table-column
                label="小计">
                <template slot-scope="scope">
                  {{scope.row.shop_price * scope.row.qty | getNumber}}
                </template>
              </el-table-column>

              <el-table-column
                label="状态"
                align="center"
                width="80">
                <template slot-scope="scope">
                  {{statusMap[scope.row.status]}}
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>

          <el-collapse-item title="订单日志" name="log">
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in orderData.get_order_log"
                :key="index"
                :type="log.client_type ? 'danger' : 'primary'"
                :timestamp="log.create_time">
                <div class="order-log">
                  <li>{{`${clientMap[log.client_type]}：${log.action}`}}</li>
                  <li>{{`${log.description}：${log.comment}`}}</li>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
import util from '@/utils/util'
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
      orderData: {},
      tradeStatus: {
        'active': 0,
        'step': [
          {
            'icon': 'el-icon-edit-outline',
            'title': '创建订单'
          },
          {
            'icon': 'el-icon-bank-card',
            'title': '付款'
          },
          {
            'icon': 'el-icon-takeaway-box',
            'title': '配货'
          },
          {
            'icon': '',
            'title': '发货'
          },
          {
            'icon': '',
            'title': '完成'
          }
        ]
      },
      clientMap: {
        '-1': '游客',
        '0': '顾客',
        '1': '商家'
      },
      statusMap: {
        0: '待发货',
        1: '已发货',
        2: '已收货',
        3: '已取消'
      }
    }
  },
  filters: {
    getNumber(val) {
      return util.getNumber(val)
    },
    getPreviewUrl(val) {
      return val ? util.getImageCodeUrl(val, 'goods_image_x80') : ''
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
    // 处理订单状态数据
    _setTradeStatus() {
      // 处理状态显示
      switch (this.orderData.trade_status) {
        case 4:
          // this.tradeStatus.current = 'error'
          // this.tradeStatus.status = 'wait'
          break
        default:
          this.tradeStatus.current = 'success'
          this.tradeStatus.status = 'success'
      }

      // switch (this.orderData.trade_status) {
      //   case 4:
      //     this.tradeStatus.active = 4
      //     this.tradeStatus.current = 'error'
      //     this.tradeStatus.status = 'wait'
      //     this.tradeStatus.step[4] = '交易取消'
      //     break
      //   case 3:
      //     this.tradeStatus.active = 4
      //     this.tradeStatus.current = 'success'
      //     this.tradeStatus.status = 'success'
      //     this.tradeStatus.step[4] = '交易成功'
      //     break
      // }
    },
    // 获取订单信息
    getOrderData() {
      this.loading = true
      getOrderItem(this.order_no, 1)
        .then(res => {
          this.orderData = res.data || {}
          this._setTradeStatus()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 商品预览
    handleViewGoods(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 金额信息
    getSummaries() {
      let money = `订单金额：${util.getNumber(this.orderData.pay_amount)}`
      money += ` 需付款：${util.getNumber(this.orderData.total_amount)}`
      money += ` 含运费：${util.getNumber(this.orderData.delivery_fee)}`

      return [money]
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;

    p {
      margin-top: 0;
    }
  }

  .order-left {
    border-right: 1px solid $color-border-1;
  }

  .goods-image {
    float: left;
    width: 60px;
    height: 60px;

    &:hover {
      cursor: pointer;
    }
  }

  .goods-info {
    float: left;
    width: 80%;
    margin-left: 10px;

    .name {
      height: 36px;
      line-height: 18px;
      overflow: hidden;

      &:hover {
        cursor: pointer;
        color: $color-primary;
        text-decoration: underline;
      }
    }

    .specs {
      margin: 0;
      font-size: 12px;
      color: $color-info;
    }
  }

  .el-collapse /deep/ .el-collapse-item__header {
    font-size: 16px;
  }
</style>
