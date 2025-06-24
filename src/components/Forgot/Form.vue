<template>
    <div class="form">
        <div class="form__header">
            <h2 class="form__title">Şifre Sıfırlama</h2>
            <h4 class="form__subTitle">Lütfen email adresinizi giriniz.</h4>
            <router-link to="/login" class="form__headerBtn">Giriş Ekranına Dön</router-link>
        </div>
        <div class="form__body">
            <div class="form__group">
                <label class="form__inputTitle">Email*</label>
                <input v-model="email" type="text" class="form__input" placeholder="example@example.com">
            </div>
        </div>
        <div class="form__footer">
            <button :class="{ '-disabled': !formValid }" class="form__btn" @click="reset()">Sıfırla</button>
        </div>
    </div>
</template>

<script>

export default {
    name: "login-form",
    data() {
        return {
            email: '',
            formValid: false
        }
    },
    watch: {
        email: 'validateForm',
    },
    components: {},
    created() {},
    methods: {
        validateForm() {
            this.formValid = this.email.trim() !== ''
        },
        reset() {
            if (!this.formValid) {
                return
            }
            this.$store.dispatch('login/reset', this.email);
        }
    },
};
</script>
<style lang="scss" scoped>
.form {
    background-color: #0F1021;
    border-radius: 20px;
    padding: 40px 40px 50px;
    border: 1px solid #21234B;
    width: 520px;

    &__header {
        color: #CCCEEF;
        text-align: center;
    }

    &__title {
        font-size: 30px;
        line-height: 40px;
        margin-bottom: 15px;
    }

    &__subTitle {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 33px;
    }

    &__headerBtn {
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        padding: 11px 30px;
        border-radius: 6px;
        align-items: center;
        border: 1px solid #21234B;
        background-color: #070710;
        color: #CCCEEF;
        display: block;
        text-decoration: none;
    }

    &__body {
         margin-top: 30px;
        padding-top: 30px;
        border-top: 2px solid #21234B;
    }

    &__group {
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;
    }

    &__inputTitle {
        color: #D4D5D1;
        font-size: 16px;
    }

    &__input {
        margin-top: 6px;
        padding: 0 24px;
        height: 50px;
        border-radius: 6px;
        font-size: 16px;
        transition: 0.3s ease;
        color: #CCCEEF;
        background-color: #0F1021;
        border: 1px solid #21234B;
        caret-color: #CCCEEF;
        outline: none;

        &:focus {
            border-color: #7130C3;
        }
    }

    &__actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__action {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__checkBox {
        margin-right: 10px;
        cursor: pointer;
        border-radius: .25em;
    }

    &__link {
        margin-left: 10px;
    }

    &__footer {
        margin-top: 30px;
    }

    &__btn {
        cursor: pointer;
        width: 100%;
        border-radius: 6px;
        -webkit-box-pack: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        padding: 15px 30px;
        color: #FFFFFF;
        border-color: #7130C3;
        background-color: #7130C3;
        transition: 0.3s ease;

        &:hover {
            background-color: #FF3BD4;
            border-color: #FF3BD4;
        }

        &.-disabled {
            cursor: not-allowed;
            background-color: #838383;
            border-color: #838383;
            color: #636363;
        }
    }
}
</style>