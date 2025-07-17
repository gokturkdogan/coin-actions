<template>
  <div class="header" :class="{'-scrolled': isScrolled }">
    <div class="header__container">
      <HeaderLogo />
        <div class="header__nav">
          <router-link to="/coin-actions/" class="header__link" :class="{ '-active': currentRoute === 'Home' }">ANASAYFA</router-link>
          <router-link to="/coin-actions/coin-list" class="header__link" :class="{ '-active': currentRoute === 'Coins' }">COİN LİSTESİ</router-link>
          <router-link to="/coin-actions/order-book" class="header__link" :class="{ '-active': currentRoute === 'Book' }">ORDER BOOK</router-link>          
          <router-link to="/coin-actions/future-list" class="header__link" :class="{ '-active': currentRoute === 'Future' }">VADELİ COİNLER</router-link>
          <router-link to="/coin-actions/spot-list" class="header__link" :class="{ '-active': currentRoute === 'Spot' }">SPOT COİNLER</router-link>
        </div>
        <!-- <router-link to="/login" class="header__button">Giriş Yap</router-link> -->
    </div>
  </div>
</template>

<script>
import HeaderLogo from '../../assets/images/logos/header-logo.vue'
export default {
  name: "the-header",
  components: {
    HeaderLogo
  },
  props: {
    currentRoute: {
      type: String,
      required: false,
      default: 'Home'
    }
  },
  data() {
    return {
      isScrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 80
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 100;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
  -webkit-transition: background-color 0.3s ease, -webkit-backdrop-filter 0.3s ease;

  &.-scrolled {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background-color: #ff3bd523;
    box-shadow: 0 0 26px -5px #FF3BD4;
  }

  &__container {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    padding: 20px 300px;
  }

  &__nav {
    display: flex;
  }

  &__link {
    font-size: 16px;
    font-weight: 500;
    line-height: 18px;
    color: #CCCEEF;
    text-decoration: none;
    transition: 0.3s;

    &.-active {
      color: #FF3BD4;
      text-decoration: underline;
    }

    &:not(:first-child) {
      margin-left: 40px;
    }

    &:hover {
      color: #FF3BD4;
      text-decoration: underline;
    }
  }
  
  &__button {
    font-size: 16px;
    padding: 14px 26px;
    font-weight: 700;
    border-radius: 6px;
    background: linear-gradient(90deg, rgba(113, 48, 195, 0.96) 0%, #070710 24%);
    position: relative;
    z-index: 1;
    color: #CCCEEF;
    text-decoration: none;
    border: 1px solid #FF3BD4;

    &:hover {
      background: -webkit-gradient(linear, left top, right top, from(#FF3BD4), to(#7130C3));
    }
  }
}
</style>