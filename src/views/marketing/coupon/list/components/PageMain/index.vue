<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增优惠劵</el-button>
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
        <el-button-group>
          <el-button
            icon="el-icon-circle-check"
            :disabled="loading"
            @click="handleInvalid(null, 0, true)">正常</el-button>

          <el-button
            icon="el-icon-circle-close"
            :disabled="loading"
            @click="handleInvalid(null, 1, true)">作废</el-button>
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
      <el-table-column align="center" type="selection" width="55"/>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="名称">
              <span>{{props.row.name}}</span>
            </el-form-item>

            <el-form-item label="描述">
              <span>{{props.row.description}}</span>
            </el-form-item>

            <el-form-item label="类型">
              <span>{{typeMap[props.row.type]}}</span>
            </el-form-item>

            <el-form-item label="领取码">
              <span>{{props.row.give_code}}</span>
            </el-form-item>

            <el-form-item label="优惠金额">
              <span>{{props.row.money | getNumber}}</span>
            </el-form-item>

            <el-form-item label="限制金额">
              <span>{{props.row.quota | getNumber}}</span>
            </el-form-item>

            <el-form-item label="限领次数">
              <span>{{props.row.frequency || '不限次数'}}</span>
            </el-form-item>

            <el-form-item label="发放数">
              <span>{{props.row.give_num}}</span>
            </el-form-item>

            <el-form-item label="领取数">
              <span>{{props.row.receive_num}}</span>
            </el-form-item>

            <el-form-item label="使用数">
              <span>{{props.row.use_num}}</span>
            </el-form-item>

            <el-form-item label="状态">
              <span>{{props.row.status}}</span>
            </el-form-item>

            <el-form-item label="是否有效">
              <span>{{props.row.is_invalid}}</span>
            </el-form-item>

            <el-divider/>

            <el-form-item label="发放开始日期">
              <span>{{props.row.give_begin_time}}</span>
            </el-form-item>

            <el-form-item label="发放截至日期">
              <span>{{props.row.give_end_time}}</span>
            </el-form-item>

            <el-form-item label="使用开始日期">
              <span>{{props.row.use_begin_time}}</span>
            </el-form-item>

            <el-form-item label="使用截至日期">
              <span>{{props.row.use_end_time}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="名称"
        prop="name"
        sortable="custom"
        min-width="200"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.description"
            :content="`描述：${scope.row.description}`"
            placement="top-start">
            <i class="el-icon-tickets cs-pr-5"/>
          </el-tooltip>
          <span :class="{link: true}" @click="handleGive(scope.row.coupon_id)">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        sortable="custom"
        prop="type">
        <template slot-scope="scope">
          {{typeMap[scope.row.type]}}
        </template>
      </el-table-column>

      <el-table-column
        label="优惠金额"
        prop="money">
        <template slot-scope="scope">
          {{scope.row.money | getNumber}}
        </template>
      </el-table-column>

      <el-table-column
        label="限制金额"
        prop="quota">
        <template slot-scope="scope">
          {{scope.row.quota | getNumber}}
        </template>
      </el-table-column>

      <el-table-column
        label="发放数"
        sortable="custom"
        prop="give_num">
      </el-table-column>

      <el-table-column
        label="状态"
        sortable="custom"
        prop="status"
        align="center"
        width="100">
      </el-table-column>

      <el-table-column
        label="是否有效"
        sortable="custom"
        prop="is_invalid"
        align="center"
        width="100">
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="120">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  // components: {
  //   'csGoodsCategory': () => import('@/components/cs-goods-category')
  // },
  props: {
    loading: {
      default: false
    },
    typeMap: {
      default: () => {}
    },
    tableData: {
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  filters: {
    getNumber(val) {
      return util.getNumber(val)
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
    }
  }
}
</script>

<style scoped>
  .link:hover {
    cursor: pointer;
    color: #409EFF;
    text-decoration: underline;
  }
  .table-expand {
    font-size: 0;
    padding: 0 65px;
  }
  .table-expand >>> label {
    float: left;
    width: 120px;
    color: #99a9bf;
  }
  .table-expand >>> .el-form-item__content {
    display: block;
    padding-left: 120px;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
