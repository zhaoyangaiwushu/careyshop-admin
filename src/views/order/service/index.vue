<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :type-map="typeMap"
      :status-map="statusMap"
      @submit="handleSubmit"
      ref="header"/>

<!--    <page-main-->
<!--      :loading="loading"-->
<!--      :table-data="table"-->
<!--      @tabs="handleTabs"-->
<!--      @refresh="handleRefresh"/>-->

    <page-footer
      slot="footer"
      :loading="loading"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
  </cs-container>
</template>

<script>
import { getOrderServiceList } from '@/api/order/service'

export default {
  name: 'order-service-list',
  components: {
    'PageHeader': () => import('./components/PageHeader'),
    // 'PageMain': () => import('./components/PageMain'),
    'PageFooter': () => import('@/components/cs-footer')
  },
  data() {
    return {
      loading: false,
      table: [],
      typeMap: {
        '0': '仅退款',
        '1': '退货退款',
        '2': '换货',
        '3': '维修'
      },
      statusMap: {
        '0': '待处理',
        '1': '已同意',
        '2': '已拒绝',
        '3': '已寄件',
        '4': '售后中',
        '5': '已撤销',
        '6': '已完成'
      },
      page: {
        current: 1,
        size: 0,
        total: 0
      }
    }
  },
  mounted() {
    this.$store.dispatch('careyshop/db/databasePage', { user: true })
      .then(res => {
        this.page.size = res.get('size').value() || 25
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  beforeRouteEnter(to, from, next) {
    // 从订单详情页返回后刷新列表
    if (from.name === 'order-service-info') {
      next(instance => {
        if (instance.$refs.header) {
          instance.$refs.header.handleFormSubmit()
        }
      })
    } else {
      next()
    }
  },
  methods: {
    // 刷新列表页面
    handleRefresh(isTurning = false) {
      if (isTurning) {
        !(this.page.current - 1) || this.page.current--
      }

      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 分页变化改动
    handlePaginationChange(val) {
      this.page = val
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 标签页切换
    handleTabs(val) {
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit(true)
      })
    },
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.current = 1
      }

      this.loading = true
      getOrderServiceList({
        ...form,
        page_no: this.page.current,
        page_size: this.page.size
      })
        .then(res => {
          this.table = res.data.items || []
          this.page.total = res.data.total_result
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
