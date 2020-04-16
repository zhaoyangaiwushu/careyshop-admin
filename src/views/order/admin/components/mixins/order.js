import util from '@/utils/util'

export default {
  data() {
    return {
      serviceMap: {
        '1': '售后中',
        '2': '已售后'
      },
      statusMap: {
        0: '待发货',
        1: '已发货',
        2: '已收货',
        3: '已取消'
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
    }
  }
}
