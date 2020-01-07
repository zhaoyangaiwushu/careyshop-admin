<template>
  <div class="magnify">
    <!-- 左侧容器 -->
    <div class="left_contaner">
      <div>中图占位</div>

      <!-- 小图 -->
      <div class="carousel">
        <i class="el-icon-arrow-left arrow"/>

        <div class="show_box">
          <ul class="picture_container">
            <li
              v-for="(item, index) in imageList"
              :key="index"
              class="picture_item">
              <img :src="item | getPreviewUrl('goods_image_x80')" class="small_img" alt="">
            </li>
          </ul>
        </div>

        <i class="el-icon-arrow-right arrow"/>
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
    }
  },
  data() {
    return {
      imageList: []
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
        console.log(val)
        this.imageList = [...val]
      },
      immediate: true
    }
  },
  methods: {
    // 插入图集到列表中(临时)
    unshiftImage(imageList) {
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
      }
      .arrow {
        font-size: 25px;
        font-weight: 700;
        flex-basis: 25px;
        cursor: pointer;
        color: $color-border-1;
      }
      .picture_container {
        width: 200%;
        height: 100%;
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        .picture_item {
          height: 100%;
          float: left;
          padding: 5px;
          box-sizing: border-box;
          &:hover {
            border: 2px solid $color-danger;
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
