const config = {}

/**
 * 获取API配置参数
 * @returns {any}
 */
config.get = () => {
  let configFile = ''
  const files = require.context('@static/config', false, /\.json$/)

  files.keys().forEach(key => {
    configFile = key.replace(/(\.\/)/g, '')
  })

  return require('@static/config/' + configFile)
}

export default config
