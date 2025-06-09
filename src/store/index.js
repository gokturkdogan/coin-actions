import { createStore } from 'vuex';
import login from './modules/login';
import register from './modules/register';
import notify from './modules/notify';

export default createStore({
  modules: {
    login,
    register,
    notify
  },
});