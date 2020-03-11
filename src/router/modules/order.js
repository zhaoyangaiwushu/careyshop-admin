import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/order',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '订单首页' },
      component: () => import('@/views/order/index')
    },
    {
      path: 'admin/list',
      name: `${pre}admin-list`,
      meta: { ...meta, cache: true, title: '订单列表' },
      component: () => import('@/views/order/admin')
    },
    {
      path: 'admin/refund',
      name: `${pre}admin-refund`,
      meta: { ...meta, cache: true, title: '退款日志' },
      component: () => import('@/views/order/refund')
    }
  ])('order-')
}
