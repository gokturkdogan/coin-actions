import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
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
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let userData = { ...user };
        if (userDocSnap.exists()) {
          const docData = userDocSnap.data();
          userData.isPremium = docData.isPremium ?? false;
        }
        commit('SET_USER', userData);
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
        onAuthStateChanged(auth, (user) => {
          if (!user) {
            commit('SET_USER', null);
            commit('SET_IS_LOGIN', false);
            resolve(false);
          } else if (!user.emailVerified) {
            signOut(auth).then(() => {
              commit('SET_USER', null);
              commit('SET_IS_LOGIN', false);
              resolve(false);
            });
          } else {
            const userDocRef = doc(db, 'users', user.uid);
            getDoc(userDocRef).then(userDocSnap => {
              let userData = { ...user };
              if (userDocSnap.exists()) {
                const docData = userDocSnap.data();
                userData.isPremium = docData.isPremium ?? false;
              }
              commit('SET_USER', userData);
              commit('SET_IS_LOGIN', true);
              resolve(true);
            }).catch(() => {
              commit('SET_USER', user);
              commit('SET_IS_LOGIN', true);
              resolve(true);
            });
          }
        });
      });
    },
    async reset({ dispatch }, email) {
      try {
        await sendPasswordResetEmail(auth, email);
        dispatch('notify/openNotify', { type: 'success', message: 'Parola Sıfırlama Bağlantısı E postanıza Gönderildi, Lütfen Spam Kutunuzu Kontrol Edin' }, { root: true });
      } catch (error) {
         dispatch('notify/openNotify', { type: 'warning', message: 'Geçersiz E-posta, Lütfen Kontrol Edip Tekrar Deneyiniz' }, { root: true });
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
