<template>
  <div class="list">
    <div class="list__header">
      <div class="list__filter">
        <div class="list__input" :class="{ '-focused': inputFocused || searchText }">
          <input
            type="text"
            v-model="searchText"
            placeholder="Coin Ara"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @input="onSearchInput"
          />
          <Search />
        </div>
        <div class="list__tabs">
          <div class="list__tab" :class="{ '-active': filterType === 'buy' }" @click="changeFilter('buy')">
            <span class="list__tabText">Alış</span>
          </div>
          <div class="list__tab" :class="{ '-active': filterType === 'sell' }" @click="changeFilter('sell')">
            <span class="list__tabText">Satış</span>
          </div>
          <div class="list__tab" :class="{ '-active': filterType === 'mix' }" @click="changeFilter('mix')">
            <span class="list__tabText">Hepsi</span>
          </div>
        </div>
      </div>          
      <h2 class="list__title">ORDER BOOK</h2>
        <div class="list__quickFilters">
          <div class="list__tab -sort" @click="changeOrder()">
            <UpIcon v-if="sortDescending"/>
            <DownIcon v-else />
          </div>
          <div class="list__tab" :class="{ '-active': minTotal === 10000 }" @click="changeRange(10000)">
            <span class="list__tabText">10,000$</span>
          </div>
          <div class="list__tab" :class="{ '-active': minTotal === 100000 }" @click="changeRange(100000)">
            <span class="list__tabText">100,000$</span>
          </div>
          <div class="list__tab" :class="{ '-active': minTotal === 500000 }" @click="changeRange(500000)">
            <span class="list__tabText">500,000$</span>
          </div>
        </div>
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
        <tr
          class="list__item"
          v-for="(order, index) in orderBooks"
          :key="index"
          :class="{ '-up': order.type === 'buy', '-down': order.type === 'sell' }"
          @click="goDetail(order)"
        >
          <td class="list__number">{{ index + 1 }}</td>
          <td class="list__name"><span class="list__symbol">{{ order.symbol }}</span></td>
          <td class="list__name">
            <span class="list__symbol -colored" :class="{ '-buy': order.type === 'buy', '-sell': order.type === 'sell' }">
              ${{ formatNumber(order.total, 2) }}
            </span>
          </td>
          <td class="list__name">
            <span class="list__symbol -colored" :class="{ '-buy': order.type === 'buy', '-sell': order.type === 'sell' }">
              {{ order.qty }}
            </span>
          </td>
          <td class="list__change">
            <span class="list__currency">
              ${{ formatNumber(order.price, 2) }}
            </span>
          </td>
          <td class="list__change">
            <span class="list__span">
              <span class="list__colored" :class="{ '-up': order.changePercent > 0, '-down': order.changePercent < 0 }">
                <ArrowUp v-if="order.changePercent > 0"/>
                <ArrowDown v-else/>
                {{ order.changePercent }}
              </span>
            </span>
          </td>
          <td class="list__change"><span class="list__currency">${{ formatNumber(order.volume24h, 3) }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ArrowUp from '../../assets/images/icons/arrow-up-icon.vue';
import ArrowDown from '../../assets/images/icons/arrow-down-icon.vue';
import Search from '../../assets/images/icons/search-icon.vue';
import UpIcon from '../../assets/images/icons/arrow-up-v2.vue';
import DownIcon from '../../assets/images/icons/arrow-down-v2.vue';

export default {
  name: "orders-list",
  components: {
    ArrowUp,
    ArrowDown,
    Search,
    UpIcon,
    DownIcon
  },
  data() {
    return {
      inputFocused: false,
      searchText: '',
      debounceTimer: null,
      filterType: 'mix',
      minTotal: 0,
      sortDescending: true,
    }
  },
  watch: {
    searchText(newValue) {
      const symbol = newValue.trim().toUpperCase();

      if (!symbol) {
        // Arama boşsa: varsayılan coin listesi başlatılır
        this.$store.dispatch('orderBook/initOrderBooks');
      } else {
        // Arama varsa: sadece bu coin izlenir
        this.$store.dispatch('orderBook/watchCoin', symbol);
      }
    }
  },
  methods: {
    formatNumber(value, decimals = 4) {
      if (isNaN(value)) return value;
      const parts = Number(value).toFixed(decimals).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    },
    onSearchInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const symbol = this.searchText.trim().toUpperCase();
        if (symbol.length >= 2) {
          this.$store.dispatch('orderBook/watchCoin', symbol);
        }
      }, 600);
    },
    async goDetail(coin) {
        await this.$store.dispatch('coinDetail/openCoinDetail', coin.symbol);
        this.$router.push({ name: 'CoinDetail', params: { symbol: coin.symbol } });
    },
    changeFilter(type) {
      this.filterType = type;
    },
    changeRange(range) {
      if(range === this.minTotal) {
        this.minTotal = 0
        return
      }
      this.minTotal = range;
    },
    changeOrder() {
      this.sortDescending = !this.sortDescending;
    }
  },
  computed: {
    orderBooks() {
      let filtered = this.$store.getters['orderBook/allOrderBookOrders'];

      // Tip filtresi
      if (this.filterType !== 'mix') {
        filtered = filtered.filter(order => order.type === this.filterType);
      }

      // Minimum tutar filtresi
      if (this.minTotal > 0) {
        filtered = filtered.filter(order => order.total >= this.minTotal);
      }

      // Sıralama
      return filtered.sort((a, b) =>
        this.sortDescending ? b.total - a.total : a.total - b.total
      );
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
    width: 100%;

    &__header {
        display: flex;
        justify-content: center;
        position: relative;
    }

    &__filter {
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        left: 0;
        display: flex;
    }

    &__quickFilters {
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        right: 0;
        display: flex;
        gap: 10px;
    }

    &__tabs {
      margin-left: 20px;
      display: flex;
      gap: 10px;
    }

    &__tab {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #5349CA;
      padding: 0 20px;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.3s;
      color: #ffffff;

      &.-sort {
        padding: 5px 10px;
        margin-right: 20px;
      }

      &:hover {
        border-color: #FF3BD4;
        box-shadow: 0 0 26px -5px #FF3BD4;
      }

      &.-active {
        border-color: #FF3BD4;
        box-shadow: 0 0 26px -5px #FF3BD4;
        color: #FF3BD4;
      }
    }

    &__input {
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