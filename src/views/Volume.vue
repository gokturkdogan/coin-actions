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
import List from '../components/Volume/List.vue';

export default {
  name: "volume",
  data() {
    return {}
  },
  components: {
    List
  },
  created() {
    this.$store.dispatch('volume/connectKlineSocket');
  },
  beforeUnmount() {
    this.$store.dispatch('volume/disconnectKlineSocket');
  },
  computed: {
    volumes() {
      return this.$store.getters['volume/getCoinData']
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
      padding: 0 100px;
      color: white;
    }
  }
</style>