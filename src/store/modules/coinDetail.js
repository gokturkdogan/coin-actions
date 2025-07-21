const coinDetail = {
  namespaced: true,

  state: () => ({
    symbol: null,
    tickerSocket: null,
    klineSocket: null,
    orderBookSocket: null,
    price: null,
    priceChange: null,
    priceChangePercent: null,
    highPrice: null,
    lowPrice: null,
    quoteVolume: null,
    quoteVolume1h: null,
    oldVolumes: [],
    bids: [],
    asks: []
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
    SET_ORDERBOOK_SOCKET(state, socket) {
      state.orderBookSocket = socket;
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
    SET_ORDERBOOK_DATA(state, data) {
      state.bids = data.bids.slice(0, 20).map(item => [Number(item[0]), Number(item[1])]);
      state.asks = data.asks.slice(0, 20).map(item => [Number(item[0]), Number(item[1])]);
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
    },
    CLOSE_ORDERBOOK_SOCKET(state) {
      if (state.orderBookSocket) {
        console.log(`[coinDetail][${state.symbol}] OrderBook socket closing...`);
        state.orderBookSocket.close();
        state.orderBookSocket = null;
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
    connectOrderBookSocket({ commit, state }, symbol) {
      commit('CLOSE_ORDERBOOK_SOCKET');
      const wsSymbol = symbol.toLowerCase();
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@depth20@100ms`);
      socket.onopen = () => {
        console.log(`[coinDetail][${symbol}] OrderBook socket opened.`);
      };
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        commit('SET_ORDERBOOK_DATA', data);
      };
      socket.onerror = (error) => {
        console.error(`[coinDetail][${symbol}] OrderBook socket error:`, error);
      };
      socket.onclose = () => {
        console.log(`[coinDetail][${symbol}] OrderBook socket closed.`);
      };
      commit('SET_ORDERBOOK_SOCKET', socket);
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
      commit('CLOSE_ORDERBOOK_SOCKET');
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
    getOldVolumes: state => state.oldVolumes,
    getBids: state => state.bids,
    getAsks: state => state.asks,
  }
};

export default coinDetail;