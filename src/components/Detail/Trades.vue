<template>
    <div class="trades">
        <div class="trades__section">
            <div class="trades__title">
                Anlık Trade Listesi
            </div>
            <table class="trades__table">
                <thead class="trades__thead">
                    <tr class="trades__heading">
                        <th class="trades__head">Fiyat</th>
                        <th class="trades__head">Tutar ($)</th>
                        <th class="trades__head">Tutar ({{ symbolFormatter(coinSymbol) }})</th>
                        <th class="trades__head">Zaman</th>
                    </tr>
                </thead>
                <tbody class="trades__tbody">
                    <tr class="trades__item" :class="trade.type" v-for="(trade, index) in trades" :key="index">
                        <td class="trades__value">
                            <span class="trades__key" :class="trade.type">${{ formatDecimal(trade.price) }}</span>
                        </td>
                        <td class="trades__value">
                            <span class="trades__key">${{ formatDecimal(trade.quantity * trade.price) }}</span>
                        </td>
                        <td class="trades__value">
                            <span class="trades__key">{{ trade.quantity }}</span>
                        </td>
                        <td class="trades__value">
                            <div class="trades__flex">
                                <ClockIcon class="trades__icon" :class="trade.type" />
                                <span class="trades__key">{{ formatMillisecondsToTime(trade.timestamp) }}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import helpers from '../../mixins/helpers';
import ClockIcon from '../../assets/images/icons/clock-icon.vue'
export default {
    name: "detail-trade",
    data() {
        return {}
    },
    props: {
        coinSymbol: {
            type: String,
            required: true
        }
    },
    mixins: [helpers],
    components: {
        ClockIcon
    },
    computed: {
        trades() {
            return this.$store.getters['coinDetail/getTrades'];
        }
    }
};
</script>
<style lang="scss" scoped>
.trades {
    color: #ffffff;
    background-color: #31324f;
    font-size: 12px;
    height: fit-content;
    border-radius: 10px;
    max-height: 1610px;
    overflow-y: scroll;

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

    &__icon {
        width: 15px;
        height: 15px;

        &.sell {
            fill: rgb(207, 48, 74);
        }
    }

    &__flex {
        display: flex;
        align-items: center;
        gap: 5px;
    }
}
</style>