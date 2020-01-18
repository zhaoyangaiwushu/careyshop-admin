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
            @click="() => {}">启用</el-button>

          <el-button
            icon="el-icon-close"
            :disabled="loading"
            @click="() => {}">禁用</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item>
        <el-button
          icon="el-icon-delete"
          :disabled="loading"
          @click="() => {}">删除</el-button>
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
            @click="() => {}"
            size="small"
            type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
        enable: false,
        disable: false
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
    }
  }
}
</script>

<style scoped>
</style>
