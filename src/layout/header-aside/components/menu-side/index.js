import { mapActions, mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import BScroll from 'better-scroll'
import { elMenuItem, elSubmenu } from '../libs/util.menu'

export default {
  name: 'cs-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render(createElement) {
    return createElement('div', {
      attrs: { class: 'cs-layout-header-aside-menu-side' }
    }, [
      createElement('el-menu', {
        props: { collapse: this.asideCollapse, uniqueOpened: true, defaultActive: this.active, defaultOpeneds: this.openeds },
        ref: 'menu',
        on: { select: this.handleMenuSelect }
      }, this.menuAside.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, createElement, menu))),
      ...this.menuAside.length === 0 && !this.asideCollapse ? [
        createElement('div', {
          attrs: { class: 'cs-layout-header-aside-menu-empty', flex: 'dir:top main:center cross:center' }
        }, [
          createElement('i', {
            attrs: { class: 'el-icon-s-grid' }
          }),
          createElement('span', {
          }, '暂无侧栏菜单')
        ])
      ] : []
    ])
  },
  data() {
    return {
      active: '',
      asideHeight: 300,
      menuAside: [],
      openeds: [],
      matched: null,
      BS: null
    }
  },
  computed: {
    ...mapState('careyshop/menu', [
      'aside',
      'asideCollapse',
      'asideIndex',
      'history'
    ])
  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse() {
      this.scrollDestroy()
      setTimeout(() => {
        this.scrollInit()
      }, 500)
    },
    // 监听路由 改变侧边菜单栏
    '$route': {
      handler({ matched, fullPath }) {
        // 路由父级发生变化时菜单数据将发生改变
        const pathRoute = matched[0].path ? matched[0].path : matched[1].path
        if (matched.length > 0 && pathRoute !== this.matched) {
          const _side = this.aside.find(menu => menu.path === pathRoute)
          this.menuAside = _side && _side.children ? [..._side.children] : []
          this.matched = pathRoute
        }

        // 计算待激活菜单
        const path = fullPath.slice(0, fullPath.lastIndexOf('/'))
        const openeds = this.menuAside.find(menu => menu.path === path)
        this.openeds = openeds ? [path] : fullPath === '/index' ? ['/index'] : []

        // 调整被激活菜单
        this.active = fullPath
        this.$nextTick(() => {
          if (this.aside.length > 0 && this.$refs.menu) {
            this.$refs.menu.activeIndex = fullPath
          }
        })

        // 记录历史菜单
        if (openeds !== undefined && openeds.children) {
          let history = openeds.children.find(menu => menu.path === fullPath)
          this.historyDataSet(history).then(() => {})
        }

        // 进入"首页"时,将历史菜单压入最底部
        if (this.asideIndex === fullPath && this.history.length) {
          let history = {
            path: '/index',
            title: '历史记录',
            icon: 'lishijilu_o',
            children: [...this.history]
          }

          this.menuAside.unshift({ path: '/index', title: '首页', icon: 'shouye_o' })
          this.menuAside.push(history)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.scrollInit()
  },
  beforeDestroy() {
    this.scrollDestroy()
  },
  methods: {
    ...mapActions('careyshop/menu', [
      'historyDataSet'
    ]),
    scrollInit() {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      })
    },
    scrollDestroy() {
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    }
  }
}
