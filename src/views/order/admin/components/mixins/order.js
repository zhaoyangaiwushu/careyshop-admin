import util from '@/utils/util'
import { changePriceOrderItem, remarkOrderItem } from '@/api/order/order'

export default {
  components: {
    'csDeliveryDist': () => import('@/components/cs-delivery-dist')
  },
  data() {
    return {
      currentTableData: [],
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
          this.currentTableData[index].total_amount += this.formAmount.request.total_amount
          this.formAmount.visible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.formAmount.loading = false
        })
    }
  }
}
