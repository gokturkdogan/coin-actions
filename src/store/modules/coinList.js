import axios from 'axios';
const symbolsPriority = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
const coinList = {
  namespaced: true,
  state: () => ({
    socket: null,
    coinsMap: new Map(),
    futuresMap: {},
    futuresIntervalId: null,
  }),
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
    updateCoin(state, coin) {
      state.coinsMap.set(coin.symbol, coin);
    },
    setCoinsMap(state, map) {
      state.coinsMap = map;
    },
    updateFuturesMap(state, futuresMap) {
      state.futuresMap = futuresMap;
      state.coinsMap.forEach((coin, symbol) => {
        if (futuresMap[symbol] !== undefined) {
          state.coinsMap.set(symbol, { ...coin, quoteFutureVolume: futuresMap[symbol] });
        }
      });
    },
    setFuturesIntervalId(state, id) {
      state.futuresIntervalId = id;
    },
    clearSocket(state) {
      if (state.socket) {
        state.socket.onmessage = null;
        state.socket.onerror = null;
        state.socket.onclose = null;
        if (state.socket.readyState !== WebSocket.CLOSED) {
          state.socket.close();
        }
      }
      state.socket = null;
    },
    clearFuturesInterval(state) {
      if (state.futuresIntervalId) {
        clearInterval(state.futuresIntervalId);
        state.futuresIntervalId = null;
      }
    },
  },
  actions: {
    async fetchFuturesVolumes({ commit }) {
      try {
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
        const futuresData = response.data;

        const futuresMap = {};
        futuresData
          .filter(item => item.symbol && item.symbol.endsWith('USDT'))
          .forEach(item => {
            futuresMap[item.symbol] = Number(item.quoteVolume);
          });

        commit('updateFuturesMap', futuresMap);
      } catch (error) {
        console.error('Vadeli hacim verisi alınamadı:', error);
      }
    },
    startFuturesInterval({ dispatch, commit, state }) {
      if (state.futuresIntervalId) return;
      dispatch('fetchFuturesVolumes');
      const id = setInterval(() => {
        dispatch('fetchFuturesVolumes');
      }, 5 * 60 * 1000);
      commit('setFuturesIntervalId', id);
    },
    stopFuturesInterval({ commit }) {
      commit('clearFuturesInterval');
    },
    connectTickerSocket({ commit, state, dispatch }) {
      if (state.socket) {
        if (state.socket.readyState !== WebSocket.CLOSED) {
          console.log('coinList websocket zaten açık, önce kapatılıyor...');
          commit('clearSocket');
        } else {
          commit('clearSocket');
        }
      }
      console.log('coinList websocket açılıyor...');
      const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      socket.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          const usdtPairs = rawData.filter(item => item.s && item.s.endsWith('USDT'));
          usdtPairs.forEach(item => {
            const coin = {
              symbol: item.s,
              lastPrice: Number(item.c),
              bestBidPrice: Number(item.b),
              bestAskPrice: Number(item.a),
              highPrice: Number(item.h),
              lowPrice: Number(item.l),
              quoteVolume: Number(item.q),
              priceChangePercent: Number(item.P),
              quoteFutureVolume: state.futuresMap[item.s] || 0,
            };
            commit('updateCoin', coin);
          });
        } catch (e) {
          console.error('WebSocket message parse hatası:', e);
        }
      };
      socket.onerror = (error) => {
        console.error('coin listesi websocket hatası:', error);
      };
      socket.onclose = () => {
        console.log('coin listesi websocket kapandı');
        commit('clearSocket');
      };
      commit('setSocket', socket);
      dispatch('startFuturesInterval');
    },
    disconnectTickerSocket({ commit, dispatch }) {
      console.log('coin listesi websocket kapatılıyor...');
      commit('clearSocket');
      dispatch('stopFuturesInterval');
    }
  },
  getters: {
    getCoinsData: (state) => {
      const array = Array.from(state.coinsMap.values());
      array.sort((a, b) => {
        const aPriority = symbolsPriority.includes(a.symbol) ? 0 : 1;
        const bPriority = symbolsPriority.includes(b.symbol) ? 0 : 1;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return 0;
      });
      return array;
    },
  },
};

export default coinList;