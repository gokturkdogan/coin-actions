<template>
  <div class="book">
    <img class="book__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="book__content">
      <List v-if="orders"/>
    </div>
    <img class="book__divider" src="../assets/images/backgorunds/divider.svg" alt="">
  </div>
</template>

<script>
import List from '../components/Book/List.vue';

export default {
  name: "book",
  data() {
    return {}
  },
  components: {
    List
  },
  created() {
    this.$store.dispatch('orderBook/initOrderBooks');
  },
  beforeUnmount() {
    this.$store.dispatch('orderBook/stopOrderBooks');
  },
  computed: {
    orders() {
      return this.$store.getters['orderBook/allOrderBookOrders']
    },
  }
};
</script>
<style lang="scss" scoped>
  .book {
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