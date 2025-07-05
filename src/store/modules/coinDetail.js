import axios from 'axios';

const coinDetail = {
  namespaced: true,
  state: () => ({
    coinSymbol: null,
    tickerData: null,
    depthData: { bids: [], asks: [] },
    historicalVolumes: { weekly: null, monthly: null, quarterly: null },
    klineData: [],
    trades: [],
    socketTicker: null,
    socketDepth: null,
    socketTrades: null,
  }),

  mutations: {
    setCoinSymbol(state, symbol) {
      state.coinSymbol = symbol;
    },
    setTickerData(state, data) {
      state.tickerData = data;
    },
    setDepthData(state, { bids, asks }) {
      state.depthData = {
        bids: [...bids],
        asks: [...asks],
      };
    },
    setHistoricalVolumes(state, { weekly, monthly, quarterly }) {
      state.historicalVolumes = { weekly, monthly, quarterly };
    },
    setKlineData(state, data) {
      state.klineData = data;
    },
    setTrades(state, trades) {
      state.trades = trades;
    },
    setSocketTicker(state, socket) {
      state.socketTicker = socket;
    },
    setSocketDepth(state, socket) {
      state.socketDepth = socket;
    },
    setSocketTrades(state, socket) {
      state.socketTrades = socket;
    },
    clearSockets(state) {
      if (state.socketTicker) state.socketTicker.close();
      if (state.socketDepth) state.socketDepth.close();
      if (state.socketTrades) state.socketTrades.close();
      state.socketTicker = null;
      state.socketDepth = null;
      state.socketTrades = null;
    },
  },

  actions: {
    async openCoinDetail({ commit, dispatch }, symbol) {
      commit('clearSockets');
      commit('setCoinSymbol', symbol);
      await Promise.all([
        dispatch('fetchHistoricalVolumes', symbol),
        dispatch('fetchKlineData', symbol),
      ]);
      dispatch('connectTickerSocket', symbol);
      dispatch('connectDepthSocket', symbol);
      dispatch('connectTradesSocket', symbol);
    },

    async fetchHistoricalVolumes({ commit }, symbol) {
      const symbolQuery = `${symbol.toUpperCase()}USDT`;
      try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: { symbol: symbolQuery, interval: '1d', limit: 90 }
        });
        const volumes = response.data.map(entry => parseFloat(entry[7]));
        const weekly = volumes.slice(-7).reduce((a, b) => a + b, 0);
        const monthly = volumes.slice(-30).reduce((a, b) => a + b, 0);
        const quarterly = volumes.reduce((a, b) => a + b, 0);

        commit('setHistoricalVolumes', {
          weekly: weekly.toFixed(2),
          monthly: monthly.toFixed(2),
          quarterly: quarterly.toFixed(2),
        });
      } catch (error) {
        console.error('Historical volume fetch error:', error);
      }
    },

    async fetchKlineData({ commit }, symbol) {
      const symbolQuery = `${symbol.toUpperCase()}USDT`;
      try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: { symbol: symbolQuery, interval: '1h', limit: 100 }
        });
        const klineData = response.data.map(entry => ({
          time: entry[0],
          open: parseFloat(entry[1]),
          high: parseFloat(entry[2]),
          low: parseFloat(entry[3]),
          close: parseFloat(entry[4]),
          volume: parseFloat(entry[5])
        }));
        commit('setKlineData', klineData);
      } catch (error) {
        console.error('Kline data fetch error:', error);
      }
    },

    connectTickerSocket({ commit }, symbol) {
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@ticker`);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        commit('setTickerData', {
          lastPrice: parseFloat(data.c).toFixed(2),
          changePercent: parseFloat(data.P).toFixed(2),
          changeAmount: parseFloat(data.p).toFixed(4),
          changeAmount: Number(data.p).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4
            }),
          volume24h: parseFloat(data.q).toFixed(2),
          high24h: parseFloat(data.h).toFixed(2),
          low24h: parseFloat(data.l).toFixed(2),
        });
      };
      socket.onerror = (err) => console.error('Ticker socket error:', err);
      commit('setSocketTicker', socket);
    },

    connectDepthSocket({ commit, state }, symbol) {
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@depth20@100ms`);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const bids = data.bids;
          const asks = data.asks;
          commit('setDepthData', { bids, asks });
        } catch (err) {
          console.error('Depth data error:', err);
        }
      };
      socket.onerror = (err) => console.error('Depth socket error:', err);
      commit('setSocketDepth', socket);
    },

    connectTradesSocket({ commit }, symbol) {
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
      const trades = [];
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        trades.unshift({
          price: parseFloat(data.p).toFixed(2),
          qty: parseFloat(data.q).toFixed(4),
          time: data.T,
          type: data.m ? 'sell' : 'buy'
        });
        if (trades.length > 40) trades.pop();
        commit('setTrades', [...trades]);
      };
      socket.onerror = (err) => console.error('Trades socket error:', err);
      commit('setSocketTrades', socket);
    },

    closeCoinDetail({ commit }) {
      commit('clearSockets');
    },
  },

  getters: {
    coinSymbol: state => state.coinSymbol,
    tickerData: state => state.tickerData,
    depthData: state => state.depthData,
    historicalVolumes: state => state.historicalVolumes,
    klineData: state => state.klineData,
    trades: state => state.trades,
  }
};

export default coinDetail;