# URL Shortener Service

A high-performance, scalable URL shortener service built with Node.js, Express, MongoDB, and Redis. This project demonstrates various optimization techniques and architectural patterns for building production-ready web services.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **URL Redirection**: Fast redirection to original URLs with click tracking
- **Analytics**: Get detailed statistics for shortened URLs including click counts
- **Caching**: Multi-layer Redis caching with consistent hashing for optimal performance
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **Horizontal Scaling**: Load balancer support with multiple server instances
- **Real-time Analytics**: Redis Streams for efficient click data processing
- **Auto-expiration**: TTL-based URL expiration (7 days default)
- **Performance Monitoring**: Comprehensive benchmarking and metrics

## 🏗️ Architecture

The service uses a microservices-inspired architecture with the following components:

- **Express.js Server**: RESTful API endpoints
- **MongoDB**: Primary data storage for URLs and metadata
- **Redis Cluster**: Distributed caching with consistent hashing
- **Redis Streams**: Real-time click event processing
- **Background Workers**: Bulk write operations for analytics
- **Load Balancer**: Nginx for horizontal scaling
- **Docker**: Containerized deployment

### Architecture Diagram

![URL Shortener Architecture](./benchmark/pics/URL%20Shortener%20Architecture.png)

*The architecture diagram shows the complete system design including load balancing, caching layers, and data flow between components.*

### Performance Optimizations

1. **Multi-layered Caching**: Redis cache with consistent hashing across multiple instances
2. **Horizontal Scaling**: Load balancer with multiple server instances
3. **Bulk Operations**: Batched database writes for analytics
4. **Connection Pooling**: Optimized database and Redis connections
5. **TTL Management**: Automatic cleanup of expired URLs

## 📊 Performance Benchmarks

Comprehensive performance testing across different optimization stages:

### Measurement Points Overview

The performance benchmarks track the following optimization stages:

- **Point 1**: TTL and Pre-caching - Implementation of time-to-live functionality and cache warming strategies
- **Point 2**: Redis Caching - Multi-layer Redis caching system with distributed cache management
- **Point 3**: Consistent Hashing - Distributed caching across multiple Redis instances using consistent hashing algorithm
- **Point 4**: Redis Streams - Real-time analytics processing with background bulk write operations
- **Point 5**: Horizontal Scaling + Load Balancing - Multiple server instances with Nginx load balancer

### Performance Overview Charts

#### Requests per Second Comparison

![Requests per Second - Main Comparison](./benchmark/pics/Req_Sec%20Main.png)

*Main performance comparison showing local vs render environment across all optimization points*

#### Average Latency Comparison

![Average Latency - Main Comparison](./benchmark/pics/Avg_Lat%20Main.png)

*Latency analysis across different environments and optimization stages*

#### Horizontal Scaling Performance

![Requests per Second - Scaling](./benchmark/pics/Req_Sec%20Scale.png)

*Load balancer and horizontal scaling impact on throughput*

![Average Latency - Scaling](./benchmark/pics/Avg%20Latency%20Scale.png)

*Latency improvements with load balancing and horizontal scaling*

### Detailed Performance Data

#### Local Environment Performance

| Optimization Point               | 1 Conn | 5 Conn | 10 Conn | 25 Conn | 50 Conn | 100 Conn | 300 Conn | 400 Conn | 500 Conn |
| -------------------------------- | ------ | ------ | ------- | ------- | ------- | -------- | -------- | -------- | -------- |
| **Point 1 (No Cache)**     | 45.95  | 52.55  | 155.02  | 253.58  | 432.61  | 741.83   | -        | -        | -        |
| **Point 2**                | 57.39  | 57.25  | 62.41   | 167.95  | 247.55  | 331.57   | -        | -        | -        |
| **Point 3**                | 65.67  | 67.35  | 70.25   | 159.74  | 250.5   | 333.75   | -        | -        | -        |
| **Point 4**                | 74.61  | 76.37  | 77.34   | 138.52  | 238.1   | 310.61   | 247.49   | 200.26   | 117.56   |
| **Point 5 (LB + Scaling)** | 75.17  | 86.16  | 70.04   | 148.22  | 243.65  | 309.02   | 391.49   | 301.21   | 218.85   |

*Requests per second (req/sec) measurements*

#### Local Environment Latency

