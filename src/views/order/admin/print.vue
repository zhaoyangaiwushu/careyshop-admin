<template>
  <cs-container :is-back-to-top="true" parent-path="order-admin-list">
    <template v-if="orderData && !loading">
      <div class="print-main" ref="print">
        <template v-if="type === 'order'">
          <div
            v-for="(item, index) in orderData"
            :key="index"
            class="print-order">
            <table style="border-top: none; padding: 0;">
              <tr>
                <th><img :src="logo || './image/print/logo.png'" alt=""></th>
                <th style="width: 280px;" valign="bottom">买家账号：{{item.get_user.username}}</th>
              </tr>
            </table>

            <table>
              <tr>
                <th>订单号：{{item.order_no}}</th>
                <th style="width: 280px;">创建日期：{{item.create_time}}</th>
              </tr>
            </table>

            <table>
              <colgroup>
                <col style="width: 10%;">
                <col style="width: 35%;">
                <col style="width: 25%;">
                <col span="3" style="width: 10%;">
              </colgroup>
              <thead>
              <tr>
                <th>序号</th>
                <th>商品名称</th>
                <th>规格</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
              </tr>
              </thead>
              <colgroup>
                <col style="width: 10%;">
                <col style="width: 35%;">
                <col style="width: 25%;">
                <col span="3" style="width: 10%;">
              </colgroup>
              <tbody style="border-top: 1px solid #CCC;">
                <tr v-for="(goods, index) in item.get_order_goods" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{goods.goods_name}}</td>
                  <td>{{goods.key_value || '-'}}</td>
                  <td>{{goods.shop_price | getNumber}}</td>
                  <td>{{goods.qty}}</td>
                  <td>{{goods.shop_price * goods.qty | getNumber}}</td>
                </tr>
              </tbody>
            </table>

            <table>
              <tbody>
                <tr>
                  <td>买家备注：{{item.buyer_remark}}</td>
                  <td style="width: 280px;">
                    <ul>
                      <li>总计：<span>{{item.goods_amount | getNumber}}</span></li>
                      <li>运费：<span>{{item.delivery_fee | getNumber}}</span></li>
                      <li>开票：<span>{{item.invoice_amount | getNumber}}</span></li>
                      <li>余额抵扣：<span>- {{item.use_money | getNumber}}</span></li>
                      <li>购物卡抵扣：<span>- {{item.use_card | getNumber}}</span></li>
                      <li>会员抵扣：<span>- {{item.use_level | getNumber}}</span></li>
                      <li>积分抵扣：<span>- {{item.use_integral | getNumber}}</span></li>
                      <li>优惠劵抵扣：<span>- {{item.use_coupon | getNumber}}</span></li>
                      <li>商品折扣抵扣：<span>- {{item.use_discount | getNumber}}</span></li>
                      <li>订单促销抵扣：<span>- {{item.use_promotion | getNumber}}</span></li>
                      <li>实际支付：<span>{{item.pay_amount + item.delivery_fee | getNumber}}</span></li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            <table>
              <tr>
                <td>收货人姓名：{{item.consignee}}</td>
              </tr>
              <tr>
                <td>
                  <template v-if="item.mobile">
                    收货人手机：{{item.mobile}}
                  </template>

                  <template v-if="item.tel">
                    电话：{{item.tel}}
                  </template>
                </td>
              </tr>
              <tr>
                <td>
                  收货地址：{{item.complete_address}}
                  <template v-if="item.zipcode">
                    邮编：{{item.zipcode}}
                  </template>
                  配送方式：{{item.get_delivery.alias}}
                </td>
              </tr>
              <tr v-if="item.invoice_type > 0">
                <td>
                  发票抬头：{{item.invoice_title}}
                  <template v-if="item.invoice_type === 2">
                    纳税人识别号：{{item.tax_number}}
                  </template>
                </td>
              </tr>
            </table>

            <table>
              <tr>
                <td><img :src="item.order_no | getBarcode" alt=""></td>
                <td style="float: right;"><img :src="item.order_no | getQrcode" alt=""></td>
              </tr>
            </table>
          </div>
        </template>

        <template v-if="type === 'out'">
          <div class="print-order">
            <table style="border-top: none; padding: 0;">
              <tr>
                <td style="text-align: center;"><h1>{{name}}出库单</h1></td>
              </tr>
            </table>

            <table>
              <colgroup>
                <col style="width: 40%;">
                <col style="width: 25%;">
                <col span="2" style="width: 10%;">
                <col style="width: 15%;">
              </colgroup>
              <thead>
              <tr>
                <th>商品名称</th>
                <th>规格</th>
                <th>数量</th>
                <th>货号</th>
                <th>订单号</th>
              </tr>
              </thead>
              <colgroup>
                <col style="width: 40%;">
                <col style="width: 25%;">
                <col span="2" style="width: 10%;">
                <col style="width: 15%;">
              </colgroup>
              <tbody style="border-top: 1px solid #CCC;">
                <tr v-for="(goods, key) in outOrder" :key="key">
                  <td>{{goods.goods_name}}</td>
                  <td>{{goods.key_value || '-'}}</td>
                  <td>{{goods.qty}}</td>
                  <td>{{goods.goods_code}}</td>
                  <td>
                    <span v-for="(item, index) in goods.order_no" :key="index">
                      {{item}}<br/>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <table>
              <tr>
                <td style="text-align: right;">出库日期：{{getNowTime()}}</td>
              </tr>
            </table>
          </div>
        </template>

        <template v-if="type === 'delivery'">
          <div
            v-for="(item, index) in orderData"
            :key="index"
            class="print-order">
            <table style="border-top: none; padding: 0;">
              <tr>
                <td style="text-align: center;"><h1>{{name}}，感谢您的惠顾</h1></td>
              </tr>
            </table>

            <table>
              <tr>
                <td>订单号：{{item.order_no}}</td>
                <td>创建日期：{{item.create_time}}</td>
              </tr>
              <tr>
                <td>收货人：{{item.consignee}}</td>
                <td>
                  <template v-if="item.mobile">
                    手机：{{item.mobile}}
                  </template>

                  <template v-if="item.tel">
                    电话：{{item.tel}}
                  </template>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  收货地址：{{item.complete_address}}
                  <template v-if="item.zipcode">
                    邮编：{{item.zipcode}}
                  </template>
                </td>
              </tr>
              <tr v-if="item.invoice_type > 0">
                <td colspan="2">
                  发票抬头：{{item.invoice_title}}
                  <template v-if="item.invoice_type === 2">
                    纳税人识别号：{{item.tax_number}}
                  </template>
                </td>
              </tr>
              <tr>
                <td colspan="2">买家备注：{{item.buyer_remark}}</td>
              </tr>
            </table>

            <table>
              <colgroup>
                <col style="width: 40%;">
                <col style="width: 30%;">
                <col span="3" style="width: 10%;">
              </colgroup>
              <thead>
              <tr>
                <th>商品名称</th>
                <th>规格</th>
                <th>数量</th>
                <th>金额</th>
                <th>发货</th>
              </tr>
              </thead>
              <colgroup>
                <col style="width: 40%;">
                <col style="width: 30%;">
                <col span="3" style="width: 10%;">
              </colgroup>
              <tbody style="border-top: 1px solid #CCC;">
              <tr v-for="(goods, index) in item.get_order_goods" :key="index">
                <td>{{goods.goods_name}}</td>
                <td>{{goods.key_value || '-'}}</td>
                <td>{{goods.qty}}</td>
                <td>{{goods.shop_price | getNumber}}</td>
                <td>{{statusMap[goods.status]}}</td>
              </tr>
              </tbody>
            </table>

            <table>
              <tbody>
              <tr>
                <td></td>
                <td style="width: 280px;">
                  <ul>
                    <li>总计：<span>{{item.goods_amount | getNumber}}</span></li>
                    <li>运费：<span>{{item.delivery_fee | getNumber}}</span></li>
                    <li>开票：<span>{{item.invoice_amount | getNumber}}</span></li>
                    <li>余额抵扣：<span>- {{item.use_money | getNumber}}</span></li>
                    <li>购物卡抵扣：<span>- {{item.use_card | getNumber}}</span></li>
                    <li>会员抵扣：<span>- {{item.use_level | getNumber}}</span></li>
                    <li>积分抵扣：<span>- {{item.use_integral | getNumber}}</span></li>
                    <li>优惠劵抵扣：<span>- {{item.use_coupon | getNumber}}</span></li>
                    <li>商品折扣抵扣：<span>- {{item.use_discount | getNumber}}</span></li>
                    <li>订单促销抵扣：<span>- {{item.use_promotion | getNumber}}</span></li>
                    <li>实际支付：<span>{{item.pay_amount + item.delivery_fee | getNumber}}</span></li>
                  </ul>
                </td>
              </tr>
              </tbody>
            </table>

            <table>
              <tr>
                <td class="pre-text">{{information}}</td>
              </tr>
            </table>
          </div>
        </template>
      </div>
    </template>

    <template ref="footer" slot="footer">
      <div style="margin: -10px 0;">
        <el-button
          type="primary"
          size="small"
          :loading="loading"
          @click="$print($refs.print)">打印</el-button>

        <el-button
          size="small"
          @click="handleClose">取消</el-button>
      </div>
    </template>
  </cs-container>
