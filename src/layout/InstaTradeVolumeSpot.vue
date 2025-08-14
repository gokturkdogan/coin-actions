<template>
  <div class="volume">
    <TheHeader :current-route="currentRoute"/>
    <InstaTradeVolumeSpot />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import InstaTradeVolumeSpot from '../views/InstaTradeVolumeSpot.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "spot-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    InstaTradeVolumeSpot,
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