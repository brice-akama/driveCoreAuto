# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy app dependencies
COPY package*.json ./
RUN npm install

# Copy everything including env file
COPY . .

# 👇 COPY .env.production manually
COPY .env.production .env.local


# Build app
RUN npm run build

# Remove dev deps (optional)
RUN npm prune --production

# Expose and set environment
ENV NODE_ENV=production
EXPOSE 3000

# Start the app
CMD ["npm", "start"]