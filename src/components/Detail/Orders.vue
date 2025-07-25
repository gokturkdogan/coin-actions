<template>
    <div class="orders">
        <div class="orders__section">
            <div class="orders__title">
                <div class="orders__text --title">Anlık Emir Takibi</div>
            </div>
            <table class="orders__table">
                <thead class="orders__thead">
                    <tr class="orders__heading">
                        <th class="orders__head">Fiyat</th>
                        <th class="orders__head">Miktar ({{ symbolFormatter(coinSymbol) }})</th>
                        <th class="orders__head">Tutar ($)</th>
                    </tr>
                </thead>
                <tbody class="orders__tbody">
                    <tr class="orders__item buy" v-for="(buy, index) in buyOrders" :key="index">
                        <td class="orders__value">
                            <span class="orders__key buy">${{ formatDecimal(buy[0]) }}</span>
                        </td>
                        <td class="orders__value">
                            <span class="orders__key">${{ buy[1] }}</span>
                        </td>
                        <td class="orders__value">
                            <span class="orders__key">{{ formatDecimal(buy[0] * buy[1]) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="orders__price" :class="priceDirection">
            {{ price }} $
            <ArrowUpIcon class="orders__icon" v-if="priceDirection === 'up'" />
            <ArrowDownIcon class="orders__icon" v-else />
        </div>
        <table class="orders__table">
            <tbody class="orders__tbody">
                <tr class="orders__item sell" v-for="(sell, index) in sellOrders" :key="index">
                    <td class="orders__value">
                        <span class="orders__key sell">${{ formatDecimal(sell[0]) }}</span>
                    </td>
                    <td class="orders__value">
                        <span class="orders__key">${{ sell[1] }}</span>
                    </td>
                    <td class="orders__value">
                        <span class="orders__key">{{ formatDecimal(sell[0] * sell[1]) }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
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
    height: fit-content;
    min-width: 310px;

    &__title {
        display: flex;
        justify-content: space-between;
        background-color: #1d1f40;
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 16px;
        border-bottom: 2px solid #31324f;
    }

    &__price {
        display: flex;
        gap: 10px;
        justify-content: center;
        background-color: #1d1f40;
        padding: 20px 0;
        font-size: 26px;
        align-items: center;

        &.up {
            color: #6ccf59;
        }
        &.down {
            color: #ff0000;
        }
    }

    &__thead {
        background-color: #1d1f40;
    }

    &__head {
        padding: 10px;
    }

    &__tbody {
        background-color: #31324f;
    }

    &__item {
        cursor: pointer;

        &.buy {
            &:hover {
                background-color: rgba(1, 167, 128, 0.271);
            }
        }

        &.sell {
            &:hover {
                background-color: rgba(207, 48, 75, 0.271);
            }
        }
    }

    &__value {
        padding: 10px;
    }

    &__key {
        &.buy {
            color: rgb(1, 167, 129);
        }

        &.sell {
            color: rgb(207, 48, 74);
        }
    }
}
</style>