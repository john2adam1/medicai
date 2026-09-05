# MedicAI — Professional Medical Simulation Platform

MedicAI — bu shifokorlar va tibbiyot talabalari uchun sun'iy intellekt (Gemini AI) asosida ishlovchi klinik simulyatsiya platformasi. Loyiha frontend va backend qismlarini bitta toza monorepo tuzilmasida birlashtirgan.

---

## 📁 Loyiha Strukturasi (Monorepo)

```text
medicai/
├── frontend/             # Next.js 16 (React 19, TailwindCSS, Zustand, Framer Motion)
│   ├── src/              # UI komponentlar, sahifalar va do'kon (store)
│   ├── public/           # Statik resurslar va rasmlar
│   ├── .env.example      # Frontend muhit o'zgaruvchilari namunasi
│   └── package.json
│
├── backend/              # Express.js API (TypeScript, Gemini 2.5 Flash, Supabase)
│   ├── src/              # Server logikasi va AI simulyatsiya dvigateli
│   ├── .env.example      # Backend muhit o'zgaruvchilari namunasi
│   ├── vercel.json       # Backend deploy konfiguratsiyasi
│   └── package.json
│
├── package.json          # Monorepo boshqaruv scriptlari
├── .gitignore            # Umumiy ignore qoidalari
└── README.md
```

---

## 🚀 Tezkor Ishga Tushirish (Quick Start)

### 1. Bog'liqliklarni (Dependencies) O'rnatish

Loyiha ildiz (root) papkasida barcha kerakli paketlarni bitta buyruq bilan o'rnating:

```bash
npm run install:all
```

*(Yoki alohida o'rnatish uchun: `npm run install:backend` va `npm run install:frontend`)*

---

### 2. Muhit O'zgaruvchilarini (.env) Sozlash

#### Backend:
`backend/.env.example` faylidan nusxa olib, `backend/.env` faylini yarating:
```env
PORT=4002
GEMINI_API_KEY=sizning_gemini_api_kalitingiz
FRONTEND_URL=http://localhost:3000
```

#### Frontend:
`frontend/.env.example` faylidan nusxa olib, `frontend/.env.local` faylini yarating:
```env
NEXT_PUBLIC_API_URL=http://localhost:4002/api
NEXT_PUBLIC_SUPABASE_URL=sizning_supabase_proyekt_urlingiz
NEXT_PUBLIC_SUPABASE_ANON_KEY=sizning_supabase_anon_kalitingiz
```

---

### 3. Serverlarni Ishga Tushirish

Barcha tizimni (ham Frontend, ham Backend) parallel ravishda ishga tushirish uchun:

```bash
npm run dev
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:4002](http://localhost:4002)

#### Alohida ishga tushirish:
* **Faqat Frontend:** `npm run dev:frontend` (yoki `npm run dev:front`)
* **Faqat Backend:** `npm run dev:backend` (yoki `npm run dev:back`)

---

## 🛠 Qo'shimcha Buyruqlar

* `npm run build` — Ham backend, ham frontend loyihalarini build qiladi.
* `npm run build:backend` — Faqat backend TypeScript kodini compile qiladi.
* `npm run build:frontend` — Faqat Next.js loyihasini production uchun build qiladi.
