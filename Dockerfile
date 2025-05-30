# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy application code (excluding folders via .dockerignore)
COPY . .

# Expose the port
EXPOSE 3000

# Environment variables with defaults (NO SENSITIVE DATA)
ENV PORT=3000
ENV BASE_URL="http://localhost:3000"
ENV NODE_ENV="development"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); http.get('http://localhost:3000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Start the application
CMD ["node", "app.js"]