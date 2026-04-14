# Cocktail Bar - Orchestration Docker

Application de gestion de commandes d'un bar, conteneurisée avec Docker.

## Membres de l'équipe

| Nom | Rôle |
|-----|------|
| Thomas Peyrusaubes | Backend / Docker |
| Lorenzo Siniglia | Frontend |

## Architecture

4 conteneurs Docker orchestrés par Docker Compose, sur un réseau bridge dédié.

| Conteneur | Image | Port | Rôle |
|-----------|-------|------|------|
| nginx | nginx:alpine | 80:80 | Reverse proxy, point d'entrée unique |
| api | cocktail-bar-backend | 3000 (interne) | API REST Express |
| frontend | cocktail-bar-frontend | 80 (interne) | Interface React |
| db | postgres:16-alpine | 5432 (interne) | Base de données |

## Prérequis

- Docker
- Docker Compose

## Lancement

git clone https://github.com/thomaspeyr31/cocktail-bar.git
cd cocktail-bar
cp .env.example .env
docker compose up --build

L'application est accessible sur http://localhost

## Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| DB_PASSWORD | postgres | Mot de passe PostgreSQL |
| JWT_SECRET | change-me-in-production | Clé de signature JWT |

## Compte administrateur par défaut

- **Identifiant** : admin2024
- **Mot de passe** : Admin2024!@#$

## Dépôts

| Dépôt | URL |
|-------|-----|
| cocktail-bar | https://github.com/thomaspeyr31/cocktail-bar |
| cocktail-bar-backend | https://github.com/thomaspeyr31/cocktail-bar-backend |
