# Cocktail Bar Backend

API REST Express.js pour la gestion des commandes d'un bar à cocktails.

## Membres de l'équipe

| Nom | Rôle |
|-----|------|
| Thomas Peyrusaubes | Backend / Docker |
| Lorenzo Siniglia | Frontend |

## Prérequis

- Node.js 20+
- PostgreSQL 16+
- Docker (optionnel)

## Installation

npm install
cp .env.example .env

## Lancement

npm run dev
npm start

## Tests

npm test

## Docker

docker build -t cocktail-bar-backend .
docker run -p 3000:3000 --env-file .env cocktail-bar-backend

## Compte administrateur par défaut

- **Identifiant** : `admin2024`
- **Mot de passe** : `Admin2024!@#$`

## Endpoints API

### Authentification
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | /api/auth/login | Public | Connexion, retourne JWT |

### Utilisateurs
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | /api/users | Admin | Liste des utilisateurs |
| POST | /api/users | Admin | Créer un utilisateur |
| PUT | /api/users/:id | Admin | Modifier le rôle |
| DELETE | /api/users/:id | Admin | Supprimer |

### Cocktails
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | /api/cocktails | Public | Liste (filtres: ingredient, category, search) |
| GET | /api/cocktails/:id | Public | Détail |
| POST | /api/cocktails | Admin | Ajouter |
| PUT | /api/cocktails/:id | Admin | Modifier |
| PATCH | /api/cocktails/:id | Admin | Modifier partiellement |
| DELETE | /api/cocktails/:id | Admin | Supprimer |

### Commandes
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | /api/orders | Public | Liste (filtres: status, table) |
| GET | /api/orders/:id | Public | Détail avec items |
| POST | /api/orders | Public | Créer |
| PUT | /api/orders/:id | Staff+ | Modifier statut/contenu |
| DELETE | /api/orders/:id | Staff+ | Supprimer |

## Structure du projet

src/
├── app.js
├── server.js
├── config/db.js
├── middleware/
│   ├── auth.js
│   └── validate.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── cocktails.js
│   └── orders.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── cocktailController.js
│   └── orderController.js
└── db/
    ├── init.sql
    └── seed.sql
tests/
├── setup.js
├── auth.test.js
├── users.test.js
├── cocktails.test.js
└── orders.test.js
