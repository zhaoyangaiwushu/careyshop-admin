const config = {}

/**
 * 获取API配置参数
 * @returns {any}
 */
config.get = () => {
  let configFile = ''
  const files = require.context('@static/config/' + process.env.NODE_ENV, false, /\.json$/)

  files.keys().forEach(key => {
    configFile = key.replace(/(\.\/)/g, '')
  })

  return require('@static/config/' + process.env.NODE_ENV + '/' + configFile)
}

export default config
