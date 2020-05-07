import request from '@/plugin/axios/request'

/**
 * 清空所有缓存
 * @returns
 */
export function clearCacheAll() {
  return request({
    url: '/v1/index',
    method: 'post',
    params: {
      method: 'clear.cache.all'
    }
  })
}

/**
 * 调整最优状态(服务端为正式环境有效)
 * @returns
 */
export function setSystemOptimize() {
  return request({
    url: '/v1/index',
    method: 'post',
    params: {
      method: 'set.system.optimize'
    }
  })
}

/**
 * 获取内核版本号
 * @returns
 */
export function getKernelVersion() {
  return request({
    url: '/v1/index',
    method: 'post',
    params: {
      method: 'get.system.version'
    }
  })
}

/**
 * 批量调用
 * @param {Array} data
 * @returns
 */
export function batchRequests(data) {
  return request({
    url: '/batch',
    method: 'post',
    params: {
      method: null
    },
    data: {
      batch: data
    }
  })
}
