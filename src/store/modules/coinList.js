import axios from 'axios';

const coinList = {
  namespaced: true,
  state: () => ({
    socket: null,
    coinsData: [],
    futuresMap: {}, // Vadeli hacimler sembol->değer map’i
    futuresIntervalId: null, // Interval ID
  }),

  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
    setCoinsData(state, payload) {
        const prioritySymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
        const sortedCoins = payload.slice().sort((a, b) => {
            const aPriority = prioritySymbols.includes(a.symbol) ? 0 : 1;
            const bPriority = prioritySymbols.includes(b.symbol) ? 0 : 1;
            if (aPriority === bPriority) return 0;
            return aPriority - bPriority;
        });
        state.coinsData = sortedCoins;
    },
    updateFuturesMap(state, futuresMap) {
      state.futuresMap = futuresMap;
      state.coinsData = state.coinsData.map((coin) => ({
        ...coin,
        quoteFutureVolume: futuresMap[coin.symbol] || 0,
      }));
    },
    setFuturesIntervalId(state, id) {
      state.futuresIntervalId = id;
    },
    clearSocket(state) {
      if (state.socket) {
        state.socket.close();
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
      console.log('coin listesi için vadeli hacim getirildi.')
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
      if (state.futuresIntervalId) return; // Zaten interval varsa

      // İlk çağrı
      dispatch('fetchFuturesVolumes');

      // 1 dakikada bir yenile
      const id = setInterval(() => {
        dispatch('fetchFuturesVolumes');
      }, 60 * 1000);

      commit('setFuturesIntervalId', id);
    },

    stopFuturesInterval({ commit }) {
      commit('clearFuturesInterval');
    },

    connectTickerSocket({ commit, state, dispatch }) {
      if (state.socket && state.socket.readyState !== WebSocket.CLOSED) {
        console.log('coinList websocket zaten açık, tekrar açılmadı');
        return;
      }

      console.log('coinList websocket açılıyor...');
      const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

      socket.onmessage = (event) => {
        const rawData = JSON.parse(event.data);

        const usdtPairs = rawData
          .filter(item => item.s && item.s.endsWith('USDT'))
          .map(item => ({
            symbol: item.s,
            lastPrice: Number(item.c),
            bestBidPrice: Number(item.b),
            bestAskPrice: Number(item.a),
            highPrice: Number(item.h),
            lowPrice: Number(item.l),
            quoteVolume: Number(item.q),
            priceChangePercent: Number(item.P),
            quoteFutureVolume: state.futuresMap[item.s] || 0, // Vadeli hacim state’den al
          }));

        commit('setCoinsData', usdtPairs);
      };

      socket.onerror = (error) => {
        console.error('coin listesit websocket hatası:', error);
      };

      socket.onclose = () => {
        console.log('coin listesi websocket kapandı');
        commit('clearSocket');
      };

      commit('setSocket', socket);

      // Vadeli hacim güncellemeyi başlat
      dispatch('startFuturesInterval');
    },

    disconnectTickerSocket({ commit, dispatch }) {
      console.log('coin listesi websocket kapatılıyor...');
      commit('clearSocket');
      dispatch('stopFuturesInterval');
    }
  },

  getters: {
    getCoinsData: (state) => state.coinsData,
  },
};

export default coinList;