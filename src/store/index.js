import { createStore } from 'vuex';
import login from './modules/login';
import register from './modules/register';
import notify from './modules/notify';
import coins from './modules/coins';

export default createStore({
  modules: {
    login,
    register,
    notify,
    coins
  },
});