CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  identifiant VARCHAR(12) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cocktails (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  image VARCHAR(500),
  histoire TEXT,
  origine VARCHAR(200),
  ingredients JSONB DEFAULT '[]',
  disponibilite BOOLEAN DEFAULT true,
  prix DECIMAL(10,2) NOT NULL,
  categorie VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  table_number INT NOT NULL,
  status VARCHAR(20) DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  cocktail_id INT REFERENCES cocktails(id),
  quantity INT NOT NULL DEFAULT 1
);
