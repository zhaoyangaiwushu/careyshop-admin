<template>
  <div class="cs-print">
    <slot/>
  </div>
</template>

<script>
import Printd from 'printd'
export default {
  name: 'cs-print',
  props: {
    cssText: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    toPrint() {
      let styleList = []
      let styles = document.querySelectorAll('style,link')

      for (let i = 0; i < styles.length; i++) {
        switch (styles[i].localName) {
          case 'link':
            styles[i].rel === 'stylesheet' && styleList.push(styles[i].href)
            break
          case 'style':
            styleList.push(styles[i].outerHTML)
            break
        }
      }

      const d = new Printd()
      d.print(this.$el, this.cssText.concat(styleList))

      // todo 未完待续,清理工作未完成
      // https://www.npmjs.com/package/printd
    }
  }
}
</script>
