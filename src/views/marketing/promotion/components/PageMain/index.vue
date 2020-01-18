<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="() => {}">新增促销</el-button>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button
            icon="el-icon-check"
            :disabled="loading"
            @click="handleStatus(null, 1, true)">启用</el-button>

          <el-button
            icon="el-icon-close"
            :disabled="loading"
            @click="handleStatus(null, 0, true)">禁用</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item>
        <el-button
          icon="el-icon-delete"
          :disabled="loading"
          @click="handleDelete(null)">删除</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-table
      v-loading="loading"
      :data="currentTableData"
      :highlight-current-row="true"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">
      <el-table-column align="center" type="selection" width="50"/>

      <el-table-column
        label="编号"
        prop="promotion_id"
        sortable="custom"
        min-width="40">
      </el-table-column>

      <el-table-column
        label="名称"
        prop="name"
        sortable="custom"
        min-width="180">
      </el-table-column>

      <el-table-column
        label="促销日期"
        prop="begin_time"
        sortable="custom"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.begin_time}}</span>
          <br>
          <span>{{scope.row.end_time}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status"
        sortable="custom"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="statusMap[scope.row.status].type"
            :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
            :effect="auth.enable || auth.disable ? 'light' : 'plain'"
            @click.native="handleStatus(scope.$index)">
            {{statusMap[scope.row.status].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <el-button
            @click="() => {}"
            size="small"
            type="text">编辑</el-button>

          <el-button
            @click="handleDelete(scope.$index)"
            size="small"
            type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { delPromotionList, setPromotionStatus } from '@/api/marketing/promotion'

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
      multipleSelection: [],
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
      textMap: {
        update: '编辑促销',
        create: '新增促销'
      },
      form: {
        name: undefined,
        begin_time: undefined,
        end_time: undefined,
        status: undefined,
        promotion_item: undefined
      },
      auth: {
        add: false,
        set: false,
        del: false,
        enable: true,
        disable: true
      },
      rules: {
      },
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: ''
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
  mounted() {
    this._validationAuth()
  },
  methods: {
    // 验证权限
    _validationAuth() {
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.promotion_id)
        })
      } else {
        idList.push(this.currentTableData[val].promotion_id)
      }

      return idList
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
    // 批量设置状态
    handleStatus(val, status = 0, confirm = false) {
      let promotion_id = this._getIdList(val)
      if (promotion_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(promotion_id, status, vm) {
        setPromotionStatus(promotion_id, status)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (promotion_id.indexOf(value.promotion_id) !== -1) {
                vm.$set(vm.currentTableData, index, {
                  ...value,
                  status
                })
              }
            })

            vm.$message.success('操作成功')
          })
      }

      if (!confirm) {
        let oldData = this.currentTableData[val]
        const newStatus = oldData.status ? 0 : 1

        if (oldData.status > 1) {
          return
        }

        // 禁用权限检测
        if (newStatus === 0 && !this.auth.disable) {
          return
        }

        // 启用权限检测
        if (newStatus === 1 && !this.auth.enable) {
          return
        }

        this.$set(this.currentTableData, val, { ...oldData, status: 2 })
        setStatus(promotion_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(promotion_id, status, this)
        })
        .catch(() => {
        })
    },
    // 批量删除
    handleDelete(val) {
      let promotion_id = this._getIdList(val)
      if (promotion_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          delPromotionList(promotion_id)
            .then(() => {
              for (let i = this.currentTableData.length - 1; i >= 0; i--) {
                if (promotion_id.indexOf(this.currentTableData[i].promotion_id) !== -1) {
                  this.currentTableData.splice(i, 1)
                }
              }

              if (this.currentTableData.length <= 0) {
                this.$emit('refresh', true)
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style scoped>
</style>
