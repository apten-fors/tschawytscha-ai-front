# Build stage
FROM node:22-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

# Install serve
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist /app

# Expose port 3000 (serve's default port)
EXPOSE 3000

# Start serve with absolute path
CMD ["serve", "-s", "/app", "-l", "3000"]
