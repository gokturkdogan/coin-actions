import { createStore } from 'vuex';
import login from './modules/login';
import register from './modules/register';
import notify from './modules/notify';
import coins from './modules/coins';
import coinDetail from './modules/coinDetail';
import orderList from './modules/orderList';
import orderBook from './modules/orderBook';
import futureList from './modules/futureList';
import spotList from './modules/spotList';
import coinList from './modules/coinList';

export default createStore({
  modules: {
    login,
    register,
    notify,
    coins,
    coinDetail,
    orderList,
    orderBook,
    futureList,
    spotList,
    coinList
  },
});