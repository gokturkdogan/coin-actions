<template>
  <div>
    <router-view />
    <Notify />
  </div>
</template>

<script>
import Notify from './components/Base/Notify.vue'
export default {
  name: "App",
  data() {
    return {}
  },
  components: {
    Notify
  },
  created() {},
  methods: {},
};
</script>