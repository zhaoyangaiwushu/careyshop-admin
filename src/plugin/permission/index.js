import store from '@/store'

export default {
  install(Vue, options) {
    Vue.prototype.$permission = (path) => {
      const auth = store.state.careyshop.menu.authKey
      return !(!path || !auth.hasOwnProperty(path))
    }
  }
}
