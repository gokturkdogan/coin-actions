<template>
    <div class="list">
        <div class="list__header">
            <h2 class="list__title">TREND COINLER</h2>
        </div>
        <table class="list__table">
            <thead>
                <tr>
                    <th class="list__name">Coin</th>
                    <th class="list__price">Fiyat</th>
                    <th class="list__change">24s Değişim</th>
                </tr>
            </thead>
            <tbody>
                <tr class="list__item" v-for="(coin, index) in coins" :key="index" :class="priceStatus[coin.symbol]">
                    <td class="list__name">
                        <span class="list__symbol">
                            <img class="list__img" :src="logos[coin.symbol]" alt="coin_logo" />
                            {{ symbolFormatter(coin.symbol) }}
                        </span>
                    </td>
                    <td class="list__price">
                        <span class="list__currency">
                            <DollarIcon class="list__dolar" />{{ formatDecimal(coin.price) }}
                        </span>
                    </td>
                    <td class="list__change">
                        <span class="list__span">
                            <span class="list__colored" :class="{ '-up': coin.change > 0, '-down': coin.change < 0 }">
                                <ArrowUp class="list__icon" v-if="coin.change > 0" />
                                <ArrowDown class="list__icon" v-else />
                                {{ percentFormatter(coin.change) }} %
                            </span>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="list__buttonArea">
            <router-link class="list__button" to="/coin-actions/coin-list">Daha Fazla Coin Gör</router-link>
        </div>
    </div>
</template>

<script>
import DollarIcon from '../../assets/images/icons/dollar-icon.vue';
import ArrowUp from '../../assets/images/icons/arrow-up-icon.vue';
import ArrowDown from '../../assets/images/icons/arrow-down-icon.vue';
import helpers from '../../mixins/helpers';
export default {
    name: 'home-list',
    components: {
        DollarIcon,
        ArrowUp,
        ArrowDown,
    },
    data() {
        return {
            priceStatus: {}
        };
    },
    mixins: [helpers],
    computed: {
        coins() {
            return this.$store.getters['home/allPrices'];
        },
        logos() {
            return this.$store.getters['home/getLogos'];
        },
    },
    watch: {
        coins: {
            deep: true,
            immediate: true,
            handler(newCoins, oldCoins) {
                if (!oldCoins) return;
                for (const symbol in newCoins) {
                    const newPrice = parseFloat(newCoins[symbol].price);
                    const oldPrice = oldCoins[symbol] ? parseFloat(oldCoins[symbol].price) : null;
                    if (oldPrice === null) continue;

                    if (newPrice > oldPrice) {
                        this.setPriceStatus(symbol, '-up');
                    } else if (newPrice < oldPrice) {
                        this.setPriceStatus(symbol, '-down');
                    }
                }
            },
        },
    },
    methods: {
        setPriceStatus(symbol, status) {
            this.priceStatus = { ...this.priceStatus, [symbol]: status };
            setTimeout(() => {
                this.priceStatus = { ...this.priceStatus, [symbol]: '' };
            }, 2000);
        },
    },
};
</script>
<style lang="scss" scoped>
.list {
    margin-top: 100px;
    background-color: #070710;
    padding: 15px;
    border-radius: 20px;
    border: 1px solid rgba(47, 51, 109, 0.6);
    position: relative;
    box-shadow: 0 0 26px -5px #FF3BD4;

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

        @media (max-width: 768px) {
            font-size: 12px;
        }

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

        @media (max-width: 768px) {
            font-size: 10px;
        }

        th,
        td {
            padding: 20px 40px;
            border: none;
            outline: none;

            @media (max-width: 768px) {
                padding: 10px 20px;
            }
        }

        tbody {
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
            background-color: rgba(0, 200, 0, 0.255);
            transition: background-color 1s ease;
        }

        &.-down {
            background-color: rgba(200, 0, 0, 0.255);
            transition: background-color 1s ease;
        }
    }

    &__number {
        width: 44px;
        text-align: left;

        @media (max-width: 768px) {
            width: 20px;
        }
    }

    &__name {
        width: 270px;
        text-align: left;

        @media (max-width: 768px) {
            width: 100px;
        }
    }

    &__dolar {
        @media (max-width: 768px) {
            width: 8px;
            margin-right: 2px;
        }
    }

    &__symbol {
        display: flex;
    }

    &__currency {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__img {
        width: 20px;
        margin-right: 10px;

        @media (max-width: 768px) {
            width: 10px;
        }
    }

    &__price {
        width: 200px;
        text-align: right;
    }

    &__change {
        width: 100px;
        text-align: right;
    }

    &__icon {
        @media (max-width: 768px) {
            width: 10px;
        }
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

        @media (max-width: 768px) {
            height: 20px;
        }
    }

    &__buttonArea {
        margin-top: 50px;
        display: flex;
        justify-content: center;
    }

    &__button {
        cursor: pointer;
        border: 1px solid #FF3BD4;
        color: #FF3BD4;
        text-decoration: none;
        font-size: 16px;
        font-weight: 700;
        border-radius: 6px;
        padding: 15px;
        width: 100%;
        text-align: center;
        position: relative;
        background: none;
        perspective: 2em;
        -webkit-box-shadow: inset 0px 0px 0.5em 0px #FF3BD4, 0px 0px 0.5em 0px #FF3BD4;
        -moz-box-shadow: inset 0px 0px 0.5em 0px #FF3BD4, 0px 0px 0.5em 0px #FF3BD4;
        box-shadow: inset 0px 0px 0.5em 0px #FF3BD4, 0px 0px 0.5em 0px #FF3BD4;

        @media (max-width: 768px) {
            font-size: 12px;
        }

        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
            z-index: -1;
            background-color: #FF3BD4;
            box-shadow: 0 0 2em 0.2em #FF3BD4;            transition: opacity 100ms linear;
        }

        &:hover {
            color: #FFFFFF;
            text-shadow: none;
            animation: none;

            &::after {
                opacity: 1;
            }
        }

        &.-disabled {
            color: #8a898a;
            border-color: #8a898a;
            -webkit-box-shadow: inset 0px 0px 0.5em 0px #8a898a, 0px 0px 0.5em 0px #8a898a;
            -moz-box-shadow: inset 0px 0px 0.5em 0px #8a898a, 0px 0px 0.5em 0px #8a898a;
            box-shadow: inset 0px 0px 0.5em 0px #8a898a, 0px 0px 0.5em 0px #8a898a;

            &:hover {
                color: #8a898a;
                text-shadow: none;
                animation: none;

                &::after {
                    opacity: 0;
                }
            }
        }

    }
}
</style>