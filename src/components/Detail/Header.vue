<template>
    <div class="header">
        <div class="header__item -symbol">{{ coinSymbol }} / USD</div>
        <div class="header__item -symbol">
            ${{ formatNumber(tickerData.lastPrice, 2) }}
        </div>
        <div class="header__item" :class="{ '-up': tickerData.changePercent > 0, '-down': tickerData.changePercent < 0 }">
            <span class="header__title">
                24 saatlik Değişim
            </span>
            <span class="header__text" :class="{ '-up': tickerData.changePercent > 0, '-down': tickerData.changePercent < 0 }">
                {{ tickerData.changePercent }} %
                {{ tickerData.changeAmount }} $
            </span>
        </div>
        <div class="header__item">
            <span class="header__title">
                24s En Yüksek
            </span>
            <span class="header__text">
                ${{ formatNumber(tickerData.high24h, 2) }}
            </span>
        </div>
        <div class="header__item">
            <span class="header__title">
                24s En Düşük
            </span>
            <span class="header__text">
                ${{ formatNumber(tickerData.low24h, 2) }}
            </span>
        </div>
        <div class="header__item">
            <span class="header__title">
                24s Hacim
            </span>
            <span class="header__text">
                ${{ formatNumber(tickerData.volume24h, 2) }}
            </span>
        </div>
        <div class="header__item">
            <span class="header__title">
                Haftalık Hacim
            </span>
            <span class="header__text">
                ${{ formatNumber(oldVolumes.weekly, 2) }}
            </span>
        </div>
        <div class="header__item">
            <span class="header__title">
                Aylık Hacim
            </span>
            <span class="header__text">
                ${{ formatNumber(oldVolumes.monthly, 2) }}
            </span>
        </div>
        <div class="header__item">
            <span class="header__title">
                3 Aylık Hacim
            </span>
            <span class="header__text">
                ${{ formatNumber(oldVolumes.quarterly, 2) }}
            </span>
        </div>
    </div>
</template>

<script>

export default {
    name: "detail-header",
    data() {
        return {
            isReady: false
        }
    },
    props: {
        coinSymbol: {
            type: String,
            required: true
        },
        tickerData: {
            type: Object,
            required: true
        },
        oldVolumes: {
            type: Object,
            required: true
        } 
    },
    components: {},
    created() {
        setTimeout(() => {
            this.isReady = true
        }, 3000);
    },
    methods: {
        formatNumber(value, decimals = 4) {
            if (isNaN(value)) return value;
            const parts = Number(value).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        }
    },
};
</script>
<style lang="scss" scoped>
.header {
    padding: 10px;
    display: flex;
    color: #ffffff;
    background-color: #1d1f40;
    justify-content: space-between;
    border-radius: 10px;
    box-shadow: inset 0px 0px 0.5em 0px #ff3bd547, 0px 0px 0.5em 0px #ff3bd573;

    &__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        cursor: pointer;

        &:hover {
            color: #FF3BD4;
        }

        &.-symbol {
            font-size: 20px;
        }
    }

    &__title {
        font-size: 11px;
        color: #d1d1d1;
    }

    &__text {
        &.-up {
            color: #00ff00;
        }
        &.-down {
            color: #ff0000;
        }
    }
}
</style>