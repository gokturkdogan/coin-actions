<template>
    <div class="orders">
        <div class="orders__section">
            <div class="orders__title">
                <div class="orders__text --title">Emir Takibi</div>
            </div>
            <div class="orders__title">
                <div class="orders__text">Fiyat</div>
                <div class="orders__text">Miktar ({{ symbolFormatter(coinSymbol) }})</div>
                <div class="orders__text">Tutar</div>
            </div>
            <div class="orders__item --buy" v-for="(buy, index) in buyOrders" :key="index">
                <div class="orders__text --price --buy">$ {{ formatDecimal(buy[0]) }}</div>
                <div class="orders__text">{{ buy[1] }}</div>
                <div class="orders__text --amount">$ {{ formatDecimal(buy[0] * buy[1]) }}</div>
            </div>
        </div>
        <div class="orders__price" :class="{ '-up': priceDirection === 'up', '-down': priceDirection === 'down' }">
            {{ price }} $
            <ArrowUpIcon class="orders__icon" v-if="priceDirection === 'up'" />
            <ArrowDownIcon class="orders__icon" v-else />
        </div>
        <div class="orders__section">
            <div class="orders__item --sell" v-for="(sell, index) in sellOrders" :key="index">
                <div class="orders__text --price --sell">{{ formatDecimal(sell[0]) }}</div>
                <div class="orders__text">{{ sell[1] }}</div>
                <div class="orders__text">$ {{ formatDecimal(sell[0] * sell[1]) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import helpers from '../../mixins/helpers';
import ArrowUpIcon from '../../assets/images/icons/arrow-up-icon.vue';
import ArrowDownIcon from '../../assets/images/icons/arrow-down-icon.vue';
export default {
    name: "detail-order",
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
    components: {
        ArrowUpIcon,
        ArrowDownIcon
    },
    mixins: [helpers],
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
    computed: {
        buyOrders() {
            return this.$store.getters['coinDetail/getBids']
        },
        sellOrders() {
            return this.$store.getters['coinDetail/getAsks']
        },
        price() {
            return this.$store.getters['coinDetail/getPrice']
        }
    }
};
</script>
<style lang="scss" scoped>
.orders {
    color: #ffffff;
    background-color: #31324f;
    font-size: 12px;
    border-radius: 10px;

    &__sell {
        display: flex;
        flex-direction: column;
    }

    &__title {
        display: flex;
        justify-content: space-between;
        background-color: #1d1f40;
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        &.--price {
            justify-content: center;
            font-size: 20px;
        }
    }

    &__price {
        display: flex;
        justify-content: center;
        background-color: #1d1f40;
        padding: 10px;
        align-items: center;
        font-size: 20px;

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

    &__item {
        display: flex;
        padding: 5px 10px;
        gap: 20px;
        justify-content: space-between;
        cursor: pointer;

        &.--buy {
            &:hover {
                background-color: rgba(1, 167, 128, 0.271);
            }
        }

        &.--sell {
            &:hover {
                background-color: rgba(207, 48, 75, 0.271);
            }
        }

        &.--amount {
            text-align: right;
        }
    }

    &__text {
        min-width: 80px;

        &.--title {
            font-size: 16px;
        }

        &.--price {
            &.--buy {
                color: rgb(1, 167, 129);
            }

            &.--sell {
                color: rgb(207, 48, 74);
            }
        }
    }
}
</style>