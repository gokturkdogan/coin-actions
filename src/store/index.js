import { createStore } from 'vuex';
import home from './modules/home';
import coinDetail from './modules/coinDetail';
import volume from './modules/volume';
import coinList from './modules/coinList';
import tradeVolume from './modules/tradeVolume';

export default createStore({
  modules: {
    home,
    coinDetail,
    volume,
    coinList,
    tradeVolume
  },
});