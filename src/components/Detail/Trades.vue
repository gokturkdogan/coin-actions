<template>
    <div class="trades">
        <div class="trades__section">
            <div class="trades__title">
                <div class="trades__text -button" :class="{ '-active': timeStampForSpot === 1, '-disabled': loaderForSpot }" @click="setTime(1)">
                    <span v-if="!loaderForSpot">1s</span>
                    <img class="trades__spinner" v-else src="../../assets/images/gifs/spinner.gif" alt="spinner">
                </div>
                <div class="trades__text -button" :class="{ '-active': timeStampForSpot === 12, '-disabled': loaderForSpot }" @click="setTime(12)">
                    <span v-if="!loaderForSpot">12s</span>
                    <img class="trades__spinner" v-else src="../../assets/images/gifs/spinner.gif" alt="spinner">
                </div>
                <div class="trades__text -button" :class="{ '-active': timeStampForSpot === 24, '-disabled': loaderForSpot }" @click="setTime(24)">
                    <span v-if="!loaderForSpot">24s</span>
                    <img class="trades__spinner" v-else src="../../assets/images/gifs/spinner.gif" alt="spinner">
                </div>
                <div class="trades__text -button" :class="{ '-active': timeStampForSpot === 0, '-disabled': loaderForSpot }" @click="removeTime()">
                    <span v-if="!loaderForSpot">Genel</span>
                    <img class="trades__spinner" v-else src="../../assets/images/gifs/spinner.gif" alt="spinner">
                </div>
            </div>
            <div class="trades__title">
                <div class="trades__text">Fiyat</div>
                <div class="trades__text">Tutar ($)</div>
                <div class="trades__text">Tutar ({{ symbol }})</div>
                <div class="trades__text">Zaman</div>
            </div>
            <div class="trades__item" v-for="(trade, index) in trades" :key="index" :class="{ '-buy': trade.type === 'buy', '-sell': trade.type === 'sell' }">
                <div class="trades__text --price" :class="{ '-buy': trade.type === 'buy', '-sell': trade.type === 'sell' }">${{ formatNumber(trade.price, 2) }}</div>
                <div class="trades__text --price" :class="{ '-buy': trade.type === 'buy', '-sell': trade.type === 'sell' }">${{ formatNumber(trade.qty * trade.price, 2) }}</div>
                <div class="trades__text">{{ formatNumber(trade.qty, 5) }}</div>
                <div class="trades__text">{{ trade.time }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "detail-trade",
    data() {
        return {
            timeStampForSpot: 0,
            loaderForSpot: false
        }
    },
    props: {
        trades: {
            type: Array,
            required: true
        },
        symbol: {
            type: String,
            required: false,
            default: 'BTC'
        }
    },
    components: {},
    created() {

    },
    methods: {
        formatNumber(value, decimals = 4) {
            if (isNaN(value)) return value;
            const parts = Number(value).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        },
          formatTime(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('tr-TR');
        },
        async setTime(time) {
            if(this.loaderForSpot) {
                return
            }
            this.loaderForSpot = true;
            this.timeStampForSpot = time;
            await this.$store.dispatch('coinDetail/fetchHistoricalTradesByRange', { symbol: this.symbol, hours: time });
            this.loaderForSpot = false;
        },
        async removeTime() {
            this.timeStampForSpot = 0;
            this.loaderForSpot = true;
            await this.$store.dispatch('coinDetail/connectTradesSocket', this.symbol);
            this.loaderForSpot = false;
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
        }

        &__item {
            display: flex;
            padding: 5px 10px;
            gap: 20px;
            cursor: pointer;
            position: relative;
            &.-buy {
                &:hover {
                    background-color: rgba(1, 167, 128, 0.271);
                }
            }
            &.-sell {
                &:hover {
                    background-color: rgba(207, 48, 75, 0.271);
                }
            }

            &:hover .trades__tooltip {
                display: block;
            }
        }

        &__tooltip {
            position: absolute;
            right: -90px;
            top: 0;
            background-color: #31324f;
            padding: 5px;
            width: 70px;
            text-align: center;
            display: none;
            border-radius: 10px;

            &.-buy {
                color: rgb(1, 167, 129);
            }
            &.-sell {
                color: rgb(207, 48, 74);
            }
        }

        &__text {
            &.--price {
                &.-buy {
                    color: rgb(1, 167, 129);
                }
                &.-sell {
                    color: rgb(207, 48, 74);
                }
            }
            &.-button {
                padding: 5px 20px;
                cursor: pointer;
                border: 1px solid #52536e;
                border-radius: 6px;
                &:hover {
                    border-color: #52536e;
                    background-color: #52536e;
                }
                &.-active {
                    border-color: #FF3BD4;            
                    box-shadow: 0 0 26px -5px #FF3BD4;
                    background-color: none;
                }
                &.-disabled {
                    cursor: not-allowed;
                }
            }
        }

        &__spinner {
            width: 20px;
        }
    }
</style>