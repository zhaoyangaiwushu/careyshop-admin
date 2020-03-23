<template>
  <div class="cs-p">
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button
          icon="el-icon-download"
          :disabled="loading"
          @click="() => {}">导出数据</el-button>
      </el-form-item>

      <el-form-item>
        <el-dropdown placement="bottom" :show-timeout="50">
          <el-button
            :disabled="loading">
            <i class="el-icon-printer"/>
            <span>打印</span>
            <i class="el-icon-arrow-down cs-pl-5"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="() => {}">打印订单</el-dropdown-item>

            <el-dropdown-item
              v-if="['2', '3'].includes(tabPane)"
              @click.native="() => {}">打印出库单</el-dropdown-item>

            <el-dropdown-item
              v-if="['3', '4'].includes(tabPane)"
              @click.native="() => {}">打印发货单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <el-form-item v-if="tabPane === '2'">
        <el-button-group>
          <el-button
            icon="el-icon-document-checked"
            :disabled="loading"
            @click="() => {}">设为配货</el-button>

          <el-button
            icon="el-icon-document-delete"
            :disabled="loading"
            @click="() => {}">取消配货</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item v-if="tabPane === '4'">
        <el-button
          icon="el-icon-shopping-bag-2"
          :disabled="loading"
          @click="() => {}">确认收货</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-tabs
      v-model="tabPane"
      v-loading="loading"
      :before-leave="handleBefore"
      class="tab-box">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item"
        :name="index">
        <el-table
          v-if="index === tabPane"
          :data="currentTableData"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange">
          <el-table-column align="center" type="selection" width="55"/>

          <el-table-column
            label="订单"
            min-width="300">
            <template slot-scope="scope">
              <div class="order-summary cs-mb-5">
                <span class="cs-mr">订单号：{{scope.row.order_no}}</span>
                <span>创建日期：{{scope.row.create_time}}</span>
              </div>

              <div
                v-for="(goods, index) in scope.row.get_order_goods"
                :key="index"
                :class="{'order-goods-list': true, 'cs-mt-10': index > 0}">
                <el-image
                  class="goods-image cs-cp"
                  @click="handleView(goods.goods_id)"
                  :src="goods.goods_image | getPreviewUrl"
                  fit="contain"
                  lazy>
                </el-image>

                <div class="goods-info order-text">
                  <p @click="handleView(goods.goods_id)" class="link">{{goods.goods_name}}</p>
                  <p v-if="goods.key_value" class="son">{{goods.key_value}}</p>
                  <p class="son">本店价：{{goods.shop_price | getNumber}} x {{goods.qty}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="订单金额"
            min-width="100">
            <template slot-scope="scope">
              <div class="order-text">
                <p class="shop-price">{{scope.row.pay_amount | getNumber}}</p>
                <p class="son">需付款：{{scope.row.total_amount | getNumber}}</p>
                <p class="son">含运费：{{scope.row.delivery_fee | getNumber}}</p>
                <p class="son">{{_getPaymentType(scope.row.payment_code)}}</p>

                <el-link
                  v-if="scope.row.trade_status === 0 && scope.row.payment_status === 0"
                  class="order-button"
                  type="primary"
                  :underline="false">修改金额</el-link>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="买家">
            <template slot-scope="scope">
              <div class="order-text">
                <p>
                  <span class="son">{{scope.row.get_user.username}}</span>

                  <el-image
                    v-if="scope.row.get_user.level_icon"
                    class="level-icon"
                    :src="scope.row.get_user.level_icon"
                    fit="fill">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"/>
                    </div>
                  </el-image>
                </p>

                <p>
                  <span class="son">{{scope.row.get_delivery | getDelivery}}</span>
                </p>

                <p>
                  <el-tooltip placement="top">
                    <div slot="content">
                      姓名：{{scope.row.consignee}}<br/>
                      手机：{{scope.row.mobile}}<br/>
                      地址：{{scope.row.complete_address}}
                    </div>
                    <i class="el-icon-house"/>
                  </el-tooltip>

                  <el-tooltip
                    v-if="scope.row.buyer_remark"
                    :content="scope.row.buyer_remark"
                    placement="top">
                    <i class="el-icon-chat-dot-round cs-ml-10"/>
                  </el-tooltip>

                  <el-tooltip
                    v-if="scope.row.invoice_title"
                    placement="top">
                    <div slot="content">
                      发票抬头：{{scope.row.invoice_title}}
                      <template v-if="scope.row.tax_number"><br/>纳税人号：{{scope.row.tax_number}}</template>
                    </div>
                    <i class="el-icon-tickets cs-ml-10"/>
                  </el-tooltip>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="交易状态"
            align="center">
            <template slot-scope="scope">
              <div class="order-text">
                <p
                  v-for="(item, index) in getOrderStatus(scope.row)"
                  :key="index"
                  class="order-button">{{item}}</p>

                <p>
                  <el-link
                    class="order-button"
                    type="info"
                    :underline="false">详情</el-link>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="order-text">
                <p v-if="scope.row.delivery_status === 0 && scope.row.trade_status <= 1">
                  <el-link
                    class="order-button"
                    type="success"
                    :underline="false">修改地址</el-link>
                </p>

                <p v-if="scope.row.payment_status === 1 && scope.row.trade_status === 0">
                  <el-link
                    class="order-button"
                    type="primary"
                    :underline="false">开始配货</el-link>
                </p>

                <p v-if="scope.row.payment_status === 1 && scope.row.trade_status === 1">
                  <el-link
                    class="order-button"
                    type="primary"
                    :underline="false">取消配货</el-link>
                </p>

                <p
                  v-if="scope.row.payment_status === 1 && scope.row.delivery_status !== 1 && [1, 2].includes(scope.row.trade_status)">
                  <el-link
                    class="order-button"
                    type="primary"
                    :underline="false">确定发货
                  </el-link>
                </p>

                <p v-if="scope.row.delivery_status === 1 && scope.row.trade_status === 2">
                  <el-link
                    class="order-button"
                    type="primary"
                    :underline="false">确认收货</el-link>
                </p>

                <p v-if="scope.row.delivery_status !== 0">
                  <el-link
                    class="order-button"
                    type="primary"
                    :underline="false">物流信息</el-link>
                </p>

                <p v-if="scope.row.trade_status <= 1">
                  <el-link
                    class="order-button"
                    type="danger"
                    :underline="false">取消订单</el-link>
                </p>

                <p>
                  <el-tooltip
                    :disabled="scope.row.sellers_remark.length <= 0"
                    :content="scope.row.sellers_remark"
                    placement="left">
                    <el-link
                      class="order-button"
                      title="编辑备注，仅自己可见"
                      :type="scope.row.sellers_remark ? 'warning' : 'info'"
                      :underline="false">备注</el-link>
                  </el-tooltip>
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    toPayment: {
      default: () => {}
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      auth: {
      },
      tabPane: '0',
      tabList: {
        '0': '全部',
        '1': '未付款',
        '2': '已付款',
        '3': '待发货',
        '4': '已发货',
        '5': '已完成',
        '6': '已取消',
        '8': '回收站'
      }
    }
  },
  filters: {
    getPreviewUrl(val) {
      return val ? util.getImageCodeUrl(val, 'goods_image_x80') : ''
    },
    getNumber(val) {
      return util.getNumber(val)
    },
    getDelivery(val) {
      return val ? val['alias'] : ''
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val
        this.multipleSelection = []
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // 获取列表中的订单编号
    _getOrderNoList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.order_no)
        })
      } else {
        idList.push(this.currentTableData[val].order_no)
      }

      return idList
    },
    // 获取付款方式
    _getPaymentType(code) {
      if (this.toPayment.hasOwnProperty(code)) {
        return this.toPayment[code]['name']
      }

      return ''
    },
    // 点击切换标签
    handleBefore(activeName) {
      this.$emit('tabs', activeName)
    },
    // 选中数据项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取排序字段
    sortChange({ column, prop, order }) {
      let sort = {
        order_type: undefined,
        order_field: undefined
      }

      if (column && order) {
        sort.order_type = order === 'ascending' ? 'asc' : 'desc'
        sort.order_field = prop
      }

      this.$emit('sort', sort)
    },
    // 打开商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 获取订单状态
    getOrderStatus(data) {
      let result = []

      switch (data.trade_status) {
        // 待处理
        case 0:
          switch (data.payment_status) {
            case 0:
              result.push('等待买家付款')
              break
            case 1:
              result.push('买家已付款')
              break
          }
          break
        // 配货中
        case 1:
          result.push('配货中')
          break
        // 已发货
        case 2:
          switch (data.delivery_status) {
            case 1:
              result.push('全部发货')
              break
            case 2:
              result.push('部分发货')
              break
          }
          break
        // 已完成
        case 3:
          result.push('交易成功')
          break
        case 4:
          result.push('交易关闭')
          break
      }

      return result
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-box {
    padding: 5px 10px;
    background-color: #FFF;
  }
  .el-table /deep/ td {
    background-color: #ffffff !important;
  }
  .order-summary {
    color: $color-text-placehoder;
    font-size: 13px;
  }
  .order-text {
    p {
      margin: 0;
    }
    .son {
      color: $color-text-sub;
      font-size: 13px;
    }
  }
  .order-goods-list {
    float: left;
    .goods-image {
      float: left;
      width: 80px;
      height: 80px;
    }
    .goods-info {
      padding: 0 30px 0 100px;
      .link {
        &:hover {
          cursor: pointer;
          color: $color-primary;
          text-decoration: underline;
        }
      }
    }
  }
  .shop-price {
    color: $color-danger;
  }
  .level-icon {
    margin-left: 5px;
    line-height: 0;
    vertical-align: text-bottom;
  }
  .order-button {
    padding: 0;
    font-size: 13px;
  }
</style>
