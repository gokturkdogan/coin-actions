import { createStore } from 'vuex';
import home from './modules/home';
import coinDetail from './modules/coinDetail';
import coinList from './modules/coinList';
import tradeVolume from './modules/tradeVolume';
import instaTradeVolume from './modules/instaTradeVolume';
import instaFutureTradeVolume from './modules/instaFutureTradeVolume';

export default createStore({
  modules: {
    home,
    coinDetail,
    coinList,
    tradeVolume,
    instaTradeVolume,
    instaFutureTradeVolume
  },
});