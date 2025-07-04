<template>
    <div class="orders">
        <div class="orders__section">
            <div class="orders__title">
                <div class="orders__text">Fiyat</div>
                <div class="orders__text">Miktar</div>
                <div class="orders__text">Tutar</div>
            </div>
            <div class="orders__item --buy" v-for="(bid, index) in depthData.bids" :key="index">
                <div class="orders__text --price --buy">{{ formatNumber(bid[0], 4) }}</div>
                <div class="orders__text">{{ formatNumber(bid[1], 4) }}</div>
                <div class="orders__text --amount">$ {{ formatNumber(bid[0] * bid[1], 4) }}</div>
            </div>
        </div>
        <div class="orders__price">
            {{ formatNumber(lastPrice, 4) }} $
        </div>
        <div class="orders__section">
            <div class="orders__item --sell" v-for="(ask, index) in depthData.asks" :key="index">
                <div class="orders__text --price --sell">{{ formatNumber(ask[0], 4) }}</div>
                <div class="orders__text">{{ formatNumber(ask[1], 4) }}</div>
                <div class="orders__text">$ {{ formatNumber(ask[0] * ask[1], 4) }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "detail-order",
    data() {
        return {
            
        }
    },
    props: {
        depthData: {
            type: Object,
            required: true
        },
        lastPrice: {
            type: String,
            required: true
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
            justify-content: space-between;
            background-color: #1d1f40;
            padding: 10px;
            justify-content: center;
            font-size: 20px;
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