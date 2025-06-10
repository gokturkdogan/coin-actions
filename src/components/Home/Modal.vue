<template>
    <div class="modal">
        <div class="modal__overlay">
            <div class="modal__wrapper">
                <div class="modal__header">
                    <XMark class="modal__close" @click="$emit('close-modal')"/>
                </div>
                <div class="modal__body">
                    <Warning class="modal__icon" />
                    <div class="modal__information">
                        <p class="modal__text">Bu Özellik Premium Bir Özelliktir</p>
                        <p class="modal__subtext">Hemen Premium Sahibi Olmak İçin Tıklayın</p>
                    </div>
                </div>
                <div class="modal__footer">
                    <router-link class="modal__button">Premium Ol</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import XMark from '../../assets/images/icons/x-mark-icon.vue';
import Warning from '../../assets/images/icons/warning-icon.vue';
export default {
    name: "home-banner",
    data() {
        return {}
    },
    components: {
        XMark,
        Warning
    },
    created() {},
    methods: {},
};
</script>
<style lang="scss" scoped>
.modal {
    &__overlay {
        background-color: #000000a8;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 100;
    }

    &__wrapper {
        position: absolute;
        background-color: #171722;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
            rgba(0, 0, 0, 0.22) 0px 15px 12px;
        width: 30%;
        border: 1px solid rgba(47, 51, 109, 0.6);
    }

    &__header {
        display: flex;
        justify-content: flex-end;
        padding: 20px;
    }

    &__close {
        cursor: pointer;
        transition: 0.3s;

        &:hover {
            fill: #970076;
        }
    }

    &__body {
        margin-top: 50px;
        padding: 0 40px 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__icon {
        width: 70px;
        height: 70px;
        box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
    }

    &__information {
        text-align: center;
        margin-left: 20px;
        color: #CCCEEF;
    }

    &__text {
        font-size: 24px;
    }

    &__subtext {
        margin-top: 20px;
    }

    &__footer {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        padding: 0 50px 50px 50px;
    }

    &__button {
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

    }
}
</style>