<template>
  <div class="home">
    <img class="home__divider" src="../assets/images/backgorunds/divider.svg" alt="">
    <div class="home__section">
      <Banner />
      <List/>
    </div>
    <img class="home__divider" src="../assets/images/backgorunds/divider.svg" alt="">
  </div>
</template>

<script>
import Banner from '../components/Home/Banner.vue';
import List from '../components/Home/List.vue';

export default {
  name: "home",
  data() {
    return {
      isModalShow: false
    }
  },
  components: {
    Banner,
    List
  },
  created() {
    this.$store.dispatch('home/connectPriceSocket');
    this.$store.dispatch('home/fetchLogos');
  },
  beforeUnmount() {
    this.$store.dispatch('home/disconnectPriceSocket');
  },
  methods: {
    openModal() {
      this.isModalShow = true;
    },
    closeModal() {
      this.isModalShow = false;
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