# 📋 Task Management REST API

A scalable REST API with **JWT Authentication**, **Role-Based Access Control (RBAC)**, and a **React frontend** — built with Spring Boot 3.x and MySQL.

---

## 🚀 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Java 17, Spring Boot 3.2, Spring Security |
| Database  | MySQL 8                                 |
| Auth      | JWT (JJWT 0.11.5)                       |
| Docs      | SpringDoc OpenAPI (Swagger UI)           |
| Frontend  | React 18, Vite, React Router, Axios     |

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── src/main/java/com/primetrade/api/
│   │   ├── config/          # SecurityConfig, SwaggerConfig
│   │   ├── controller/      # AuthController, TaskController, AdminController
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # User, Task (JPA entities)
│   │   ├── exception/       # GlobalExceptionHandler
│   │   ├── repository/      # Spring Data JPA repos
│   │   ├── security/        # JwtUtil, JwtAuthFilter
│   │   └── service/         # AuthService, TaskService
│   └── src/main/resources/
│       └── application.properties
└── frontend/
    └── src/
        ├── context/         # AuthContext (global state)
        ├── pages/           # Login, Register, Dashboard
        └── services/        # api.js (Axios + interceptors)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

### Backend Setup

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd project/backend
   ```

2. **Configure the database**  
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/taskdb?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access Swagger UI**  
   Open → `http://localhost:8080/swagger-ui.html`

### Frontend Setup

```bash
cd project/frontend
npm install
npm run dev
```

Open → `http://localhost:3000`

---

## 🔐 API Endpoints

### Authentication (Public)
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/v1/auth/register` | Register new user |
| POST   | `/api/v1/auth/login`    | Login & get JWT   |

### Tasks (Authenticated — Bearer Token required)
| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | `/api/v1/tasks`     | Get all tasks (current user)    |
| GET    | `/api/v1/tasks/{id}`| Get task by ID                  |
| POST   | `/api/v1/tasks`     | Create new task                 |
| PUT    | `/api/v1/tasks/{id}`| Update task                     |
| DELETE | `/api/v1/tasks/{id}`| Delete task                     |

### Admin (ADMIN role only)
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | `/api/v1/admin/tasks`| Get all tasks      |
| GET    | `/api/v1/admin/users`| Get all users      |

---

## 📊 Database Schema

```sql
CREATE TABLE users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,           -- BCrypt hashed
    role       ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    created_at DATETIME
);

CREATE TABLE tasks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    status      ENUM('TODO','IN_PROGRESS','DONE') NOT NULL DEFAULT 'TODO',
    priority    ENUM('LOW','MEDIUM','HIGH')        NOT NULL DEFAULT 'MEDIUM',
    user_id     BIGINT NOT NULL,
    created_at  DATETIME,
    updated_at  DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔒 Security Features

- **BCrypt** password hashing (strength 10)
- **Stateless JWT** — no sessions stored on server
- **JwtAuthFilter** validates every protected request
- **CORS** configured for React dev server
- **@Valid** + **GlobalExceptionHandler** for input sanitization
- **Method-level security** via `@PreAuthorize`

---

## 📈 Scalability Note

See `SCALABILITY.md` for the full architecture discussion.

---

## 🧪 Testing the API

1. **Register** → `POST /api/v1/auth/register`
2. **Login** → copy the `token` from response
3. In Swagger UI → click **Authorize** → paste `Bearer <token>`
4. Now access protected endpoints

---

## 📬 Postman Collection

Import `TaskManager.postman_collection.json` from the repo root (if included), or use Swagger UI at `/swagger-ui.html`.
