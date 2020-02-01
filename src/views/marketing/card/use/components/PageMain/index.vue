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
            @click="handleInvalid(null, 1)">启用</el-button>

          <el-button
            v-if="auth.disable"
            icon="el-icon-close"
            :disabled="loading"
            @click="handleInvalid(null, 0)">禁用</el-button>
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
      <el-table-column align="center" type="selection" width="55"/>

      <el-table-column
        label="卡号"
        prop="number"
        min-width="110">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.remark"
            :content="`备注：${scope.row.remark}`"
            placement="top-start">
            <i class="el-icon-tickets cs-pr-5"/>
          </el-tooltip>
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="卡密"
        prop="password"
        min-width="130">
      </el-table-column>

      <el-table-column
        label="可用余额"
        prop="money">
        <template slot-scope="scope">
          {{scope.row.money | getNumber}}
        </template>
      </el-table-column>

      <el-table-column
        label="是否激活"
        align="center"
        prop="is_active">
        <template slot-scope="scope">
          <el-tag size="mini" effect="plain" :type="activeMap[scope.row.is_active].type">
            {{activeMap[scope.row.is_active].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="激活账号"
        prop="get_user.username">
      </el-table-column>

      <el-table-column
        label="激活日期"
        align="center"
        prop="active_time"
        width="160">
      </el-table-column>

      <el-table-column
        label="状态"
        align="center"
        prop="is_invalid">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="invalidMap[scope.row.is_invalid].type"
            :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
            :effect="auth.enable || auth.disable ? 'light' : 'plain'"
            @click.native="handleInvalid(scope.$index)">
            {{invalidMap[scope.row.is_invalid].text}}
          </el-tag>
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
      },
      activeMap: {
        0: {
          text: '待激活',
          type: 'info'
        },
        1: {
          text: '已激活',
          type: ''
        }
      },
      invalidMap: {
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
  },
  mounted() {
    this._validationAuth()
  },
  methods: {
    // 验证权限
    _validationAuth() {
    },
    // 显示购物卡信息
    handleInfo() {
      let message = !this.cardData
        ? '<p>查询全部购物卡时无法显示购物卡信息</p>'
        : `
        <p>名称：${this.cardData.name}</p>
        <p>描述：${this.cardData.description}</p></br>
        <p>面额：${util.getNumber(this.cardData.money)}</p>
        <p>发放数：${this.cardData.give_num}</p>
        <p>激活数：${this.cardData.active_num}</p>
        <p>创建时间：${this.cardData.create_time}</p>
        <p>截止日期：${this.cardData.end_time || '不限日期'}</p>
        <p>状态：${this.invalidMap[this.cardData.status].text}</p>
        `

      this.$notify({
        title: '购物卡信息',
        dangerouslyUseHTMLString: true,
        message: message,
        type: 'success',
        position: 'bottom-right',
        duration: 0
      })
    }
  }
}
</script>