</template>

<script>
import dayjs from 'dayjs'
import util from '@/utils/util'
import { mapActions } from 'vuex'
import { getSettingList } from '@/api/config/setting'

export default {
  name: 'order-admin-print',
  computed: {
    outPrint() {
      const { type, orderData } = this
      return {
        type,
        orderData
      }
    }
  },
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
      loading: false,
      outOrder: {},
      logo: '',
      name: '',
      information: '',
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
    getBarcode(text) {
      return util.getBarcodeUrl(text)
    },
    getQrcode(text) {
      return util.getQrcodeUrl(text)
    }
  },
  watch: {
    outPrint: {
      handler(value) {
        if (value.type === 'out') {
          this.outOrder = {}
          this.handleOutOrder()
        }
      },
      immediate: true
    }
  },
  activated() {
    if (!this.orderData) {
      this.$router.push({ name: 'index' })
      this.handleClose()
    }
  },
  mounted() {
    this.loading = true
    getSettingList('system_info', ['logo', 'name', 'information'])
      .then(res => {
        for (let key in res.data) {
          if (!res.data.hasOwnProperty(key)) {
            continue
          }

          if (key === 'logo') {
            this.logo = util.checkUrl(res.data[key]['value'])
            continue
          }

          this[key] = res.data[key]['value']
        }
      })
      .finally(() => {
        this.loading = false
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
    },
    // 获取当前日期
    getNowTime() {
      return dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    // 从订单数据中制作一份出库单
    handleOutOrder() {
      let goodsList = {}
      this.orderData.forEach(item => {
        for (const goods of item.get_order_goods) {
          let key = `${goods.goods_id}-${goods.key_name}`
          if (goodsList.hasOwnProperty(key)) {
            goodsList[key].qty += goods.qty
            if (!goodsList[key].order_no.includes(goods.order_no)) {
              goodsList[key].order_no.push(goods.order_no)
            }
          } else {
            goodsList[key] = {
              order_no: [goods.order_no],
              goods_name: goods.goods_name,
              goods_code: goods.goods_code,
              key_value: goods.key_value,
              qty: goods.qty
            }
          }
        }
      })

      this.outOrder = goodsList
    }
  }
}
</script>

<style scoped>
  .print-main {
    /*font: 12px/1.5 "宋体", Helvetica, Arial, serif;*/
    background: #FFFFFF;
  }

  .print-order {
    padding: 20px;
    page-break-after: always;
    /*min-height: 1000px;*/
  }

  .print-order table {
    width: 100%;
    border-top: 1px solid #CCC;
  }

  .print-order table tr th,
  .print-order table tr td {
    padding: 4px 5px;
    text-align: left;
  }

  .print-order table tr td ul li {
    list-style: none;
  }

  .print-order table tr td ul span {
    float: right;
  }

  .pre-text {
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
