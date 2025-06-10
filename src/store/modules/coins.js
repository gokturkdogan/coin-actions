import axios from 'axios';

const coins = {
  namespaced: true,
  state: () => ({
    coinsData: [],
    socket: null,
    logos: {},
  }),
  mutations: {
    setCoinsData(state, payload) {
      state.coinsData = payload;
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
    setLogos(state, logos) {
      state.logos = logos;
    },
  },
  actions: {
    async fetchLogos({ commit }) {
      const ids = 'bitcoin,ethereum,binancecoin,solana,ripple';
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids,
          },
        });
        const logos = {};
        response.data.forEach(coin => {
          let symbol = '';
          switch (coin.id) {
            case 'bitcoin': symbol = 'BTCUSDT'; break;
            case 'ethereum': symbol = 'ETHUSDT'; break;
            case 'binancecoin': symbol = 'BNBUSDT'; break;
            case 'solana': symbol = 'SOLUSDT'; break;
            case 'ripple': symbol = 'XRPUSDT'; break;
          }
          if (symbol) {
            logos[symbol] = coin.image;
          }
        });
        commit('setLogos', logos);
      } catch (error) {
        console.error('Logo fetch hatası:', error);
      }
    },
    async connectWebSocketForHome({ commit, state, dispatch }) {
      if (state.socket) return;
      await dispatch('fetchLogos');
      const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      socket.onmessage = (event) => {
        const rawData = JSON.parse(event.data);
        const selectedSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT'];
        const order = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
        const logos = state.logos;
        const filteredData = rawData
          .filter(item => selectedSymbols.includes(item.s))
          .map(item => ({
            symbol: item.s.replace('USDT', ''),
            lastPrice: Number(item.c).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            priceChangePercent: Number(item.P).toFixed(2),
            logoUrl: logos[item.s] || '',
          }))
          .sort((a, b) =>
            order.indexOf(a.symbol + 'USDT') - order.indexOf(b.symbol + 'USDT')
          );
        commit('setCoinsData', filteredData);
      };
      socket.onerror = (error) => {
        console.error('WebSocket hata:', error);
      };
      socket.onclose = () => {
        console.log('WebSocket kapandı');
        commit('setSocket', null);
      };
      commit('setSocket', socket);
    },
    disconnectWebSocketForHome({ state, commit }) {
      if (state.socket) {
        state.socket.close();
        commit('setSocket', null);
      }
    },
  },
  getters: {
    coinsData: (state) => state.coinsData,
  },
};

export default coins;
