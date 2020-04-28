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

/**
 * 同意(接收)一个售后服务单
 * @param {String} service_no
 * @returns
 */
export function setOrderServiceAgree(service_no) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'set.order.service.agree'
    },
    data: {
      service_no
    }
  })
}

/**
 * 拒绝一个售后服务单
 * @param {String} service_no
 * @param {String} result
 * @returns
 */
export function setOrderServiceRefused(service_no, result) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'set.order.service.refused'
    },
    data: {
      service_no,
      result
    }
  })
}

/**
 * 设置退换货、维修商品是否寄还商家
 * @param {String} service_no
 * @param {Number} is_return
 * @returns
 */
export function setOrderServiceSendback(service_no, is_return) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'set.order.service.sendback'
    },
    data: {
      service_no,
      is_return
    }
  })
}

/**
 * 设置一个售后服务单状态为”售后中”
 * @param {String} service_no
 * @returns
 */
export function setOrderServiceAfter(service_no) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'set.order.service.after'
    },
    data: {
      service_no
    }
  })
}

/**
 * 撤销一个售后服务单
 * @param {String} service_no
 * @returns
 */
export function setOrderServiceCancel(service_no) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'set.order.service.cancel'
    },
    data: {
      service_no
    }
  })
}

/**
 * 完成一个售后服务单
 * @param {Object} data
 * @returns
 */
export function setOrderServiceComplete(data) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'set.order.service.complete'
    },
    data
  })
}

/**
 * 客服对售后服务单添加备注(顾客不可见)
 * @param {Object} data
 * @returns
 */
export function setOrderServiceRemark(data) {
  return request({
    url: '/v1/order_service',
    method: 'post',
    params: {
      method: 'set.order.service.remark'
    },
    data
  })
}
