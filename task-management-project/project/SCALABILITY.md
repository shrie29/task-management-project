# 📈 Scalability & Deployment Note

## Current Architecture

This application follows a **monolithic, layered architecture** with clean separation:
- **Controller layer** → handles HTTP requests/responses
- **Service layer** → contains all business logic
- **Repository layer** → database access via Spring Data JPA
- **Security layer** → stateless JWT (no server-side sessions)

Because JWT is **stateless**, the app is **horizontally scalable from day one** — multiple instances can run without shared session storage.

---

## Scaling Path

### Phase 1: Optimize the Monolith (0–10k users)

- **Connection pooling** (HikariCP, already default in Spring Boot)
- **Database indexing** on `users.username`, `tasks.user_id`, `tasks.status`
- **Redis caching** for frequently-read data (e.g., user profile):
  ```java
  @Cacheable(value = "users", key = "#username")
  public User findUser(String username) { ... }
  ```
- **Async processing** with `@Async` for non-critical operations

### Phase 2: Horizontal Scaling (10k–100k users)

```
         ┌──────────────┐
         │  Load Balancer│  (Nginx / AWS ALB)
         └──────┬───────┘
        ┌───────┼────────┐
        ▼       ▼        ▼
   [Instance1][Instance2][Instance3]
        └───────┬────────┘
                ▼
         ┌──────────────┐
         │  MySQL (RDS) │  (Primary-Replica setup)
         └──────────────┘
                ▼
         ┌──────────────┐
         │  Redis Cache │
         └──────────────┘
```

- Stateless JWT means any instance can serve any request
- Session affinity is NOT needed
- Use **AWS RDS** with read replicas for DB scaling

### Phase 3: Microservices (100k+ users)

Split into independent services:
```
API Gateway (Spring Cloud Gateway)
    ├── auth-service      (handles login/register, issues JWT)
    ├── task-service      (CRUD for tasks)
    ├── user-service      (profile management)
    └── notification-service (email/push — async via Kafka)
```

- **Service discovery**: Eureka / Consul
- **Inter-service auth**: JWT passed in headers between services
- **Message queue**: Kafka or RabbitMQ for async events
- **Distributed tracing**: Zipkin / Jaeger

---

## Docker Deployment

```dockerfile
# Dockerfile (backend)
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/task-management-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: taskdb
      MYSQL_ROOT_PASSWORD: password
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on: [db, redis]
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/taskdb
      SPRING_DATASOURCE_PASSWORD: password

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on: [backend]
```

Run everything with: `docker-compose up --build`

---

## API Versioning Strategy

Currently using **URI versioning** (`/api/v1/...`), which is the simplest approach.

Future: Can add `/api/v2/...` endpoints for breaking changes without affecting existing clients. This is why the controllers are organized under versioned paths from the start.

---

## Logging & Monitoring (Recommended Additions)

- **Structured logging** with Logback + JSON format
- **Actuator** endpoints for health checks (`/actuator/health`)
- **Prometheus + Grafana** for metrics dashboards
- **ELK Stack** (Elasticsearch, Logstash, Kibana) for log aggregation
