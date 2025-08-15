<template>
    <div class="header" :class="{ '-scrolled': isScrolled }">
        <div class="header__container">
            <HeaderLogo />
            <div class="header__hamburger" @click="toggleMenu">
                <HamburgerIcon />
            </div>
        </div>
        <transition name="fade">
            <div v-if="isMenuOpen" class="overlay" @click="closeMenu"></div>
        </transition>
        <transition name="slide-down">
            <div v-if="isMenuOpen" class="mobile-menu">
                <router-link to="/coin-actions/" class="mobile-menu__navItem"
                    :class="{ '-active': currentRoute === 'Home' }">ANASAYFA</router-link>
                <router-link to="/coin-actions/coin-list" class="mobile-menu__navItem"
                    :class="{ '-active': currentRoute === 'Coins' }">COİN LİSTESİ</router-link>
                <router-link to="/coin-actions/trade-volume" class="mobile-menu__navItem"
                    :class="{ '-active': currentRoute === 'TradeVolume' }">TRADE HACİM</router-link>
                <router-link to="/coin-actions/trade-future-volume" class="mobile-menu__navItem"
                    :class="{ '-active': currentRoute === 'FutureVolume' }">30DK VADELİ</router-link>
                <router-link to="/coin-actions/trade-spot-volume" class="mobile-menu__navItem"
                    :class="{ '-active': currentRoute === 'SpotVolume' }">30DK SPOT</router-link>
            </div>
        </transition>
    </div>
</template>

<script>
import HeaderLogo from '../../assets/images/logos/header-logo.vue'
import HamburgerIcon from '../../assets/images/icons/hamburger-menu-icon.vue'

export default {
    name: "the-header-mobile",
    components: { HeaderLogo, HamburgerIcon },
    data() {
        return {
            isScrolled: false,
            isMenuOpen: false,
            navItems: ["Home", "About", "Contact", "Blog"]
        }
    },
    props: {
        currentRoute: {
            type: String,
            required: false,
            default: 'Home'
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
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        },
        closeMenu() {
            this.isMenuOpen = false
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    width: 100%;
    z-index: 100;
    transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
    display: none;

    @media (max-width: 768px) {
        display: unset;
    }

    &.-scrolled {
        backdrop-filter: blur(10px);
        background-color: rgba(255, 59, 213, 0.14);
        box-shadow: 0 0 26px -5px #FF3BD4;
    }

    &__container {
        display: flex;
        justify-content: space-between;
        padding: 20px 10px;
        align-items: center;
    }

    &__hamburger {
        cursor: pointer;
    }
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 98;
}

.mobile-menu {
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 59, 213, 0.14);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    z-index: 99;
    display: flex;
    flex-direction: column;

    &__navItem {
        color: rgb(179, 179, 179);
        padding: 12px 0;
        border-bottom: 1px solid #eee;
        font-size: 16px;
        text-decoration: none;

        &.-active {
            color: white;
            border-color: #FF3BD4;
        }
    }
}

/* Geçiş animasyonu: Menü */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>