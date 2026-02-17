import { loadState, saveState } from './storage.js';
import { courses } from './demoData.js';

const defaultState = {
  user: null,
  enrollments: {},
  lessonProgress: {},
  quizAttempts: {},
  certificates: {}
};

export function initState() {
  const s = loadState();
  if (!s) {
    saveState(defaultState);
    return structuredClone(defaultState);
  }
  // migrate fields if missing
  const merged = { ...defaultState, ...s };
  saveState(merged);
  return merged;
}

export function setUser(state, user) {
  const next = { ...state, user };
  saveState(next);
  return next;
}

export function enroll(state, courseId) {
  const next = {
    ...state,
    enrollments: {
      ...state.enrollments,
      [courseId]: {
        status: 'enrolled',
        startedAt: state.enrollments[courseId]?.startedAt || new Date().toISOString()
      }
    }
  };
  saveState(next);
  return next;
}

export function markLessonDone(state, courseId, lessonId) {
  const key = `${courseId}:${lessonId}`;
  const next = {
    ...state,
    lessonProgress: {
      ...state.lessonProgress,
      [key]: { done: true, doneAt: new Date().toISOString() }
    }
  };
  saveState(next);
  return next;
}

export function isLessonDone(state, courseId, lessonId) {
  const key = `${courseId}:${lessonId}`;
  return Boolean(state.lessonProgress[key]?.done);
}

export function getCourseCompletion(state, courseId, lessons) {
  if (!lessons.length) return { done: 0, total: 0, percent: 0 };
  const done = lessons.filter((l) => isLessonDone(state, courseId, l.id)).length;
  const total = lessons.length;
  const percent = Math.round((done / total) * 100);
  return { done, total, percent };
}

export function saveQuizAttempt(state, courseId, attempt) {
  const next = {
    ...state,
    quizAttempts: {
      ...state.quizAttempts,
      [courseId]: [...(state.quizAttempts[courseId] || []), attempt]
    }
  };
  saveState(next);
  return next;
}

export function lastAttempt(state, courseId) {
  const arr = state.quizAttempts[courseId] || [];
  return arr[arr.length - 1] || null;
}

export function canIssueCertificate(state, courseId, lessons, passingScore = 70) {
  const enrolled = Boolean(state.enrollments[courseId]);
  const completion = getCourseCompletion(state, courseId, lessons);
  const att = lastAttempt(state, courseId);
  return enrolled && completion.percent === 100 && att && att.passed && att.score >= passingScore;
}

export function issueCertificate(state, courseId, cert) {
  const next = {
    ...state,
    certificates: {
      ...state.certificates,
      [cert.certNo]: cert
    }
  };
  saveState(next);
  return next;
}

export function findCertificate(state, certNo) {
  return state.certificates[certNo] || null;
}

export function listCertificatesForUser(state, userId) {
  return Object.values(state.certificates).filter((c) => c.userId === userId);
}

export function listEnrollments(state) {
  return courses.map((c) => ({ courseId: c.id, enrollment: state.enrollments[c.id] || null }));
}
