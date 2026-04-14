import { initializeApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from 'firebase/auth';
import {
  getFirestore, collection, doc, getDoc, getDocs, addDoc,
  setDoc, updateDoc, deleteDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, increment, arrayUnion, arrayRemove,
  getCountFromServer
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// ── AUTH ──────────────────────────────────────────────────
export const authService = {
  loginWithGoogle: () => signInWithPopup(auth, googleProvider),
  loginWithEmail: (e, p) => signInWithEmailAndPassword(auth, e, p),
  async registerWithEmail(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await userService.createUser(cred.user.uid, { displayName, email, photoURL: '' });
    return cred;
  },
  logout: () => signOut(auth),
  onAuthChange: (cb) => onAuthStateChanged(auth, cb),
};

// ── USERS ─────────────────────────────────────────────────
export const userService = {
  async createUser(uid, data) {
    await setDoc(doc(db, 'users', uid), {
      ...data, role: 'student', bio: '', phone: '',
      enrolledCourses: [], completedLessons: [],
      createdAt: serverTimestamp(),
    });
  },
  async getUser(uid) {
    const s = await getDoc(doc(db, 'users', uid));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  },
  async updateUser(uid, data) { await updateDoc(doc(db, 'users', uid), data); },
  async getAllUsers() {
    const s = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async setRole(uid, role) { await updateDoc(doc(db, 'users', uid), { role }); },
};

// ── COURSES ───────────────────────────────────────────────
export const courseService = {
  async create(data) {
    return addDoc(collection(db, 'courses'), {
      ...data, studentCount: 0, rating: 0, ratingCount: 0,
      createdAt: serverTimestamp(),
    });
  },
  async getAll(cat = null) {
    const q = cat
      ? query(collection(db, 'courses'), where('category', '==', cat), orderBy('createdAt', 'desc'))
      : query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const s = await getDocs(q);
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async get(id) {
    const s = await getDoc(doc(db, 'courses', id));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  },
  async update(id, data) { await updateDoc(doc(db, 'courses', id), data); },
  async delete(id) { await deleteDoc(doc(db, 'courses', id)); },
  async enroll(courseId, userId) {
    await updateDoc(doc(db, 'courses', courseId), { studentCount: increment(1) });
    await updateDoc(doc(db, 'users', userId), { enrolledCourses: arrayUnion(courseId) });
  },
  async unenroll(courseId, userId) {
    await updateDoc(doc(db, 'courses', courseId), { studentCount: increment(-1) });
    await updateDoc(doc(db, 'users', userId), { enrolledCourses: arrayRemove(courseId) });
  },
};

// ── LESSONS ───────────────────────────────────────────────
export const lessonService = {
  async create(data) {
    return addDoc(collection(db, 'lessons'), { ...data, createdAt: serverTimestamp() });
  },
  async getByCourse(courseId) {
    const q = query(collection(db, 'lessons'), where('courseId', '==', courseId), orderBy('order', 'asc'));
    const s = await getDocs(q);
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async get(id) {
    const s = await getDoc(doc(db, 'lessons', id));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  },
  async update(id, data) { await updateDoc(doc(db, 'lessons', id), data); },
  async delete(id) { await deleteDoc(doc(db, 'lessons', id)); },
  async markComplete(lessonId, userId) {
    await updateDoc(doc(db, 'users', userId), { completedLessons: arrayUnion(lessonId) });
  },
};

// ── TEACHERS ──────────────────────────────────────────────
export const teacherService = {
  async getAll() {
    const s = await getDocs(query(collection(db, 'users'), where('role', 'in', ['teacher', 'admin'])));
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  },
};

// ── COMMENTS ──────────────────────────────────────────────
export const commentService = {
  async add(courseId, data) {
    return addDoc(collection(db, 'courses', courseId, 'comments'), {
      ...data, createdAt: serverTimestamp(),
    });
  },
  subscribe(courseId, cb) {
    const q = query(
      collection(db, 'courses', courseId, 'comments'),
      orderBy('createdAt', 'desc'), limit(50)
    );
    return onSnapshot(q, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  },
  async delete(courseId, commentId) {
    await deleteDoc(doc(db, 'courses', courseId, 'comments', commentId));
  },
};

// ── ANNOUNCEMENTS ─────────────────────────────────────────
export const announcementService = {
  async create(data) {
    return addDoc(collection(db, 'announcements'), { ...data, createdAt: serverTimestamp() });
  },
  async getAll() {
    const s = await getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(20)));
    return s.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async delete(id) { await deleteDoc(doc(db, 'announcements', id)); },
};

// ── STORAGE ───────────────────────────────────────────────
export const storageService = {
  async upload(path, file) {
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return getDownloadURL(r);
  },
};
