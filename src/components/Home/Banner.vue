<template>
    <div class="banner">
        <div class="banner__text">COIN ACTIONS İle Takipte Kalın</div>
        <div class="banner__buttons">
           <!--  <router-link to="/" class="banner__button">Hemen Premium Al</router-link> -->
            <span @click="showCoins()" class="banner__button">Tüm Coinler</span>
        </div>
    </div>
</template>

<script>

export default {
    name: "home-banner",
    data() {
        return {}
    },
    components: {},
    created() {},
    methods: {
        showCoins() {
            this.$router.push({ name: 'Coins' });
            //this.$emit('open-modal')
        }
    },
};
</script>
<style lang="scss" scoped>
.banner {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__text {
        color: #CCCEEF;
        font-size: 60px;
        font-weight: 700;
    }

    &__buttons {
        margin-top: 46px;
        display: flex;
        justify-content: center;
        gap: 30px;
    }

    &__button {
        cursor: pointer;
        border: 1px solid #FF3BD4;
        color: #FF3BD4;
        text-decoration: none;
        font-size: 16px;
        font-weight: 700;
        border-radius: 6px;
        padding: 15px;
        width: 200px;
        text-align: center;
        position: relative;
        background: none;
        perspective: 2em;
        -webkit-box-shadow: inset 0px 0px 0.5em 0px #FF3BD4, 0px 0px 0.5em 0px #FF3BD4;
        -moz-box-shadow: inset 0px 0px 0.5em 0px #FF3BD4, 0px 0px 0.5em 0px #FF3BD4;
        box-shadow: inset 0px 0px 0.5em 0px #FF3BD4, 0px 0px 0.5em 0px #FF3BD4;

        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
            z-index: -1;
            background-color: #FF3BD4;
            box-shadow: 0 0 2em 0.2em #FF3BD4;
            transition: opacity 100ms linear;
        }

        &:hover {
            color: #FFFFFF;
            text-shadow: none;
            animation: none;

            &::after {
                opacity: 1;
            }
        }

    }
}
</style>