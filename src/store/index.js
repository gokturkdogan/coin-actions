import { createStore } from 'vuex';
import login from './modules/login';
import register from './modules/register';

export default createStore({
  modules: {
    login,
    register
  },
});