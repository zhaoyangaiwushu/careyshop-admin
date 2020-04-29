<template>
  <cs-container>
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never">
        <el-row>
          <el-col class="service-left cs-pr" :span="9">
            <p class="card-title">售后信息</p>
          </el-col>

          <el-col class="cs-pl" :span="15">
            <p class="card-title">售后状态</p>
          </el-col>
        </el-row>

        <el-collapse :value="['goods', 'log']">
          <el-collapse-item title="售后商品" name="goods">
            <el-table
              style="margin-top: -15px;"
              :data="serviceData.get_order_goods">
              <el-table-column label="商品" min-width="300">
                <template slot-scope="scope">
                  <el-image
                    class="goods-image"
                    @click="handleView(scope.row.goods_id)"
                    :src="scope.row.goods_image | getPreviewUrl"
                    fit="contain"
                    lazy>
                  </el-image>

                  <div class="goods-info">
                    <span
                      :title="scope.row.goods_name"
                      @click="handleView(scope.row.goods_id)"
                      class="name">{{scope.row.goods_name}}</span>
                    <span
                      :style="{'color': deliveryMap[scope.row.status].color}"
                      class="delivery cs-pl-5">{{deliveryMap[scope.row.status].text}}</span>

                    <p class="specs">{{scope.row.key_value}}</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="申请数量">
                <span>{{serviceData.qty}}</span>
              </el-table-column>

              <el-table-column label="申请金额">
                <span>{{serviceData.refund_fee | getNumber}}</span>
              </el-table-column>

              <el-table-column label="类型">
                <span>{{typeMap[serviceData.type]}}</span>
              </el-table-column>

              <el-table-column label="状态">
                <span>{{statusMap[serviceData.status + 1]}}</span>
              </el-table-column>
            </el-table>
          </el-collapse-item>

          <el-collapse-item title="售后日志" name="log" id="msg-form">
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in serviceData.get_service_log"
                :key="index"
                :type="log.client_type ? 'danger' : 'primary'"
                :timestamp="log.create_time">
                <div class="service-log">
                  <li><span>[{{clientMap[log.client_type]}}]</span> {{log.action}}</li>
                  <li class="comment">{{`${log.description}：${log.comment}`}}</li>
                </div>
              </el-timeline-item>
            </el-timeline>

            <el-form
              :model="msgForm"
              :rules="msgRules"
              label-width="68px"
              id="add-message"
              ref="msgForm">
              <el-form-item prop="message">
                <el-input
                  v-model="msgForm.message"
                  placeholder="您可以输入售后单留言，顾客在日志中可看到"
                  type="textarea"
                  :autosize="{minRows: 5}"
                  :show-word-limit="true"
                  maxlength="255"/>

                <el-button
                  class="cs-mt-10"
                  type="primary"
                  :loading="msgLoading"
                  @click="handleMessage"
                  size="small">提交</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
import serviceMixins from './components/mixins/service'
import { addOrderServiceMessage, getOrderServiceItem } from '@/api/order/service'

export default {
  name: 'order-service-info',
  mixins: [
    serviceMixins
  ],
  props: {
    service_no: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      serviceData: {},
      msgForm: {},
      msgLoading: false,
      msgRules: {
        message: [
          {
            required: true,
            message: '留言内容不能为空',
            trigger: 'blur'
          },
          {
            max: 255,
            message: '长度不能大于 255 个字符',
            trigger: 'blur'
          }
        ]
      },
      typeMap: {
        '0': '仅退款',
        '1': '退货退款',
        '2': '换货',
        '3': '维修'
      },
      clientMap: {
        '-1': '游客',
        '0': '顾客',
        '1': '商家'
      }
    }
  },
  watch: {
    service_no: {
      handler() {
        this.getServiceData()
      },
      immediate: true
    }
  },
  methods: {
    // 获取售后数据
    getServiceData() {
      getOrderServiceItem(this.service_no)
        .then(res => {
          let service = res.data || {}
          service.get_order_goods = service.get_order_goods ? [service.get_order_goods] : []

          this.serviceData = service
        })
    },
    // 添加售后留言
    handleMessage() {
      this.$refs.msgForm.validate(valid => {
        if (valid) {
          this.msgLoading = true
          addOrderServiceMessage(this.service_no, this.msgForm.message)
            .then(() => {
              this.getServiceData()
            })
            .then(() => {
              this.$nextTick(() => {
                this.msgForm = {}
                this.$el.querySelector('#msg-form').scrollIntoView()
              })
            })
            .finally(() => {
              this.msgLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;

    .card-title {
      margin-top: 0;
    }
  }

  .service-left {
    margin-bottom: 20px;
    border-right: 1px solid $color-border-1;

    .level-icon {
      margin-left: 5px;
      line-height: 0;
      vertical-align: text-bottom;
    }
  }

  .service-log {
    span {
      color: $color-info;
    }

    .comment {
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }

  .goods-image {
    float: left;
    width: 60px;
    height: 60px;

    &:hover {
      cursor: pointer;
    }
  }

  .goods-info {
    float: left;
    width: 80%;
    margin-left: 10px;

    .name {
      height: 36px;
      line-height: 18px;
      overflow: hidden;

      &:hover {
        cursor: pointer;
        color: $color-primary;
        text-decoration: underline;
      }
    }

    .specs {
      margin: 0;
      font-size: 12px;
      color: $color-info;
    }

    .delivery {
      font-size: 13px;
    }
  }

  .el-collapse /deep/ .el-collapse-item__header {
    font-size: 16px;
  }
</style>
