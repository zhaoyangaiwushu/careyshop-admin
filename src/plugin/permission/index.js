import store from '@/store'

export default {
  install(Vue, options) {
    Vue.prototype.$permission = (value, type = 'menu') => {
      let path = ''
      const auth = store.state.careyshop.menu.authKey

      switch (type) {
        case 'menu':
          path = value
          break

        case 'router':
          path = value.name.replace(/-/g, '/')
          path.slice(0, 1) !== '/' && (path = '/' + path)
          break
      }

      return !!(path && auth.hasOwnProperty(path))
    }
  }
}
