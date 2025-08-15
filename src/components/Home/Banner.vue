<template>
    <div class="banner">
        <div class="banner__text">COIN ACTIONS İle Takipte Kalın</div>
        <div class="banner__buttons">
            <router-link class="banner__button" to="/coin-actions/coin-list">Tüm Coinler</router-link>
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
    created() { },
    methods: {},
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

        @media (max-width: 768px) {
            font-size: 20px;
        }
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

        @media (max-width: 768px) {
            font-size: 12px;
        }

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