<template>
  <div class="volume">
    <TheHeader :current-route="currentRoute"/>
    <InstaTradeVolume />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import InstaTradeVolume from '../views/InstaTradeVolume.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "spot-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    InstaTradeVolume,
    TheFooter
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
.volume {
  background-color: #080713;
  min-height: 100vh;
}
</style>