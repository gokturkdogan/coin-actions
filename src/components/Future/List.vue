<template>
    <div class="list">
        <div class="list__header">
            <div class="list__input" :class="{ '-focused': inputFocused || searchText }">
                <input type="text" v-model="searchText" placeholder="Coin Ara" @focus="inputFocused = true"
                    @blur="inputFocused = false">
                <Search />
            </div>
            <h2 class="list__title">VADELİ COİN LİSTESİ</h2>
            <div class="list__tabs">
                <div v-for="(tab, index) in orders" :key="index" class="list__tab" :class="{ '-active': tab.isActive }"
                    @click="order(tab)">
                    <span class="list__tabText">{{ tab.text }}</span>
                    <span class="list__tabICon">
                        <UpDown v-if="!tab.isActive" />
                        <ArrowUp v-else-if="tab.isUp" />
                        <ArrowDown v-else />
                    </span>
                </div>
            </div>
        </div>
        <table class="list__table">
            <thead>
                <tr>
                    <th class="list__name">#</th>
                    <th class="list__name">Coin</th>
                    <th :class="{ '-active': activeOrderType === 'lastPrice' }" class="list__name">Fiyat</th>
                    <th class="list__price">En Yüksek Fiyat 24s</th>
                    <th class="list__change">En Düşük Fiyat 24s</th>
                    <th class="list__change">Ortalama Fiyat 24s</th>
                    <th :class="{ '-active': activeOrderType === 'quoteVolume' }" class="list__change">Vadeli Hacim 24s</th>
                    <th :class="{ '-active': activeOrderType === 'quoteVolume1h' }" class="list__change">Vadeli Hacim 1s</th>
                    <th :class="{ '-active': activeOrderType === 'priceChangePercent' }" class="list__change">Değişim 24s</th>
                </tr>
            </thead>
            <tbody>
                <tr class="list__item" :class="coin.changeClass" v-for="(coin, index) in volumes" :key="index"
                    @click="getVolume(coin.symbol)">
                    <td class="list__name">
                        <span class="list__symbol">
                            {{ index }}
                        </span>
                    </td>
                    <td class="list__name">
                        <span class="list__symbol">
                            {{ symbolFormatter(coin.symbol) }}
                        </span>
                    </td>
                    <td class="list__name" :class="{ '-active': activeOrderType === 'lastPrice' }">
                        <span class="list__symbol" :class="coin.changeClass">
                            <DollarIcon />{{ formatDecimal(coin.lastPrice) }}
                        </span>
                    </td>
                    <td class="list__price">
                        <span class="list__currency">
                            <DollarIcon />{{ formatDecimal(coin.highPrice) }}
                        </span>
                    </td>
                    <td class="list__price">
                        <span class="list__currency">
                            <DollarIcon />{{ formatDecimal(coin.lowPrice) }}
                        </span>
                    </td>
                    <td class="list__price">
                        <span class="list__currency">
                            <DollarIcon />{{ formatDecimal(coin.weightedAvgPrice) }}
                        </span>
                    </td>
                    <td class="list__price" :class="{ '-active': activeOrderType === 'quoteVolume' }">
                        <span class="list__currency">
                            <DollarIcon />{{ formatDecimal(coin.quoteVolume) }}
                        </span>
                    </td>
                    <td class="list__price" :class="{ '-active': activeOrderType === 'quoteVolume1h' }">
                        <span v-if="coin.quoteVolume1h" class="list__currency">
                            <DollarIcon />{{ formatDecimal(coin.quoteVolume1h) }}
                        </span>
                        <img v-else class="list__spinner" src="../../assets/images/gifs/spinner.gif" alt="spinner">
                    </td>
                    <td class="list__change" :class="{ '-active': activeOrderType === 'priceChangePercent' }">
                        <span class="list__span">
                            <span class="list__colored"
                                :class="{ '-up': coin.priceChangePercent > 0, '-down': coin.priceChangePercent < 0 }">
                                <ArrowUp v-if="coin.priceChangePercent > 0" />
                                <ArrowDown v-else />
                                {{ formatNumber(coin.priceChangePercent) }}%
                            </span>
                        </span>
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
import helpers from '../../mixins/helpers';
export default {
    name: "home-list",
    data() {
        return {
            inputFocused: false,
            searchText: ''
        }
    },
    components: {
        DollarIcon,
        ArrowUp,
        ArrowDown,
        UpDown,
        Search
    },
    created() { },
    mixins: [helpers],
    methods: {
        order(tab) {
            this.$store.commit('futureList/setOrder', { type: tab.type, isUp: !tab.isUp });
        },
        async getVolume(coin) {
            await this.$store.dispatch('futureVolume/fetch1hVolume', coin);
        },
        formatNumber(value, decimals = 1) {
            if (isNaN(value)) return value;
            const parts = Number(value).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        },
    },
    computed: {
        volumes() {
            const all = Object.values(this.$store.getters['futureList/allCoins']);
            const search = this.searchText.trim().toLowerCase();
            if (!search) return all;
            return all.filter(coin => coin.symbol.toLowerCase().includes(search));
        },
        orders() {
            return this.$store.getters['futureList/getOrders'];
        },
        activeOrderType() {
            const activeOrder = this.orders.find(order => order.isActive);
            return activeOrder ? activeOrder.type : null;
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

    &__tabs {
        display: flex;
        gap: 10px;
        position: absolute;
        right: 0;
        transform: translateY(-50%);
        top: 50%;
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

        svg {
            margin: 0;
        }

        &:hover {
            border-color: #FF3BD4;
            box-shadow: 0 0 26px -5px #FF3BD4;

            svg {
                fill: #FF3BD4;
            }
        }

        &.-active {
            border-color: #FF3BD4;
            box-shadow: 0 0 26px -5px #FF3BD4;
            color: #FF3BD4;

            svg {
                fill: #FF3BD4;
            }
        }
    }

    &__tabIcon {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__tabText {
        //color: #ffffff;
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

        th,
        td {
            padding: 20px 10px;
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
            background-color: rgba(0, 200, 0, 0.488);
            transition: background-color 1s ease;
        }

        &.-down {
            background-color: rgba(200, 0, 0, 0.488);
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
        align-items: center;

        &.-up {
            color: #6ccf59;
        }

        &.-down {
            color: #ff4d4d;
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