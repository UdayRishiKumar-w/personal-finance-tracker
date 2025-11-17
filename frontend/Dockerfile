# ---- Build stage ----
FROM node:22.21.1-alpine AS build

WORKDIR /app

ARG VITE_API_BASE=http://localhost:8080/api
ARG VITE_NONCE_ENABLED=true

ENV VITE_API_BASE=${VITE_API_BASE}
ENV VITE_NONCE_ENABLED=${VITE_NONCE_ENABLED}

COPY package.json package-lock.json* ./

# https://overcast.blog/13-docker-chaching-strategies-you-should-know-b6b37e556781
# Install dependencies using npm ci with a cache mount for faster subsequent builds
RUN --mount=type=cache,target=/root/.npm,id=npm-cache-pft,sharing=locked npm ci --ignore-scripts
# RUN npm ci

COPY . .
RUN npm run build

# ---- Run stage ----
FROM nginx:1.28.0-alpine

# # Install Brotli module and server header remover module
# RUN apk add --no-cache nginx-mod-http-brotli nginx-mod-http-headers-more

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
