import request from '@/utils/request'

/**
 * 通用的接口获取
 * @param {Object} data
 * @param {String} method
 * @returns {AxiosPromise}
 */
function getRequest(data, method) {
  return request({
    url: '/v1/setting',
    method: 'post',
    params: {
      method: method
    },
    data
  })
}

/**
 * 获取某个模块的设置
 * @param {String} module
 * @param {String} code
 */
export function getSettingList(module, code = '') {
  return request({
    url: '/v1/setting',
    method: 'post',
    params: {
      method: 'get.setting.list'
    },
    data: {
      module,
      code
    }
  })
}

/**
 * 获取某个模块的设置
 * @param {Object} data
 */
export function setDeliveryDistList(data) {
  return getRequest(data, 'set.delivery.dist.list')
}

/**
 * 设置支付完成提示页
 * @param {Object} data
 */
export function setPaymentList(data) {
  return getRequest(data, 'set.payment.list')
}

/**
 * 设置配送优惠
 * @param {Object} data
 */
export function setDeliveryList(data) {
  return getRequest(data, 'set.delivery.list')
}

/**
 * 设置购物系统
 * @param {Object} data
 */
export function setShoppingList(data) {
  return getRequest(data, 'set.shopping.list')
}

/**
 * 设置售后服务
 * @param {Object} data
 */
export function setServiceList(data) {
  return getRequest(data, 'set.service.list')
}

/**
 * 设置系统配置
 * @param {Object} data
 */
export function setSystemList(data) {
  return getRequest(data, 'set.system.list')
}

/**
 * 设置上传配置
 * @param {Object} data
 */
export function setUploadList(data) {
  return getRequest(data, 'set.upload.list')
}
