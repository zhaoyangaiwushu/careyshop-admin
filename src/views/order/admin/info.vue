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
              <div class="dd"><span>{{orderData.payment_no}}</span></div>
            </div>

            <div class="order-info">
              <div class="dt">订单来源</div>
              <div class="dd">{{sourceMap[orderData.source]}}</div>
            </div>

            <div class="order-info">
              <div class="dt">支付方式</div>
              <div class="dd">
                <span :style="orderData.payment_code === '1' && 'color: #F56C6C;'">
                  {{_getPaymentType(orderData.payment_code)}}
                </span>
              </div>
            </div>

            <div class="order-info" v-if="orderData.card_number">
              <div class="dt">购物卡号</div>
              <div class="dd">{{orderData.card_number}}</div>
            </div>

            <div class="order-info">
              <div class="dt">买家</div>
              <div class="dd">
                <span>{{orderData.get_user.username}}</span>
                <el-image
                  v-if="orderData.get_user.level_icon"
                  class="level-icon"
                  :src="orderData.get_user.level_icon"
                  fit="fill">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"/>
                  </div>
                </el-image>
              </div>
            </div>

            <div class="order-info">
              <div class="dt">买家备注</div>
              <div class="dd">{{orderData.buyer_remark}}</div>
            </div>

            <el-divider></el-divider>

            <div class="order-info">
              <div class="dt">收货人姓名</div>
              <div class="dd">{{orderData.consignee}}</div>
            </div>

            <div class="order-info">
              <div class="dt">收货地址</div>
              <div class="dd">{{orderData.complete_address}}</div>
            </div>

            <div class="order-info">
              <div class="dt">配送方式</div>
              <div class="dd">{{orderData.get_delivery | getDelivery}}</div>
            </div>

            <div class="order-info" v-if="orderData.zipcode">
              <div class="dt">邮编</div>
              <div class="dd">{{orderData.zipcode}}</div>
            </div>

            <div class="order-info">
              <div class="dt">收货人手机</div>
              <div class="dd">{{orderData.mobile}}</div>
            </div>

            <div class="order-info" v-if="orderData.tel">
              <div class="dt">收货人电话</div>
              <div class="dd">{{orderData.tel}}</div>
            </div>

            <template v-if="orderData.invoice_type > 0">
              <div class="order-info">
                <div class="dt">发票抬头</div>
                <div class="dd">{{orderData.invoice_title}}</div>
              </div>

              <div class="order-info" v-if="orderData.invoice_type === 2">
                <div class="dt">纳税人识别号</div>
                <div class="dd">{{orderData.tax_number}}</div>
              </div>
            </template>

            <el-divider></el-divider>

            <div class="order-info">
              <div class="dt">卖家备注</div>
              <div class="dd">{{orderData.sellers_remark}}</div>
            </div>
          </el-col>

          <el-col class="cs-pl" :span="15">
            <p class="card-title">订单状态 <span v-if="orderData.is_delete">(回收站)</span></p>
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

            <el-divider></el-divider>

            <el-button
              @click="() => {}"
              size="small">备注</el-button>

            <el-button
              v-if="orderData.delivery_status !== 0"
              @click="() => {}"
              size="small">物流信息</el-button>

            <el-button
              v-if="orderData.trade_status === 0 && orderData.payment_status === 0"
              @click="() => {}"
              size="small">修改金额</el-button>

            <el-button
              v-if="orderData.delivery_status === 0 && orderData.trade_status <= 1"
              @click="() => {}"
              size="small">修改订单</el-button>

            <el-button
              v-if="orderData.payment_status === 1 && orderData.trade_status === 0"
              @click="() => {}"
              size="small">设为配货</el-button>

            <el-button
              v-if="orderData.payment_status === 1 && orderData.trade_status === 1"
              @click="() => {}"
              size="small">取消配货</el-button>

            <el-button
              v-if="orderData.payment_status === 1 && orderData.delivery_status !== 1 && [1, 2].includes(orderData.trade_status)"
              @click="() => {}"
              size="small">确定发货</el-button>

            <el-button
              v-if="orderData.delivery_status === 1 && orderData.trade_status === 2"
              @click="() => {}"
              size="small">确认收货</el-button>

            <el-button
              v-if="orderData.trade_status <= 1"
              @click="() => {}"
              size="small">取消订单</el-button>

            <el-button
              v-if="orderData.trade_status === 4 && orderData.is_delete <= 0"
              @click="() => {}"
              size="small">删除订单</el-button>

            <el-button
              v-if="orderData.is_delete > 0"
              @click="() => {}"
              size="small">恢复订单</el-button>
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
                    @click="handleView(scope.row.goods_id)"
                    :src="scope.row.goods_image | getPreviewUrl"
                    fit="contain"
                    lazy>
                  </el-image>

                  <div class="goods-info">
                    <span
                      :title="scope.row.goods_name"
                      @click="handleView(scope.row.goods_id)"
                      class="name">{{scope.row.goods_name}}</span>
                    <span
                      :class="`${scope.row.is_service === 1 ? 'service' : 'complete'}`"
                      class="cs-pl-5">{{serviceMap[scope.row.is_service]}}</span>

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
import orderMixins from './components/mixins'
import { getOrderItem } from '@/api/order/order'
import { getPaymentList } from '@/api/payment/payment'
import { getSettingList } from '@/api/config/setting'

export default {
  name: 'order-admin-info',
  mixins: [
    orderMixins
  ],
  props: {
    order_no: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      isInitial: false,
      orderData: {
        get_user: {},
        get_order_goods: [],
        get_delivery: {},
        get_order_log: []
      },
      tradeStatus: {},
      toPayment: {},
      sourceMap: {},
      clientMap: {
        '-1': '游客',
        '0': '顾客',
        '1': '商家'
      }
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
      let request = [getOrderItem(this.order_no, 1)]

      if (!this.isInitial) {
        request.push(getPaymentList({ is_select: 1, exclude_code: [4, 5, 6] }))
        request.push(getSettingList('system_shopping', ['source']))
        this.isInitial = true
      }

      Promise.all(request)
        .then(res => {
          this.orderData = res[0].data || {}
          this._setTradeStatus()

          if (res[1] && res[1].data) {
            res[1].data.forEach(value => {
              this.toPayment[value.code] = value
            })
          }

          if (res[2] && res[2].data) {
            res[2].data['source']['value'].forEach((value, index) => {
              this.sourceMap[index] = value.name
            })
          }
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

    .card-title {
      margin-top: 0;
    }

    .order-info {
      display: table;
      font-size: 14px;
      line-height: 28px;
      .dt {
        float: left;
        width: 100px;
        color: #99A9BF;
      }
      .dd {
        padding-left: 100px;
      }
      .number {
        width: 100px;
        text-align: right;
      }
    }
  }

  .order-left {
    margin-bottom: 20px;
    border-right: 1px solid $color-border-1;

    .level-icon {
      margin-left: 5px;
      line-height: 0;
      vertical-align: text-bottom;
    }

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

    .service {
      font-size: 13px;
      color: $color-warning;
    }

    .complete {
      font-size: 13px;
      color: $color-success;
    }
  }

  .order-log span {
    color: $color-info;
  }

  .el-collapse /deep/ .el-collapse-item__header {
    font-size: 16px;
  }
</style>
