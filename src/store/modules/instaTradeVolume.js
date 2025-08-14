const COINS = [
  "DMCUSDT",
  "MYXUSDT",
  "VELVETUSDT",
  "SWELLUSDT",
  "EPICUSDT",
  "DMCUSDT",
  "SPELLUSDT",
  "SOONUSDT",
  "SYRUPUSDT",
  "PROVEUSDT",
  "OMNIUSDT",
  "ILVUSDT",
  "OMUSDT",
  "1000BOBUSDT",
  "BIDUSDT",
  "POLUSDT",
  "REZUSDT",
  "DUSKUSDT",
  "PUMPUSDT",
  "1INCHUSDT",
  "OGUSDT",
  "BELUSDT",
  "EIGENUSDT",
  "THEUSDT",
  "AMPUSDT",
  "WUSDT",
  "LDOUSDT",
  "PENDLEUSDT",
  "ETHFIUSDT",
  "PEPEUSDT",
  "ALTUSDT",
  "PNUTUSDT",
  "VIRTUALUSDT",
  "ENAUSDT",
  "TURBOUSDT",
  "1MBABYDOGEUSDT",
  "ALGOUSDT",
  "HBARUSDT",
  "RAYUSDT",
  "WIFUSDT",
  "NEIROUSDT",
  "SUIUSDT",
  "TIAUSDT",
  "ADAUSDT",
  "CRVUSDT",
  "PENGUUSDT",
  "FILUSDT",
  "CVXUSDT",
  "AUCTIONUSDT",
  "APEUSDT",
  "PORTALUSDT",
  "BOMEUSDT",
  "UNIUSDT",
  "WLDUSDT",
  "NEARUSDT",
  "HYPERUSDT",
  "BROCCOLI714USDT",
  "FUNUSDT",
  "MAGICUSDT",
  "KERNELUSDT",
  "ZROUSDT",
  "RSRUSDT",
  "XLMUSDT",
  "SPXUSDT",
  "SAGAUSDT",
  "SPKUSDT",
  "ASRUSDT",
  "FUNUSDT",
  "TREEUSDT",
  "MEMEUSDT",
  "TONUSDT"
];

const state = () => ({
  coinData: [],  // her coin için data objesi {symbol, volume30m, buyVolume, sellVolume, buyPercent, sellPercent, liveBuy, liveSell}
  aggTradeSocket: null,
});

const mutations = {

  setCoinTradeVolume(state, { symbol, buyVolume, sellVolume }) {
    const idx = state.coinData.findIndex(c => c.symbol === symbol);
    if (idx !== -1) {
      state.coinData[idx] = {
        ...state.coinData[idx],
        liveBuy: buyVolume,
        liveSell: sellVolume,
      };
    } else {
      state.coinData.push({
        symbol,
        liveBuy: buyVolume,
        liveSell: sellVolume,
        volume30m: 0,
        buyVolume: 0,
        sellVolume: 0,
        buyPercent: 0,
        sellPercent: 0,
      });
    }
  },

  setAggTradeSocket(state, socket) {
    state.aggTradeSocket = socket;
  },

  clearAggTradeSocket(state) {
    if (state.aggTradeSocket) {
      state.aggTradeSocket.onmessage = null;
      state.aggTradeSocket.onerror = null;
      state.aggTradeSocket.onclose = null;
      if (state.aggTradeSocket.readyState !== WebSocket.CLOSED) {
        state.aggTradeSocket.close();
      }
    }
    state.aggTradeSocket = null;
  }
};

const actions = {

  startAggTradeSocket({ commit, state }) {
    if (state.aggTradeSocket) {
      console.log('aggTrades websocket zaten açık, kapatılıyor...');
      commit('clearAggTradeSocket');
    }

    const streams = COINS.map(sym => sym.toLowerCase() + '@aggTrade').join('/');

    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    const volumeMap = {};
    COINS.forEach(symbol => {
      volumeMap[symbol] = { buy: 0, sell: 0 };
    });

    ws.onopen = () => {
      console.log('aggTrades websocket bağlantısı açıldı ✅');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const data = msg.data;

        const symbol = data.s;
        const price = parseFloat(data.p);
        const qty = parseFloat(data.q);
        const volume = price * qty;
        const isSell = data.m;

        if (!volumeMap[symbol]) {
          volumeMap[symbol] = { buy: 0, sell: 0 };
        }

        if (isSell) {
          volumeMap[symbol].sell += volume;
        } else {
          volumeMap[symbol].buy += volume;
        }

        commit('setCoinTradeVolume', {
          symbol,
          buyVolume: volumeMap[symbol].buy,
          sellVolume: volumeMap[symbol].sell,
        });
      } catch (e) {
        console.error('aggTrade websocket mesaj işlenirken hata:', e);
      }
    };

    ws.onerror = (err) => {
      console.error('aggTrades websocket hatası:', err);
    };

    ws.onclose = () => {
      console.log('aggTrades websocket kapandı ❌');
      commit('clearAggTradeSocket');
    };

    commit('setAggTradeSocket', ws);
  },

  stopAggTradeSocket({ commit }) {
    console.log('aggTrades websocket kapanıyor....')
    commit('clearAggTradeSocket');
  }
};

const getters = {
  getCoinData: (state) => state.coinData,
  getCoinBySymbol: (state) => (symbol) => state.coinData.find(c => c.symbol === symbol) || null,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
