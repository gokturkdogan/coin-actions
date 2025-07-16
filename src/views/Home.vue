<template>
  <div class="home">
    <img class="home__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="home__section">
      <Banner @open-modal="openModal" />
      <img class="home__spinner" v-if="!spinner" src="../assets/images/gifs/spinner.gif" alt="spinner">
      <List v-else @open-modal="openModal"/>
    </div>
    <img class="home__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <!-- <Advantages /> -->
    <Modal v-if="isModalShow" @close-modal="closeModal"/>
  </div>
</template>

<script>
import Banner from '../components/Home/Banner.vue';
import List from '../components/Home/List.vue';
import Modal from '../components/Home/Modal.vue';
//import Advantages from '../components/Home/Advantages.vue';
export default {
  name: "home",
  data() {
    return {
      isModalShow: false
    }
  },
  components: {
    Banner,
    List,
    Modal,
    //Advantages
  },
  created() {
    this.$store.dispatch('coins/connectWebSocketForHome');
  },
  beforeUnmount() {
    this.$store.dispatch('coins/disconnectWebSocketForHome');
  },
  methods: {
    openModal() {
      this.isModalShow = true;
    },
    closeModal() {
      this.isModalShow = false;
    }
  },
  computed: {
    spinner() {
      return this.$store.getters['coins/spinnerHome'] 
    }
  }
};
</script>
<style lang="scss" scoped>
  .home {
    &__section {
      background-image: url('../assets/images/backgorunds/home-banner.svg');
      padding: 0 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__spinner {
      margin-top: 50px;
    }

    &__divider {
      width: 100%;
    }
  }
</style>