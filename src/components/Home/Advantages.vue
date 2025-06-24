<template>
    <div class="advantages">
        <div class="advantages__header">
            PREMIUM AVANTAJLARI
        </div>
        <div class="advantages__content">
            <ul class="advantages__list">
                <li class="advantages__item">
                    <h3 class="advantages__title">Anlık Emir Takibi</h3>
                    <p class="advantages__text">Premium üyelik sayesinde listelenen coinlerin aldığı tüm alış ve satış
                        emirlerini görüntüleyebilir ve takip edebilirsiniz</p>
                </li>
                <li class="advantages__item">
                    <h3 class="advantages__title">Anlık Emir Takibi</h3>
                    <p class="advantages__text">Premium üyelik sayesinde listelenen coinlerin aldığı tüm alış ve satış
                        emirlerini görüntüleyebilir ve takip edebilirsiniz</p>
                </li>
                <li class="advantages__item">
                    <h3 class="advantages__title">Anlık Emir Takibi</h3>
                    <p class="advantages__text">Premium üyelik sayesinde listelenen coinlerin aldığı tüm alış ve satış
                        emirlerini görüntüleyebilir ve takip edebilirsiniz</p>
                </li>
            </ul>
            <div class="advantages__image">
                <img src="../../assets/images/backgorunds/advantages-banner.svg" alt="">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "home-advantages",
    data() {
        return {}
    },
    components: {},
    created() { },
    methods: {},
};
</script>
<style lang="scss" scoped>
.advantages {
    padding: 0 500px 100px 500px;

    &__header {
        font-size: 50px;
        line-height: 62px;
        color: #CCCEEF;
    }

    &__content {
        display: flex;
        justify-content: space-between;
    }

    &__list {
        margin-top: 30px;
    }

    &__item {
        position: relative;
        padding-bottom: 40px;
        border-bottom: 1px solid rgba(47, 51, 109, 0.31);
        list-style: none;
        margin-top: 40px;

        &::before {
            top: -12px;
            left: -60px;
            line-height: 1;
            font-size: 42px;
            content: "\f192";
            font-weight: 400;
            position: absolute;
            font-family: "Font Awesome 5 Pro";
            background: -webkit-gradient(linear, left bottom, left top, from(#4E47A6), to(#101122));
            background: linear-gradient(0deg, #4E47A6, #101122);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        &::after {
            top: 30px;
            left: -42px;
            width: 5px;
            content: "";
            bottom: -30px;
            position: absolute;
            background: -webkit-gradient(linear, left bottom, left top, from(#101122), to(#4E47A6));
            background: linear-gradient(0deg, #101122, #4E47A6);
        }
    }

    &__title {
        line-height: 1;
        font-size: 20px;
        margin-bottom: 20px;
        color: #CCCEEF;
    }

    &__text {
        color: #D4D5D1;
        font-size: 16px;
        line-height: 35px;
    }
}
</style>