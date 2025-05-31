# API Gestion des étudiants 

## Configuration 

1. Installer NodeJS [https://nodejs.org/en]
2. Créer un projet sur MongoDB [https://docs.google.com/presentation/d/1WUCXZ7wBQjRY1NEfZ9F__SKJXkmIw4d9vRyisXkEXjY/edit#slide=id.g321cca09bd4_0_0]
3. Générer une chaîne de connexion pour NodeJS
4. Ouvrir le fichier server.js et remplacer l'uri par votre chaîne de connexion

## Lancer le server 
1. Installer les dépendances
```shell
npm install
```
2. Lancer le server

```shell
node server.js
```
# 📄 Configuration Google Sign-In

Ce projet utilise Google Sign-In pour permettre l'authentification avec un compte Google.

## ⚙️ Configuration requise

Ajoutez la variable suivante dans un fichier `.env` à la racine de votre projet :
```env
REACT_APP_GOOGLE_CLIENT_ID=511349385041-a1mmmkvmon00pdr9stur60op9igg10ct.apps.googleusercontent.com
```