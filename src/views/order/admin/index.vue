<template>
  <cs-container :is-back-to-top="true">
    <page-header
      slot="header"
      :loading="loading"
      :to-payment="toPayment"
      :status-map="statusMap"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :tabs-config="tabs"
      :to-payment="toPayment"
      :status-map="statusMap"
      @sort="handleSort"
      @refresh="handleRefresh"/>

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
import { getPaymentList } from '@/api/payment/payment'

export default {
  name: 'order-admin-list',
  components: {
    'PageHeader': () => import('./components/PageHeader'),
    'PageMain': () => import('./components/PageMain'),
    'PageFooter': () => import('@/layout/header-aside/components/footer')
  },
  data() {
    return {
      loading: true,
      table: [],
      toPayment: {},
      statusMap: {
        0: '全部',
        1: '未付款',
        2: '已付款',
        3: '待发货',
        4: '已发货',
        5: '已完成',
        6: '已取消',
        7: '待评价'
      },
      page: {
        current: 1,
        size: 0,
        total: 0
      },
      order: {
        order_type: undefined,
        order_field: undefined
      }
    }
  },
  mounted() {
    Promise.all([
      // TODO 是否需要"type"字段有待验证
      getPaymentList({ is_select: 1 }),
      this.$store.dispatch('careyshop/db/databasePage', { user: true })
    ])
      .then(res => {
        if (res[0].data) {
          res[0].data.forEach(value => {
            this.toPayment[value.code] = value
          })
        }

        this.page.size = res[1].get('size').value() || 50
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  methods: {
  }
}
</script>
