import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail  } from 'firebase/auth'
import { auth } from '@/config/firebase'
import router from '@/router';

const login = {
  namespaced: true,
  state: () => ({
    login: {},
    user: null,
    isLogin: false
  }),
  mutations: {
    SET_LOGIN_INFO(state, payload) {
      state.login = payload;
    },
    SET_USER(state, user) {
      state.user = user;
      state.isLogin = !!user;
    },
    SET_IS_LOGIN(state, status) {
      state.isLogin = status;
    }
  },
  actions: {
    async login({ commit, dispatch }, { email, password }) {
      commit('SET_LOGIN_INFO', { email, password });
      commit('SET_IS_LOGIN', false);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user.emailVerified) {
          await signOut(auth);
          dispatch('notify/openNotify', { type: 'warning', message: 'Lütfen önce e-posta adresinizi doğrulayın.' }, { root: true });
          return
        }
        commit('SET_USER', user);
        commit('SET_IS_LOGIN', true);
        router.push({ name: 'Home' });
      } catch (error) {
        let errMsg = '';
        if (error.message === 'Firebase: Error (auth/invalid-email).') {
          errMsg = 'Geçersiz E-posta, Lütfen Kontrol Edip Tekrar Deneyiniz'
        } else if (error.message === 'Firebase: Error (auth/invalid-credential).') {
          errMsg = 'Giriş Bilgilerinizi Kontrol Edip Tekrar Deneyiniz'
        } else {
          errMsg = 'Bir Hata Oluştu Lütfen Daha Sonra Tekrar Deneyin'
        }
        commit('SET_IS_LOGIN', false);
        dispatch('notify/openNotify', { type: 'error', message: errMsg }, { root: true });
        throw error;
      }
    },
    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('SET_USER', null);
        commit('SET_IS_LOGIN', false);
      } catch (error) {
        throw error;
      }
    },
    checkLogin({ commit }) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user && !user.emailVerified) {
            await signOut(auth);
            commit('SET_USER', null);
            commit('SET_IS_LOGIN', false);
            resolve(false);
          } else {
            commit('SET_USER', user);
            commit('SET_IS_LOGIN', !!user);
            resolve(!!user);
          }
        });
      });
    },
    async reset(_, email) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.error('Şifre sıfırlama başarısız:', error);
        throw error;
      }
    }
  },
  getters: {
    isLogin(state) {
      return state.isLogin;
    },
    currentUser(state) {
      return state.user;
    }
  }
};

export default login;
