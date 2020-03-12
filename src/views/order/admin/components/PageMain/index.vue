<template>
  <div class="cs-p">
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button
          icon="el-icon-download"
          :disabled="loading"
          @click="() => {}">批量导出</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-tabs
      v-model="tabPane"
      v-loading="loading"
      :before-leave="handleBefore"
      class="tab-box">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item"
        :name="index">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    toPayment: {
      default: () => {}
    }
  },
  data() {
    return {
      tabPane: '0',
      tabList: {
        '0': '全部',
        '1': '未付款',
        '2': '已付款',
        '3': '待发货',
        '4': '已发货',
        '5': '已完成',
        '6': '已取消'
      }
    }
  },
  filters: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    // 点击切换标签
    handleBefore(activeName) {
      this.$emit('tabs', activeName)
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-box {
    padding: 5px 10px;
    background-color: #FFF;
  }
</style>
