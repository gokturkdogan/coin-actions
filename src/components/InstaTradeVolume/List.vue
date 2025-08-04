<template>
    <div class="list">
        <div class="list__header">
            <div class="list__input" :class="{ '-focused': inputFocused || searchText }">
                <input type="text" v-model="searchText" placeholder="Coin Ara" @focus="inputFocused = true"
                    @blur="inputFocused = false">
                <Search />
            </div>
            <div class="list__tab">
                <ArrowUp2 v-if="destination === 'up'" @click="changeDestination('down')" />
                <ArrowDown2 v-else @click="changeDestination('up')" />
            </div>
            <h2 class="list__title">ALIŞ SATIŞ HACİM SPOT (30dk)</h2>
        </div>
        <table class="list__table">
            <thead>
                <tr>
                    <th class="list__name">#</th>
                    <th class="list__name">Coin</th>
                    <th class="list__name" :class="{ '-active': activeOrder === 'volume' }" @click="changeOrder('volume')">Hacim<span class="list__tooltip">30 Dk'lık
                            Toplam Hacim</span></th>
                    <th class="list__name" :class="{ '-active': activeOrder === 'buy' }" @click="changeOrder('buy')">Alış<span class="list__tooltip">30 Dk'lık Alış
                            Hacim</span></th>
                    <th class="list__name" :class="{ '-active': activeOrder === 'sell' }" @click="changeOrder('sell')">Satış<span class="list__tooltip">30 Dk'lık Satış
                            Hacim</span></th>
                    <th class="list__name" :class="{ '-active': activeOrder === 'buyPercent' }" @click="changeOrder('buyPercent')">Alış %<span class="list__tooltip">30
                            Dk'lık Alış Yüzdelik Hacim</span></th>
                    <th class="list__name" :class="{ '-active': activeOrder === 'sellPercent' }" @click="changeOrder('sellPercent')">Satış %<span class="list__tooltip">30
                            Dk'lık Satış Yüzdelik Hacim</span></th>
                </tr>
            </thead>
            <tbody>
                <tr class="list__item" v-for="(coin, index) in volumes" :key="coin.symbol"
                    :class="{ '-up': coin.isUp }">
                    <td class="list__name">
                        <span class="list__symbol">
                            {{ index + 1 }}
                        </span>
                    </td>
                    <td class="list__name">
                        <span class="list__symbol">
                            {{ symbolFormatter(coin.symbol) }}
                        </span>
                    </td>
                    <td class="list__name" :class="{ '-active': activeOrder === 'volume' }">
                        <span v-if="coin.liveSell" class="list__symbol">
                            <DollarIcon />{{ formatDecimal(coin.liveSell + coin.liveBuy) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__name" :class="{ '-active': activeOrder === 'buy' }">
                        <span v-if="coin.liveBuy" class="list__symbol -up">
                            <DollarIcon />{{ formatDecimal(coin.liveBuy) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price" :class="{ '-active': activeOrder === 'sell' }">
                        <span v-if="coin.liveSell" class="list__symbol -down">
                            <DollarIcon />{{ formatDecimal(coin.liveSell) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price" :class="{ '-active': activeOrder === 'buyPercent' }">
                        <span v-if="coin.liveBuy" class="list__percent -up">
                            {{ percentFormatter((100 * (coin.liveBuy)) / (
                                coin.liveSell + coin.liveBuy)) }} %
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price" :class="{ '-active': activeOrder === 'sellPercent' }">
                        <span v-if="coin.liveSell" class="list__percent -down">
                            {{ percentFormatter((100 * (coin.liveSell)) / (
                                coin.liveSell + coin.liveBuy)) }} %
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import DollarIcon from '../../assets/images/icons/dollar-icon.vue';
import ArrowUp from '../../assets/images/icons/arrow-up-icon.vue';
import ArrowDown from '../../assets/images/icons/arrow-down-icon.vue';
import UpDown from '../../assets/images/icons/up-down-icon.vue';
import Search from '../../assets/images/icons/search-icon.vue';
import Clock from '../../assets/images/icons/clock-icon.vue';
import ArrowUp2 from '../../assets/images/icons/arrow-up-v2.vue';
import ArrowDown2 from '../../assets/images/icons/arrow-down-v2.vue';
import helpers from '../../mixins/helpers';

export default {
    name: "spot-list",
    data() {
        return {
            inputFocused: false,
            searchText: '',
            destination: 'up',
            activeOrder: 'volume',
        };
    },
    components: {
        DollarIcon,
        ArrowUp,
        ArrowDown,
        UpDown,
        Search,
        Clock,
        ArrowUp2,
        ArrowDown2
    },
    mixins: [helpers],
    methods: {
        changeDestination(value) {
            this.destination = value;
        },
        changeOrder(value) {
            this.activeOrder = value;
        },
    },
    computed: {
        volumes() {
            const data = this.$store.getters['instaTradeVolume/getCoinData'] || [];

            return [...data].sort((a, b) => {
                const getSafe = (v) => v || 0;

                const aVolume = getSafe(a.volume30m) + getSafe(a.liveBuy) + getSafe(a.liveSell);
                const bVolume = getSafe(b.volume30m) + getSafe(b.liveBuy) + getSafe(b.liveSell);

                const aBuy = getSafe(a.buyVolume) + getSafe(a.liveBuy);
                const bBuy = getSafe(b.buyVolume) + getSafe(b.liveBuy);

                const aSell = getSafe(a.sellVolume) + getSafe(a.liveSell);
                const bSell = getSafe(b.sellVolume) + getSafe(b.liveSell);

                let valueA = 0;
                let valueB = 0;

                switch (this.activeOrder) {
                    case 'buy':
                        valueA = aBuy;
                        valueB = bBuy;
                        break;
                    case 'sell':
                        valueA = aSell;
                        valueB = bSell;
                        break;
                    case 'buyPercent':
                        valueA = aVolume > 0 ? (100 * aBuy) / aVolume : 0;
                        valueB = bVolume > 0 ? (100 * bBuy) / bVolume : 0;
                        break;
                    case 'sellPercent':
                        valueA = aVolume > 0 ? (100 * aSell) / aVolume : 0;
                        valueB = bVolume > 0 ? (100 * bSell) / bVolume : 0;
                        break;
                    default: // 'volume'
                        valueA = aVolume;
                        valueB = bVolume;
                }

                return this.destination === 'down'
                    ? valueA - valueB
                    : valueB - valueA;
            });
        }
    }
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

    &__header {
        display: flex;
        justify-content: center;
        position: relative;
    }

    &__input {
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        left: 0;
        background-color: #0F1021;
        outline: none;
        border: none;
        color: #ffffff;
        padding: 10px 20px;
        border: 1px solid #5349CA;
        border-radius: 10px;
        display: flex;
        align-items: center;
        transition: 0.5;

        &.-focused {
            border-color: #FF3BD4;
            box-shadow: 0 0 26px -5px #FF3BD4;
        }

        &:hover {
            border-color: #FF3BD4;
            box-shadow: 0 0 26px -5px #FF3BD4;
        }

        input {
            background: none;
            border: none;
            outline: none;
            color: #ffffff;

            &:focus {
                border: none;
                outline: none;
            }
        }
    }

    &__title {
        color: #CCCEEF;
        font-size: 14px;
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

    &__spinner {
        width: 20px;
    }

    &__tab {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        border: 1px solid #5349CA;
        padding: 5px 20px;
        border-radius: 10px;
        transition: 0.3s;
        color: #ffffff;
        transform: translateY(-50%);
        top: 50%;
        left: 250px;
        position: absolute;

        &:hover {
            border-color: #FF3BD4;
            box-shadow: 0 0 26px -5px #FF3BD4;

            svg {
                fill: #FF3BD4;
            }
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
        font-size: 14px;

        thead {
            font-size: 14px;

            th {
                cursor: pointer;

                &:hover {
                    box-shadow: 0 0 26px -5px #FF3BD4;
                    color: #FF3BD4;
                }

                &:hover .list__tooltip {
                    display: block;
                }
            }
        }

        th,
        td {
            padding: 20px;
            border: none;
            outline: none;

            &.-active {
                box-shadow: 0 0 26px -5px #FF3BD4;
            }
        }

        tbody {
            color: #b9b9b9;

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
            background-color: rgba(0, 200, 0, 0.200);
            transition: background-color 1.5s ease;
        }
    }

    &__number {
        text-align: left;
    }

    &__name {
        min-width: 200px;
        text-align: left;
        position: relative;
    }

    &__tooltip {
        position: absolute;
        background-color: #000000;
        border: 1px solid #FF3BD4;
        color: #ffffff;
        padding: 5px 20px;
        top: -50px;
        right: 0;
        border-radius: 20px;
        width: max-content;
        box-shadow: 0 0 26px -5px #FF3BD4;
        display: none;
    }

    &__symbol {
        display: flex;
        align-items: center;

        &.-up {
            color: #6ccf59;
        }

        &.-down {
            color: #ff4d4d;
        }

    }

    &__percent {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 7px;
        border-radius: 8px;
        width: fit-content;
        height: 30px;

        &.-up {
            background: rgba(52, 179, 73, 0.1);
            color: #6ccf59;
        }

        &.-down {
            background-color: rgba(240, 41, 52, 0.3);
            color: #ff4d4d;
        }
    }

    &__clock {
        height: 15px;
        width: 15px;
        margin-right: 5px;

        &.-red {
            fill: #ff4d4d;
        }
    }

    &__cur {
        font-size: 12px;
        margin-left: 5px;

        &.-up {
            color: #6ccf59;
        }

        &.-down {
            color: #ff4d4d;
        }
    }

    &__currency {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__icon {
        margin-left: 10px;
    }

    &__img {
        width: 20px;
        margin-right: 10px;
    }

    &__price {
        text-align: right;

        &.-width {
            min-width: 120px;
        }

        &.-colored {
            &.-up {
                color: #6ccf59;
            }

            &.-down {
                color: #ff4d4d;
            }
        }
    }

    &__change {
        text-align: right;
        position: relative;
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