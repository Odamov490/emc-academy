// Demo kurslar + darslar + quiz savollar

export const courses = [
  {
    id: 'emc-weekly-esd',
    title: 'Haftalik kurs: ESD (IEC 61000-4-2) asoslari',
    durationType: 'weekly',
    level: 'Beginner → Intermediate',
    description:
      'ESD nima, test darajalari, setup, xatoliklar va amaliy tavsiyalar. Yakunda quiz va sertifikat.',
    price: 0,
    coverEmoji: '⚡️'
  },
  {
    id: 'emc-monthly-radiated',
    title: 'Oylik kurs: Radiated Emission (30–1000 MHz) amaliyoti',
    durationType: 'monthly',
    level: 'Intermediate',
    description:
      'OATS/Camera tushunchasi, antenna/polarizatsiya, limitlar, peak vs avg, report tayyorlash.',
    price: 0,
    coverEmoji: '📡'
  }
];

export const lessonsByCourse = {
  'emc-weekly-esd': [
    {
      id: 'l1',
      title: 'ESD: Asosiy tushunchalar',
      content:
        'ESD — elektrostatik razryad. Inson tanasi/obyektlarda zaryad yig‘ilishi va razryad paytida elektronika ishdan chiqishi mumkin. Bu darsda ESD manbalari va risklar ko‘rib chiqiladi.'
    },
    {
      id: 'l2',
      title: 'IEC 61000-4-2: test darajalari va setup',
      content:
        'Kontakt va havo razryadlari, 2/4/6/8 kV (kontakt) va 2/4/8/15 kV (havo) kabi darajalar, EUT joylashuvi, HCP/VCP va qayta takrorlanuvchanlik.'
    },
    {
      id: 'l3',
      title: 'Xulosa va report: qanday yoziladi?',
      content:
        'Reportda: test sharoiti, EUT holati, pass/fail mezoni, kuzatilgan nosozliklar, tiklanish va takrorlashlar, fotolar va konfiguratsiya bo‘lishi kerak.'
    }
  ],
  'emc-monthly-radiated': [
    {
      id: 'l1',
      title: 'Radiated Emission: o‘lchov zanjiri',
      content:
        'Antenna → kabel → preamp → spektr analizator. O‘lchov birliklari (dBµV/m), RBW/VBW, detector turlari, peak/avg farqi.'
    },
    {
      id: 'l2',
      title: 'Setup: masofa, balandlik, polarizatsiya',
      content:
        '3 m / 10 m masofa, antenna balandligi skani, turntable 0–360°, gorizontal/vertikal polarizatsiya va worst-case qidirish.'
    },
    {
      id: 'l3',
      title: 'Limitlar va natijani baholash',
      content:
        'CISPR limitlari konsepsiyasi, margin, measurement uncertainty, natijalarni jadval va grafikda berish, pass/fail qoidalari.'
    },
    {
      id: 'l4',
      title: 'Report tayyorlash',
      content:
        'Report shablon: EUT, konfiguratsiya, ish rejimlari, fotolar, o‘lchov jadvali, grafiklar, xulosa va imzo.'
    }
  ]
};

export const questionsByCourse = {
  'emc-weekly-esd': [
    {
      id: 'q1',
      question: 'ESD nima?',
      options: [
        'Elektrostatik razryad',
        'Elektr motor shovqini',
        'Radiatsion fon',
        'Wi‑Fi protokoli'
      ],
      correctIndex: 0
    },
    {
      id: 'q2',
      question: 'IEC 61000‑4‑2 da kontakt razryad odatda qaysi diapazonda bo‘ladi?',
      options: ['2–8 kV', '30–1000 MHz', '0–1 V', '1–10 A'],
      correctIndex: 0
    },
    {
      id: 'q3',
      question: 'ESD testida “worst-case” deganda nima nazarda tutiladi?',
      options: [
        'Eng yomon ta’sir beradigan nuqta/holatni topish',
        'Eng qisqa kabel ishlatish',
        'Faqat bitta razryad berish',
        'Faqat Wi‑Fi o‘chirilgan holat'
      ],
      correctIndex: 0
    }
  ],
  'emc-monthly-radiated': [
    {
      id: 'q1',
      question: 'Radiated emission o‘lchov birligi ko‘pincha qaysi ko‘rinishda beriladi?',
      options: ['dBµV/m', '°C', 'kg', 'ms'],
      correctIndex: 0
    },
    {
      id: 'q2',
      question: 'Peak detector nimaga kerak?',
      options: [
        'Maksimal (eng yuqori) qiymatni tez topish',
        'Tarmoq kuchlanishini o‘lchash',
        'Namlikni o‘lchash',
        'Router kanalini tanlash'
      ],
      correctIndex: 0
    },
    {
      id: 'q3',
      question: 'Antenna polarizatsiyasi nima uchun almashtiriladi?',
      options: [
        'Gorizontal/vertikal holatlarda turli maksimumlar bo‘lishi mumkin',
        'Chunki kabel qisqaradi',
        'Chunki internet tezlashadi',
        'Chunki RBW o‘zgarmaydi'
      ],
      correctIndex: 0
    }
  ]
};

export function getCourse(courseId) {
  return courses.find((c) => c.id === courseId);
}

export function getLessons(courseId) {
  return lessonsByCourse[courseId] || [];
}

export function getQuestions(courseId) {
  return questionsByCourse[courseId] || [];
}
