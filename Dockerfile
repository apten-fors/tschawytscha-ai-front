# Build stage
FROM node:22-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code, excluding .git and other unnecessary files
COPY dist/ .
# OR if you need to build in container:
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js ./

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

# Install serve
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy ONLY the built assets from build stage
COPY --from=build /app/dist /app

# Expose port 3000 (serve's default port)
EXPOSE 3000

# Start serve with absolute path
CMD ["serve", "-s", "/app", "-l", "tcp://0.0.0.0:3000"]
