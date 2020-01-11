import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/marketing',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '营销首页' },
      component: () => import('@/views/marketing/index')
    },
    {
      path: 'marketing/discount',
      name: `${pre}marketing-discount`,
      meta: { ...meta, cache: true, title: '商品折扣' },
      component: () => import('@/views/marketing/discount')
    }
  ])('marketing-')
}
