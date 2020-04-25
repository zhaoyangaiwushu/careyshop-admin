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
            label="售后单"
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

                <div class="goods-info order-text">
                  <p @click="handleView(scope.row.get_order_goods.goods_id)">
                    <span class="link">{{scope.row.get_order_goods.goods_name}}</span>
                  </p>
                </div>
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
    typeMap: {
      default: () => {}
    }
  },
  data() {
    return {
      currentTableData: [],
      tabPane: '0',
      statusMap: {
        '0': '全部',
        '1': '待处理',
        '2': '已同意',
        '3': '已拒绝',
        '4': '已寄件',
        '5': '售后中',
        '6': '已撤销',
        '7': '已完成'
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
        .then(() => {
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

  .service-goods {
    float: left;

    .goods-image {
      float: left;
      width: 80px;
      height: 80px;
    }
  }
</style>
