<template>
  <div class="register">
    <div class="register__container">
      <Form />
    </div>
  </div>
</template>

<script>
import Form from '../components/Register/Form.vue';
export default {
  name: "register",
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
  .register {
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