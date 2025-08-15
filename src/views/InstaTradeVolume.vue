<template>
  <div class="volume">
    <img class="volume__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="volume__content">
      <ListFuture v-if="volumesFuture" />
    </div>
    <img class="volume__divider" src="../assets/images/backgorunds/divider.svg" alt="">
  </div>
</template>

<script>
import ListFuture from '../components/InstaTradeVolume/ListFuture.vue';

export default {
  name: "volume",
  data() {
    return {}
  },
  components: {
    ListFuture
  },
  created() {
    this.$store.dispatch('instaFutureTradeVolume/startAggTradeSocket');
  },
  beforeUnmount() {
    this.$store.dispatch('instaFutureTradeVolume/stopAggTradeSocket');
  },
  computed: {
    volumesFuture() {
      return this.$store.getters['instaFutureTradeVolume/getCoinData']
    }
  }
};
</script>
<style lang="scss" scoped>
.volume {
  background-image: url('../assets/images/backgorunds/home-banner.svg');

  &__divider {
    width: 100%;

    @media (max-width: 768px) {
      margin: 50px 0;
    }
  }

  &__content {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 100px;
    color: white;

      @media (max-width: 768px) {
        padding: 10px 20px;
      }
    }
  }
</style>