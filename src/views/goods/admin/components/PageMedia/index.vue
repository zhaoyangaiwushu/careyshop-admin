<template>
  <div class="magnify">
    <!-- 左侧容器 -->
    <div class="left_contaner">
      <div class="middle_img">
        <el-image
          :src="currentImage | getPreviewUrl('goods_image_x480')"
          :style="{width: width + 'px', height: height + 'px'}"
          fit="contain">
          <div slot="placeholder" class="image-slot">
          </div>
          <div slot="error" class="image-slot">
          </div>
        </el-image>
      </div>

      <!-- 小图 -->
      <div class="carousel" :style="{width: width + 'px', height: thumbHeight + 'px'}">
        <i class="el-icon-arrow-left arrow" @click="clickPage('left')"/>

        <div class="show_box">
          <ul class="picture_container" :style="{left: middleLeft + 'px'}">
            <li
              v-for="(item, index) in imageList"
              class="picture_item"
              :class="{selected: currentIndex === index}"
              :key="index"
              :style="{
                width: thumbWidth + 'px',
                height: thumbHeight + 'px',
                margin: `0 ${itemMargin / 2}px`
              }">
              <el-image
                :src="item | getPreviewUrl('goods_image_x80')"
                @mouseover="tabPicture(index)"
                fit="contain">
              </el-image>
            </li>
          </ul>
        </div>

        <i class="el-icon-arrow-right arrow" @click="clickPage('right')"/>
      </div>
    </div>

    <!-- 右侧大图容器 -->
    <div class="right_contanier">
    </div>
  </div>
</template>

<script>
import util from '@/utils/util'
import { debounce } from 'lodash'

export default {
  props: {
    image: {
      type: Array,
      required: false,
      default: () => []
    },
    video: {
      type: [Object, Array],
      required: false,
      default: () => {}
    },
    width: {
      type: Number,
      default: 460
    },
    height: {
      type: Number,
      default: 460
    },
    thumbWidth: {
      type: Number,
      default: 60
    },
    thumbHeight: {
      type: Number,
      default: 60
    },
    zoom: {
      type: Number,
      default: 2
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      imageList: [],
      middleLeft: 0,
      currentImage: {},
      currentIndex: undefined
    }
  },
  filters: {
    getPreviewUrl(val, code) {
      if (val) {
        if (val.source || val) {
          return util.getImageCodeUrl(val.source || val, code)
        }
      }

      return ''
    }
  },
  watch: {
    image: {
      handler(val) {
        this.imageList = [...val]
        this.resetData()
      },
      immediate: true
    }
  },
  computed: {
    itemMargin() {
      return (this.width - (this.thumbWidth * this.pageSize) - 51) / this.pageSize
    }
  },
  methods: {
    // 重置数据
    resetData() {
      this.middleLeft = 0
      this.currentIndex = undefined
      this.currentImage = this.imageList[0]
    },
    // 插入图集到列表中
    updateImage(imageList = []) {
      this.imageList = imageList.length ? imageList.concat(this.image) : [...this.image]
      this.resetData()
    },
    // 切换图片
    tabPicture: debounce(function(index) {
      if (this.imageList.hasOwnProperty(index)) {
        this.currentIndex = index
        this.currentImage = this.imageList[index]
      }
    }, 100),
    // 左右缩略图翻页
    clickPage(points) {
      const step = this.width - 51

      if (points === 'right') {
        let maxMove = -(this.thumbWidth + this.itemMargin) * this.imageList.length
        if (-step + this.middleLeft > maxMove) {
          this.middleLeft -= step
        }
      }

      if (points === 'left' && this.middleLeft < 0) {
        this.middleLeft += step
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .magnify {
    position: relative;
  }
  .left_contaner {
    width: 100%;
    height: 100%;
    .carousel {
      margin-top: 20px;
      display: inline-flex;
      .show_box {
        flex: 1;
        overflow: hidden;
        position: relative;
        ul {
          margin: 0;
          padding: 0;
        }
      }
      .arrow {
        @extend %flex-center-row;
        @extend %unable-select;
        font-size: 25px;
        font-weight: 700;
        flex-basis: 25px;
        color: $color-border-1;
      }
      .picture_container {
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        .picture_item {
          float: left;
          box-sizing: border-box;
          list-style: none;
          border: 2px solid #ffffff;
        }
        .selected {
          border-color: $color-danger;
        }
      }
    }
    .middle_img {
      @extend %flex-center-col;
      border: 1px solid $color-border-1;
      box-sizing: border-box;
      position: relative;
      line-height: 0;
    }
  }
</style>
