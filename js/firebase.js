import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

class Firebase {
  constructor() {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    // Get a reference to the Realtime Database service
    this.database = getDatabase(this.app);
  }

  // Method to get a reference to a specific path in the database
  getDbRef(path) {
    return ref(this.database, path);
  }

  // Method to write data to a specific path
  writeData(path, data) {
    return set(this.getDbRef(path), data);
  }

  // Method to push new data to a list (generates unique key)
  pushData(path, data) {
    const newListRef = push(this.getDbRef(path));
    return set(newListRef, data);
  }
}

export default new Firebase(); 