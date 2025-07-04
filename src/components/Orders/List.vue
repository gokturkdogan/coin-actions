<template>
    <div class="list">
        <div class="list__header">
            <h2 class="list__title">EMİR TAKİBİ</h2>
        </div>
        <table class="list__table">
            <thead>
                <tr>
                    <th class="list__number">#</th>
                    <th class="list__name">Coin</th>
                    <th class="list__name">Emir Tutarı</th>
                    <th class="list__name">Miktar</th>
                    <th class="list__change">Fiyat</th>                    
                    <th class="list__change">24s %</th>
                    <th class="list__change">Hacim 24s</th>
                </tr>
            </thead>
            <tbody>
                <tr class="list__item" v-for="(order, index) in orders" :key="index" :class="{ '-up': order.type === 'buy', '-down': order.type === 'sell' }">
                    <td class="list__number">{{ index + 1 }}</td>
                    <td class="list__name">
                        <span class="list__symbol">
                            {{ order.symbol }}
                        </span>
                    </td>
                    <td class="list__name">
                        <span class="list__symbol -colored" :class="{ '-buy': order.type === 'buy', '-sell': order.type === 'sell' }">
                            ${{ formatNumber(order.usdValue, 2) }}
                        </span>
                    </td>
                    <td class="list__name">
                        <span class="list__symbol -colored" :class="{ '-buy': order.type === 'buy', '-sell': order.type === 'sell' }">
                            {{ order.qty }}
                        </span>
                    </td>
                    <td class="list__change">
                        <span class="list__currency">
                            {{ formatNumber(order.lastPrice, 4) }}
                        </span>
                    </td>                    
                    <td class="list__change">
                        <span class="list__span">
                            <span class="list__colored" :class="{ '-up': order.changePercent > 0, '-down':  order.changePercent < 0 }">
                                <ArrowUp v-if="order.changePercent > 0"/>
                                <ArrowDown v-else/>
                                {{ order.changePercent }}
                            </span>
                        </span>
                    </td>
                    <td class="list__change">
                        <span class="list__currency">
                            ${{ formatNumber(order.volume24h, 3) }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import ArrowUp from '../../assets/images/icons/arrow-up-icon.vue';
import ArrowDown from '../../assets/images/icons/arrow-down-icon.vue';
export default {
    name: "orders-list",
    data() {
        return {}
    },
    components: {
        ArrowUp,
        ArrowDown
    },
    props: {
        orders: {
            tyoe: Array,
            required: true
        }
    },
    created() { },
    methods: {
        formatNumber(value, decimals = 4) {
            if (isNaN(value)) return value;
            const parts = Number(value).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        },
    },
    computed: {}
};
</script>
<style lang="scss" scoped>
.list {
    background-color: #070710;
    padding: 15px;
    border-radius: 20px;
    border: 1px solid rgba(47, 51, 109, 0.6);
    position: relative;
    box-shadow: 0 0 26px -5px #FF3BD4;
    width: 100%;

    &__header {
        display: flex;
        justify-content: center;
    }

    &__title {
        color: #CCCEEF;
        font-size: 16px;
        text-align: center;
        position: relative;
        padding: 0 20px;

        &::before {
            top: 5px;
            content: "";
            width: 8px;
            height: 8px;
            position: absolute;
            border-radius: 100%;
            background-color: #0F1021;
            background-image: radial-gradient(#5349CA, transparent);
            right: 0;
        }

        &::after {
            top: 5px;
            content: "";
            width: 8px;
            height: 8px;
            position: absolute;
            border-radius: 100%;
            background-color: #0F1021;
            background-image: radial-gradient(#5349CA, transparent);
            left: 0;
        }
    }

    &__table {
        margin-top: 20px;
        width: 100%;
        color: #FFFFFF;
        background-color: #0F1021;
        border-radius: 20px;
        border: 1px solid rgba(47, 51, 109, 0.6);
        margin-bottom: 50px;

        th,
        td {
            padding: 20px 40px;
            border: none;
            outline: none;
        }

        tbody {
            color: #d5d5d5;
            tr {
                cursor: pointer;
                transition: 0.3s;
                border-radius: 20px;

                &:hover {
                    background-color: rgba(47, 51, 109, 0.6);
                }
            }
        }

    }

    &__item {
        &.-up {
            background-color: rgba(0, 200, 0, 0.109);
            transition: background-color 1s ease;
        }

        &.-down {
            background-color: rgba(200, 0, 0, 0.109);
            transition: background-color 1s ease;
        }
    }

    &__number {
        width: 44px;
        text-align: left;
    }

    &__name {
        width: 270px;
        text-align: left;
    }

    &__symbol {
        display: flex;

        &.-colored {
            &.-buy {
                color: green;
            }
            &.-sell {
                color: red;
            }
        }
    }

    &__currency {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__img {
        width: 20px;
        margin-right: 10px;
    }

    &__price {
        width: 200px;
        text-align: right;
    }

    &__change {
        width: 100px;
        text-align: right;
    }

    &__span {
        display: flex;
        justify-content: flex-end;
        align-items: center;

    }

    &__colored {
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 7px;
        border-radius: 8px;
        overflow: hidden;
        position: relative;

        &.-up {
            background: rgba(52, 179, 73, 0.1);
            color: #6ccf59;
        }

        &.-down {
            background-color: rgba(240, 41, 52, .1);
            color: #ff4d4d;
        }
    }
}
</style>