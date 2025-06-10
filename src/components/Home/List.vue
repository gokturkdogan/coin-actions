<template>
    <div class="list">
        <div class="list__header">
            <h2 class="list__title">TREND COINLER</h2>
        </div>
        <table class="list__table">
            <thead>
                <tr>
                    <th class="list__number">#</th>
                    <th class="list__name">Coin</th>
                    <th class="list__price">Fiyat</th>
                    <th class="list__change">24s Değişim</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="list__number">1</td>
                    <td class="list__name">Bitcoin</td>
                    <td class="list__price">$109,220.07</td>
                    <td class="list__change">
                        <div><i></i>3.13%</div>
                    </td>
                </tr>
                <tr>
                    <td class="list__number">2</td>
                    <td class="list__name">Ethereum</td>
                    <td class="list__price">$2,680.16</td>
                    <td class="list__change">
                        <div><i></i>3.13%</div>
                    </td>
                </tr>
                <tr>
                    <td class="list__number">3</td>
                    <td class="list__name">BNB</td>
                    <td class="list__price">$658.82</td>
                    <td class="list__change">
                        <div><i></i>3.13%</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="list__buttonArea">
            <span @click="showCoins()" class="list__button -disabled">Daha Fazla Coin Gör</span>
        </div>
    </div>
</template>

<script>
import Modal from './Modal.vue';
export default {
    name: "home-list",
    data() {
        return {}
    },
    components: {
        Modal
    },
    created() { },
    methods: {
        showCoins() {
            this.$emit('open-modal');
        }
    }
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

    &__number {
        width: 44px;
        text-align: left;
    }

    &__name {
        width: 270px;
        text-align: left;
    }

    &__price {
        width: 200px;
        text-align: right;
    }

    &__change {
        width: 100px;
        text-align: right;
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
            box-shadow: 0 0 2em 0.2em #FF3BD4;
            transition: opacity 100ms linear;
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