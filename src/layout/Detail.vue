<template>
  <div class="detail">
    <TheHeader :current-route="currentRoute"/>
    <Detail v-if="symbol" :symbol="symbol"/>
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import Detail from '../views/Detail.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "main-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    Detail,
    TheFooter
  },
  props: {
    symbol: {
      type: String
    }
  },
  created() { },
  methods: {},
  computed: {
    currentRoute() {
      return this.$router.currentRoute._value.name
    }
  } 
};
</script>
<style lang="scss" scoped>
.detail {
  background-color: #080713;
  min-height: 100vh;
}
</style>