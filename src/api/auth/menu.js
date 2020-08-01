import request from '@/plugin/axios/request'

const url = '/v1/menu'

/**
 * 获取菜单所属模块
 * @returns {Promise<any>}
 */
export function getMenuModule() {
  return new Promise(resolve => {
    resolve({
      admin: '后台',
      home: '前台',
      api: 'API'
    })
  })
}

/**
 * 根据权限获取菜单列表
 * @param {Object} data
 * @returns
 */
export function getMenuAuthList(data) {
  return request({
    url:"/auth/api/v1/menu",
    method: 'post',
    data: {
      module: 'admin',
      ...data
    }
  })
}

/**
 * 获取一个菜单
 * @param {Number} menu_id
 * @returns
 */
export function getMenuItem(menu_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.menu.item',
      menu_id
    }
  })
}

/**
 * 添加一个菜单
 * @param {Object} data
 * @returns
 */
export function addMenuItem(data) {
  return request({
    url:"/system/aleMenu/insert",
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 * 编辑一个菜单
 * @param {Object} data
 * @returns
 */
export function setMenuItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.menu.item',
      ...data
    }
  })
}

/**
 * 删除一个菜单，如果当前菜单存在子级，那么所有的子级也将被删除
 * @param {Number} menu_id
 * @returns
 */
export function delMenuItem(menu_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.menu.item',
      menu_id
    }
  })
}

/**
 * 获取菜单列表
 * @param {Object} data
 * @returns
 */
export function getMenuList(data) {
  return request({
    url:"/system/aleMenu/list",
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 * 根据菜单Id生成导航「面包屑」数据
 * @param {Number} menu_id
 * @param {Number} is_layer
 * @returns
 */
export function getMenuIdNavi(menu_id, is_layer = 1) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.menu.id.navi',
      menu_id,
      is_layer
    }
  })
}

/**
 * 根据菜单Url生成导航「面包屑」数据
 * @param {String} url
 * @param {Number} is_layer
 * @returns
 */
export function getMenuUrlNavi(url, is_layer = 1) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.menu.url.navi',
      url,
      is_layer
    }
  })
}

/**
 * 批量设置是否属于导航菜单
 * @param {Array} menu_id
 * @param {Number} is_navi
 * @returns
 */
export function setMenuNavi(menu_id, is_navi) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.menu.navi',
      menu_id,
      is_navi
    }
  })
}

/**
 * 设置菜单排序
 * @param {Number} menu_id
 * @param {Number} sort
 * @returns
 */
export function setMenuSort(menu_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.menu.sort',
      menu_id,
      sort
    }
  })
}

/**
 * 根据编号自动设置排序值
 * @param {Array} menu_id
 * @returns
 */
export function setMenuIndex(menu_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.menu.index',
      menu_id
    }
  })
}

/**
 * 设置菜单状态，同时会影响上级与下级菜单的状态
 * @param {Number} menu_id
 * @param {Number} status
 * @returns
 */
export function setMenuStatus(menu_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.menu.status',
      menu_id,
      status
    }
  })
}
