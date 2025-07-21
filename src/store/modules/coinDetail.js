const coinDetail = {
  namespaced: true,

  state: () => ({
    symbol: null,
    tickerSocket: null,
    klineSocket: null,
    price: null,
    priceChange: null,
    priceChangePercent: null,
    highPrice: null,
    lowPrice: null,
    quoteVolume: null,
    quoteVolume1h: null,
    oldVolumes: [],
  }),

  mutations: {
    SET_SYMBOL(state, symbol) {
      state.symbol = symbol;
    },
    SET_TICKER_SOCKET(state, socket) {
      state.tickerSocket = socket;
    },
    SET_KLINE_SOCKET(state, socket) {
      state.klineSocket = socket;
    },
    SET_TICKER_DATA(state, data) {
      state.price = Number(data.c);
      state.priceChange = Number(data.p);
      state.priceChangePercent = Number(data.P);
      state.highPrice = Number(data.h);
      state.lowPrice = Number(data.l);
      state.quoteVolume = Number(data.q);
    },
    SET_QUOTE_VOLUME_1H(state, klineData) {
      const quoteVolume = Number(klineData.k.q);
      state.quoteVolume1h = quoteVolume;
    },
    SET_OLD_VOLUMES(state, volumes) {
      state.oldVolumes = volumes;
    },
    CLOSE_TICKER_SOCKET(state) {
      if (state.tickerSocket) {
        console.log(`[coinDetail][${state.symbol}] Ticker socket closing...`);
        state.tickerSocket.close();
        state.tickerSocket = null;
      }
    },
    CLOSE_KLINE_SOCKET(state) {
      if (state.klineSocket) {
        console.log(`[coinDetail][${state.symbol}] Kline socket closing...`);
        state.klineSocket.close();
        state.klineSocket = null;
      }
    }
  },

  actions: {
    connectTickerSocket({ commit, state }, symbol) {
      commit('CLOSE_TICKER_SOCKET');
      commit('SET_SYMBOL', symbol);

      const wsSymbol = symbol.toLowerCase();
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@ticker`);

      socket.onopen = () => {
        console.log(`[coinDetail][${symbol}] Ticker socket opened.`);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        commit('SET_TICKER_DATA', data);
      };

      socket.onerror = (error) => {
        console.error(`[coinDetail][${symbol}] Ticker socket error:`, error);
      };

      socket.onclose = () => {
        console.log(`[coinDetail][${symbol}] Ticker socket closed.`);
      };

      commit('SET_TICKER_SOCKET', socket);
    },

    connectKlineSocket({ commit, state }, symbol) {
      commit('CLOSE_KLINE_SOCKET');
      const wsSymbol = symbol.toLowerCase();
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@kline_1h`);

      socket.onopen = () => {
        console.log(`[coinDetail][${symbol}] Kline socket opened.`);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        commit('SET_QUOTE_VOLUME_1H', data);
      };

      socket.onerror = (error) => {
        console.error(`[coinDetail][${symbol}] Kline socket error:`, error);
      };

      socket.onclose = () => {
        console.log(`[coinDetail][${symbol}] Kline socket closed.`);
      };

      commit('SET_KLINE_SOCKET', socket);
    },

    async fetchOldVolumes({ commit }, symbol) {
      if (!symbol) return;
      const upperSymbol = symbol.toUpperCase();
      const limit = 12;
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${upperSymbol}&interval=1h&limit=${limit}`
        );
        const data = await response.json();
        const volumes = data
          .slice(0, data.length - 1)
          .map(item => ({
            closeTime: item[6],
            quoteVolume: Number(item[7])
          }));

        commit('SET_OLD_VOLUMES', volumes);
      } catch (error) {
        console.error(`[coinDetail][${upperSymbol}] fetchOldVolumes error:`, error);
        commit('SET_OLD_VOLUMES', []);
      }
    },

    disconnectSockets({ commit }) {
      commit('CLOSE_TICKER_SOCKET');
      commit('CLOSE_KLINE_SOCKET');
    }
  },

  getters: {
    getPrice: state => state.price,
    getPriceChange: state => state.priceChange,
    getPriceChangePercent: state => state.priceChangePercent,
    getHighPrice: state => state.highPrice,
    getLowPrice: state => state.lowPrice,
    getQuoteVolume: state => state.quoteVolume,
    getQuoteVolume1h: state => state.quoteVolume1h,
    getOldVolumes: state => state.oldVolumes
  }
};

export default coinDetail;