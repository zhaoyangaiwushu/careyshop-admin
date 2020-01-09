<template>
  <div class="magnify">
    <!-- 左侧容器 -->
    <div class="left-contaner">
      <div
        :class="{'middle-img': true, 'video-bg': isVideoPlay}"
        :style="{'width': `${width}px`, 'height': `${height}px`}"
        @mouseover.prevent.stop="boxMouseOver"
        @mouseleave="boxMouseLeave">
        <i
          v-if="!isVideoEmpty && !isVideoPlay"
          class="el-icon-video-play video-button play"
          @click="isVideoPlay = true"/>

        <template v-if="isVideoPlay">
          <i
            class="el-icon-circle-close video-button stop"
            @click="isVideoPlay = false"/>

          <cs-video
            class="video-box"
            aspect-ratio="1:1"
            :video-data="video"
            :autoplay="true">
          </cs-video>
        </template>

        <img
          v-show="!isVideoPlay"
          alt=""
          :src="currentImage | getPreviewUrl('goods_image_x480')"
          :style="{
            'width': 'auto',
            'height': 'auto',
            'max-width': `${width - 2}px`,
            'max-height': `${height - 2}px`
          }">

        <div
          v-show="!isVideoPlay && isShade"
          class="shade"
          :style="shadeSize"
          @mouseover.prevent.stop="() => {}"
          @mousemove.prevent.stop="shadeMouseMove"/>
      </div>

      <!-- 缩略图集 -->
      <div class="carousel" :style="{'width': `${width}px`, 'height': `${thumbHeight}px`}">
        <i class="el-icon-arrow-left arrow" @click="clickPage('left')"/>

        <div class="show-box">
          <ul class="picture-container" :style="{'left': `${middleLeft}px`, 'width': `${middleWidth}px`}">
            <li
              v-for="(item, index) in imageList"
              class="picture-item"
              :class="{'selected': currentIndex === index}"
              :key="index"
              :style="{
                'width': `${thumbWidth}px`,
                'height': `${thumbHeight}px`,
                'margin': `0 ${itemMargin / 2}px`
              }">
              <img
                alt=""
                :src="item | getPreviewUrl('goods_image_x80')"
                :style="{
                  'width': 'auto',
                  'height': 'auto',
                  'max-width': `${thumbWidth - 4}px`,
                  'max-height': `${thumbHeight - 4}px`
                }"
                @mouseover="tabPicture(index)">
            </li>
          </ul>
        </div>

        <i class="el-icon-arrow-right arrow" @click="clickPage('right')"/>
      </div>
    </div>

    <!-- 右侧大图容器 -->
    <div class="right_contanier" v-show="isBig">
      <img :src="currentImage | getPreviewUrl('goods_image_x800')" class="big-img" alt="">
    </div>
  </div>
</template>

<script>
import util from '@/utils/util'
import { debounce, isEmpty } from 'lodash'

export default {
  components: {
    'csVideo': () => import('@/components/cs-video')
  },
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
      currentIndex: undefined,
      isVideoPlay: false,
      isShade: false,
      isBig: false,
      shade: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      }
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
    },
    middleWidth() {
      return (this.thumbWidth + this.itemMargin) * this.imageList.length
    },
    isVideoEmpty() {
      return isEmpty(this.video)
    },
    shadeSize() {
      return {
        width: `${this.shade.width}px`,
        height: `${this.shade.height}px`,
        left: `${this.shade.left}px`,
        top: `${this.shade.top}px`
      }
    }
  },
  mounted() {
    this.shade.width = this.width / this.zoom
    this.shade.height = this.height / this.zoom
  },
  methods: {
    // 重置数据
    resetData() {
      this.middleLeft = 0
      this.isShade = false
      this.isBig = false
      this.isVideoPlay = false
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
    },
    // 鼠标移入产品图片事件,显示阴影,显示大图
    boxMouseOver(e) {
      this.isShade = true
      this.isBig = true

      // 计算阴影的位置
      let x = e.offsetX - this.shade.width / 2
      let y = e.offsetY - this.shade.height / 2

      let maxLeft = this.width - this.shade.width
      let maxTop = this.height - this.shade.height

      // 边界修正
      x = x <= 0 ? 0 : x
      x = x >= maxLeft ? maxLeft : x
      y = y <= 0 ? 0 : y
      y = y >= maxTop ? maxTop : y

      this.shade.left = x
      this.shade.top = y
    },
    // 鼠标移出隐藏阴影和大图
    boxMouseLeave() {
      this.isShade = false
      this.isBig = false
    },
    // 鼠标在阴影移动
    shadeMouseMove(e) {
      // 待续
    }
  }
}
</script>

<style lang="scss" scoped>
  .magnify {
    position: relative;
  }
  .left-contaner {
    width: 100%;
    height: 100%;
    .carousel {
      margin-top: 20px;
      display: inline-flex;
      .show-box {
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
      .picture-container {
        position: absolute;
        overflow: hidden;
        top: 0;
        .picture-item {
          @extend %flex-center-row;
          float: left;
          box-sizing: border-box;
          list-style: none;
          border: 2px solid #FFFFFF;
          &.selected {
            border-color: $color-danger;
          }
        }
      }
    }
    .middle-img {
      @extend %flex-center-row;
      border: 1px solid $color-border-4;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      &.video-bg {
        border-color: #FFFFFF;
      }
      .video-box {
        width: 100%;
        text-align: center;
      }
      .video-button {
        @extend %unable-select;
        font-size: 38px;
        color: $color-text-sub;
        position: absolute;
        z-index: 1;
        &.play {
          bottom: 10px;
          left: 10px;
        }
        &.stop {
          top: 10px;
          right: 10px;
        }
      }
    }
    .right_contanier {
      position: absolute;
      overflow: hidden;
      border: 1px solid $color-border-4;
      top: 0;
      .big-img {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .shade {
      cursor: move;
      background-color: rgba($color-primary, .3);
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>
