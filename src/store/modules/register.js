import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const register = {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  actions: {
    async register({ commit }, { email, password, displayName }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName });
        await sendEmailVerification(user);
        await setDoc(doc(db, 'users', user.uid), {
          email: email,
          displayName: displayName,
          isPremium: false, 
          createdAt: new Date()
        });

      } catch (error) {
        console.error('Register failed:', error);
        throw error;
      }
    }
  },
  getters: {}
};

export default register;
