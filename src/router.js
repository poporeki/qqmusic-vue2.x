import Vue from 'vue'
import Router from 'vue-router'
import MusicHall from './views/MusicHallView'
import SongsList from './views/SongListView'
import SingerDetail from './views/SingerDetailView'
import MVPlayer from './views/MVPlayerView'
import AlbumDetailView from './views/AlbumDetailView'
import SingerListView from './views/SingerListView'
import TopListZoneView from './views/TopListZoneView'
import TopListView from './views/TopListView'
import CategoryZoneView from './views/CategoryZoneView'
import CategoryView from './views/CategoryView'
import AllCategoryView from './views/AllCategoryView'
import CategoryAreaView from './views/CategoryAreaView'
import RadioListView from './views/RadioListView'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  },
  routes: [{
      path: '/',
      redirect: 'musichall'
    }, {
      path: '/musichall',
      name: '音乐馆',
      meta: {
        title: '音乐馆'
      },
      component: MusicHall
    }, {
      path: '/songslist/:id',
      name: '歌单',
      meta: {
        title: '歌单'
      },
      component: SongsList
    }, {
      path: '/singer/:mid',
      name: '详情',
      meta: {
        title: '歌手'
      },
      component: SingerDetail
    },
    {
      path: '/mv/:vid',
      name: 'MV',
      meta: {
        title: "MV"
      },
      component: MVPlayer
    },
    {
      path: '/album/:mid',
      name: 'ALBUM',
      meta: {
        title: '专辑'
      },
      component: AlbumDetailView
    },
    {
      path: '/singerlist',
      name: 'SINGERLIST',
      meta: {
        title: '歌手'
      },
      component: SingerListView
    }, {
      path: '/toplistzone',
      name: 'TOPLISTZONE',
      meta: {
        title: 'QQ音乐排行榜'
      },
      component: TopListZoneView
    }, {
      path: '/toplist/:id',
      name: 'TOPLIST',
      meta: {
        title: ''
      },
      component: TopListView
    }, {
      path: '/categoryzone',
      name: '分类区',
      meta: {
        title: '分类区'
      },
      component: CategoryZoneView
    }, {
      path: '/category/:id',
      name: '分类区',
      meta: {
        title: ''
      },
      component: CategoryView
    }, {
      path: '/categoryall',
      name: '所有分类',
      meta: {
        title: '所有分类'
      },
      component: AllCategoryView
    }, {
      path: '/categoryarea/:areaid',
      name: '所有分类',
      meta: {
        title: ''
      },

      component: CategoryAreaView
    }, {
      path: '/radiolist',
      name: '电台',
      meta: {
        title: '电台'
      },

      component: RadioListView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})