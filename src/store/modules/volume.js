import axios from 'axios';

const COINS = [
  'IOSTUSDT', 'XRPUSDT', 'BCHUSDT', 'ETHUSDT',
  'SOLUSDT', 'BNBUSDT', 'BONKUSDT', 'GUNUSDT',
  'FLOKIUSDT', 'ACXUSDT', 'WIFUSDT', 'BOMEUSDT',
  'UNIUSDT', 'TURBOUSDT', 'ZENUSDT', 'ACHUSDT',
  'NEIROUSDT', 'TONUSDT','BTCUSDT', 'DOGEUSDT', 'RAYUSDT',
  '1MBABYDOGEUSDT', 'PNUTUSDT', 'EIGENUSDT', 'SYNUSDT',
  'RSRUSDT', 'SUPERUSDT', 'CFXUSDT', 'PEPEUSDT', 'WOOUSDT',
  'JUPUSDT', 'APEUSDT', 'TWTUSDT', 'FUNUSDT',
  'ARKUSDT', 'LOKAUSDT', 'BIGTIMEUSDT',
  'HMSTRUSDT', 'MASKUSDT', 'ARBUSDT', 'ALTUSDT', 'AUCTIONUSDT',
  'PENGUUSDT', 'PENDLEUSDT', 'KAVAUSDT', 'APTUSDT', 'YFIUSDT',
  'WUSDT', 'SEIUSDT', 'SUIUSDT', 'JTOUSDT', 'TRUMPUSDT',
  'TAOUSDT', 'BANANAUSDT'
];

const state = () => ({
  coinData: [],
  socket: null,
  lastKlineCloseTime: null,
  fetchedCoins: [],
  liveKlineFetchedCoins: []
});

const mutations = {
  setCoinData(state, { symbol, data }) {
    const index = state.coinData.findIndex(c => c.symbol === symbol);
    if (index !== -1) {
      state.coinData[index] = { ...state.coinData[index], ...data };
    } else {
      state.coinData.push({ symbol, ...data });
    }
  },

  setSocket(state, socket) {
    state.socket = socket;
  },

  clearSocket(state) {
    if (state.socket) {
      state.socket.onmessage = null;
      state.socket.onerror = null;
      state.socket.onclose = null;
      if (state.socket.readyState !== WebSocket.CLOSED) {
        state.socket.close();
      }
    }
    state.socket = null;
  },

  setLastKlineCloseTime(state, closeTime) {
    state.lastKlineCloseTime = closeTime;
  },

  markCoinAsFetched(state, symbol) {
    if (!state.fetchedCoins.includes(symbol)) {
      state.fetchedCoins.push(symbol);
    }
  },

  resetFetchedCoins(state) {
    state.fetchedCoins = [];
  },

  markLiveKlineFetched(state, symbol) {
  if (!state.liveKlineFetchedCoins.includes(symbol)) {
    state.liveKlineFetchedCoins.push(symbol);
  }
},
};

