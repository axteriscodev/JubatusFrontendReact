# Fase 1: Build dell'app React
FROM node:alpine AS builder

# Imposta la directory di lavoro
WORKDIR /app

# Copia package.json e installa le dipendenze
COPY package.json package-lock.json ./
RUN npm install

# Copia il resto del progetto
COPY . .

# Build dell'app
RUN npm run build

# Fase 2: Serve l'app con NGINX
FROM nginx:alpine

# Copia i file di build dentro NGINX
COPY --from=builder /app/build /usr/share/nginx/html

# Copia il file di configurazione personalizzato per NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponi la porta 80
EXPOSE 555

# Avvia NGINX
CMD ["nginx", "-g", "daemon off;"]
