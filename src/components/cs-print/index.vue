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
  mounted() {
    this.printd = new Printd()
    this.iframe = this.printd.getIFrame()
  },
  beforeDestroy() {
    this.iframe && document.body.removeChild(this.iframe)
  },
  methods: {
    toPrint() {
      let styleList = ['.no-print {display: none;}']
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

      const { contentWindow } = this.iframe
      this.printd.print(this.$el, this.cssText.concat(styleList))

      contentWindow.addEventListener('afterprint', () => {
        contentWindow.document.open()
        contentWindow.document.write('<html lang="zh"><head><title>careyshop</title></head><body/></html>')
        contentWindow.document.close()
      })
    }
  }
}
</script>
