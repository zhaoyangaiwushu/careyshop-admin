<template>
  <el-table :data="discountList">
    <el-table-column
      label="商品名称"
      prop="name">
      <template slot-scope="scope">
        <div class="discount-text" :title="scope.row.name">{{scope.row.goods.name}}</div>
      </template>
    </el-table-column>

    <el-table-column
      :label="typeMap[type] || '折扣方式'"
      width="160">
      <template slot="header" slot-scope="scope">
        <el-tooltip placement="top" :content="typeHelp[type]">
          <i class="el-icon-warning-outline cs-mr-10" v-show="typeHelp[type]"/>
        </el-tooltip>
        <span>{{scope.column.label}}</span>
      </template>

      <template slot-scope="scope">
        <el-select
          v-if="type === '3'"
          v-model="scope.row.discount"
          placeholder="请选择">
        </el-select>

        <el-input-number
          v-else
          v-model="scope.row.discount"
          controls-position="right"
          placeholder="请输入"
          size="mini"
          :max="type === '0' ? 100 : Number.MAX_SAFE_INTEGER"
          :min="0"
          :precision="2">
        </el-input-number>
      </template>
    </el-table-column>

    <el-table-column
      align="center"
      width="80">
      <template slot="header">
        <el-button type="text">批处理</el-button>
      </template>

      <template slot-scope="scope">
        <el-button
          @click="remove(scope.$index)"
          type="text"
          size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getCouponSelect } from '@/api/marketing/coupon'

export default {
  props: {
    // 外部v-model值
    value: {
      type: Array,
      required: true,
      default: () => {}
    },
    // 折扣方式
    type: {
      type: String,
      required: false,
      default: null
    },
    // 折扣索引
    typeMap: {
      default: () => {}
    }
  },
  computed: {
    discountList: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  data() {
    return {
      typeHelp: {
        '0': '打折额度，比如65表示按6.5折结算',
        '1': '减多少额度，比如65表示在原价的基础上减去65',
        '2': '固定价格，比如65则按65的价格结算',
        '3': '赠送优惠劵，订单完成后赠送指定的优惠劵给顾客'
      },
      couponData: []
    }
  },
  watch: {
    type: {
      handler() {
        this.discountList.forEach(value => {
          value.discount = undefined
        })
      }
    }
  },
  mounted() {
    getCouponSelect({ type: 3, status: 1, is_invalid: 1 })
      .then(res => {
        this.couponData = res.data || []
      })
  },
  methods: {
    remove(index) {
      this.discountList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
  .discount-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }
</style>
