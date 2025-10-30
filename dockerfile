# ---- Stage 1: Build the React app ----
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app source code
COPY . .

# Build the React app for production
RUN npm run build

# ---- Stage 2: Serve the build with Nginx ----
FROM nginx:1.25-alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional — for routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]