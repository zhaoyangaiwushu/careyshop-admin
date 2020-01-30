<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-if="auth.info">
        <el-button
          icon="el-icon-warning-outline"
          :disabled="loading"
          @click="handleInfo">购物卡信息</el-button>
      </el-form-item>

      <el-form-item v-if="auth.enable || auth.disable">
        <el-button-group>
          <el-button
            v-if="auth.enable"
            icon="el-icon-check"
            :disabled="loading"
            @click="handleInvalid(null, 1, true)">设为有效</el-button>

          <el-button
            v-if="auth.disable"
            icon="el-icon-close"
            :disabled="loading"
            @click="handleInvalid(null, 0, true)">设为无效</el-button>
        </el-button-group>
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
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50"/>

      <el-table-column
        label="卡号"
        prop="number"
        min-width="120">
      </el-table-column>

      <el-table-column
        label="卡密"
        prop="password"
        min-width="120">
      </el-table-column>

      <el-table-column
        label="金额"
        prop="money">
        <template slot-scope="scope">
          {{scope.row.money | getNumber}}
        </template>
      </el-table-column>
    </el-table>
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
    cardData: {
      default: null
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      auth: {
        info: true,
        enable: true,
        disable: true
      }
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
  }
}
</script>
