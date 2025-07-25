import axios from 'axios';

const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
const idToSymbol = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  binancecoin: 'BNBUSDT',
  solana: 'SOLUSDT',
  ripple: 'XRPUSDT',
};

let socket = null;
let manuallyClosed = false;

const LOCAL_STORAGE_KEY = 'home_coin_logos';

// Reconnect limit ayarları
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const home = {
  namespaced: true,

  state: () => ({
    prices: {},
    logos: {},
  }),

  mutations: {
    SET_PRICE(state, { symbol, data }) {
      state.prices = { ...state.prices, [symbol]: data };
    },
    CLEAR_PRICES(state) {
      state.prices = {};
    },
    setLogos(state, logos) {
      state.logos = logos;
    },
  },

  actions: {
    async fetchLogos({ commit }) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          const logos = JSON.parse(cached);
          commit('setLogos', logos);
          return;
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }

      const ids = Object.keys(idToSymbol).join(',');
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids,
          },
        });
        const logos = {};
        response.data.forEach(coin => {
          const symbol = idToSymbol[coin.id];
          if (symbol) logos[symbol] = coin.image;
        });
        commit('setLogos', logos);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logos));
      } catch (error) {
        console.error('Logo fetch hatası:', error);
      }
    },

    connectPriceSocket({ commit, dispatch }) {
      if (socket) return;

      reconnectAttempts = 0; // Bağlantı açılırken sıfırla

      const streamString = symbols.map(s => s.toLowerCase() + '@ticker').join('/');
      socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamString}`);

      socket.onopen = () => {
        console.log('Home WebSocket bağlantısı açıldı.');
        reconnectAttempts = 0; // başarılı açılışta sıfırla
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const msg = parsed.data;
          const symbol = msg.s;
          const price = Number(msg.c);
          const change = Number(msg.P);

          commit('SET_PRICE', {
            symbol,
            data: { symbol, price, change },
          });
        } catch (err) {
          console.error('WebSocket parse error:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('Home WebSocket hatası:', err);
      };

      socket.onclose = () => {
        console.warn('Home WebSocket kapatıldı.');
        socket = null;

        if (!manuallyClosed) {
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(() => {
              console.log(`Yeniden bağlantı denemesi ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
              manuallyClosed = false;
              dispatch('connectPriceSocket');
            }, 3000);
          } else {
            console.warn('Reconnect deneme limiti aşıldı, otomatik yeniden bağlantı durduruldu.');
          }
        }
      };
    },

    disconnectPriceSocket({ commit }) {
      if (socket) {
        manuallyClosed = true;
        socket.close();
        socket = null;
        commit('CLEAR_PRICES');
        console.log('Home WebSocket manuel olarak kapatıldı.');
      }
    },
  },

  getters: {
    getCoinPrice: (state) => (symbol) => state.prices[symbol] || null,
    allPrices: (state) => state.prices,
    getLogos: (state) => state.logos,
  },
};

export default home;