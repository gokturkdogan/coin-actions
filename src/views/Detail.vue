<template>
  <div class="detail">
    <img class="detail__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="detail__header">
      <Header v-if="tickerData && oldVolumes" :coin-symbol="coinSymbol" :ticker-data="tickerData" :old-volumes="oldVolumes" />
    </div>
    <div class="detail__content">
      <Orders v-if="depthData && tickerData" :depth-data="depthData"  :last-price="tickerData.lastPrice" />
      <Trades v-if="trades" :trades="trades":symbol="coinSymbol" />
    </div>
    <img class="detail__divider" src="../assets/images/backgorunds/divider.svg" alt="">
  </div>
</template>

<script>
import Header from '../components/Detail/Header.vue';
import Orders from '../components/Detail/Orders.vue';
import Trades from '../components/Detail/Trades.vue';
export default {
  name: "list",
  data() {
    return {}
  },
  components: {
    Header,
    Orders,
    Trades
  },
  props: {
    symbol: {
      type: String,
      required: true
    }
  },
  created() {
    //this.$store.dispatch('coinDetail/openCoinDetail', symbol);
  },
  beforeUnmount() {
    this.$store.dispatch('coinDetail/closeCoinDetail');
  },
  methods: {

  },
  computed: {
    coinSymbol() {
      return this.$store.getters['coinDetail/coinSymbol']
    },
    tickerData() {
      return this.$store.getters['coinDetail/tickerData']
    },
    depthData() {
      return this.$store.getters['coinDetail/depthData']
    },
    oldVolumes() {
      return this.$store.getters['coinDetail/historicalVolumes']
    },
    klineData() {
      return this.$store.getters['coinDetail/klineData']
    },
    trades() {
      return this.$store.getters['coinDetail/trades']
    }
  }
};
</script>
<style lang="scss" scoped>
  .detail {
    background-image: url('../assets/images/backgorunds/home-banner.svg');

    &__divider {
      width: 100%;
    }

    &__header {
      padding: 0 100px;
    }

    &__content {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      padding: 0 100px;
    }
  }
</style>