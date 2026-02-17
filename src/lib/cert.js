import { v4 as uuidv4 } from 'uuid';

const COUNTER_KEY = 'emc_academy_cert_counter_v1';

function nextSeq() {
  const raw = localStorage.getItem(COUNTER_KEY);
  const cur = raw ? parseInt(raw, 10) : 0;
  const next = Number.isFinite(cur) ? cur + 1 : 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return next;
}

export function generateCertNo() {
  const year = new Date().getFullYear();
  const seq = nextSeq();
  return `EMC-${year}-${String(seq).padStart(6, '0')}`;
}

export function generateHash() {
  // simple unique token for demo (realda sha256/signature qilamiz)
  return uuidv4().replaceAll('-', '');
}
