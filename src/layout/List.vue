<template>
  <div class="main">
    <TheHeader :current-route="currentRoute"/>
    <List />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import List from '../views/List.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "main-list",
  data() {
    return {}
  },
  components: {
    TheHeader,
    List,
    TheFooter
  },
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