<template>
  <cs-container :is-back-to-top="true" parent-path="order-admin-list">
    <template v-if="orderData">
      <div class="print-main" ref="print">
        <template v-if="type === 'order'">
          <div
            v-for="(item, index) in orderData"
            :key="index"
            class="print-order"
            style="page-break-after: always;">
            <table style="border-top: none; padding: 0;">
              <tr>
                <th><img :src="logo" alt=""></th>
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
                <col style="width: 5%;">
                <col style="width: 22%;">
                <col style="width: 20%;">
                <col style="width: 10%;">
                <col style="width: 8%;">
                <col style="width: 8%;">
                <col style="width: 8%;">
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
                <col style="width: 5%;">
                <col style="width: 22%;">
                <col style="width: 20%;">
                <col style="width: 8%;">
                <col style="width: 8%;">
                <col style="width: 8%;">
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
                  <td>买家留言：{{item.buyer_remark}}</td>
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
                <td>收货人：{{item.consignee}}</td>
                <td style="text-align: right;">
                  地址：{{item.complete_address}}
                  <template v-if="item.zipcode">
                    邮编：{{item.zipcode}}
                  </template>
                </td>
              </tr>
              <tr>
                <td>
                  <template v-if="item.mobile">
                    收货人手机：{{item.mobile}}
                  </template>

                  <template v-if="item.tel">
                    收货人电话：{{item.tel}}
                  </template>
                </td>
                <td style="text-align: right;">配送方式：{{item.get_delivery.alias}}</td>
              </tr>

              <template v-if="item.invoice_type > 0">
                <tr>
                  <td colspan="2">发票抬头：{{item.invoice_title}}</td>
                </tr>
                <tr v-if="item.invoice_type === 2">
                  <td colspan="2">纳税人识别号：{{item.tax_number}}</td>
                </tr>
              </template>
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
  activated() {
    if (!this.orderData) {
      this.$router.push({ name: 'index' })
      this.handleClose()
    }
  },
  mounted() {
    getSettingList('system_info', ['logo'])
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
    /*font: 12px/1.5 "宋体", Helvetica, Arial, serif;*/
    background: #FFFFFF;
  }

  .print-order {
    padding: 20px;
    /*min-height: 1000px;*/
  }

  .print-order table {
    width: 100%;
    border-top: 1px solid #CCC;
    text-align: left;
  }

  .print-order table tr th,
  .print-order table tr td {
    padding: 4px 5px;
  }

  .print-order table tr td ul li {
    list-style: none;
  }

  .print-order table tr td ul span {
    float: right;
  }
</style>
