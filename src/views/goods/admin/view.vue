<template>
  <cs-container :is-back-to-top="true" parent-path="goods-admin-list">
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never"
        v-loading="loading">
        <div slot="header" class="clearfix">
          {{goods_id}}
        </div>

        <el-tabs v-model="activeName">
          <el-tab-pane label="详情描述" name="content">
            <div class="mce-content-body" v-html="goodsData.content"></div>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="attr">
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
export default {
  props: {
    goods_id: {
      type: [String, Number],
      required: true
    }
  },
  watch: {
    goods_id: {
      handler() {
        this.getGoodsData()
      },
      immediate: true
    }
  },
  data() {
    return {
      loading: true,
      activeName: 'content',
      goodsData: {}
    }
  },
  methods: {
    resetGoodsData() {
      this.activeName = 'content'
      this.goodsData = {}
    },
    getGoodsData() {
      this.loading = true
      this.resetGoodsData()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/style/fixed/tinymce.scss';

  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;
  }
  .clearfix{
    text-align: center;
  }
  .clearfix span, a{
    color: $color-text-sub;
    font-size: 13px;
    margin-right: 15px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