const actions = {
  async fetchPreviousKline({ commit, state, dispatch }, symbol) {
    if (state.fetchedCoins.includes(symbol)) return;
    try {
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=2`;
      const res = await axios.get(url);
      const klines = res.data;
      if (klines.length < 2) return;
      const previousKlineRaw = klines[0];
      const previousKline = {
        openTime: previousKlineRaw[0],
        closeTime: previousKlineRaw[6],
        quoteAssetVolume: Number(previousKlineRaw[7])
      };
      commit('setCoinData', { symbol, data: { previousKline } });
      commit('setLastKlineCloseTime', previousKline.closeTime);
      commit('markCoinAsFetched', symbol);
      dispatch('fetchAggTradesForCoin', { symbol, openTime: previousKline.openTime, closeTime: previousKline.closeTime });
    } catch (e) {
      console.error(`fetchPreviousKline hata (${symbol}):`, e);
    }
  },
  async fetchAllPreviousKlinesWithDelay({ dispatch }) {
    for (const symbol of COINS) {
      await dispatch('fetchPreviousKline', symbol);
      await new Promise(res => setTimeout(res, 300));
    }
  },
  async fetchAggTradesForCoin({ commit, state }, { symbol, openTime, closeTime }) {
    try {
      const url = `https://api.binance.com/api/v3/aggTrades`;
      const res = await axios.get(url, {
        params: {
          symbol,
          startTime: openTime,
          endTime: closeTime,
          limit: 1000,
        }
      });
      const trades = res.data;
      let totalBuyVolume = 0;
      let totalSellVolume = 0;
      trades.forEach(trade => {
        const qty = parseFloat(trade.q);
        const price = parseFloat(trade.p);
        const tradeVolume = qty * price;

        if (trade.m) {
          totalSellVolume += tradeVolume;
        } else {
          totalBuyVolume += tradeVolume;
        }
      });

      const totalVolume = totalBuyVolume + totalSellVolume;
      if (totalVolume === 0) {
        console.log(`${symbol} AggTrades: Veri yok veya hacim sıfır.`);
        return;
      }

      const buyPercent = totalBuyVolume / totalVolume;
      const sellPercent = totalSellVolume / totalVolume;

      commit('setCoinData', {
        symbol,
        data: {
          previousKlineBuyPercent: buyPercent,
          previousKlineSellPercent: sellPercent
        }
      });

    } catch (e) {
      console.error(`AggTrades isteği hata (${symbol}):`, e);
    }
  },
  async fetchAggTradesForCoinLiveKline({ commit, state }, { symbol }) {
    console.log(symbol)
    try {
      const coin = state.coinData.find(c => c.symbol === symbol);
      if (!coin || !coin.liveKline) return;

      const openTime = coin.liveKline.openTime;
      const closeTime = Date.now();

      const url = `https://api.binance.com/api/v3/aggTrades`;
      const res = await axios.get(url, {
        params: {
          symbol,
          startTime: openTime,
          endTime: closeTime,
          limit: 1000,
        }
      });

      const trades = res.data;
      let totalBuyVolume = 0;
      let totalSellVolume = 0;

      trades.forEach(trade => {
        const qty = parseFloat(trade.q);
        const price = parseFloat(trade.p);
        const tradeVolume = qty * price;

        if (trade.m) {
          totalSellVolume += tradeVolume;
        } else {
          totalBuyVolume += tradeVolume;
        }
      });

      const totalVolume = totalBuyVolume + totalSellVolume;
      console.log(totalVolume)
      if (!totalVolume) {
        console.log(`${symbol} (LiveKline) AggTrades: Veri yok veya hacim sıfır.`);
        return;
      }

      const buyPercent = totalBuyVolume / totalVolume;
      const sellPercent = totalSellVolume / totalVolume;
      console.log(buyPercent)
      console.log(sellPercent)
      commit('setCoinData', {
        symbol,
        data: {
          liveKlineBuyPercent: buyPercent,
          liveKlineSellPercent: sellPercent
        }
      });

    } catch (e) {
      console.error(`AggTrades (LiveKline) isteği hata (${symbol}):`, e);
    }
  },

  connectKlineSocket({ commit, dispatch, state }) {
    if (state.socket) {
      console.log('Saatlik hacim websocket zaten açık, kapatılıyor...');
      commit('clearSocket');
    }

    const streams = COINS.map(s => s.toLowerCase() + '@kline_1h').join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onopen = () => {
      console.log('Saatlik hacim websocket bağlandı ✅');
      dispatch('fetchAllPreviousKlinesWithDelay');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const kline = msg.data.k;
        const symbol = msg.data.s;

        const liveKline = {
          openTime: kline.t,
          closeTime: kline.T,
          quoteAssetVolume: Number(kline.q),
          isFinal: kline.x,
        };

        commit('setCoinData', { symbol, data: { liveKline } });
        if (!state.liveKlineFetchedCoins.includes(symbol)) {
          dispatch('fetchAggTradesForCoinLiveKline', { symbol });
          commit('markLiveKlineFetched', symbol);
        }

        if (liveKline.isFinal && liveKline.closeTime !== state.lastKlineCloseTime) {
          console.log('mum kapandı eski mum saatleri değişecek')
          commit('setLastKlineCloseTime', liveKline.closeTime);
          dispatch('fetchPreviousKline', symbol);
        }
      } catch (e) {
        console.error('Socket mesaj işleme hatası:', e);
      }
    };

    ws.onerror = (err) => {
      console.error('Saatlik hacim websocket hatası:', err);
    };

    ws.onclose = () => {
      console.log('Saatlik hacim websocket kapandı ❌');
      commit('clearSocket');
    };

    commit('setSocket', ws);
  },

  disconnectKlineSocket({ commit }) {
    console.log('Saatlik hacim websocket kapanıyor...');
    commit('clearSocket');
    commit('resetFetchedCoins');
  }
};

const getters = {
  getCoinData: (state) => state.coinData,

  getCoinBySymbol: (state) => (symbol) =>
    state.coinData.find(c => c.symbol === symbol) || null,

  getTopVolumeCoins: (state) => {
    return [...state.coinData]
      .filter(c => c.liveKline && c.liveKline.quoteAssetVolume)
      .sort((a, b) =>
        parseFloat(b.liveKline.quoteAssetVolume) - parseFloat(a.liveKline.quoteAssetVolume)
      )
      .slice(0, 10);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};