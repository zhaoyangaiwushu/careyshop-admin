<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="() => {}">新增购物卡</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑购物卡',
        create: '新增购物卡'
      },
      statusMap: {
        0: {
          text: '禁用',
          type: 'danger'
        },
        1: {
          text: '启用',
          type: 'success'
        },
        2: {
          text: '...',
          type: 'info'
        }
      },
      auth: {
        add: false,
        set: false,
        del: false,
        enable: false,
        disable: false
      },
      form: {
        name: undefined,
        description: undefined,
        money: undefined,
        category: undefined,
        exclude_category: undefined,
        give_num: undefined,
        end_time: undefined,
        status: undefined
      },
      rules: {
      }
    }
  }
}
</script>

<style scoped>
</style>
