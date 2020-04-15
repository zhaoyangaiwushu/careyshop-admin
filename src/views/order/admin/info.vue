<template>
  <cs-container>
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never"
        v-loading="loading">
        <el-row>
          <el-col class="order-left" :span="9">
            <p class="card-title">订单信息</p>
            <div class="order-info">
              <div class="dt">订单号</div>
              <div class="dd">{{orderData.order_no}}</div>
            </div>

            <div class="order-info">
              <div class="dt">支付流水号</div>
              <div class="dd">{{orderData.payment_no}}</div>
            </div>

            <div class="order-info">
              <div class="dt">订单来源</div>
              <div class="dd">-</div>
            </div>

            <div class="order-info">
              <div class="dt">支付方式</div>
              <div class="dd">-</div>
            </div>

            <div class="order-info">
              <div class="dt">购物卡号</div>
              <div class="dd">-</div>
            </div>

            <div class="order-info">
              <div class="dt">买家</div>
              <div class="dd">-</div>
            </div>

            <el-divider></el-divider>

            <div class="order-info">
              <div class="dt">收货人</div>
              <div class="dd">-</div>
            </div>
          </el-col>

          <el-col class="cs-pl" :span="15">
            <p class="card-title">订单状态</p>
            <el-steps
              :active="tradeStatus.active"
              :process-status="tradeStatus.process_status"
              :finish-status="tradeStatus.finish_status"
              :align-center="false">
              <el-step
                v-for="(value, index) of tradeStatus.step"
                :key="index"
                :description="value.description"
                :title="value.title"
                :icon="value.icon"/>
            </el-steps>

            <div class="order-remark" v-if="orderData.sellers_remark">
              <span>卖家备注：{{orderData.sellers_remark}}</span>
            </div>
          </el-col>
        </el-row>

        <el-collapse :value="['goods', 'log']">
          <el-collapse-item title="商品列表" name="goods">
            <el-table
              style="margin-top: -15px;"
              :data="orderData.get_order_goods">
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
                  <li><span>[{{clientMap[log.client_type]}}]</span> {{`${log.action}`}}</li>
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
      tradeStatus: {},
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
      // 初始化数据
      this.tradeStatus = {
        active: 1,
        step: [
          {
            'icon': 'el-icon-edit-outline',
            'title': '创建订单',
            'description': this.orderData.create_time
          },
          {
            'icon': 'el-icon-bank-card',
            'title': '付款',
            'description': this.orderData.payment_time
          },
          {
            'icon': 'el-icon-receiving',
            'title': '配货',
            'description': this.orderData.picking_time
          },
          {
            'icon': 'el-icon-truck',
            'title': '发货',
            'description': this.orderData.delivery_time
          },
          {
            'icon': 'el-icon-time',
            'title': '完成',
            'description': this.orderData.finished_time
          }
        ]
      }

      // 处理状态显示
      switch (this.orderData.trade_status) {
        case 4:
          this.tradeStatus.process_status = 'wait'
          this.tradeStatus.finish_status = 'wait'
          break
        case 3:
          this.tradeStatus.process_status = 'finish'
          this.tradeStatus.finish_status = 'finish'
          break
        default:
          this.tradeStatus.process_status = 'process'
          this.tradeStatus.finish_status = 'finish'
      }

      // 实际状态转换
      switch (this.orderData.trade_status) {
        case 4:
          this.tradeStatus.active = 4
          this.tradeStatus.step[4].title = '交易关闭'
          break
        case 3:
          this.tradeStatus.active = 4
          this.tradeStatus.step[4].title = '交易成功'
          break
        case 2:
          this.tradeStatus.active = 3
          switch (this.orderData.delivery_status) {
            case 1:
              this.tradeStatus.step[3].title = '全部发货'
              break
            case 2:
              this.tradeStatus.step[3].title = '部分发货'
              break
          }
          break
        case 1:
          this.tradeStatus.active = 2
          this.tradeStatus.step[2].title = '配货中'
          break
        case 0:
          this.tradeStatus.active = 1
          switch (this.orderData.payment_status) {
            case 0:
              this.tradeStatus.step[1].title = '等待买家付款'
              break
            case 1:
              this.tradeStatus.step[1].title = '买家已付款'
              break
          }
          break
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;

    .card-title {
      margin-top: 0;
    }

    .order-info {
      font-size: 14px;
      line-height: 28px;
      display: flex;
      .dt {
        color: #99A9BF;
        width: 90px;
      }
    }
  }

  .order-left {
    margin-bottom: 20px;
    border-right: 1px solid $color-border-1;

    .el-divider--horizontal {
      width: 96%;
    }
  }

  .order-remark {
    font-size: 13px;
    line-height: 32px;
    color: $color-info;
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

  .order-log span {
    color: $color-info;
  }

  .el-collapse /deep/ .el-collapse-item__header {
    font-size: 16px;
  }
</style>
