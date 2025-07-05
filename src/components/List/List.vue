<template>
    <div class="list">
        <div class="list__header">
            <div class="list__input" :class="{ '-focused': inputFocused || searchText }">
                <input type="text" v-model="searchText" placeholder="Coin Ara" @focus="inputFocused = true" @blur="inputFocused = false">
                <Search />
            </div>
            <h2 class="list__title">TÜM COINLER</h2>
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
                    <th class="list__number">#</th>
                    <th class="list__name">Coin</th>
                    <th class="list__name" :class="{ '-active': activeOrderType === 'lastPrice' }">Fiyat</th>
                    <th class="list__name">Spot Hacim (Adet)</th>
                    <th class="list__name" :class="{ '-active': activeOrderType === 'totalQuoteVolume' }">Spot Hacim
                        (Usd)</th>
                    <th class="list__price">Vadeli Hacim (Adet)</th>
                    <th class="list__price" :class="{ '-active': activeOrderType === 'futuresQuoteVolume' }">Vadeli
                        Hacim (Usd)</th>
                    <th class="list__change" :class="{ '-active': activeOrderType === 'priceChangePercent' }">
                        Değişim 24s</th>
                </tr>
            </thead>
            <tbody>
                <tr class="list__item" v-for="(coin, index) in coins" :key="index" :class="coin.changeClass"
                    @click="goDetail(coin)">
                    <td class="list__number">{{ index + 1 }}</td>
                    <td class="list__name">
                        <span class="list__symbol">
                            <img class="list__img" :src="coin.logoUrl" alt="">{{ coin.symbol }}
                        </span>
                    </td>
                    <td :class="{ '-active': activeOrderType === 'lastPrice' }" class="list__name">
                        <span class="list__symbol">
                            <DollarIcon />{{ coin.lastPrice }}
                        </span>
                    </td>
                    <td class="list__name">
                        <span class="list__symbol">
                            {{ coin.totalVolume }} <span class="list__cur"
                                :class="{ '-up': coin.priceChangePercent > 0, '-down': coin.priceChangePercent < 0 }">
                                ({{ coin.symbol }})</span>
                        </span>
                    </td>
                    <td :class="{ '-active': activeOrderType === 'totalQuoteVolume' }" class="list__price">
                        <span class="list__symbol">
                            <DollarIcon />{{ coin.totalQuoteVolume }}
                        </span>
                    </td>
                    <td class="list__price">
                        <span class="list__currency -withSpan">
                            {{ coin.futuresVolume }}({{ coin.symbol }})
                        </span>
                    </td>
                    <td :class="{ '-active': activeOrderType === 'futuresQuoteVolume' }" class="list__price">
                        <span class="list__currency">
                            <DollarIcon />{{ coin.futuresQuoteVolume }}
                        </span>
                    </td>
                    <td class="list__change" :class="{ '-active': activeOrderType === 'priceChangePercent' }">
                        <span class="list__span">
                            <span class="list__colored"
                                :class="{ '-up': coin.priceChangePercent > 0, '-down': coin.priceChangePercent < 0 }">
                                <ArrowUp v-if="coin.priceChangePercent > 0" />
                                <ArrowDown v-else />
                                {{ coin.priceChangePercent }}
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
    methods: {
        order(tab) {
            this.$store.dispatch('coins/setOrderBy', { type: tab.type, isUp: !tab.isUp });
        },
        async goDetail(coin) {
            await this.$store.dispatch('coinDetail/openCoinDetail', coin.symbol);
            this.$router.push({ name: 'CoinDetail', params: { symbol: coin.symbol } });
        }
    },
    computed: {
        coins() {
            if (!this.searchText) return this.$store.getters['coins/coinsDataList'];
            return this.$store.getters['coins/coinsDataList'].filter((coin) =>
                coin.symbol.toLowerCase().includes(this.searchText.toLowerCase())
            );
        },
        orders() {
            return this.$store.getters['coins/orders'];
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