# EMC Academy (Demo)

## Ishga tushirish

```bash
npm install
npm run dev
```

## Demo login
- Oddiy user: istalgan email
- Admin: `admin@emc.uz` (Admin panel ochiladi)

## Google Sign-In + Firestore sozlash
1. `.env.example` faylidan nusxa olib `.env` yarating va Firebase qiymatlarini to‘ldiring:

```bash
cp .env.example .env
```

2. `.env` ichida quyidagilar bo‘lishi kerak:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

3. Firebase Console’da:
   - **Authentication → Sign-in method → Google** ni yoqing.
   - **Firestore Database** ni yoqing.

Google bilan kirilganda `users/{uid}` hujjati yaratiladi/yangilanadi:
- `uid`
- `email`
- `displayName`
- `photoURL`
- `provider` (`google`)
- `createdAt` (faqat birinchi marta)
- `lastLoginAt` (har kirishda)

## Qanday sertifikat chiqadi?
1) Kursga enroll
2) Darslarni 100% tugatish
3) Quiz (>=70%)
4) Sertifikat avtomatik beriladi: `/certificate/:certNo`
5) Verify: `/verify/:certNo`

> Eslatma: demo holatda ma’lumotlar browser localStorage’da saqlanadi. Google kirish bo‘lsa, profil Firestore’da ham saqlanadi.
