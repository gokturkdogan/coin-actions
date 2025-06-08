import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification  } from 'firebase/auth';
import { auth } from '@/config/firebase';

const register = {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  actions: {
    async register({ commit }, { email, password, displayName }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //burda araya girerek update methodunu 3 saniye geicktirip notify componenti ile başarı ile kayıto lundu gibi bir mesaj bastırabiliriz
        await updateProfile(userCredential.user, { displayName });
        await sendEmailVerification(userCredential.user);
      } catch (error) {
        console.error('Register failed:', error);
        throw error;
      }
    }
  },
  getters: {}
};

export default register;
