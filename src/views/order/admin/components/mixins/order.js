import util from '@/utils/util'
import { changePriceOrderItem, remarkOrderItem, setOrderItem } from '@/api/order/order'

export default {
  components: {
    'csRegionSelect': () => import('@/components/cs-region-select'),
    'csDeliveryDist': () => import('@/components/cs-delivery-dist')
  },
  data() {
    return {
      currentTableData: [],
      rules: {
        order: {
          consignee: [
            {
              required: true,
              message: '收货人姓名不能为空',
              trigger: 'blur'
            },
            {
              max: 50,
              message: '长度不能大于 50 个字符',
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '收货人手机号码不能为空',
              trigger: 'blur'
            },
            {
              min: 7,
              max: 15,
              message: '长度在 7 到 15 个字符',
              trigger: 'blur'
            }
          ],
          tel: [
            {
              max: 20,
              message: '长度不能大于 20 个字符',
              trigger: 'blur'
            }
          ],
          zipcode: [
            {
              max: 20,
              message: '长度不能大于 20 个字符',
              trigger: 'blur'
            }
          ],
          region: [
            {
              required: true,
              message: '收货区域不能为空',
              trigger: 'change'
            }
          ],
          address: [
            {
              required: true,
              message: '收货详细地址不能为空',
              trigger: 'blur'
            },
            {
              max: 255,
              message: '长度不能大于 255 个字符',
              trigger: 'blur'
            }
          ],
          invoice_title: [
            {
              max: 255,
              message: '长度不能大于 255 个字符',
              trigger: 'blur'
            }
          ],
          tax_number: [
            {
              max: 20,
              message: '长度不能大于 20 个字符',
              trigger: 'blur'
            }
          ]
        },
        delivery: {
          delivery_id: [
            {
              required: true,
              message: '至少选择一项',
              trigger: 'change'
            }
          ],
          delivery_item_id: [
            {
              required: true,
              message: '至少选择一项',
              trigger: 'change'
            }
          ],
          logistic_code: [
            {
              required: true,
              message: '快递单号不能为空',
              trigger: 'blur'
            },
            {
              max: 50,
              message: '长度不能大于 50 个字符',
              trigger: 'blur'
            }
          ]
        }
      },
      serviceMap: {
        '1': '售后中',
        '2': '已售后'
      },
      statusMap: {
        0: '待发货',
        1: '已发货',
        2: '已收货',
        3: '已取消'
      },
      formRemark: {
        index: undefined,
        loading: false,
        visible: false,
        request: {}
      },
      formAmount: {
        index: undefined,
        loading: false,
        visible: false,
        actual: 0,
        request: {}
      },
      formOrder: {
        index: undefined,
        loading: false,
        visible: false,
        request: {}
      }
    }
  },
  filters: {
    getPreviewUrl(val) {
      return val ? util.getImageCodeUrl(val, 'goods_image_x80') : ''
    },
    getNumber(val) {
      return util.getNumber(val)
    },
    getDelivery(val) {
      return val ? val['alias'] : ''
    }
  },
  methods: {
    // 获取付款方式
    _getPaymentType(code) {
      if (this.toPayment.hasOwnProperty(code)) {
        return this.toPayment[code]['name']
      }

      return ''
    },
    // 商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 设置卖家备注
    setSellersRemark(index) {
      const data = this.currentTableData[index]
      this.formRemark = {
        index,
        loading: false,
        visible: true,
        request: {
          order_no: data.order_no,
          sellers_remark: data.sellers_remark
        }
      }
    },
    // 请求卖家备注
    handleSellersRemark() {
      this.formRemark.loading = true
      const index = this.formRemark.index

      remarkOrderItem(this.formRemark.request)
        .then(res => {
          this.currentTableData[index].sellers_remark = res.data.sellers_remark
          this.formRemark.visible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.formRemark.loading = false
        })
    },
    // 查询配送轨迹
    handleDeliveryDist(value) {
      if (this.$refs.deliveryDist) {
        this.$refs.deliveryDist.show(value)
      }
    },
    // 修改金额
    setOrderAmount(index) {
      const data = this.currentTableData[index]
      this.formAmount = {
        index,
        loading: false,
        visible: true,
        actual: data.total_amount,
        request: {
          order_no: data.order_no,
          total_amount: 0
        }
      }
    },
    // 请求修改金额
    handleOrderAmount() {
      this.formAmount.loading = true
      const index = this.formAmount.index

      changePriceOrderItem(this.formAmount.request)
        .then(() => {
          if (this.$options.name !== 'order-admin-info') {
            this.currentTableData[index].total_amount += this.formAmount.request.total_amount
          } else {
            this.getOrderData()
          }

          this.formAmount.visible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.formAmount.loading = false
        })
    },
    // 修改订单
    setOrderItem(index) {
      this.formOrder = {
        index,
        loading: false,
        visible: false,
        request: {
          ...this.currentTableData[index],
          region: []
        }
      }

      let region = ['province', 'city', 'district']
      region.forEach(item => {
        if (this.formOrder.request.hasOwnProperty(item)) {
          if (this.formOrder.request[item] > 0) {
            this.formOrder.request.region.push(this.formOrder.request[item])
          }
        }
      })

      this.$nextTick(() => {
        if (this.$refs.formOrder) {
          this.$refs.formOrder.clearValidate()
        }

        this.formOrder.visible = true
      })
    },
    // 请求修改订单
    handleSetOrder() {
      this.$refs.formOrder.validate(valid => {
        if (valid) {
          let region = ['province', 'city', 'district']
          region.forEach((item, index) => {
            if (this.formOrder.request.hasOwnProperty(item)) {
              if (this.formOrder.request[item] > 0) {
                this.formOrder.request[item] = this.formOrder.request.region[index]
              }
            }
          })

          this.formOrder.loading = true
          setOrderItem(this.formOrder.request)
            .then(res => {
              if (this.$options.name !== 'order-admin-info') {
                this.$set(this.currentTableData, this.formOrder.index, {
                  ...this.currentTableData[this.formOrder.index],
                  ...res.data
                })
              } else {
                this.getOrderData()
              }

              this.formOrder.visible = false
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.formOrder.loading = false
            })
        }
      })
    }
  }
}
