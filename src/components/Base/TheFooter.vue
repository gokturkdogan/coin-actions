<template>
    <div class="footer">
        <div class="footer__informations">
            <div class="footer__socials">
                <h4 class="footer__title">SOSYAL PLATFORMLAR</h4>
                <div class="footer__icons">
                    <a class="footer__link" href="">
                        <Telegram />
                    </a>
                    <a class="footer__link" href="">
                        <Whatsapp />
                    </a>
                </div>
            </div>
            <div class="footer__communication">
                <h4 class="footer__title">İLETİŞİM</h4>
                <p class="footer__text">+ 90 539 822 6918</p>
                <p class="footer__text">gokturk.dogan@hotmail.com</p>
            </div>
            <div class="footer__premium">
                <h4 class="footer__title">ARAMIZA KATIL</h4>
                <router-link class="footer__button" to="/">Premium Ol</router-link>
            </div>
        </div>
        <span class="footer__copyrights">Copyright© 2025 CoinActions. All rights reserved.</span>
    </div>
</template>

<script>
import Telegram from '../../assets/images/icons/telegram-icon.vue';
import Whatsapp from '../../assets/images/icons/whatsapp-icon.vue';
export default {
    name: "the-footer",
    components: {
        Telegram,
        Whatsapp
    },
    computed: {},
};
</script>

<style lang="scss" scoped>
.footer {
    padding: 0 300px 100px 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &__informations {
        display: flex;
        gap: 0;
        border-top: 1px solid #2F336D;
        border-bottom: 1px solid #2F336D;
        padding: 0 40px;
    }

    &__socials {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }

    &__title {
        line-height: 1;
        font-size: 14px;
        margin-bottom: 30px;
        color: #CCCEEF;
        font-weight: 700;
    }

    &__icons {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    &__link {
        z-index: 1;
        border: none;
        font-size: 20px;
        overflow: hidden;
        border-radius: 6px;
        position: relative;
        background: linear-gradient(60deg, #DD00AC, #7130C3, #DD00AC);
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(255, 59, 212, 0.3);
        }

        &::before {
            inset: 1px;
            content: "";
            z-index: -1;
            border-radius: 6px;
            position: absolute;
            background-color: #0F1021;
        }

        &::after {
            left: 0;
            top: -60%;
            content: "";
            width: 100%;
            height: 100%;
            -webkit-filter: blur(10px);
            filter: blur(10px);
            position: absolute;
            background-image: radial-gradient(#4E47A6, transparent);
        }
    }

    &__communication {
        flex: 1;
        text-align: center;
        border-left: 1px solid #2F336D;
        border-right: 1px solid #2F336D;
        padding: 40px;
    }

    &__text {
        color: #CCCEEF;
        font-size: 16px;
        margin-top: 10px;
    }

    &__premium {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    &__button {
        border: 1px solid #FF3BD4;
        color: #FF3BD4;
        text-decoration: none;
        font-size: 16px;
        font-weight: 700;
        border-radius: 6px;
        padding: 15px;
        width: 50%;
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

    }

    &__copyrights {
        text-align: center;
        color: #7064E9;
        font-size: 16px;
        margin-top: 40px;
    }
}
</style>