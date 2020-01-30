import { getCardUseExport } from '@/api/marketing/card_use'
import { tableExport } from '@careyshop/vue-table-export'

export default {
  data() {
    return {
      columns: [
        {
          label: '编号',
          prop: 'card_use_id'
        },
        {
          label: '卡号',
          prop: 'number'
        },
        {
          label: '卡密',
          prop: 'password'
        },
        {
          label: '金额',
          prop: 'money'
        },
        {
          label: '是否激活',
          prop: 'is_active'
        },
        {
          label: '是否有效',
          prop: 'is_invalid'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '激活时间',
          prop: 'active_time'
        }
      ],
      replace: {
        is_active: {
          0: '否',
          1: '是'
        },
        is_invalid: {
          0: '无效',
          1: '有效'
        }
      }
    }
  },
  methods: {
    handleExportCard(id, name) {
      getCardUseExport(id)
        .then(res => {
          // eslint-disable-next-line new-cap
          let instance = new tableExport(this.columns, res.data, this.replace, name)
          instance.export()
        })
    }
  }
}
