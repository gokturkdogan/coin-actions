<template>
  <div class="volume">
    <TheHeader :current-route="currentRoute"/>
    <FutureVolume />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import FutureVolume from '../views/FutureVolume.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "book-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    FutureVolume,
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