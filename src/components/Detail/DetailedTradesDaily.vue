<template>
    <div class="trades">
        <div class="trades__section">
            <div class="trades__header">
                <span class="trades__title">Günlük Trade Takibi</span>
                <div class="trades__ranges">
                    <span @click="changeRange(1)" class="trades__range" :class="{ '-active': activeDay === 1 }">1</span>
                    <span @click="changeRange(2)" class="trades__range" :class="{ '-active': activeDay === 2 }">2</span>
                    <span @click="changeRange(5)" class="trades__range" :class="{ '-active': activeDay === 5 }">5</span>
                    <span @click="changeRange(7)" class="trades__range" :class="{ '-active': activeDay === 7 }">7</span>
                    <span @click="changeRange(15)" class="trades__range" :class="{ '-active': activeDay === 15 }">15</span>
                </div>
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
                    <tr class="trades__item" :class="trade.type" v-for="(trade, index) in detailedTradesDaily" :key="index">
                        <td class="trades__value">
                            <span class="trades__key" :class="trade.type">${{ formatDecimal(trade.price) }}</span>
                        </td>
                        <td class="trades__value">
                            <span class="trades__key">${{ formatDecimal(trade.amount) }}</span>
                        </td>
                        <td class="trades__value">
                            <span class="trades__key">{{ trade.quantity }}</span>
                        </td>
                        <td class="trades__value">
                            <div class="trades__flex">
                                <CalendarIcon class="trades__icon" :class="trade.type" />
                                <span class="trades__key">{{ formatTimestamp(trade.timestamp) }}</span>
                                <ClockIcon class="trades__icon" :class="trade.type" />
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
import ClockIcon from '../../assets/images/icons/clock-icon.vue';
import CalendarIcon from '../../assets/images/icons/calendar-icon.vue'
export default {
    name: "detail-trades",
    data() {
        return {
            activeDay: 1
        }
    },
    props: {
        coinSymbol: {
            type: String,
            required: true
        }
    },
    components: {
        ClockIcon,
        CalendarIcon
    },
    mixins: [helpers],
    computed: {
        detailedTradesDaily() {
            return this.$store.getters['coinDetail/getDetailTradesDaily']
        }
    },
    methods: {
        changeRange(selectedDay) {
            const now = Date.now();
            const newRange = selectedDay * 24;
            const range = now - 60 * 60 * 1000 * newRange;
            this.activeDay = selectedDay;
            this.$store.dispatch('coinDetail/fetchDetailAggTradesDaily', {
                symbol: this.coinSymbol,
                startTime: range,
                endTime: now
            });
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
    max-height: 1500px;
    overflow-y: scroll;

    &__header {
        gap: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #1d1f40;
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom: 2px solid #31324f;
    }

    &__ranges {
        display: flex;
        gap: 5px;
    }

    &__range {
        border-radius: 5px;
        border: 1px solid #FF3BD4;
        padding: 5px 10px;
        cursor: pointer;
        transition: 0.3s;

        &:hover {
            background-color: #FF3BD4;
            box-shadow: 0 0 26px -5px #FF3BD4;
        }

        &.-active {
            background-color: #FF3BD4;
            box-shadow: 0 0 26px -5px #FF3BD4;
        }
    }

    &__title {
        font-size: 16px;
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