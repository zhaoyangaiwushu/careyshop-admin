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

      const handlePrint = new Printd()
      // const iframe = handlePrint.getIFrame()

      // console.dir(iframe)

      // iframe.contentWindow.addEventListener('afterprint', () => {
      //   // document.body.removeChild(iframe)
      //   console.log('okokok')
      // })

      handlePrint.print(this.$el, this.cssText.concat(styleList))
    }
  }
}
</script>
