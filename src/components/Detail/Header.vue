<template>
    <div class="volumes">
        <div class="volumes__item -symbol">{{ symbolFormatter(coinSymbol) }} / USD</div>
        <div class="volumes__item -symbol"
            :class="{ '-up': priceDirection === 'up', '-down': priceDirection === 'down' }">
            ${{ formatDecimal(price) }}
            <ArrowUpIcon class="volumes__icon" v-if="priceDirection === 'up'" />
            <ArrowDownIcon class="volumes__icon" v-else />
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                24 saatlik Değişim
            </span>
            <span class="volumes__text" :class="{ '-up': priceChangePercent > 0, '-down': priceChangePercent < 0 }">
                {{ percentFormatter(priceChangePercent) }} %
                {{ formatDecimal(priceChange) }} $
                <ArrowUpIcon class="volumes__icon" v-if="priceChangePercent > 0" />
                <ArrowDownIcon class="volumes__icon" v-else />
            </span>
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                24s En Yüksek
            </span>
            <span class="volumes__text -up">
                ${{ formatDecimal(highPrice) }}
            </span>
        </div>
        <div class="volumes__item">
            <span class="volumes__title">
                24s En Düşük
            </span>
            <span class="volumes__text -down">
                ${{ formatDecimal(lowPrice) }}
            </span>
        </div>
    </div>
</template>

<script>
import helpers from '../../mixins/helpers';
import ArrowUpIcon from '../../assets/images/icons/arrow-up-icon.vue';
import ArrowDownIcon from '../../assets/images/icons/arrow-down-icon.vue';


export default {
    name: "detail-volumes",
    data() {
        return {
            priceDirection: null
        }
    },
    props: {
        coinSymbol: {
            type: String,
            required: true
        }
    },
    mixins: [helpers],
    components: {
        ArrowUpIcon,
        ArrowDownIcon
    },
    created() { },
    watch: {
        price(newVal, oldVal) {
            if (oldVal === null || oldVal === undefined) return; // ilk değer atlama
            if (newVal > oldVal) {
                this.priceDirection = 'up';
            } else if (newVal < oldVal) {
                this.priceDirection = 'down';
            } else {
                this.priceDirection = null;
            }
        }
    },
    methods: {},
    computed: {
        price() {
            return this.$store.getters['coinDetail/getPrice'];
        },
        priceChange() {
            return this.$store.getters['coinDetail/getPriceChange'];
        },
        priceChangePercent() {
            return this.$store.getters['coinDetail/getPriceChangePercent'];
        },
        highPrice() {
            return this.$store.getters['coinDetail/getHighPrice'];
        },
        lowPrice() {
            return this.$store.getters['coinDetail/getLowPrice'];
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
        font-size: 20px;
        cursor: pointer;

        &.-up {
            color: #00ff00;
        }

        &.-down {
            color: #ff0000;
        }

        &:hover {
            color: #FF3BD4;
        }

        &.-symbol {
            flex-direction: row;
            font-size: 24px;
        }
    }

    &__title {
        font-size: 14px;
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
        margin-left: 5px;
    }
}
</style>