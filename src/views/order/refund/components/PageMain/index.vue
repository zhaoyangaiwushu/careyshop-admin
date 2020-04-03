<template>
  <div class="cs-p">
    <el-table
      v-loading="loading"
      :data="tableData"
      :highlight-current-row="true"
      @sort-change="sortChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="退款流水号">
              <span>{{props.row.refund_no}}</span>
            </el-form-item>

            <el-form-item label="交易账号">
              <span>{{props.row.get_user.username}}</span>
            </el-form-item>

            <el-form-item label="订单号">
              <span>{{props.row.order_no}}</span>
            </el-form-item>

            <el-form-item label="支付流水号">
              <span>{{props.row.payment_no}}</span>
            </el-form-item>

            <el-form-item label="退款交易号">
              <span>{{props.row.out_trade_no}}</span>
            </el-form-item>

            <el-form-item label="退款信息">
              <span>{{props.row.out_trade_msg}}</span>
            </el-form-item>

            <el-form-item label="支付总额">
              <el-tag
                type="success"
                effect="plain"
                size="mini">
                + {{props.row.total_amount | getNumber}}
              </el-tag>
            </el-form-item>

            <el-form-item label="退款金额">
              <el-tag
                type="danger"
                effect="plain"
                size="mini">
                + {{props.row.amount | getNumber}}
              </el-tag>
            </el-form-item>

            <el-form-item label="退款方式">
              <span>{{getToPayment(props.row.to_payment)}}</span>
            </el-form-item>

            <el-form-item label="退款状态">
              <el-tag
                :type="statusMap[props.row.status].type"
                effect="plain"
                size="mini">
                {{statusMap[props.row.status].text}}
              </el-tag>
            </el-form-item>

            <el-form-item label="创建日期">
              <span>{{props.row.create_time}}</span>
            </el-form-item>

            <el-form-item label="最后更新">
              <span>{{props.row.update_time}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="退款流水号"
        prop="refund_no"
        width="240">
        <template slot-scope="scope">
          <span
            @click="handleQuery(scope.row.refund_no)"
            :class="{link: auth.query}">{{scope.row.refund_no}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="交易账号"
        prop="get_user.username">
      </el-table-column>

      <el-table-column
        label="支付总额"
        prop="total_amount">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="plain"
            size="mini">
            + {{scope.row.total_amount | getNumber}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="退款金额"
        prop="amount">
        <template slot-scope="scope">
          <el-tag
            type="danger"
            effect="plain"
            size="mini">
            - {{scope.row.amount | getNumber}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="退款方式"
        prop="to_payment">
        <template slot-scope="scope">
          {{getToPayment(scope.row.to_payment)}}
        </template>
      </el-table-column>

      <el-table-column
        label="退款状态"
        prop="status"
        align="center"
        sortable="custom"
        min-width="100">
        <template slot-scope="scope">
          <el-tag
            :type="statusMap[scope.row.status].type"
            effect="plain"
            size="mini">
            {{statusMap[scope.row.status].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="创建日期"
        prop="create_time"
        align="center"
        width="160"
        sortable="custom">
      </el-table-column>
    </el-table>

    <el-dialog
      title="退款信息"
      :visible.sync="queryVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="650px"
      ref="print">
      <el-form
        label-width="165px"
        label-position="left"
        style="margin-top: -25px;">
        <el-form-item label="退款金额：">
          <span>{{queryData.refund_amount | getNumber}}</span>
        </el-form-item>

        <el-form-item label="退款状态：">
          <span>{{queryData.refund_status}}</span>
        </el-form-item>

        <el-form-item label="退款入账账户：">
          <span>{{queryData.refund_recv_accout}}</span>
        </el-form-item>

        <el-form-item label="退款单号(流水号)：">
          <span>{{queryData.refund_no}}</span>
        </el-form-item>

        <el-form-item label="支付单号(交易流水号)：">
          <span>{{queryData.payment_no}}</span>
        </el-form-item>

        <el-form-item label="退款交易号：">
          <span>{{queryData.out_trade_no}}</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer no-print">
        <div style="float: left">
          <el-button
            icon="el-icon-printer"
            @click="$print($refs.print)"
            size="small">打印</el-button>
        </div>

        <el-button
          type="primary"
          @click="queryVisible = false"
          size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
import { queryRefundItem } from '@/api/order/service'

export default {
  props: {
    loading: {
      default: false
    },
    toPayment: {
      default: () => {}
    },
    tableData: {
      default: () => []
    }
  },
  data() {
    return {
      queryData: {},
      queryVisible: false,
      auth: {
        query: false
      },
      statusMap: {
        0: {
          text: '待处理',
          type: 'info'
        },
        1: {
          text: '已处理',
          type: 'success'
        },
        2: {
          text: '失败',
          type: 'danger'
        },
        3: {
          text: '撤销',
          type: 'warning'
        }
      }
    }
  },
  filters: {
    getNumber(val) {
      return util.getNumber(val)
    }
  },
  mounted() {
    this._validationAuth()
  },
  methods: {
    _validationAuth() {
      this.auth.query = this.$permission('/order/admin/refund/query')
    },
    getToPayment(val) {
      return val !== '' ? this.toPayment[val]['name'] : ''
    },
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
    handleQuery(val) {
      if (!this.auth.query) {
        return
      }

      queryRefundItem(val)
        .then(res => {
          this.queryData = res.data || {}
          this.queryVisible = true
        })
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
    padding: 0 10px;
  }

  .table-expand >>> label {
    float: left;
    width: 90px;
    color: #99A9BF;
  }

  .table-expand >>> .el-form-item__content {
    display: block;
    padding-left: 90px;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