| Optimization Point               | 1 Conn | 5 Conn | 10 Conn | 25 Conn | 50 Conn | 100 Conn | 300 Conn | 400 Conn | 500 Conn |
| -------------------------------- | ------ | ------ | ------- | ------- | ------- | -------- | -------- | -------- | -------- |
| **Point 1 (No Cache)**     | 8.16   | 28.18  | 171.32  | 301.5   | 382.92  | 403.5    | -        | -        | -        |
| **Point 2**                | 20.48  | 27.43  | 34.32   | 168.4   | 260.76  | 338.55   | -        | -        | -        |
| **Point 3**                | 26.83  | 36.8   | 34.68   | 178.37  | 265.26  | 336.25   | -        | -        | -        |
| **Point 4**                | 42.89  | 43.26  | 50.48   | 139.74  | 248.17  | 318.04   | 333.75   | 463.62   | 88.23    |
| **Point 5 (LB + Scaling)** | 46.46  | 112.35 | 37.76   | 155.28  | 255.48  | 310.27   | 391.49   | 391.43   | 70.82    |

*Average latency (ms) measurements*

#### Production Environment (Render) Performance

| Optimization Point           | 1 Conn | 5 Conn | 10 Conn | 25 Conn | 50 Conn | 100 Conn |
| ---------------------------- | ------ | ------ | ------- | ------- | ------- | -------- |
| **Point 1 (No Cache)** | 4.49   | 23.26  | 47.43   | 75.55   | 87.45   | 86.03    |
| **Point 2**            | 4.59   | 23.35  | 47.68   | 110.91  | 154.22  | 187.93   |
| **Point 3**            | 4.6    | 24.74  | 47.62   | 110.81  | 131.12  | 151.49   |
| **Point 4**            | 4.3    | 21.88  | 42.58   | 91.5    | 118.11  | 138.11   |

*Requests per second (req/sec) measurements*

#### Production Environment Latency

| Optimization Point           | 1 Conn | 5 Conn | 10 Conn | 25 Conn | 50 Conn | 100 Conn |
| ---------------------------- | ------ | ------ | ------- | ------- | ------- | -------- |
| **Point 1 (No Cache)** | 213.09 | 211.27 | 207.39  | 326.39  | 548.46  | 1090     |
| **Point 2**            | 212.25 | 210.77 | 205.6   | 220.36  | 319.69  | 518.89   |
| **Point 3**            | 212.99 | 199.09 | 204.66  | 215.68  | 369.46  | 622.35   |
| **Point 4**            | 223.58 | 220.65 | 231.54  | 271.03  | 406.38  | 701.45   |

*Average latency (ms) measurements*

### Key Performance Insights

1. **Local vs Production**: Local environment significantly outperforms production (up to 8x better throughput)
2. **Horizontal Scaling Impact**: Load balancing provides substantial benefits at high connection counts (300+ connections)
3. **Caching Benefits**: Multi-layer caching improves performance but shows diminishing returns in some scenarios
4. **Latency Patterns**: Production environment has consistently higher baseline latency (~200ms) compared to local (~8-46ms)

*Detailed benchmark results and raw data available in `/benchmark` directory*

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis (multiple instances with consistent hashing)
- **Load Balancer**: Nginx
- **Process Management**: Node-cron for scheduled tasks
- **Logging**: Winston with structured logging
- **Validation**: Validator.js for URL validation
- **ID Generation**: Nanoid for short URL keys
- **Containerization**: Docker & Docker Compose

## 📋 API Endpoints

### POST `/api/v1/shorten`

Create a shortened URL

**Request Body:**

```json
{
  "originalUrl": "https://www.example.com/very/long/url"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "originalUrl": "https://www.example.com/very/long/url",
    "shortUrlKey": "abc123X",
    "shortUrl": "http://localhost:3000/abc123X"
  }
}
```

### GET `/api/v1/:shortUrlKey`

Redirect to the original URL

**Response:** 301 redirect to original URL

### GET `/api/v1/stats/:shortUrlKey`

Get URL statistics

**Response:**

```json
{
  "status": "success",
  "data": {
    "originalUrl": "https://www.example.com/very/long/url",
    "shortUrlKey": "abc123X",
    "clickCount": 42,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "cacheMetrics": {
      "hitRate": 85,
      "avgLatency": 45
    }
  }
}
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Redis
- Docker (optional)

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd url-shortener
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:

```env
BASE_URL=http://localhost
NODE_ENV=development
PORT=3000

# Database Configuration
MONGO_URI=<your-mongo-uri>
 
# Redis Configuration - Primary
REDIS_PASSWORD1=<your-redis-password>
REDIS_HOST1=<your-redis-host>
REDIS_PORT1=<your-redis-port>

