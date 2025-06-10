<template>
  <div class="header">
    <HeaderLogo />
    <div class="header__nav">
      <router-link to="/login" class="header__link">ANASAYFA</router-link>
      <router-link to="/login" class="header__link">COİN LİSTESİ</router-link>
      <router-link to="/login" class="header__link">ÜYELİK PLANLARI</router-link>
      <router-link to="/login" class="header__link">HESABIM</router-link>
    </div>
    <router-link to="/login" class="header__button">Giriş Yap</router-link>
  </div>
</template>

<script>
import HeaderLogo from '../../assets/images/logos/header-logo.vue'
export default {
  name: "the-header",
  components: {
    HeaderLogo
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 50px 400px;
  align-items: center;

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