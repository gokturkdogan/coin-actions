<template>
  <div>
    <UnLoggedInLayout/>
  </div>
</template>

<script>
import UnLoggedInLayout from './layout/UnLoggedIn.vue';
export default {
  name: "App",
  data() {
    return {
      isLogin: false
    }
  },
  components: {
    UnLoggedInLayout
  },
  created() {
    this.$store.dispatch('login/checkLogin');
  },
  methods: {},
};
</script>