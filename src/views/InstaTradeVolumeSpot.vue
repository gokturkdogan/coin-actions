<template>
  <div class="volume">
    <img class="volume__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="volume__content">
      <List v-if="volumes"/>
    </div>
    <img class="volume__divider" src="../assets/images/backgorunds/divider.svg" alt="">
  </div>
</template>

<script>
import List from '../components/InstaTradeVolume/List.vue';

export default {
  name: "volume",
  data() {
    return {}
  },
  components: {
    List
  },
  created() {
    this.$store.dispatch('instaTradeVolume/startAggTradeSocket');
  },
  beforeUnmount() {
    this.$store.dispatch('instaTradeVolume/stopAggTradeSocket');
  },
  computed: {
    volumes() {
      return this.$store.getters['instaTradeVolume/getCoinData']
    }
  }
};
</script>
<style lang="scss" scoped>
  .volume {
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
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 0 100px;
      color: white;
    }
  }
</style>