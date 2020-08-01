<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :tree-data="tree"
      :module="module"
      @refresh="handleRefresh"
      ref="main"/>
  </cs-container>
</template>

<script>
  import util from '@/utils/util'
  import { getMenuList } from '@/api/auth/menu'

  export default {
    name: 'setting-auth-menu',
    components: {
      PageHeader: () => import('./components/PageHeader'),
      PageMain: () => import('./components/PageMain')
    },
    data() {
      return {
        tree: [],
        loading: false,
        module: undefined
      }
    },
    mounted() {
      this.handleSubmit({ module: 'admin' })
    },
    methods: {
      // 重新载入页面
      handleRefresh() {
        this.$nextTick(() => {
          this.$refs.header.handleFormSubmit()
        })
      },
      // 提交查询请求
      handleSubmit(form) {
        form.pageNum = 1
        form.orderByColumn = 'id'
        form.isAsc = 'asc'
        form.pageSize = 10000
        this.loading = true
        getMenuList(form)
          .then(res => {
            this.module = form.module
            this.tree = util.formatDataToTree(res.rows, 'id', 'parentId')
            if (this.$refs.main) {
              this.$refs.main.filterText = ''
              this.$refs.main.resetForm()
              this.$refs.main.resetElements()
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
</script>
