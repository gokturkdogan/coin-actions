<template>
  <div class="list">
    <img class="list__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="list__section">
      <List @open-modal="openModal"/>
    </div>
    <img class="list__divider" src="../assets/images/backgorunds/divider.svg" alt="">
  </div>
</template>

<script>
import List from '../components/List/List.vue';
export default {
  name: "list",
  data() {
    return {}
  },
  components: {
    List
  },
  created() {
    this.$store.dispatch('coins/connectWebSocketForList');
  },
  beforeUnmount() {
    this.$store.dispatch('coins/disconnectWebSocketForList');
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
  .list {
    &__section {
      background-image: url('../assets/images/backgorunds/home-banner.svg');
      padding: 0 50px;
    }

    &__divider {
      width: 100%;
    }
  }
</style>