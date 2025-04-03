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

# Configure nginx - removed the daemon directive
RUN echo 'server { \
  listen 5555; \
  location / { \
  root /usr/share/nginx/html; \
  index index.html; \
  try_files $uri $uri/ /index.html; \
  gzip on; \
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
  gzip_comp_level 6; \
  gzip_min_length 1000; \
  } \
  }' > /etc/nginx/conf.d/default.conf

# Esponi la porta 80
EXPOSE 5555
# Avvia NGINX
CMD ["nginx", "-g", "daemon off;"]
