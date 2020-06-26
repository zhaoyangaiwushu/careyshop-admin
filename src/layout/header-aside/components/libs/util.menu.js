import { uniqueId } from 'lodash'

/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elMenuItem(h, menu) {
  let icon
  if (menu.icon) icon = <i class={ `iconfont icon${menu.icon}` }/>
  else if (menu.iconSvg) icon = <cs-icon-svg name={ menu.iconSvg }/>
  else icon = <i class='el el-icon-document'/>
  return <el-menu-item
    key={ menu.path }
    index={ menu.path || uniqueId('cs-menu-empty-') }>
    { icon }
    <span slot='title'>{ menu.title || '未命名菜单' }</span>
  </el-menu-item>
}

/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elSubmenu(h, menu) {
  let icon
  if (menu.icon) icon = <i slot='title' class={ `iconfont icon${menu.icon}` }/>
  else if (menu.iconSvg) icon = <cs-icon-svg slot='title' name={ menu.iconSvg }/>
  else icon = <i slot='title' class='el el-icon-folder'/>
  return <el-submenu
    key={ menu.path }
    index={ menu.path || uniqueId('cs-menu-empty-') }>
    { icon }
    <span slot='title'>{ menu.title || '未命名菜单' }</span>
    { menu.children.map(child => createMenu.call(this, h, child)) }
  </el-submenu>
}

/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function createMenu(h, menu) {
  if (menu.children === undefined) return elMenuItem.call(this, h, menu)
  return elSubmenu.call(this, h, menu)
}
