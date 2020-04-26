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
        7: '已完成'
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

  .service-event /deep/ .el-badge__content {
    margin-top: 11px;
    margin-right: -10px;
  }
</style>
