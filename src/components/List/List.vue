<template>
  <div class="list">
    <div class="list__header">
      <div class="list__input" :class="{ '-focused': inputFocused || searchText }">
        <input
          type="text"
          v-model="searchText"
          placeholder="Coin Ara"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
        <Search />
      </div>
      <span class="list__info">Lütfen detayını görmek istediğiniz coin sembolüne tıklayınız</span>
      <h2 class="list__title">TÜM COINLER</h2>
      <div class="list__tabs">
        <div
          class="list__tab"
          :class="{ '-active': sortField === 'lastPrice' }"
          @click="setSort('lastPrice')"
        >
          <span class="list__tabText">Fiyat</span>
        </div>
        <div
          class="list__tab"
          :class="{ '-active': sortField === 'quoteVolume' }"
          @click="setSort('quoteVolume')"
        >
          <span class="list__tabText">Spot Hacim</span>
        </div>
        <div
          class="list__tab"
          :class="{ '-active': sortField === 'quoteFutureVolume' }"
          @click="setSort('quoteFutureVolume')"
        >
          <span class="list__tabText">Vadeli Hacim</span>
        </div>
        <div
          class="list__tab"
          :class="{ '-active': sortField === 'priceChangePercent' }"
          @click="setSort('priceChangePercent')"
        >
          <span class="list__tabText">Değişim</span>
        </div>
      </div>
    </div>
    <table class="list__table">
      <thead>
        <tr>
          <th class="list__name">Coin</th>
          <th class="list__name" :class="{ '-active': sortField === 'lastPrice' }">Fiyat</th>
          <th class="list__name">En İyi Alış</th>
          <th class="list__name">En İyi Satış</th>
          <th class="list__name">En Yüksek Fiyat</th>
          <th class="list__price">En Düşük Fiyat</th>
          <th class="list__change" :class="{ '-active': sortField === 'quoteVolume' }">İşlem Hacmi 24s (Spot)</th>
          <th class="list__change" :class="{ '-active': sortField === 'quoteFutureVolume' }">İşlem Hacmi 24s (Vadeli)</th>
          <th class="list__change" :class="{ '-active': sortField === 'priceChangePercent' }">Değişim %</th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="{
            '-up': priceDirections[coin.symbol] === 'up',
            '-down': priceDirections[coin.symbol] === 'down',
          }"
          class="list__item"
          v-for="(coin, index) in coins"
          :key="coin.symbol"
        >
          <td class="list__number"> <router-link :to="'/coin-actions/coin-detail/' + coin.symbol" class="list__link">{{ symbolFormatter(coin.symbol) }}</router-link></td>
          <td class="list__name" :class="{ '-active': sortField === 'lastPrice' }">
            <span class="list__symbol">
              <DollarIcon />{{ formatDecimal(coin.lastPrice) }}
            </span>
          </td>
          <td class="list__name">
            <span class="list__symbol">
              <DollarIcon />{{ formatDecimal(coin.bestBidPrice) }}
            </span>
          </td>
          <td class="list__name">
            <span class="list__symbol">
              <DollarIcon />{{ formatDecimal(coin.bestAskPrice) }}
            </span>
          </td>
          <td class="list__price">
            <span class="list__symbol">
              <DollarIcon />{{ formatDecimal(coin.highPrice) }}
            </span>
          </td>
          <td class="list__price">
            <span class="list__currency">
              <DollarIcon />{{ formatDecimal(coin.lowPrice) }}
            </span>
          </td>
          <td class="list__price" :class="{ '-active': sortField === 'quoteVolume' }">
            <span class="list__currency">
              <DollarIcon />{{ formatDecimal(coin.quoteVolume) }}
            </span>
          </td>
          <td class="list__price" :class="{ '-active': sortField === 'quoteFutureVolume' }">
            <span class="list__currency">
              <DollarIcon />{{ formatDecimal(coin.quoteFutureVolume) }}
            </span>
          </td>
          <td class="list__change" :class="{ '-active': sortField === 'priceChangePercent' }">
            <span class="list__span">
              <span
                class="list__colored"
                :class="{ '-up': coin.priceChangePercent > 0, '-down': coin.priceChangePercent < 0 }"
              >
                <ArrowUp v-if="coin.priceChangePercent > 0" />
                <ArrowDown v-else />
                {{ percentFormatter(coin.priceChangePercent) }}
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
  name: 'home-list',
  data() {
    return {
      inputFocused: false,
      searchText: '',
      lastPrices: new Map(),
      priceDirections: {},
      animationTimeouts: {},
      sortField: 'lastPrice', // başlangıç sıralama alanı
      sortOrder: 'desc', // başlangıç sıralama yönü (desc: büyükten küçüğe)
    };
  },
  components: {
    DollarIcon,
    ArrowUp,
    ArrowDown,
    UpDown,
    Search,
  },
  mixins: [helpers],
  watch: {
    coins: {
      handler(newCoins) {
        newCoins.forEach((coin) => {
          const oldPrice = this.lastPrices.get(coin.symbol);
          if (oldPrice !== undefined) {
            if (coin.lastPrice > oldPrice) this.setPriceDirection(coin.symbol, 'up');
            else if (coin.lastPrice < oldPrice) this.setPriceDirection(coin.symbol, 'down');
            else this.clearPriceDirection(coin.symbol);
          }
          this.lastPrices.set(coin.symbol, coin.lastPrice);
        });
      },
      deep: true,
    },
  },
  methods: {
    setPriceDirection(symbol, direction) {
      this.priceDirections = { ...this.priceDirections, [symbol]: direction };

      if (this.animationTimeouts[symbol]) {
        clearTimeout(this.animationTimeouts[symbol]);
      }

      this.animationTimeouts[symbol] = setTimeout(() => {
        const { [symbol]: _, ...rest } = this.priceDirections;
        this.priceDirections = rest;
        delete this.animationTimeouts[symbol];
      }, 1500);
    },
    clearPriceDirection(symbol) {
      const { [symbol]: _, ...rest } = this.priceDirections;
      this.priceDirections = rest;

      if (this.animationTimeouts[symbol]) {
        clearTimeout(this.animationTimeouts[symbol]);
        delete this.animationTimeouts[symbol];
      }
    },
    goDetail(coin) {
      this.$router.push({ name: 'coin-detail', params: { symbol: coin.symbol } });
    },
    setSort(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        this.sortField = field;
        this.sortOrder = 'desc';
      }
    },
  },
  computed: {
    coins() {
      const allCoins = this.$store.getters['coinList/getCoinsData'];
      const query = this.searchText.trim().toLowerCase();

      let filtered = !query
        ? allCoins
        : allCoins.filter((coin) => coin.symbol.toLowerCase().includes(query));

      filtered = filtered.slice().sort((a, b) => {
        const aVal = a[this.sortField] ?? 0;
        const bVal = b[this.sortField] ?? 0;

        if (aVal === bVal) return 0;

        if (this.sortOrder === 'desc') {
          return bVal - aVal;
        } else {
          return aVal - bVal;
        }
      });

      return filtered;
    },
  },
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

    &__info {
      position: absolute;
      color: #b9b9b9;
      transform: translateY(-50%);
      top: 50%;
      left: 220px;
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
            background-color: rgba(0, 200, 0, 0.220);
            transition: background-color 0.5s ease;
        }

        &.-down {
            background-color: rgba(200, 0, 0, 0.220);
            transition: background-color 0.5s ease;
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
            background: rgba(52, 179, 73, 0.3);
            color: #6ccf59;
        }

        &.-down {
            background-color: rgba(240, 41, 52, 0.3);
            color: #ff4d4d;
        }
    }

    &__link {
      color: #b9b9b9;
      text-decoration: none;
    }
}
</style>