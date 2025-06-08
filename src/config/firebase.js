import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCZQH0zLvrX1d46Y6vb0YxCiB9BpMnoo-o",
  authDomain: "coin-actions.firebaseapp.com",
  projectId: "coin-actions",
  storageBucket: "coin-actions.firebasestorage.app",
  messagingSenderId: "402548375660",
  appId: "1:402548375660:web:ea64a6af555f1425ce1849",
  measurementId: "G-EHJ7S33DP6"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
