# Étape de build
FROM node:18

# Dossier de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code
COPY . .

# Définir la variable d'environnement pour production
ENV NODE_ENV=production

# Exposition du port
EXPOSE 8010

# Commande pour démarrer l'application
CMD ["node", "server.js"]
