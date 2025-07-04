const orderList = {
  namespaced: true,
  state: () => ({
    orders: [],
    sockets: [],
    tickers: {},
  }),

  mutations: {
    addOrder(state, order) {
      state.orders.unshift(order);
      if (state.orders.length > 100) state.orders.pop();
    },
    addSocket(state, socket) {
      state.sockets.push(socket);
    },
    clearSockets(state) {
      state.sockets.forEach(socket => socket.close());
      state.sockets = [];
    },
    clearOrders(state) {
      state.orders = [];
    },
    updateTicker(state, { symbol, data }) {
      state.tickers[symbol] = data;
    }
  },

  actions: {
    async initOrderList({ commit, dispatch }) {
      commit('clearSockets');
      commit('clearOrders');
      const coins = [
        'BTC', 'ETH', 'BNB', 'SOL', 'ADA',
        'XRP', 'AVAX', 'DOGE', 'DOT', 'MATIC',
        'LTC', 'SHIB', 'LINK', 'BCH', 'XLM',
        'NEAR', 'FIL', 'ATOM', 'APT', 'ICP'
      ];
      await dispatch('connectTradeSocket', 'BTC');
      await dispatch('connectTickerSocket', 'BTC');
      const delayedCoins = coins.filter(c => c !== 'BTC');
      for (let i = 0; i < delayedCoins.length; i++) {
        const symbol = delayedCoins[i];
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch('connectTradeSocket', symbol);
        dispatch('connectTickerSocket', symbol);
        console.log('açıldı', symbol);
      }
    },
    watchCoin({ commit, dispatch }, symbol) {
      const upper = symbol.toUpperCase();
      if (!upper) return;
      commit('clearSockets');
      commit('clearOrders');
      dispatch('connectTradeSocket', upper);
      dispatch('connectTickerSocket', upper);
    },
    connectTradeSocket({ commit, state }, symbol) {
      const pair = symbol.toLowerCase() + 'usdt';
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@trade`);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p);
        const qty = parseFloat(data.q);
        const total = price * qty;
        const ticker = state.tickers[symbol] || {};
        const order = {
          symbol: symbol.toUpperCase(),
          price: price.toFixed(4),
          qty: qty.toFixed(4),
          total: total.toFixed(4),
          usdValue: total,
          type: data.m ? 'sell' : 'buy',
          lastPrice: ticker.lastPrice || null,
          changePercent: ticker.changePercent || null,
          changeAmount: ticker.changeAmount || null,
          volume24h: ticker.volume24h || null,
        };
        commit('addOrder', order);
      };
      socket.onerror = (err) => {
        console.error(`Trade socket error for ${symbol}:`, err);
      };
      commit('addSocket', socket);
    },
    connectTickerSocket({ commit }, symbol) {
      const pair = symbol.toLowerCase() + 'usdt';
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@ticker`);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const tickerData = {
          lastPrice: parseFloat(data.c).toFixed(2),
          changePercent: parseFloat(data.P).toFixed(2),
          changeAmount: parseFloat(data.p).toFixed(2),
          volume24h: parseFloat(data.q).toFixed(2),
        };
        commit('updateTicker', { symbol, data: tickerData });
      };
      socket.onerror = (err) => {
        console.error(`Ticker socket error for ${symbol}:`, err);
      };
      commit('addSocket', socket);
    },
    stopOrderList({ commit }) {
      commit('clearSockets');
      commit('clearOrders');
    }
  },
  getters: {
    allOrders: state => state.orders
  }
};

export default orderList;