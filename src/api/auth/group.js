import request from '@/plugin/axios/request'

const url = '/v1/auth_group'

/**
 * 添加一个用户组
 * @param {Object} data
 * @returns
 */
export function addAuthGroupItem(data) {
  return request({
    url:"/system/aleAuthGroup/add",
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 * 编辑一个用户组
 * @param {Object} data
 * @returns
 */
export function setAuthGroupItem(data) {
  return request({
    url:"/system/aleAuthGroup/update",
    method: 'put',
    data: {
      ...data
    }
  })
}

/**
 * 获取一个用户组
 * @param {Number} group_id
 * @returns
 */
export function getAuthGroupItem(group_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.auth.group.item',
      group_id
    }
  })
}

/**
 * 删除一个用户组
 * @param {Number} group_id
 * @returns
 */
export function delAuthGroupItem(group_id) {
  return request({
    url:`/system/aleAuthGroup/remove/${group_id}`,
    method: 'delete',
  })
}

/**
 * 获取用户组列表
 * @param {Object} data
 * @returns
 */
export function getAuthGroupList(data) {
  return request({
    url:"/system/aleAuthGroup/list",
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 * 批量设置用户组状态
 * @param {Array} group_id
 * @param {Number} status
 * @returns
 */
export function setAuthGroupStatus(ids, status) {
  return request({
    url:"/system/aleAuthGroup/updateStatus",
    method: 'put',
    data: {
      ids,
      status
    }
  })
}

/**
 * 设置用户组排序值
 * @param {Number} group_id
 * @param {Number} sort
 * @returns
 */
export function setAuthGroupSort(id, sort) {
  return request({
    url:"/system/aleAuthGroup/update",
    method: 'put',
    data: {
      id,
      sort
    }
  })
}
