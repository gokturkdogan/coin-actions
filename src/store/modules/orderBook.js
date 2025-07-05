const orderList = {
  namespaced: true,
  state: () => ({
    orderBookOrders: [], // tüm coinlerden gelen order book emirleri
    sockets: [],
    tickers: {} // coin -> { changePercent, volume24h }
  }),

  mutations: {
    setOrderBookOrders(state, orders) {
      state.orderBookOrders = orders;
    },
    addSocket(state, socket) {
      state.sockets.push(socket);
    },
    clearSockets(state) {
      state.sockets.forEach(socket => socket.close());
      state.sockets = [];
    },
    updateTicker(state, { symbol, data }) {
      state.tickers[symbol] = data;
    }
  },

  actions: {
    async initOrderBooks({ commit, dispatch }) {
      commit('clearSockets');
      commit('setOrderBookOrders', []);

      const coins = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA',
        'XRP', 'AVAX', 'DOGE', 'DOT', 'MATIC',
        'LTC', 'SHIB', 'LINK', 'BCH', 'XLM',
        'NEAR', 'FIL', 'ATOM', 'APT', 'ICP'];

      // İlk BTC aç
      dispatch('connectDepthSocket', 'BTC');
      dispatch('connectTickerSocket', 'BTC');

      const delayedCoins = coins.filter(c => c !== 'BTC');
      for (let i = 0; i < delayedCoins.length; i++) {
        const symbol = delayedCoins[i];
        await new Promise(res => setTimeout(res, 500));
        dispatch('connectDepthSocket', symbol);
        dispatch('connectTickerSocket', symbol);
      }
    },

    watchCoin({ commit, dispatch }, symbol) {
      const upper = symbol.toUpperCase();
      if (!upper) return;
      commit('clearSockets');
      commit('setOrderBookOrders', []);
      dispatch('connectDepthSocket', upper);
      dispatch('connectTickerSocket', upper);
    },

    connectDepthSocket({ commit, state }, symbol) {
      const pair = symbol.toLowerCase() + 'usdt';
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@depth`);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const bids = data.b.map(bid => ({
          symbol: symbol,
          price: parseFloat(bid[0]),
          qty: parseFloat(bid[1]),
          total: parseFloat(bid[0]) * parseFloat(bid[1]),
          type: 'buy',
          changePercent: state.tickers[symbol]?.changePercent || null,
          volume24h: state.tickers[symbol]?.volume24h || null
        }))
        .filter(order => order.qty > 0);

        const asks = data.a.map(ask => ({
          symbol: symbol,
          price: parseFloat(ask[0]),
          qty: parseFloat(ask[1]),
          total: parseFloat(ask[0]) * parseFloat(ask[1]),
          type: 'sell',
          changePercent: state.tickers[symbol]?.changePercent || null,
          volume24h: state.tickers[symbol]?.volume24h || null
        }))
        .filter(order => order.qty > 0);

        const otherOrders = state.orderBookOrders.filter(o => o.symbol !== symbol);
        const allOrders = [...otherOrders, ...bids, ...asks].sort((a, b) => b.total - a.total);

        commit('setOrderBookOrders', allOrders);
      };

      socket.onerror = (err) => {
        console.error(`Depth socket error for ${symbol}:`, err);
      };

      commit('addSocket', socket);
    },

    connectTickerSocket({ commit }, symbol) {
      const pair = symbol.toLowerCase() + 'usdt';
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@ticker`);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const tickerData = {
          changePercent: parseFloat(data.P).toFixed(2),
          volume24h: parseFloat(data.q).toFixed(2),
        };

        commit('updateTicker', { symbol, data: tickerData });
      };

      socket.onerror = (err) => {
        console.error(`Ticker socket error for ${symbol}:`, err);
      };

      commit('addSocket', socket);
    },

    stopOrderBooks({ commit }) {
      commit('clearSockets');
      commit('setOrderBookOrders', []);
    }
  },

  getters: {
    allOrderBookOrders: state => state.orderBookOrders
  }
};

export default orderList;