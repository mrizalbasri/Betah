FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# ponytail: npm ci fails on lockfile peer dependency mismatches with React 19/HeroUI; use npm install --legacy-peer-deps for reliable CI builds
RUN npm install --legacy-peer-deps

COPY . .

# Pass build time environment variables if needed
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
