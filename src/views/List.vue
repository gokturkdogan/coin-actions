<template>
  <div class="list">
    <img class="list__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="list__section">
      <List />
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
    this.$store.dispatch('coinList/connectTickerSocket');
  },
  beforeUnmount() {
    this.$store.dispatch('coinList/disconnectTickerSocket');
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.list {
  @media (max-width: 768px) {
    overflow: scroll;
  }

  &__section {
    background-image: url('../assets/images/backgorunds/home-banner.svg');
    padding: 0 50px;

      @media (max-width: 768px) {
        padding: 0 5px;
      }
    }

    &__divider {
      width: 100%;

      @media (max-width: 768px) {
        margin: 50px 0;
      }
    }
  }
</style>