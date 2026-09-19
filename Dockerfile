FROM node:20-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./

# Build tools such as Tailwind/PostCSS are usually devDependencies,
# so they must be installed before running next build.
RUN npm ci --include=dev

COPY . .

RUN npm run build

# Remove build-only packages after the production build is complete.
RUN npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
