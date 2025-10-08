# ---- Build stage ----
FROM node:22.19.0-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

# Install dependencies using npm ci with a cache mount for faster subsequent builds
RUN --mount=type=cache,target=/root/.npm npm ci
# RUN npm ci

COPY . .
RUN npm run build

# ---- Run stage ----
FROM nginx:1.28.0-alpine

# # Install Brotli module
# RUN apk add --no-cache nginx-mod-http-brotli

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
