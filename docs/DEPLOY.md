# Deploy

## Prerequisites

- Node.js 18+
- npm or yarn

## Build

```bash
npm install
npm run build
```

## Environment Variables

```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Sistema DP
```

## Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Vercel

1. Connect repository
2. Set environment variables
3. Deploy

## Nginx Config

```nginx
server {
    listen 80;
    root /var/www/dist;
    index index.html;
    location / {
        try_files \ /index.html;
    }
}
```
