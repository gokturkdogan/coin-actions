import axios from 'axios';

const futureList = {
  namespaced: true,
  state: () => ({
    coins: [],
    previousPrices: {},
    socket: null,
    volumeFetched: {},
    defaultOrderList: [
      'BTC', 'XRP', 'BCH', 'ETH', 'MATIC', 'SOL', 'BNB', '1000BONK', 'BSW', 'GUN', 'MYRO', '1000FLOKI', 'ACX', 'WIF',
      'BOME', 'UNI', 'TURBO', 'ZEN', 'ACH', 'MOODENG', 'NEIRO', 'POPCAT', 'TON', 'DOGE', 'RAYSOL', '1MBABYDOGE',
      'GOAT', 'PNUT', 'EIGEN', 'SYN', 'RSR', 'SUPER', 'CFX', '1000PEPE', 'WOO', 'JUP', 'APE', 'TWT', 'BID', 'FUN',
      'SPX', 'ARK', 'LOKA', 'ALPA', 'BIGTIME', 'HMSTR', 'MASK', 'ARB', 'ALT', 'AUCTION', 'PENGU', 'PENDLE',
      'KAVA', 'APT', 'YFI', 'W', 'SEI', 'SUI', 'JTO', 'TRUMP', 'TAO', 'BANANA', 'IOST', 'MYX'
    ],
    orders: [
      { text: 'Temizle', type: 'default', isUp: false, isActive: false },
      { text: 'Fiyat', type: 'lastPrice', isUp: false, isActive: false },
      { text: '24s Hacim', type: 'quoteVolume', isUp: false, isActive: false },
      { text: '1s Hacim', type: 'quoteVolume1h', isUp: false, isActive: false },
      { text: 'Yüzde', type: 'priceChangePercent', isUp: false, isActive: false }
    ],
  }),

  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
    clearSocket(state) {
      state.socket = null;
    },

    setCoinData(state, payload) {
      const newCoinsMap = {};
      state.coins.forEach(c => {
        newCoinsMap[c.symbol] = c;
      });

      payload.forEach(data => {
        const fullSymbol = data.s;
        if (!fullSymbol.endsWith('USDT')) return;

        const symbol = fullSymbol.replace('USDT', '');
        const newPrice = parseFloat(data.c);
        const prevPrice = state.previousPrices[symbol];
        let changeClass = '';

        if (prevPrice !== undefined) {
          if (newPrice > prevPrice) changeClass = '-up';
          else if (newPrice < prevPrice) changeClass = '-down';
        }

        newCoinsMap[symbol] = {
          ...newCoinsMap[symbol],
          symbol,
          fullSymbol,
          priceChangePercent: parseFloat(data.P),
          weightedAvgPrice: parseFloat(data.w),
          lastPrice: newPrice,
          highPrice: parseFloat(data.h),
          lowPrice: parseFloat(data.l),
          quoteVolume: parseFloat(data.q),
          changeClass,
        };
      });

      // Aktif order'ı bul
      const activeOrder = state.orders.find(o => o.isActive);
      const allCoins = Object.values(newCoinsMap);

      let sortedCoins = [];

      if (!activeOrder || activeOrder.type === 'default') {
        // Default order list ile sıralama
        const ordered = [];
        state.defaultOrderList.forEach(s => {
          const match = allCoins.find(c => c.symbol === s);
          if (match) ordered.push(match);
        });
        const remaining = allCoins.filter(c => !state.defaultOrderList.includes(c.symbol));
        remaining.sort((a, b) => a.symbol.localeCompare(b.symbol));
        sortedCoins = [...ordered, ...remaining];
      } else {
        // Aktif order'ın type'ına göre sıralama
        const type = activeOrder.type;
        const isUp = activeOrder.isUp;

        sortedCoins = allCoins.filter(c => c[type] !== undefined);
        sortedCoins.sort((a, b) => {
          const aVal = a[type] || 0;
          const bVal = b[type] || 0;
          return isUp ? bVal - aVal : aVal - bVal;
        });

        // Sıraya girmeyen coinleri sona ekle
        const notIncluded = allCoins.filter(c => c[type] === undefined);
        sortedCoins = [...sortedCoins, ...notIncluded];
      }

      state.coins = sortedCoins;
    },

    setQuoteVolume1h(state, { symbol, quoteVolume1h }) {
      const coin = state.coins.find(c => c.symbol === symbol);
      if (coin) coin.quoteVolume1h = quoteVolume1h.toFixed(2);
    },

    markVolumeFetched(state, symbol) {
      state.volumeFetched[symbol] = true;
    },

    setPreviousPrices(state, prices) {
      state.previousPrices = { ...prices };
    },

    clearChangeClass(state) {
      state.coins = state.coins.map(c => ({ ...c, changeClass: '' }));
    },

    setOrder(state, { type, isUp }) {
      state.orders = state.orders.map(order => {
        if (order.type === type) {
          return { ...order, isActive: true, isUp };
        }
        return { ...order, isActive: false };
      });
    }

  },

  actions: {
    connectWebSocket({ commit, state, dispatch }) {
      if (state.socket) return;

      const socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (!Array.isArray(data)) return;

        const filtered = data.filter(item => item.s.endsWith('USDT'));

        commit('setCoinData', filtered);

        const symbols = filtered.map(i => i.s.replace('USDT', ''));
        const ordered = state.defaultOrderList.filter(s => symbols.includes(s));
        const rest = symbols.filter(s => !state.defaultOrderList.includes(s));
        const finalSymbols = [...ordered, ...rest];

        dispatch('fetch1hVolumesWithDelay', finalSymbols);

        // Yeni fiyatları previousPrices state'ine kaydet
        const newPrevPrices = {};
        filtered.forEach(i => {
          newPrevPrices[i.s.replace('USDT', '')] = parseFloat(i.c);
        });
        commit('setPreviousPrices', newPrevPrices);

        // 1.5 saniye sonra changeClass temizle
        setTimeout(() => {
          commit('clearChangeClass');
        }, 1500);
      };

      socket.onerror = (error) => {
        console.error('[futureList] WebSocket Error:', error);
      };

      socket.onclose = () => {
        console.log('[futureList] WebSocket Closed');
        commit('clearSocket');
      };

      commit('setSocket', socket);
    },

    disconnectWebSocket({ state, commit }) {
      if (state.socket) {
        state.socket.close();
        commit('clearSocket');
      }
    },

    async fetch1hVolume({ commit, state }, symbol) {
      if (state.volumeFetched[symbol]) return;

      try {
        const res = await axios.get('https://fapi.binance.com/fapi/v1/klines', {
          params: {
            symbol: symbol + 'USDT',
            interval: '1h',
            limit: 1
          }
        });
        const candle = res.data[0];
        const close = parseFloat(candle[4]);
        const volume = parseFloat(candle[5]);
        const quoteVolume1h = close * volume;

        commit('setQuoteVolume1h', { symbol, quoteVolume1h });
        commit('markVolumeFetched', symbol);
      } catch (err) {
        console.error(`1h volume fetch failed for ${symbol}`, err);
      }
    },

    async fetch1hVolumesWithDelay({ dispatch, state }, symbols) {
      for (const symbol of symbols) {
        if (state.volumeFetched[symbol]) continue;
        await dispatch('fetch1hVolume', symbol);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    },
  },

  getters: {
    allCoins: (state) => state.coins,
    getCoin: (state) => (symbol) => state.coins.find(c => c.symbol === symbol) || null,
    getOrders: (state) => state.orders.filter(order => order.type !== 'default')
  }
};

export default futureList;