<template>
  <cs-container :is-back-to-top="true" parent-path="goods-admin-list">
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never"
        v-loading="loading">
        <div slot="header" class="clearfix">
          <el-row>
            <el-col :span="9">
              商品图片预留
            </el-col>

            <el-col :span="15">
              商品信息预留
            </el-col>
          </el-row>
        </div>

        <el-tabs v-model="activeName">
          <el-tab-pane label="详情描述" name="content">
            <div v-if="attrImportant.length" class="parameter cs-mb-15">
              <ul class="parameter-list">
                <li v-for="(value, key) in attrImportant" :key="key" :title="value.attr_value">
                  <span>{{`${value.attr_name}：${value.attr_value}`}}</span>
                </li>
              </ul>
              <p class="more-par cs-pr">
                <el-button type="text" size="mini" @click="activeName='attr'">详细参数 >></el-button>
              </p>
            </div>
            <div class="mce-content-body" v-html="goodsData.content"></div>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="attr">
            <el-table
              :data="attrConfig"
              row-key="goods_attribute_id"
              :tree-props="{children: 'get_attribute'}"
              :show-header="false"
              default-expand-all>
              <el-table-column
                prop="attr_name"
                width="160"
                show-overflow-tooltip>
                <template slot-scope="props">
                  <span :class="{'attr-label': !props.row.is_parent}">{{props.row.attr_name}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                width="35">
                <template slot-scope="props">
                  <el-tooltip
                    v-if="props.row.description"
                    :content="props.row.description"
                    placement="top">
                    <i class="el-icon-warning-outline"/>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column prop="attr_value"/>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
import { getGoodsAttributeData } from '@/api/goods/attribute'
import { getGoodsAttrList, getGoodsItem, getGoodsSpecMenu } from '@/api/goods/goods'

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
      this.goodsData = {}
      this.attrConfig = []
      this.attrImportant = []
      this.specCombo = []
      this.specConfig = []
    },
    getGoodsOtherInfo() {
      /**
       * get.goods.attr.config 是后台商品属性设置后读取参数所使用
       * 而实际的前台是面对顾客的,所以应当使用以下方法进行显示
       */
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
                is_parent: true,
                get_attribute: []
              })

              key[value.parent_id] = pos - 1
            }

            const attrData = res[2].data[value.goods_attribute_id]
            if (attrData['is_important'] === 1) {
              this.attrImportant.push({
                goods_attribute_id: attrData['goods_attribute_id'],
                attr_name: attrData['attr_name'],
                attr_value: value.attr_value
              })
            }

            this.attrConfig[key[value.parent_id]].get_attribute.push({
              goods_attribute_id: attrData['goods_attribute_id'],
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
  .clearfix {
    text-align: center;
  }
  .clearfix span, a {
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
    clear: both;
  }
  .attr-label {
    color: $color-text-sub;
  }
  .parameter {
    padding: 0 10px 10px;
    border-bottom: 1px solid $color-border-3;
    font-size: 13px;
    color: $color-text-normal;
    .more-par {
      margin-top: -5px;
      text-align: right;
    }
    .parameter-list {
      padding: 15px 0 15px;
    }
    ul {
      padding: 20px 0 15px;
      overflow: hidden;
      _zoom: 1;
    }
    ul li {
      width: 20%;
      padding-left: 42px;
      float: left;
      margin-bottom: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    ul, li, p {
      margin: 0;
      padding: 0;
    }
  }
</style>
