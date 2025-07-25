<template>
    <div class="volumes">
        <div class="volumes__item">
            <span class="volumes__title">
                24s Hacim
            </span>
            <span class="volumes__text">
                <DollarIcon class="columes__icon"/>{{ formatDecimal(volume24h) }}
            </span>
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                12s Hacim
            </span>
            <span class="volumes__text">
                <DollarIcon class="columes__icon"/>{{ formatDecimal(volume1h + oldVolumes[10].quoteVolume + oldVolumes[9].quoteVolume +
                    oldVolumes[8].quoteVolume + oldVolumes[7].quoteVolume + oldVolumes[6].quoteVolume +
                    oldVolumes[5].quoteVolume + oldVolumes[4].quoteVolume + oldVolumes[3].quoteVolume +
                    oldVolumes[2].quoteVolume + oldVolumes[1].quoteVolume + oldVolumes[0].quoteVolume) }}
            </span>
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                6s Hacim
            </span>
            <span class="volumes__text">
                <DollarIcon class="columes__icon"/>{{ formatDecimal(volume1h + oldVolumes[10].quoteVolume + oldVolumes[9].quoteVolume +
                    oldVolumes[8].quoteVolume + oldVolumes[7].quoteVolume + oldVolumes[6].quoteVolume) }}
            </span>
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                4s Hacim
            </span>
            <span class="volumes__text">
                <DollarIcon class="columes__icon"/>{{ formatDecimal(volume1h + oldVolumes[10].quoteVolume + oldVolumes[9].quoteVolume +
                    oldVolumes[8].quoteVolume) }}
            </span>
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                2s Hacim
            </span>
            <span class="volumes__text">
                <DollarIcon class="columes__icon"/>{{ formatDecimal(volume1h + oldVolumes[10].quoteVolume) }}
            </span>
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                1s Hacim
            </span>
            <span class="volumes__text">
                <DollarIcon class="columes__icon"/>{{ formatDecimal(volume1h) }}
            </span>
        </div>
    </div>
</template>

<script>
import DollarIcon from '../../assets/images/icons/dollar-icon.vue'
import helpers from '../../mixins/helpers';

export default {
    name: "detail-volumes",
    data() {
        return {
            isReady: false
        }
    },
    mixins: [helpers],
    components: {
        DollarIcon
    },
    created() { },
    methods: {},
    computed: {
        volume24h() {
            return this.$store.getters['coinDetail/getQuoteVolume'];
        },
        volume1h() {
            return this.$store.getters['coinDetail/getQuoteVolume1h'];
        },
        oldVolumes() {
            return this.$store.getters['coinDetail/getOldVolumes'];
        }
    }
};
</script>
<style lang="scss" scoped>
.volumes {
    padding: 10px;
    display: flex;
    color: #ffffff;
    background-color: #1d1f40;
    justify-content: space-between;
    border-radius: 10px;
    box-shadow: inset 0px 0px 0.5em 0px #ff3bd547, 0px 0px 0.5em 0px #ff3bd573;

    &__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        cursor: pointer;

        &:hover {
            color: #FF3BD4;
        }

        &.-symbol {
            font-size: 20px;
        }
    }

    &__title {
        font-size: 12px;
        color: #d1d1d1;
    }

    &__text {
        display: flex;
        align-items: center;
        &.-up {
            color: #00ff00;
        }

        &.-down {
            color: #ff0000;
        }
    }

    &__icon {
        margin-right: 5px;
    }
}
</style>