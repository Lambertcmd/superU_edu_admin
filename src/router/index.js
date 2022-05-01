import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
// import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '谷粒学院后台管理系统', icon: 'nested' }
    }]
  }
]
export const asyncRoutes = [

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/table',//访问/teacher，路径自动重定向为/teacher/table
    name: '讲师管理',
    meta: { title: '讲师管理', icon: 'el-icon-s-help' },//title：侧边栏标题，icon：标题旁边的图标
    children: [
      {
        path: 'table',
        name: '讲师列表',
        component: () => import('@/views/edu/teacher/list'),//内容
        meta: { title: '讲师列表', icon: 'table' }
      },
      {
        path: 'save',
        name: '讲师添加',
        component: () => import('@/views/edu/teacher/save'),
        meta: { title: '讲师添加', icon: 'form' }
      },
      {
        path: "edit/:id",//:id :表示需要传参id
        name: "讲师修改",
        component: () => import('@/views/edu/teacher/save'),
        meta: { title: "编辑讲师", noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/list',//访问/subject，路径自动重定向为/subject/list
    name: '课程分类管理',
    meta: { title: '课程分类管理', icon: 'el-icon-s-help' },//title：侧边栏标题，icon：标题旁边的图标
    children: [
      {
        path: 'list',
        name: '课程分类列表',
        component: () => import('@/views/edu/subject/list'),//内容
        meta: { title: '课程分类列表', icon: 'tree' }
      },
      {
        path: 'save',
        name: '课程分类添加',
        component: () => import('@/views/edu/subject/save'),
        meta: { title: '课程分类添加', icon: 'form' }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',//访问/course，路径自动重定向为/course/list
    name: '课程管理',
    meta: { title: '课程管理', icon: 'el-icon-s-help' },//title：侧边栏标题，icon：标题旁边的图标
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/edu/course/list'),//内容
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: 'info',
        name: '课程添加',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '课程添加', icon: 'form' }
      },
      {
        path: 'info/:id',
        name: 'EduCourseInfoEdit',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '编辑课程基本信息', noCache: true },
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'EduCourseChapterEdit',
        component: () => import('@/views/edu/course/chapter'),
        meta: { title: '编辑课程大纲', noCache: true },
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'EduCoursePublishEdit',
        component: () => import('@/views/edu/course/publish'),
        meta: { title: '发布课程', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/statistics/daily',
    component: Layout,
    redirect: '/statistics/daily/create',
    name: '统计分析',
    meta: { title: '统计分析', icon: 'dashboard' },
    children: [
      {
        path: 'show',
        name: 'StatisticsDailyShow',
        component: () => import('@/views/statistics/daily/show'),
        meta: { title: '统计数据显示', icon: 'table' }
      },
      {
        path: 'create',
        name: 'StatisticsDailyCreate',
        component: () => import('@/views/statistics/daily/create'),
        meta: { title: '生成统计数据', icon: 'form' }
      }
    ]
  },
  {
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    name: '权限管理',
    meta: { title: '权限管理', icon: 'chart' },
    children: [
      {
        path: 'user/list',
        name: '用户管理',
        component: () => import('@/views/acl/user/list'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role/list',
        name: '角色管理',
        component: () => import('@/views/acl/role/list'),
        meta: { title: '角色管理' }
      },
      {
        path: 'role/form',
        name: '角色添加',
        component: () => import('@/views/acl/role/form'),
        meta: { title: '角色添加' },
        hidden: true
      },
      {
        path: 'role/update/:id',
        name: '角色修改',
        component: () => import('@/views/acl/role/form'),
        meta: { title: '角色修改' },
        hidden: true
      },
      {
        path: 'role/distribution/:id',
        name: '角色权限',
        component: () => import('@/views/acl/role/roleForm'),
        meta: { title: '角色权限' },
        hidden: true
      },
      {
        path: 'menu/list',
        name: '菜单管理',
        component: () => import('@/views/acl/menu/list'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'user/add',
        name: '用户添加',
        component: () => import('@/views/acl/user/form'),
        meta: { title: '用户添加' },
        hidden: true
      },
      {
        path: 'user/update/:id',
        name: '用户修改',
        component: () => import('@/views/acl/user/form'),
        meta: { title: '用户修改' },
        hidden: true
      },
      {
        path: 'user/role/:id',
        name: '用户角色',
        component: () => import('@/views/acl/user/roleForm'),
        meta: { title: '用户角色' },
        hidden: true
      }

    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

export default router
