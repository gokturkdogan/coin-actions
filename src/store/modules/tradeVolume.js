import axios from 'axios';

const COINS = [
  'IOSTUSDT', 'XRPUSDT', 'BCHUSDT', 'ETHUSDT',
  'SOLUSDT', 'BNBUSDT', 'BONKUSDT', 'GUNUSDT',
  'FLOKIUSDT', 'ACXUSDT', 'WIFUSDT', 'BOMEUSDT',
  'UNIUSDT', 'TURBOUSDT', 'ZENUSDT', 'ACHUSDT',
  'NEIROUSDT', 'TONUSDT', 'BTCUSDT', 'DOGEUSDT', 'RAYUSDT',
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
  coinData: [],  // her coin için data objesi {symbol, volume30m, buyVolume, sellVolume, buyPercent, sellPercent, liveBuy, liveSell}
  aggTradeSocket: null,
});

const mutations = {
  setCoinVolume(state, { symbol, volume30m, buyVolume, sellVolume, buyPercent, sellPercent }) {
    const idx = state.coinData.findIndex(c => c.symbol === symbol);
    if (idx !== -1) {
      state.coinData[idx] = {
        ...state.coinData[idx],
        volume30m,
        buyVolume,
        sellVolume,
        buyPercent,
        sellPercent
      };
    } else {
      state.coinData.push({
        symbol,
        volume30m,
        buyVolume,
        sellVolume,
        buyPercent,
        sellPercent,
        liveBuy: 0,
        liveSell: 0,
      });
    }
  },

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
  async fetch30mVolumes({ commit }) {
    const now = Date.now();
    const thirtyMinutesAgo = now - (30 * 60 * 1000);

    for (let i = 0; i < COINS.length; i++) {
      const symbol = COINS[i];

      try {
        const res = await axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol,
            interval: '1m',
            startTime: thirtyMinutesAgo,
            endTime: now,
          }
        });

        const klines = res.data;

        let totalQuoteVolume = 0;
        let totalTakerBuyQuoteVolume = 0;

        klines.forEach(kline => {
          totalQuoteVolume += parseFloat(kline[7]);        // quoteVolume (USDT cinsinden)
          totalTakerBuyQuoteVolume += parseFloat(kline[10]); // takerBuyQuoteVolume (USDT cinsinden)
        });

        const totalBuyVolume = totalTakerBuyQuoteVolume;
        const totalSellVolume = totalQuoteVolume - totalBuyVolume;

        commit('setCoinVolume', {
          symbol,
          volume30m: totalQuoteVolume,
          buyVolume: totalBuyVolume,
          sellVolume: totalSellVolume,
          buyPercent: totalBuyVolume / totalQuoteVolume,
          sellPercent: totalSellVolume / totalQuoteVolume
        });

      } catch (error) {
        console.error(`❌ ${symbol} için hacim alınamadı:`, error.message);
      }

      // 300ms delay
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  },

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
