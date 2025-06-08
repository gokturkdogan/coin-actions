<template>
    <div class="form">
        <div class="form__header">
            <h2 class="form__title">Lütfen Giriş Yapınız</h2>
            <h4 class="form__subTitle">Lütfen bilgilerinizi giriniz.</h4>
        </div>
        <div class="form__body">
            <div class="form__group">
                <label class="form__inputTitle">Email*</label>
                <input v-model="email" type="text" class="form__input" placeholder="example@example.com">
            </div>
            <div class="form__group">
                <label class="form__inputTitle">Şifre*</label>
                <input v-model="password" type="password" class="form__input" placeholder="*******">
            </div>
            <div class="form__actions">
                <div class="form__action">
                    <input type="checkbox" class="form__checkBox">
                    <label class="form__inputTitle">Beni hatırla</label>
                </div>
                <div class="form__action">
                    <label class="form__inputTitle">Şifremi unuttum</label>
                    <a href="/" class="form__link">Sıfırla</a>
                </div>
            </div>
        </div>
        <div class="form__footer">
            <button :class="{ '-disabled': !formValid }" class="form__btn" @click="login()">Giriş Yap</button>
        </div>
    </div>
</template>

<script>

export default {
    name: "login-form",
    data() {
        return {
            email: '',
            password: '',
            formValid: false
        }
    },
    watch: {
        email: 'validateForm',
        password: 'validateForm'
    },
    components: {},
    created() { },
    methods: {
        validateForm() {
            this.formValid = this.email.trim() !== '' && this.password.trim() !== ''
        },
        login() {
            if (!this.formValid) {
                return
            }
            this.$store.dispatch('login/login', { email: this.email, password: this.password });
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

    &__body {}

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