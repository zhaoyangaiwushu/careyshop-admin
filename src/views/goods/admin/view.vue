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
            <el-collapse v-model="attrActive">
              <form class="el-form el-form--label-right">
                <el-collapse-item
                  v-for="(value, index) in attrConfig"
                  :key="index"
                  :name="value.goods_attribute_id"
                  :title="value.attr_name">
                  <div
                    v-for="item in value.get_attribute"
                    :key="item.goods_attribute_id"
                    class="el-form-item attr-form">
                    <label class="el-form-item__label attr-label">
                      <span :title="item.attr_name">{{item.attr_name}}</span>
                    </label>

                    <div class="el-form-item__content attr-content">
                      <div class="attr-description">
                        <el-tooltip
                          v-if="item.description"
                          :content="item.description"
                          placement="top">
                          <i class="el-icon-warning-outline"/>
                        </el-tooltip>
                      </div>
                      <span>{{item.attr_value}}</span>
                    </div>
                  </div>
                </el-collapse-item>
              </form>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
import { getGoodsAttrList, getGoodsItem, getGoodsSpecMenu } from '@/api/goods/goods'
import { getGoodsAttributeData } from '@/api/goods/attribute'

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
      goodsData: {},
      attrActive: [],
      attrConfig: [],
      attrImportant: [],
      specCombo: [],
      specConfig: []
    }
  },
  methods: {
    resetGoodsData() {
      this.activeName = 'content'
      this.goodsData = {}
      this.attrActive = []
      this.attrConfig = []
      this.attrImportant = []
      this.specCombo = []
      this.specConfig = []
    },
    getGoodsOtherInfo() {
      Promise.all([
        getGoodsSpecMenu(this.goods_id),
        getGoodsAttrList(this.goods_id),
        getGoodsAttributeData(this.goodsData.goods_type_id, 1)
      ])
        .then(res => {
          this.specCombo = res[0].data['spec_combo'] || []
          this.specConfig = res[0].data['spec_config'] || []

          let key = {}
          for (let value of res[1].data) {
            if (!value.attr_value) {
              continue
            }

            if (key[value.parent_id] === undefined) {
              const parentData = res[2].data[value.parent_id]
              if (!parentData) {
                continue
              }

              let pos = this.attrConfig.push({
                goods_attribute_id: parentData['goods_attribute_id'],
                attr_name: parentData['attr_name'],
                get_attribute: []
              })

              key[value.parent_id] = pos - 1
              this.attrActive.push(value.parent_id)
            }

            const attrData = res[2].data[value.goods_attribute_id]
            if (value.is_important) {
              this.attrImportant.push({
                attr_name: attrData['attr_name'],
                attr_value: value.attr_value
              })
            }

            this.attrConfig[key[value.parent_id]].get_attribute.push({
              description: attrData['description'],
              attr_name: attrData['attr_name'],
              attr_value: value.attr_value
            })
          }
        })
    },
    getGoodsData() {
      this.loading = true
      this.resetGoodsData()

      getGoodsItem(this.goods_id)
        .then(res => {
          this.goodsData = res.data || {}
          this.getGoodsOtherInfo()
        })
        .finally(() => {
          this.loading = false
        })
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
  .attr-form {
    padding-left: 15px;
    margin-bottom: 0;
  }
  .attr-label {
    width: 140px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: $color-info;
  }
  .attr-description {
    display: inline-block;
    width: 24px;
  }
  .attr-content {
    margin-left: 140px;
  }
</style>
