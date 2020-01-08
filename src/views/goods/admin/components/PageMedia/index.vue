<template>
  <div class="magnify">
    <!-- 左侧容器 -->
    <div class="left_contaner">
      <div>中图占位</div>

      <!-- 小图 -->
      <div class="carousel" :style="{height: thumbHeight + 'px'}">
        <i class="el-icon-arrow-left arrow" @click="clickPage('left')"/>

        <div class="show_box">
          <ul class="picture_container" :style="{left: middleLeft + 'px'}">
            <li
              class="picture_item"
              v-for="(item, index) in imageList"
              :key="index"
              :style="{
                width: thumbWidth + 'px',
                height: thumbHeight + 'px',
                margin: `0 ${itemMargin / 2}px`
              }">
              <img class="small_img" :src="item | getPreviewUrl('goods_image_x80')" alt="">
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
      middleLeft: 0
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
      },
      immediate: true
    }
  },
  computed: {
    itemMargin() {
      return (this.width - (this.thumbWidth * this.pageSize) - 50) / this.pageSize
    }
  },
  methods: {
    // 插入图集到列表中
    updateImage(imageList = []) {
      this.imageList = imageList.length ? imageList.concat(this.image) : [...this.image]
    },
    // 左右缩略图翻页
    clickPage(points) {
      const step = (this.thumbWidth + this.itemMargin) * this.pageSize

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
      width: 100%;
      margin-top: 20px;
      display: -webkit-flex;
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
        font-size: 25px;
        font-weight: 700;
        flex-basis: 25px;
        cursor: pointer;
        color: $color-border-1;
      }
      .picture_container {
        height: 100%;
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        .picture_item {
          float: left;
          box-sizing: border-box;
          list-style: none;
          border: 2px solid #ffffff;
          &:hover {
            border-color: $color-danger;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
