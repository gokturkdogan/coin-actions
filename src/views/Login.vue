<template>
  <div class="login">
    <div class="login__container">
      <Form />
    </div>
  </div>
</template>

<script>
import Form from '../components/Login/Form.vue';
export default {
  name: "login",
  data() {
    return {}
  },
  components: {
    Form
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
  .login {
        background-image: linear-gradient(0deg, #070710, #591AA9);
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;

    &__container {
        display: flex;
        justify-content: center;
    }
  }
</style>