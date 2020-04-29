import util from '@/utils/util'
import { getDeliveryCompanySelect } from '@/api/logistics/company'

export default {
  components: {
    'csDeliveryDist': () => import('@/components/cs-delivery-dist')
  },
  data() {
    return {
      statusMap: {
        0: '全部',
        1: '待处理',
        2: '已同意',
        3: '已拒绝',
        4: '已寄件',
        5: '售后中',
        6: '已撤销',
        7: '已完成'
      },
      deliveryMap: {
        0: {
          text: '待发货',
          color: '#303133'
        },
        1: {
          text: '已发货',
          color: '#67C23A'
        },
        2: {
          text: '已收货',
          color: '#67C23A'
        },
        3: {
          text: '已取消',
          color: '#F56C6C'
        }
      },
      goodsMap: {
        0: '未选择',
        1: '未收到货',
        2: '已收到货'
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
    getUserName(val) {
      if (val) {
        return val.username === util.cookies.get('uuid') ? '我的工单' : `${val.username} 的工单`
      }
    }
  },
  methods: {
    // 我的工单配色
    _getServiceColor(val) {
      if (val && val.username === util.cookies.get('uuid')) {
        return 'color: #E6A23C;'
      }
    },
    // 询问提示
    _whetherToConfirm(message = null, type = 'warning') {
      let options = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type
      }

      let msg = message || '确定要执行该操作吗?'
      return this.$confirm(msg, '提示', options)
    },
    // 获取快递公司列表
    handleOpenDelivery() {
      if (!this.delivery.length) {
        getDeliveryCompanySelect(0)
          .then(res => {
            this.delivery = res.data || []
          })
      }
    },
    // 商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
        .then(() => {
        })
    },
    // 查看订单详情
    handleOrder(order_no) {
      this.$router.push({
        name: 'order-admin-info',
        params: { order_no }
      })
        .then(() => {
        })
    }
  }
}
