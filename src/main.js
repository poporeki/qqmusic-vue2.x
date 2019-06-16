import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'
import 'swiper/dist/css/swiper.css'
import '@/utils/rem';
import {
  BASE_URL
} from '@/config/baseUrl';

Vue.config.productionTip = false
Axios.defaults.baseURL = BASE_URL;

Vue.prototype.$axios = Axios;

Vue.use(VueAwesomeSwiper, /* { default global options } */ )
Vue.use(VueLazyload)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')