# Redis Configuration - Secondary
REDIS_PASSWORD2=<your-redis-password>
REDIS_HOST2=<your-redis-host>
REDIS_PORT2=<your-redis-port>
```

4. **Start the services**

```bash
# Start MongoDB and Redis
# Then start the application
npm start app.js
```

### Docker Deployment

1. **Using Docker Compose**

```bash
docker compose up -d
```

This starts:

- MongoDB
- Redis cluster (2 instances)
- URL Shortener application
- Nginx load balancer

2. **Access the service**

- API: `http://localhost:3000`
- Load Balanced: `http://localhost:80`

### Load Balanced Setup

For horizontal scaling with multiple instances:

1. **Start multiple app instances**

```bash
# Terminal 1
PORT=3001 npm start app.js

# Terminal 2  
PORT=3002 npm start app.js

# Terminal 3
PORT=3003 npm start app.js
```

2. **Configure Nginx**

```nginx
upstream backend_pool {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 80;
    server_name _;
  
    location / {
        proxy_pass http://backend_pool;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        send_timeout 30s;
    }
}
```

## 🔧 Configuration

### Rate Limiting

Production environment includes rate limiting:

- 100 requests per 15 minutes per IP for URL shortening
- Configurable in `config/rate-limiter.js`

### Cache Configuration

- **TTL**: 7 days for URL cache entries
- **Consistent Hashing**: Distributes load across Redis instances
- **Metrics**: Real-time cache hit/miss tracking

### Database Schema

```javascript
{
  originalUrl: String (required, unique),
  shortUrlKey: String (required, unique, indexed),
  clickCount: Number (default: 0),
  expiresAt: Date (default: +7 days),
  createdAt: Date,
  updatedAt: Date
}
```

## 📈 Monitoring & Analytics

### Background Workers

- **Bulk Write Worker**: Processes click events in batches every 10 minutes
- **Redis Streams**: Real-time event processing for analytics
- **Metrics Collection**: Cache performance and latency tracking

### Logging

Structured logging with different levels:

- **HTTP Requests**: Request/response logging with Morgan
- **Application Events**: Business logic events
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response times and cache statistics

### Benchmarking

Comprehensive performance testing suite in `/benchmark`:

- Load testing scripts
- Performance comparison across optimization stages
- Graph generation for visualizing results
- Multiple environment testing (local vs production)

## 🧪 Testing

### Load Testing

```bash
# Run benchmark tests
cd benchmark/scripts
./isolated_cache.sh
./wrapper_get.sh
```

### Performance Graphs

```bash
cd benchmark
python graph.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔍 Architecture Decisions

### Why Redis Consistent Hashing?

- Distributes load evenly across multiple Redis instances
- Provides fault tolerance and horizontal scalability
- Minimizes cache misses during instance failures

### Why Redis Streams for Analytics?

- Efficient real-time event processing
- Decouples click tracking from main request flow
- Enables batched database operations for better performance

### Why MongoDB?

- Flexible schema for URL metadata
- Built-in TTL support for automatic cleanup
- Excellent performance for read-heavy workloads

### Why Horizontal Scaling?

- Better resource utilization
- Improved fault tolerance
- Higher throughput under load

## 📊 Performance Insights

Based on extensive benchmarking, the service demonstrates:

1. **Caching Impact**: 2-3x performance improvement with Redis caching
2. **Horizontal Scaling**: Linear performance scaling up to certain thresholds
3. **Load Balancing**: Better resource distribution and fault tolerance
4. **Environment Differences**: Significant performance variations between local and cloud environments

### Optimization Stages

The project went through 9 distinct optimization stages:

1. **Baseline**: Initial implementation
2. **Database Optimization**: Query optimization and indexing
3. **Validation & Error Handling**: Input validation and proper error responses
4. **TTL & Pre-caching**: Time-to-live implementation and cache warming
5. **Redis Caching**: Multi-layer caching implementation
6. **Rate Limiting**: API protection and abuse prevention
7. **Consistent Hashing**: Distributed caching across multiple Redis instances
8. **Redis Streams**: Real-time analytics with background processing
9. **Horizontal Scaling**: Load balancer with multiple server instances

Each stage's performance data is meticulously documented in the `/benchmark` directory with corresponding test results and analysis.

The benchmarking suite provides detailed analysis of each optimization stage, helping understand the impact of different architectural decisions.

---

For detailed performance analysis and benchmark results, see the comprehensive charts and data in the `/benchmark` directory.
