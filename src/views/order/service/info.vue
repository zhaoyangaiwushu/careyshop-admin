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
      </el-card>
    </div>
  </cs-container>
</template>

<script>
export default {
  name: 'order-service-info'
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
</style>
