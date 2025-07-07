import axios from 'axios';

const PRIORITY_COINS = [
  'BTC', 'XRP', 'BCH', 'ETH', 'MATIC', 'SOL', 'BNB', '1000BONK', 'BSW', 'GUN',
  'MYRO', '1000FLOKI', 'ACX', 'WIF', 'BOME', 'UNI', 'TURBO', 'ZEN', 'ACH',
  'MOODENG', 'NEIRO', 'POPCAT', 'TON', 'DOGE', 'RAYSOL', '1MBABYDOGE', 'GOAT',
  'PNUT', 'EIGEN', 'SYN', 'RSR', 'SUPER', 'CFX', '1000PEPE', 'WOO', 'JUP',
  'APE', 'TWT', 'BID', 'FUN', 'SPX', 'ARK', 'LOKA', 'ALPA', 'BIGTIME',
  'HMSTR', 'MASK', 'ARB', 'ALT', 'AUCTION', 'PENGU', 'PENDLE', 'KAVA', 'APT',
  'YFI', 'W', 'SEI', 'SUI', 'JTO', 'TRUMP', 'TAO', 'BANANA', 'IOST', 'MYX'
];

const futureVolume = {
  namespaced: true,
  state: () => ({
    coins: {},
    previousPrices: {},
    priorityCoins: [...new Set(PRIORITY_COINS.map(c => c.toUpperCase()))],
    orders: [
      { text: 'Temizle', type: 'default', isUp: false, isActive: true },
      { text: 'Fiyat', type: 'lastPrice', isUp: false, isActive: false },
      { text: '24s', type: '24Volume', isUp: false, isActive: false },
      { text: '1s', type: '1Volume', isUp: false, isActive: false },
      { text: '% Değişim', type: 'priceChangePercent', isUp: false, isActive: false }
    ],
  }),

  mutations: {
    setCoinData(state, { symbol, data }) {
      state.coins[symbol] = {
        ...state.coins[symbol],
        ...data
      };
    },
    setPreviousPrice(state, { symbol, price }) {
      state.previousPrices[symbol] = price;
    },
    clearChangeClass(state, symbol) {
      if (state.coins[symbol]) {
        state.coins[symbol].changeClass = null;
      }
    },
    setOrderBy(state, { type, isUp }) {
      state.orders = state.orders.map(order => ({
        ...order,
        isActive: order.type === type,
        isUp: order.type === type ? isUp : order.isUp
      }));
    }
  },

  actions: {
    initSocket({ commit, state }) {
      const socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');

      socket.onmessage = (event) => {
        const tickers = JSON.parse(event.data);
        tickers.forEach(ticker => {
          const symbolRaw = ticker.s;
          if (!symbolRaw.endsWith('USDT')) return;

          const symbol = symbolRaw.replace('USDT', '').toUpperCase();
          const price = parseFloat(ticker.c);
          const volume = parseFloat(ticker.q);
          const prevVolume = parseFloat(ticker.V);
          const volumeUSD = volume * price;
          const prevVolumeUSD = prevVolume * price;
          const changePercent = parseFloat(ticker.P);

          let volumeChange = null;
          if (prevVolumeUSD > 0) {
            volumeChange = ((volumeUSD - prevVolumeUSD) / prevVolumeUSD) * 100;
          }

          const prevPrice = state.previousPrices[symbol];
          let changeClass = null;
          if (prevPrice !== undefined) {
            if (price > prevPrice) changeClass = '-up';
            else if (price < prevPrice) changeClass = '-down';
          }

          commit('setCoinData', {
            symbol,
            data: {
              price: price.toFixed(2),
              futuresVolume24h: volumeUSD.toFixed(2),
              futuresVolume24hChange: volumeChange?.toFixed(2) || null,
              changePercent24h: changePercent.toFixed(2),
              changeClass
            }
          });

          commit('setPreviousPrice', { symbol, price });

          if (changeClass) {
            setTimeout(() => {
              commit('clearChangeClass', symbol);
            }, 1000);
          }
        });
      };

      socket.onerror = (err) => console.error('Futures socket error:', err);
    },

    async fetch1hVolume({ commit }, symbol) {
      const symbolQuery = `${symbol.toUpperCase()}USDT`;
      try {
        const res = await axios.get('https://fapi.binance.com/fapi/v1/klines', {
          params: {
            symbol: symbolQuery,
            interval: '1h',
            limit: 1
          }
        });

        const candle = res.data[0];
        const close = parseFloat(candle[4]);
        const volumeCoin = parseFloat(candle[5]);
        const volumeUSD = close * volumeCoin;

        commit('setCoinData', {
          symbol: symbol.toUpperCase(),
          data: {
            futuresVolume1h: volumeUSD.toFixed(2)
          }
        });
      } catch (err) {
        console.error(`${symbol} 1h futures volume fetch error:`, err);
      }
    },

    async init1hVolumeForPriorityCoins({ dispatch, state }) {
      state.priorityCoins.forEach((symbol, index) => {
        setTimeout(() => {
          dispatch('fetch1hVolume', symbol);
        }, index * 200); // 200ms gecikmeli istekler
      });
    }
  },

  getters: {
    getCoinData: (state) => (symbol) => state.coins[symbol.toUpperCase()] || null,
    allCoins: (state) => {
      const activeOrder = state.orders.find(order => order.isActive);
      const prioritySet = new Set(state.priorityCoins);
      const coinsArray = Object.entries(state.coins).map(([symbol, data]) => ({ symbol, ...data }));

      const sorted = (() => {
        if (!activeOrder || activeOrder.type === 'default') {
          const priority = [];
          const rest = [];
          for (const coin of coinsArray) {
            if (prioritySet.has(coin.symbol)) priority.push(coin);
            else rest.push(coin);
          }
          return [...priority, ...rest];
        }

        let sortKey;
        switch (activeOrder.type) {
          case 'lastPrice':
            sortKey = 'price';
            break;
          case '24Volume':
            sortKey = 'futuresVolume24h';
            break;
          case '1Volume':
            sortKey = 'futuresVolume1h';
            break;
          case 'priceChangePercent':
            sortKey = 'changePercent24h';
            break;
          default:
            return coinsArray;
        }

        return [...coinsArray].sort((a, b) => {
          const valA = parseFloat(a[sortKey]) || 0;
          const valB = parseFloat(b[sortKey]) || 0;
          return activeOrder.isUp ? valB - valA : valA - valB;
        });
      })();

      return sorted;
    },
    orders: (state) => state.orders.filter(order => order.type !== 'default'),
  }
};

export default futureVolume;