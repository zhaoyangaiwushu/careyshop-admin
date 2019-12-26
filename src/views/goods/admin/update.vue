<template>
  <cs-container :is-back-to-top="true" parent-path="goods-admin-list">
    <page-edit
      ref="update"
      state="update"
      :loading="loading"
      :confirm-loading.sync="confirmLoading"
      :cat-data="catData"
      :brand-data="brandData"
      :type-data="typeData"
      :buffer-data="pageData"
      @close="handleClose">
    </page-edit>

    <template ref="footer" slot="footer">
      <div style="margin: -10px 0;">
        <el-button
          type="primary"
          size="small"
          :disabled="loading"
          :loading="confirmLoading"
          @click="handleConfirm">确定</el-button>

        <el-button
          size="small"
          @click="handleClose">取消</el-button>
      </div>
    </template>
  </cs-container>
</template>

<script>
import { mapActions } from 'vuex'
import { getBrandSelect } from '@/api/goods/brand'
import { getGoodsCategoryList } from '@/api/goods/category'
import { getGoodsTypeSelect } from '@/api/goods/type'
import { getGoodsAttrConfig, getGoodsItem, getGoodsSpecConfig } from '@/api/goods/goods'
import util from '@/utils/util'

export default {
  name: 'goods-admin-update',
  components: {
    'PageEdit': () => import('./components/PageEdit')
  },
  props: {
    goods_id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: true,
      confirmLoading: false,
      catData: [],
      brandData: [],
      typeData: [],
      // 数据缓存
      buffer: {},
      // 组件内部数据
      pageData: {},
      // 判断是否路由进入
      isSourceRoute: false
    }
  },
  mounted() {
    Promise.all([
      getBrandSelect({ order_field: 'phonetic' }),
      getGoodsTypeSelect({ order_type: 'asc' }),
      getGoodsCategoryList(null)
    ])
      .then(res => {
        this.brandData = res[0].data || []
        this.typeData = res[1].data || []
        this.catData = util.formatDataToTree(res[2].data, 'goods_category_id')

        this.$nextTick(() => {
          if (!this.isSourceRoute && !Object.keys(this.buffer).length) {
            this.switchData(this.goods_id)
          }
        })
      })
  },
  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    if (to.params.goods_id) {
      next(vm => {
        vm.switchData(to.params.goods_id)
        vm.isSourceRoute = true
      })
    } else {
      next(new Error('未指定ID'))
    }
  },
  // 在同一组件对应的多个路由间切换时触发
  beforeRouteUpdate(to, from, next) {
    if (to.params.goods_id) {
      this.switchData(to.params.goods_id)
      next()
    } else {
      next(new Error('未指定ID'))
    }
  },
  methods: {
    ...mapActions('careyshop/page', [
      'close'
    ]),
    // 请求提交
    handleConfirm() {
      this.$refs.update.handleConfirm()
    },
    // 关闭当前窗口
    handleClose() {
      console.log(this.$refs.update)
      // console.log(this.buffer)
      // this.close({
      //   tagName: this.$route.fullPath
      // })
    },
    switchData(id) {
      /**
       * 1.检测缓存是否存在
       * 2.存在则直接返回
       * 3.不存在进行关联
       */

      // // 等待子组件创建完成
      // let sleep = true
      // while (sleep) {
      //   setTimeout((sleep) => {
      //     if (this.$refs.update) {
      //       sleep = false
      //     }
      //
      //     console.log('okok')
      //   }, 1000)
      // }
      //
      // if (this.buffer[id]) {
      //   // 存在缓存时切换后可直接返回
      //   this.pageData = this.buffer[id] || {}
      // } else {
      //   // 组件缓存不存在时进行绑定
      //   this.buffer[id] = this.$refs.update.$data
      // }

      // // 否则请求获取数据
      // this.$nextTick(() => {
      //   this.loading = true
      // })
      //
      // if (this.isInitial) {
      //   // 已初始化
      //   Promise.all([
      //     getGoodsItem(id),
      //     getGoodsAttrConfig(id),
      //     getGoodsSpecConfig(id, 1)
      //   ])
      //     .then(res => {
      //       tihs.pageData = {
      //       }
      //     })
      //     .finally(() => {
      //       this.$nextTick(() => {
      //         this.loading = false
      //       })
      //     })
      // }
    }
  }
}
</script>
