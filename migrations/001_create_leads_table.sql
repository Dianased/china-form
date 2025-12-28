CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  goal TEXT NOT NULL,
  message TEXT,
  ip TEXT,
  user_agent TEXT,
  offer_agreement BOOLEAN NOT NULL,
  privacy_agreement BOOLEAN NOT NULL,
  marketing_agreement BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);