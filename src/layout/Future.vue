<template>
  <div class="volume">
    <TheHeader :current-route="currentRoute"/>
    <Future />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import Future from '../views/Future.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "future-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    Future,
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