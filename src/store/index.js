import { createStore } from 'vuex';
import home from './modules/home';
import coinDetail from './modules/coinDetail';
import orderList from './modules/orderList';
import orderBook from './modules/orderBook';
import futureList from './modules/futureList';
import spotList from './modules/spotList';
import coinList from './modules/coinList';

export default createStore({
  modules: {
    home,
    coinDetail,
    orderList,
    orderBook,
    futureList,
    spotList,
    coinList
  },
});