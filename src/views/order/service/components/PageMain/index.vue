<template>
  <div class="cs-p">
    <el-tabs
      v-model="tabPane"
      @tab-click="tab => {$emit('tabs', tab.name)}"
      class="tab-box">
      <el-tab-pane
        v-for="(item, index) in statusMap"
        :key="index"
        :label="item"
        :name="index">
        <el-table v-if="index === tabPane" :data="currentTableData">
          <el-table-column
            label="商品"
            min-width="380">
            <template slot-scope="scope">
              <div class="service-summary cs-mb-5">
                <span class="cs-mr">售后单号：{{scope.row.service_no}}</span>
                <span>创建日期：{{scope.row.create_time}}</span>
              </div>

              <div class="service-goods">
                <el-image
                  class="goods-image cs-cp"
                  @click="handleView(scope.row.get_order_goods.goods_id)"
                  :src="scope.row.get_order_goods.goods_image | getPreviewUrl"
                  fit="contain"
                  lazy>
                </el-image>

                <div class="goods-info service-text">
                  <p>
                    <span
                      @click="handleView(scope.row.get_order_goods.goods_id)"
                      class="link">{{scope.row.get_order_goods.goods_name}}</span>

                    <span
                      :style="{'color': deliveryMap[scope.row.get_order_goods.status].color}"
                      class="cs-pl-5">{{deliveryMap[scope.row.get_order_goods.status].text}}</span>
                  </p>

                  <p class="son">
                    订单号：<span
                      @click="handleOrder(scope.row.order_no)"
                      class="link">{{scope.row.order_no}}</span></p>

                  <p
                    v-if="scope.row.get_order_goods.key_value"
                    class="son">{{scope.row.get_order_goods.key_value}}</p>

                  <p class="son">{{scope.row.reason}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="售后类型"
            min-width="100">
            <template slot-scope="scope">
              <div class="service-text">
                <p>{{typeMap[scope.row.type]}}</p>
                <p v-if="scope.row.goods_status" class="son">收货状态：{{goodsMap[scope.row.goods_status]}}</p>
                <p v-if="scope.row.refund_fee" class="son">申请金额：{{scope.row.refund_fee | getNumber}}</p>
                <p v-if="scope.row.qty" class="son">申请数量：{{scope.row.qty}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="买家">
            <template slot-scope="scope">
              <div class="service-text">
                <p style="width: 130px;">
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

                <p v-if="scope.row.is_return">
                  <el-tooltip placement="top">
                    <div slot="content">
                      返件信息<br/><br/>
                      姓名：{{scope.row.consignee}}<br/>
                      手机：{{scope.row.mobile}}<br/>
                      地址：{{scope.row.address}}<br/>
                      邮编：{{scope.row.zipcode}}
                    </div>
                    <span class="son">返件地址</span>
                  </el-tooltip>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="售后状态"
            align="center">
            <template slot-scope="scope">
              <div class="service-text">
                <el-badge
                  :hidden="!scope.row.admin_event"
                  class="service-event"
                  is-dot>
                  <p class="service-button">{{statusMap[scope.row.status + 1]}}</p>
                </el-badge>

                <p v-if="scope.row.type === 2 || scope.row.logistic_code">
                  <el-link
                    class="service-button"
                    type="info"
                    @click="handleDeliveryDist(scope.row.service_no)"
                    :underline="false">物流信息</el-link>
                </p>

                <p>
                  <el-link
                    class="service-button"
                    type="info"
                    @click="() => {}"
                    :underline="false">详情</el-link>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="service-text">
                <p v-if="scope.row.status === 0">
                  <el-link
                    class="service-button"
                    type="primary"
                    @click="() => {}"
                    :underline="false">同意处理</el-link>
                </p>

                <p v-if="scope.row.status === 0">
                  <el-link
                    class="service-button"
                    type="danger"
                    @click="() => {}"
                    :underline="false">拒绝处理</el-link>
                </p>

                <p v-if="scope.row.type !== 0 && scope.row.status === 1 && !scope.row.logistic_code">
                  <el-link
                    class="service-button"
                    @click="() => {}"
                    :underline="false">{{scope.row.is_return ? '撤销寄回' : '要求寄回'}}</el-link>
                </p>

                <p v-if="[1, 3].includes(scope.row.status)">
                  <el-link
                    class="service-button"
                    @click="() => {}"
                    :underline="false">售后工单</el-link>
                </p>

                <p v-if="[1, 3, 4].includes(scope.row.status)">
                  <el-link
                    class="service-button"
                    @click="() => {}"
                    :underline="false">撤销工单</el-link>
                </p>

                <p v-if="[1, 3, 4].includes(scope.row.status)">
                  <el-link
                    class="service-button"
                    type="success"
                    @click="() => {}"
                    :underline="false">完结工单</el-link>
                </p>

                <p>
                  <el-tooltip
                    :disabled="scope.row.remark.length <= 0"
                    :content="scope.row.remark"
                    placement="left">
                    <el-link
                      class="service-button"
                      :type="scope.row.remark ? 'warning' : 'info'"
                      @click="() => {}"
                      :underline="false">备注</el-link>
                  </el-tooltip>
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <cs-delivery-dist ref="deliveryDist"/>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  components: {
    'csDeliveryDist': () => import('@/components/cs-delivery-dist')
  },
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    typeMap: {
      default: () => {}
    }
  },
  data() {
    return {
      currentTableData: [],
      tabPane: 0,
      statusMap: {
        0: '全部',
        1: '待处理',
        2: '已同意',
        3: '已拒绝',
        4: '已寄件',
        5: '售后中',
        6: '已撤销',
        7: '已完结'
      },
      deliveryMap: {
        0: {
          text: '待发货',
          color: '#303133'
        },
        1: {
          text: '已发货',
          color: '#67C23A'
        },
        2: {
          text: '已收货',
          color: '#67C23A'
        },
        3: {
          text: '已取消',
          color: '#F56C6C'
        }
      },
      goodsStatus: {
        0: '待发货',
        1: '已发货',
        2: '已收货',
        3: '已取消'
      },
      goodsMap: {
        0: '未选择',
        1: '未收到货',
        2: '已收到货'
      }
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val
      },
      immediate: true
    }
  },
  filters: {
    getPreviewUrl(val) {
      return val ? util.getImageCodeUrl(val, 'goods_image_x80') : ''
    },
    getNumber(val) {
      return util.getNumber(val)
    }
  },
  methods: {
    // 询问提示
    _whetherToConfirm(message = null, type = 'warning') {
      let options = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type
      }

      let msg = message || '确定要执行该操作吗?'
      return this.$confirm(msg, '提示', options)
    },
    // 商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 查看订单详情
    handleOrder(order_no) {
      this.$router.push({
        name: 'order-admin-info',
        params: { order_no }
      })
    },
    // 查询配送轨迹
    handleDeliveryDist(value) {
      if (this.$refs.deliveryDist) {
        this.$refs.deliveryDist.show(value)
      }
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
    background-color: #FFFFFF !important;
  }

  .service-event /deep/ .el-badge__content {
    margin-top: 5px;
    margin-right: -5px;
  }

  .service-summary {
    color: $color-text-placehoder;
    font-size: 13px;
  }

  .service-text {
    p {
      margin: 0;
    }

    .son {
      color: $color-text-sub;
      font-size: 13px;
    }
  }

  .service-goods {
    float: left;

    .goods-image {
      float: left;
      width: 80px;
      height: 80px;
    }

    .goods-info {
      padding: 0 50px 0 100px;

      .link {
        &:hover {
          cursor: pointer;
          color: $color-primary;
          text-decoration: underline;
        }
      }
    }
  }

  .level-icon {
    margin-left: 5px;
    line-height: 0;
    vertical-align: text-bottom;
  }

  .service-button {
    padding: 0;
    font-size: 13px;
  }
</style>
