# Omniamus Landing (Next.js + Vercel)

Landing page minimalist, „teasing-not-teaching”, cu:
- rezumat accesibil (din whitepaper)
- formular waitlist + rezervare username
- pagină Legal & Ethical (high-level) + link la PDF
- API route `/api/waitlist` care salvează în PostgreSQL (prin `pg`), dacă setezi `DATABASE_URL`

## Rulare locală
```bash
npm i
npm run dev
```

## Configurare DB (opțional, recomandat)
Creează tabelul (PostgreSQL):
```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  role TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
```

Setează env var:
- `DATABASE_URL=postgres://user:pass@host:5432/dbname`

Dacă `DATABASE_URL` lipsește, endpoint-ul răspunde OK dar nu persistă (returnează `stored:false`).
În Vercel, adaugă variabila în Project Settings → Environment Variables.

## PDF-uri
Înlocuiește placeholder-urile din `public/docs/` cu PDF-urile reale.
Linkurile din site:
- `/docs/Omniamus_Whitepaper_Official_EN.pdf`
- `/docs/Omniamus_Legal_Ethical_Addendum_EN.pdf`
