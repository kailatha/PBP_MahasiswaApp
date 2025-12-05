import { auth } from '../config/firebaseConfig';
import { firestore } from '../config/firebaseConfig';
import * as mmkv from '../config/mmkvStorage';

export const login = async (email, password) => {
  // sign in with Firebase Auth (native @react-native-firebase)
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  const u = userCredential.user;
  const user = { uid: u.uid, email: u.email };
  mmkv.saveUser(user);
  return user;
};

export const register = async (email, password) => {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const u = userCredential.user;
  const user = { uid: u.uid, email: u.email };
  mmkv.saveUser(user);
  return user;
};

export const signOut = async () => {
  await auth().signOut();
  mmkv.clearUser();
};

export const getCurrentUserMMKV = () => mmkv.getUser && mmkv.getUser();

export const fetchStudents = async () => {
  // Fetch mahasiswa collection once
  const snapshot = await firestore().collection('mahasiswa').get();
  const students = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return students;
};

export const addStudent = async (student) => {
  // student: object with fields like { Angkatan, NIM, Nama, Prodi }
  const id = student.NIM || undefined;
  if (id) {
    await firestore().collection('mahasiswa').doc(String(id)).set(student);
    return String(id);
  }
  const ref = await firestore().collection('mahasiswa').add(student);
  return ref.id;
};

export default { login, register, signOut, getCurrentUserMMKV, fetchStudents };
