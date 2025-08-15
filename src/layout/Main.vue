<template>
  <div class="main">
    <TheMobileHeader :current-route="currentRoute"/>
    <TheHeader :current-route="currentRoute"/>
    <Home />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import Home from '../views/Home.vue'
import TheFooter from '../components/Base/TheFooter.vue'
import TheMobileHeader from '../components/Base/MobileHeader.vue'
export default {
  name: "main-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    Home,
    TheFooter,
    TheMobileHeader
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
.main {
  background-color: #080713;
  min-height: 100vh;
}
</style>