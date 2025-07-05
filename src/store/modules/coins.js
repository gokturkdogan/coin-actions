import axios from 'axios';

const coins = {
  namespaced: true,
  state: () => ({
    coinsData: [],
    socket: null,
    futuresSocket: null,
    logos: {},
    previousPrices: {},
    coinsDataList: [],
    socketList: null,
    logosList: {},
    previousPricesList: {},
    futuresDataMap: {},
    orders: [
      { text: 'Temizle', type: 'default', isUp: false, isActive: true },
      { text: 'Fiyat', type: 'lastPrice', isUp: false, isActive: false },
      { text: 'Spot Hacim', type: 'totalQuoteVolume', isUp: false, isActive: false },
      { text: 'Vadeli Hacim', type: 'futuresQuoteVolume', isUp: false, isActive: false },
      { text: '24s Değişim', type: 'priceChangePercent', isUp: false, isActive: false }
    ],
  }),

  mutations: {
    setCoinsData(state, payload) {
      state.coinsData = payload;
    },
    setPreviousPrices(state, payload) {
      state.previousPrices = payload;
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
    setFuturesSocket(state, socket) {
      state.futuresSocket = socket;
    },
    setLogos(state, logos) {
      state.logos = logos;
    },
    setCoinsDataList(state, payload) {
      state.coinsDataList = payload;
    },
    setPreviousPricesList(state, payload) {
      state.previousPricesList = payload;
    },
    setSocketList(state, socket) {
      state.socketList = socket;
    },
    setLogosList(state, logos) {
      state.logosList = logos;
    },
    setFuturesDataMap(state, dataMap) {
      state.futuresDataMap = dataMap;
    },
    setOrders(state, payload) {
      state.orders = payload;
    }
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
        const previousPrices = state.previousPrices;
        const currentCoinsMap = {};
        state.coinsData.forEach(coin => {
          currentCoinsMap[coin.symbol] = coin;
        });
        rawData
          .filter(item => selectedSymbols.includes(item.s))
          .forEach(item => {
            const symbol = item.s.replace('USDT', '');
            const newPriceNum = Number(item.c);
            const prevPrice = previousPrices[symbol];
            let changeClass = '';
            if (prevPrice !== undefined) {
              if (newPriceNum > prevPrice) changeClass = '-up';
              else if (newPriceNum < prevPrice) changeClass = '-down';
            }
            currentCoinsMap[symbol] = {
              symbol,
              lastPrice: newPriceNum.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              priceChangePercent: Number(item.P).toFixed(2),
              logoUrl: logos[item.s] || '',
              changeClass,
            };
          });
        const combinedData = Object.values(currentCoinsMap).sort((a, b) =>
          order.indexOf(a.symbol + 'USDT') - order.indexOf(b.symbol + 'USDT')
        );
        const newPreviousPrices = {};
        combinedData.forEach(item => {
          newPreviousPrices[item.symbol] = Number(item.lastPrice.replace(/,/g, ''));
        });
        commit('setPreviousPrices', newPreviousPrices);
        commit('setCoinsData', combinedData);
        setTimeout(() => {
          const clearedData = combinedData.map(item => ({ ...item, changeClass: '' }));
          commit('setCoinsData', clearedData);
        }, 1500);
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
    async fetchLogosForList({ commit }) {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
          },
        });
        const logos = {};
        response.data.forEach(coin => {
          logos[coin.symbol.toUpperCase() + 'USDT'] = coin.image;
        });
        commit('setLogosList', logos);
      } catch (error) {
        console.error('Logo listesi fetch hatası:', error);
      }
    },
    async connectWebSocketForList({ commit, state, dispatch }) {
      if (state.socketList) return;
      await dispatch('fetchLogosForList');
      await dispatch('connectFuturesWebSocket'); // Vadeli socketi bağla
      const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      socket.onmessage = (event) => {
        const rawData = JSON.parse(event.data);
        const logos = state.logosList;
        const fixedOrder = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
        const filteredData = rawData.filter(item => item.s.endsWith('USDT'));
        const currentCoinsMap = {};
        state.coinsDataList.forEach(coin => {
          currentCoinsMap[coin.symbol] = coin;
        });
        filteredData.forEach(item => {
          const symbol = item.s.replace('USDT', '');
          const newPriceNum = Number(item.c);
          const formattedPrice = newPriceNum.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 10
          });
          const prevPrice = state.previousPricesList[symbol];
          let changeClass = '';
          if (prevPrice !== undefined) {
            if (newPriceNum > prevPrice) changeClass = '-up';
            else if (newPriceNum < prevPrice) changeClass = '-down';
          }
          const futuresData = state.futuresDataMap?.[item.s] || {};
          currentCoinsMap[symbol] = {
            symbol,
            lastPrice: formattedPrice,
            priceChangePercent: Number(item.P).toFixed(2),
            logoUrl: logos[item.s] || '',
            changeClass,
            totalVolume: Number(item.v).toFixed(3), // Spot coin cinsinden hacim, nokta ve 5 basamak
            totalQuoteVolume: Number(item.q).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }), // Spot USD hacim
            futuresVolume: futuresData.futuresVolume
              ? Number(futuresData.futuresVolume).toFixed(3)
              : '0.00000', // Vadeli coin hacim
            futuresQuoteVolume: futuresData.futuresQuoteVolume
              ? Number(futuresData.futuresQuoteVolume).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : '0.00' // Vadeli USD hacim
          };
        });
        let combinedData = Object.values(currentCoinsMap);
        const activeOrder = state.orders.find(order => order.isActive);
        const orderType = activeOrder?.type;
        const isUp = activeOrder?.isUp;
        if (orderType !== 'default') {
          combinedData.sort((a, b) => {
            const aVal = Number((a[orderType] || '0').toString().replace(/,/g, ''));
            const bVal = Number((b[orderType] || '0').toString().replace(/,/g, ''));
            return isUp ? bVal - aVal : aVal - bVal;
          });
        } else {
          combinedData.sort((a, b) => {
            const aIndex = fixedOrder.indexOf(a.symbol + 'USDT');
            const bIndex = fixedOrder.indexOf(b.symbol + 'USDT');
            const aPos = aIndex === -1 ? fixedOrder.length : aIndex;
            const bPos = bIndex === -1 ? fixedOrder.length : bIndex;
            return aPos - bPos;
          });
        }
        const newPreviousPricesList = {};
        combinedData.forEach(item => {
          newPreviousPricesList[item.symbol] = Number(item.lastPrice.replace(/,/g, ''));
        });
        commit('setPreviousPricesList', newPreviousPricesList);
        commit('setCoinsDataList', [...combinedData]);
        setTimeout(() => {
          const cleaned = state.coinsDataList.map(item => ({ ...item, changeClass: '' }));
          commit('setCoinsDataList', cleaned);
        }, 1500);
      };
      socket.onerror = (error) => console.error('WebSocket list hatası:', error);
      socket.onclose = () => {
        console.log('WebSocket list kapandı');
        commit('setSocketList', null);
      };
      commit('setSocketList', socket);
    },
    disconnectWebSocketForList({ state, commit }) {
      if (state.socketList) {
        state.socketList.close();
        commit('setSocketList', null);
      }
      if (state.futuresSocket) {
        state.futuresSocket.close();
        commit('setFuturesSocket', null);
      }
    },
    connectFuturesWebSocket({ commit, state }) {
      if (state.futuresSocket) return;
      const socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
      socket.onmessage = (event) => {
        const rawData = JSON.parse(event.data);
        const futuresDataMap = { ...state.futuresDataMap };
        rawData.forEach(item => {
          futuresDataMap[item.s] = {
            futuresVolume: Number(item.v),       // Coin cinsinden vadeli hacim
            futuresQuoteVolume: Number(item.q),  // USD cinsinden vadeli hacim
          };
        });
        commit('setFuturesDataMap', futuresDataMap);
      };
      socket.onerror = (err) => console.error('Futures socket error:', err);
      socket.onclose = () => commit('setFuturesSocket', null);
      commit('setFuturesSocket', socket);
    },
    setOrderBy({ state, commit }, { type, isUp }) {
      const updatedOrders = state.orders.map(order => {
        if (order.type === type) {
          return { ...order, isActive: true, isUp };
        }
        return { ...order, isActive: false };
      });
      commit('setOrders', updatedOrders);
    }
  },
  getters: {
    coinsData: (state) => state.coinsData,
    coinsDataList: (state) => state.coinsDataList,
    orders: (state) => state.orders.filter(order => order.type !== 'default'),
    activeOrder: (state) => state.orders.find(order => order.isActive),
  },
};

export default coins;
