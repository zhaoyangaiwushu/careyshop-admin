<template>
  <div v-if="!isIE" class="cs-preview">
    <el-image-viewer v-if="viewer" :initial-index="imageIndex" :url-list="imageList" :on-close="close"/>
  </div>

  <el-dialog
    v-else
    class="cs-preview image"
    :visible.sync="viewer"
    :append-to-body="true"
    :show-close="false"
    @close="close">
      <el-image v-if="viewer" :src="imageUrl" fit="fill" @click.native="$open(imageUrl)"/>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import util from '@/utils/util'

function isIE() {
  return !Vue.prototype.$isServer && !isNaN(Number(document.documentMode))
}

export default {
  name: 'preview',
  components: {
    'ElImageViewer': () => {
      return !isIE() ? import('element-ui/packages/image/src/image-viewer') : null
    }
  },
  mounted() {
    if (!this.isIE) {
      document.body.appendChild(this.$el)
    }
  },
  destroyed() {
    if (!this.isIE && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  data() {
    return {
      isIE: isIE(),
      viewer: false,
      imageIndex: 0,
      imageList: [],
      imageUrl: ''
    }
  },
  methods: {
    getImageList(image) {
      let result = []
      if (Array.isArray(image)) {
        // eslint-disable-next-line no-unused-vars
        for (let item of image) {
          result.push(util.checkUrl(item))
        }
      } else {
        result.push(util.checkUrl(image))
      }

      return result
    },
    visible(image, index) {
      this.$nextTick(() => {
        const temp = this.getImageList(image)
        this.isIE ? this.imageUrl = temp[0] : this.imageList = temp

        this.imageIndex = index
        this.viewer = true
      })
    },
    close() {
      this.$nextTick(() => {
        this.viewer = false
        this.imageList = []
        this.imageUrl = ''
      })
    }
  }
}
</script>

<style scoped>
  .cs-preview >>> .el-image-viewer__close {
    color: #FFF;
  }

  .image {
    text-align: center;
    line-height: 0;
  }

  .image >>> img {
    vertical-align: middle;
    cursor: pointer;
  }

  .image >>> .el-dialog__header {
    display: none;
  }

  .image >>> .el-dialog__body {
    padding: 10px;
    background-color: #F5F7FA;
  }
</style>
