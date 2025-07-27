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
            <h2 class="list__title">SAATLİK HACİM TAKİBİ</h2>
        </div>
        <table class="list__table">
            <thead>
                <tr>
                    <th class="list__name">Coin</th>
                    <th class="list__name">Açılış<span class="list__tooltip">Geçmiş Mum Açılış Saati</span></th>
                    <th class="list__name">Kapanış<span class="list__tooltip">Geçmiş Mum Kapanış Saati</span></th>
                    <th class="list__name">Hacim<span class="list__tooltip">Geçmiş Mum Hacim</span></th>
                    <th class="list__name">Alış Hacim<span class="list__tooltip">Geçmiş Mum Alış Hacim</span></th>
                    <th class="list__name">Satış Hacim<span class="list__tooltip">Geçmiş Mum Satış Hacim</span></th>
                    <th class="list__change">Açılış<span class="list__tooltip">Güncel Mum Açılış saati</span></th>
                    <th class="list__change" @click="changeOrder('volume')"
                        :class="{ '-active': activeOrder === 'volume' }">Hacim<span class="list__tooltip">Güncel Mum
                            Anlık Hacim</span></th>
                    <th class="list__change" @click="changeOrder('change')"
                        :class="{ '-active': activeOrder === 'change' }">$ Değişim<span class="list__tooltip">1 Saatlik
                            Hacim Değişimi</span></th>
                    <th class="list__change" @click="changeOrder('percent')"
                        :class="{ '-active': activeOrder === 'percent' }">% Değişim<span class="list__tooltip">1 Saatlik
                            Hacim Yüzdelik Değişimi</span></th>
                </tr>
            </thead>
            <tbody>
                <tr class="list__item" v-for="coin in volumes" :key="coin.symbol" :class="{ '-up': coin.isUp }">
                    <td class="list__name">
                        <span class="list__symbol">
                            {{ symbolFormatter(coin.symbol) }}
                        </span>
                    </td>
                    <td class="list__name">
                        <span v-if="coin.previousKline" class="list__symbol">
                            <Clock class="list__clock" />
                            {{ formatTime(coin.previousKline.openTime) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__name">
                        <span v-if="coin.previousKline" class="list__symbol">
                            <Clock class="list__clock -red" />
                            {{ formatTime(coin.previousKline.closeTime) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price">
                        <span v-if="coin.previousKline" class="list__symbol">
                            <DollarIcon />{{ formatDecimal(coin.previousKline.quoteAssetVolume) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price -colored -up">
                        <span v-if="coin.previousKlineBuyPercent" class="list__symbol">
                            <DollarIcon />{{ formatDecimal(coin.previousKlineBuyPercent * coin.previousKline.quoteAssetVolume) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price -colored -down">
                        <span v-if="coin.previousKlineSellPercent" class="list__symbol">
                            <DollarIcon />{{ formatDecimal(coin.previousKlineSellPercent * coin.previousKline.quoteAssetVolume) }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price">
                        <span v-if="coin.liveKline" class="list__currency">
                            <Clock class="list__clock" />
                            {{ formatTime(coin.liveKline?.openTime) || '-' }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price -width" :class="{ '-active': activeOrder === 'volume' }">
                        <span v-if="coin.liveKline" class="list__currency">
                            <DollarIcon />{{ formatDecimal(coin.liveKline?.quoteAssetVolume) || '-' }}
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price -colored"
                        :class="{ '-up': coin.liveKline?.quoteAssetVolume - coin.previousKline?.quoteAssetVolume > 0, '-down': coin.liveKline?.quoteAssetVolume - coin.previousKline?.quoteAssetVolume < 0, '-active': activeOrder === 'change' }">
                        <span v-if="coin.liveKline" class="list__currency">
                            <DollarIcon />{{ formatDecimal(coin.liveKline?.quoteAssetVolume -
                                coin.previousKline?.quoteAssetVolume) }}
                            <ArrowUp v-if="coin.liveKline?.quoteAssetVolume - coin.previousKline?.quoteAssetVolume > 0"
                                class="list__icon" />
                            <ArrowDown v-else class="list__icon" />
                        </span>
                        <img v-else src="../../assets/images/gifs/spinner.gif" alt="spinner" class="list__spinner">
                    </td>
                    <td class="list__price -colored"
                        :class="{ '-up': coin.liveKline?.quoteAssetVolume - coin.previousKline?.quoteAssetVolume > 0, '-down': coin.liveKline?.quoteAssetVolume - coin.previousKline?.quoteAssetVolume < 0, '-active': activeOrder === 'percent' }">
                        <span v-if="coin.liveKline && coin.previousKline" class="list__currency">
                            {{ percentFormatter((coin.liveKline?.quoteAssetVolume -
                                coin.previousKline?.quoteAssetVolume) * 100 / coin.previousKline?.quoteAssetVolume) }}%
                            <ArrowUp v-if="coin.liveKline?.quoteAssetVolume - coin.previousKline?.quoteAssetVolume > 0"
                                class="list__icon" />
                            <ArrowDown v-else class="list__icon" />
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
            previousVolumes: {} // symbol: previousQuoteAssetVolume
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
        markIsUp(coin) {
            if (!coin) return;

            coin.isUp = true;
            clearTimeout(coin._upTimer);
            coin._upTimer = setTimeout(() => {
                coin.isUp = false;
            }, 1000); // 1 saniye sonra isUp: false yapılır
        }
    },
    computed: {
        volumes() {
            const data = this.$store.getters['volume/getCoinData'] || [];

            return [...data].map(coin => {
                const symbol = coin.symbol;
                const currentVolume = Number(coin?.liveKline?.quoteAssetVolume ?? 0);
                const prevVolume = this.previousVolumes[symbol] ?? currentVolume;

                if (currentVolume > prevVolume) {
                    this.markIsUp(coin);
                }

                this.previousVolumes[symbol] = currentVolume;

                return coin;
            }).sort((a, b) => {
                let valA = 0;
                let valB = 0;

                if (this.activeOrder === 'volume') {
                    valA = Number(a?.liveKline?.quoteAssetVolume ?? 0);
                    valB = Number(b?.liveKline?.quoteAssetVolume ?? 0);
                } else if (this.activeOrder === 'change') {
                    const currentA = Number(a?.liveKline?.quoteAssetVolume ?? 0);
                    const prevA = Number(a?.previousKline?.quoteAssetVolume ?? 0);
                    valA = currentA - prevA;

                    const currentB = Number(b?.liveKline?.quoteAssetVolume ?? 0);
                    const prevB = Number(b?.previousKline?.quoteAssetVolume ?? 0);
                    valB = currentB - prevB;
                } else if (this.activeOrder === 'percent') {
                    const currentA = Number(a?.liveKline?.quoteAssetVolume ?? 0);
                    const prevA = Number(a?.previousKline?.quoteAssetVolume ?? 0);
                    valA = prevA !== 0 ? ((currentA - prevA) / prevA) * 100 : 0;

                    const currentB = Number(b?.liveKline?.quoteAssetVolume ?? 0);
                    const prevB = Number(b?.previousKline?.quoteAssetVolume ?? 0);
                    valB = prevB !== 0 ? ((currentB - prevB) / prevB) * 100 : 0;
                }

                if (isNaN(valA) && isNaN(valB)) return 0;
                if (isNaN(valA)) return 1;
                if (isNaN(valB)) return -1;

                return this.destination === 'down'
                    ? valA - valB
                    : valB - valA;
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
            font-size: 16px;

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
            padding: 25px;
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
            min: 120px;
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