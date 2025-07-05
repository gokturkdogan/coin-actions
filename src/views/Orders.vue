<template>
  <div class="orders">
    <img class="orders__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="orders__content">
      <List v-if="orders"/>
    </div>
    <img class="orders__divider" src="../assets/images/backgorunds/divider.svg" alt="">
  </div>
</template>

<script>
import List from '../components/Orders/List.vue';

export default {
  name: "orders",
  data() {
    return {}
  },
  components: {
    List
  },
  created() {
    this.$store.dispatch('orderList/initOrderList');
  },
  beforeUnmount() {
    this.$store.dispatch('orderList/stopOrderList');
  },
  computed: {
    orders() {
      return this.$store.getters['orderList/allOrders']
    },
  }
};
</script>
<style lang="scss" scoped>
  .orders {
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