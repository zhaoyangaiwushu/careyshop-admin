import request from '@/plugin/axios/request'

/**
 * 添加一条售后服务单留言
 * @param {String} service_no
 * @param {String} message
 * @returns
 */
export function addOrderServiceMessage(service_no, message) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'add.order.service.message'
    },
    data: {
      service_no,
      message
    }
  })
}

/**
 * 获取一个售后服务单
 * @param {String} service_no
 * @returns
 */
export function getOrderServiceItem(service_no) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'get.order.service.item'
    },
    data: {
      service_no
    }
  })
}

/**
 * 获取售后服务单列表
 * @param {Object} data
 * @returns
 */
export function getOrderServiceList(data) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'get.order.service.list'
    },
    data
  })
}
