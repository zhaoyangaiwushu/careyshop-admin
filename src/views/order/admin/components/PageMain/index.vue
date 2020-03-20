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
        <el-button
          icon="el-icon-takeaway-box"
          :disabled="loading"
          @click="() => {}">设为配货</el-button>
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
            min-width="380">
            <template slot-scope="scope">
              <div class="order-summary cs-mb-5">
                <span class="cs-mr">订单号：{{scope.row.order_no}}</span>
                <span>创建日期：{{scope.row.create_time}}</span>
              </div>

              <ul class="order-goods-list">
                <li v-for="(goods, index) in scope.row.get_order_goods" :key="index">
                  <el-image
                    class="order-goods-image cs-cp"
                    @click="() => {}"
                    :src="goods.goods_image | getPreviewUrl"
                    fit="contain"
                    lazy/>
                </li>
              </ul>
            </template>
          </el-table-column>

          <el-table-column label="买家">
          </el-table-column>

          <el-table-column label="实收款">
          </el-table-column>

          <el-table-column label="交易状态">
          </el-table-column>

          <el-table-column label="操作">
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
        '6': '已取消'
      }
    }
  },
  filters: {
    getPreviewUrl(val) {
      if (val) {
        if (val.source || val) {
          return util.getImageCodeUrl(val.source || val, 'goods_image_x80')
        }
      }

      return ''
    },
    getNumber(val) {
      return util.getNumber(val)
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
  .order-goods-list {
    overflow: hidden;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .order-goods-image {
    float: left;
    width: 80px;
    height: 80px;
  }
</style>
