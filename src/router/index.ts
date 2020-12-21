import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '', // 默认子路由
        redirect: '/course',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue'),
        meta: {
          title: ['首页']
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: {
          title: ['角色管理']
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: {
          title: ['菜单管理']
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
        meta: {
          title: ['资源管理']
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: {
          title: ['课程管理']
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: {
          title: ['用户管理']
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: {
          title: ['广告管理']
        }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue'),
        meta: {
          title: ['广告位管理']
        }
      },
      {
        path: '/menu-create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue'),
        meta: {
          title: ['菜单管理', '创建菜单']
        }
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue'),
        meta: {
          title: ['菜单管理', '编辑菜单']
        }
      },
      {
        path: '/resource-category',
        name: 'resource-category',
        component: () => import(/* webpackChunkName: 'resource-category' */ '@/views/resource/category.vue'),
        meta: {
          title: ['资源分类']
        }
      },
      {
        path: 'role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
        props: true, // 将路由参数映射到props
        meta: {
          title: ['角色管理', '分配菜单']
        }
      },
      {
        path: 'role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: 'alloc-resource' */ '@/views/role/alloc-resource.vue'),
        props: true, // 将路由参数映射到props
        meta: {
          title: ['角色管理', '分配资源']
        }
      },
      {
        path: 'course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */ '@/views/course/create.vue'),
        meta: {
          title: ['课程管理', '新建课程']
        }
      },
      {
        path: 'course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */ '@/views/course/edit.vue'),
        props: true, // 将路由参数映射到props
        meta: {
          title: ['课程管理', '编辑课程']
        }
      },
      {
        path: 'course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */ '@/views/course/section.vue'),
        props: true,
        meta: {
          title: ['课程管理', '内容管理']
        }
      },
      {
        path: 'course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-section' */ '@/views/course/video.vue'),
        props: true,
        meta: {
          title: ['课程管理', '内容管理', '上传课时']
        }
      },
      {
        path: 'advert/addAdvert',
        name: 'advert-addAdvert',
        component: () => import(/* webpackChunkName: 'advert-addAdvert' */ '@/views/advert/addAdvert.vue'),
        meta: {
          title: ['广告管理', '添加广告']
        }
      },
      {
        path: 'advert/editAdvert',
        name: 'advert-editAdvert',
        component: () => import(/* webpackChunkName: 'advert-editAdvert' */ '@/views/advert/editAdvert.vue'),
        meta: {
          title: ['广告管理', '编辑广告']
        }
      },
      {
        path: 'advert-space/editAdvertSpace',
        name: 'advert-space-editAdvertSpace',
        component: () => import(/* webpackChunkName: 'advert-space-editAdvertSpace' */ '@/views/advert-space/editAdvertSpace.vue'),
        meta: {
          title: ['广告位管理', '编辑广告位']
        }
      },
      {
        path: 'advert-space/addAdvertSpace',
        name: 'advert-space-addAdvertSpace',
        component: () => import(/* webpackChunkName: 'advert-space-addAdvertSpace' */ '@/views/advert-space/addAdvertSpace.vue'),
        meta: {
          title: ['广告位管理', '添加广告位']
        }
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // to.matched 是一个数组。匹配到的父路由和子路由，父路由不符合规则子路由也不行
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
