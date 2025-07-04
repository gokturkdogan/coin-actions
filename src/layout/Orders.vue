<template>
  <div class="orders">
    <TheHeader :current-route="currentRoute"/>
    <Orders />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import Orders from '../views/Orders.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "orders-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    Orders,
    TheFooter
  },
  props: {
    symbol: {
      type: String
    }
  },
  created() { 
    this.$store.dispatch('orderList/initOrderList');
  },
  beforeUnmount() {
    this.$store.dispatch('orderList/stopOrderList');
  },
  methods: {},
  computed: {
    currentRoute() {
      return this.$router.currentRoute._value.name
    },
    allOrders() {
      return this.$store.getters['orderList/allOrders']
    }
  } 
};
</script>
<style lang="scss" scoped>
.orders {
  background-color: #080713;
  min-height: 100vh;
  color: red;
}
</style>