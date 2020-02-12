<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item>
        <el-button
          icon="el-icon-warning-outline"
          :disabled="loading"
          @click="() => {}">优惠劵信息</el-button>
      </el-form-item>

      <el-form-item v-if="couponType !== 'delete'">
        <el-button
          icon="el-icon-delete"
          :disabled="loading"
          @click="() => {}">删除</el-button>
      </el-form-item>

      <el-form-item v-else>
        <el-button
          icon="el-icon-refresh-left"
          :disabled="loading"
          @click="() => {}">恢复</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>
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
    couponData: {
      default: null
    },
    couponType: {
      default: ''
    }
  }
}
</script>

<style scoped>
</style>
