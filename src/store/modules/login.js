import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'

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
    async login({ commit }, { email, password }) {
      commit('SET_LOGIN_INFO', { email, password });
      commit('SET_IS_LOGIN', false);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        commit('SET_USER', userCredential.user);
        commit('SET_IS_LOGIN', true);
      } catch (error) {
        commit('SET_IS_LOGIN', false);
        console.error('Login failed:', error);
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
          commit('SET_USER', user);
          resolve(!!user);
        });
      });

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
