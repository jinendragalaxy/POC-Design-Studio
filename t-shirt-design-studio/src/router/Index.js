import DesignStudio from '@/views/DesignStudio.vue';
import ProductPage from '@/views/ProductPage.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';



Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'ProductPage',
    component: ProductPage
  },
  {
    path: '/design',
    name: 'DesignStudio',
    component: DesignStudio
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
