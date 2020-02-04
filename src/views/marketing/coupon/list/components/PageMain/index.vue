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
              <el-tag
                :type="statusMap[props.row.status].type"
                effect="plain"
                size="mini">
                {{statusMap[props.row.status].text}}
              </el-tag>
            </el-form-item>

            <el-form-item label="是否有效">
              <el-tag
                :type="invalidMap[props.row.is_invalid].type"
                effect="plain"
                size="mini">
                {{invalidMap[props.row.is_invalid].text}}
              </el-tag>
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
          <span :class="{link: auth.give}" @click="handleGive(scope.row.coupon_id)">{{scope.row.name}}</span>
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
        label="是否有效"
        sortable="custom"
        prop="is_invalid"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="invalidMap[scope.row.is_invalid].type"
            :style="auth.normal || auth.invalid ? 'cursor: pointer;' : ''"
            :effect="auth.normal || auth.invalid ? 'light' : 'plain'"
            @click.native="handleInvalid(scope.$index)">
            {{invalidMap[scope.row.is_invalid].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="120">
        <template slot-scope="scope">
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
import { delCouponList, setCouponInvalid, setCouponStatus } from '@/api/marketing/coupon'
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
      currentTableData: [],
      multipleSelection: [],
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑优惠劵',
        create: '新增优惠劵'
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
      invalidMap: {
        0: {
          text: '正常',
          type: 'success'
        },
        1: {
          text: '作废',
          type: 'danger'
        },
        2: {
          text: '...',
          type: 'info'
        }
      },
      auth: {
        give: false,
        add: true,
        set: true,
        del: true,
        enable: true,
        disable: true,
        normal: true,
        invalid: true
      },
      form: {
      },
      rules: {
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
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.coupon_id)
        })
      } else {
        idList.push(this.currentTableData[val].coupon_id)
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
    // 打开优惠劵使用明细
    handleGive(key) {
      if (this.auth.give) {
        this.$router.push({
          name: 'marketing-card-give',
          params: { coupon_id: key }
        })
      }
    },
    // 批量删除
    handleDelete(val) {
      let coupon_id = this._getIdList(val)
      if (coupon_id.length === 0) {
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
          delCouponList(coupon_id)
            .then(() => {
              for (let i = this.currentTableData.length - 1; i >= 0; i--) {
                if (coupon_id.indexOf(this.currentTableData[i].coupon_id) !== -1) {
                  this.currentTableData.splice(i, 1)
                }
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 批量设置状态
    handleStatus(val, status = 0, confirm = false) {
      let coupon_id = this._getIdList(val)
      if (coupon_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(coupon_id, status, vm) {
        setCouponStatus(coupon_id, status)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (coupon_id.indexOf(value.coupon_id) !== -1) {
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
        setStatus(coupon_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(coupon_id, status, this)
        })
        .catch(() => {
        })
    },
    // 批量设置是否有效
    handleInvalid(val, invalid = 0, confirm = false) {
      let coupon_id = this._getIdList(val)
      if (coupon_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setInvalid(coupon_id, is_invalid, vm) {
        setCouponInvalid(coupon_id, is_invalid)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (coupon_id.indexOf(value.coupon_id) !== -1) {
                vm.$set(vm.currentTableData, index, {
                  ...value,
                  is_invalid
                })
              }
            })

            vm.$message.success('操作成功')
          })
      }

      if (!confirm) {
        let oldData = this.currentTableData[val]
        const newInvalid = oldData.is_invalid ? 0 : 1

        if (oldData.is_invalid > 1) {
          return
        }

        // 禁用权限检测
        if (newInvalid === 0 && !this.auth.normal) {
          return
        }

        // 启用权限检测
        if (newInvalid === 1 && !this.auth.invalid) {
          return
        }

        this.$set(this.currentTableData, val, { ...oldData, is_invalid: 2 })
        setInvalid(coupon_id, newInvalid, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setInvalid(coupon_id, invalid, this)
        })
        .catch(() => {
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
