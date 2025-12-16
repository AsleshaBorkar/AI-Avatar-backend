# ---------- Stage 1: Build ----------
FROM node:18 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

 RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:18-alpine AS production

WORKDIR /app

# Copy only required files from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app ./

# Expose application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
