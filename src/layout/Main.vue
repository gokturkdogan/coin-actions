<template>
  <div class="main">
    <TheHeader />
    <Home />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import Home from '../views/Home.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "main-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    Home,
    TheFooter
  },
  created() { },
  methods: {},
};
</script>
<style lang="scss" scoped>
.main {
  background-color: #080713;
  min-height: 100vh;
}
</style>