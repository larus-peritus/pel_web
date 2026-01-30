# Design Examples

Complete design document examples showing how to apply the design skill.

## Example 1: User Authentication System Design

### Overview
Design for a secure authentication system supporting email/password login, session management, and password reset based on approved requirements.

### Architecture

**System Overview**: Token-based authentication with JWT for stateless API authentication. Sessions stored in Redis for fast access, user data in PostgreSQL for reliability.

**Component Architecture**:
```
Client → API Gateway → Auth Service → Database
                    ↓
                 Redis Cache
```

### Components

**AuthController**
- Purpose: Handle HTTP authentication requests
- Responsibilities:
  - Validate request format
  - Call authentication service
  - Format HTTP responses
  - Handle errors and status codes
- Dependencies: AuthService, ValidationMiddleware

**AuthService**
- Purpose: Core authentication business logic
- Responsibilities:
  - Validate credentials against database
  - Generate and validate JWT tokens
  - Manage session creation/invalidation
  - Handle password hashing and verification
- Dependencies: UserRepository, SessionRepository, JWTUtility, PasswordHasher

**UserRepository**
- Purpose: Data access for user entities
- Responsibilities:
  - CRUD operations for users
  - Email uniqueness validation
  - Password storage and retrieval
- Dependencies: DatabaseConnection

**SessionRepository**
- Purpose: Manage authentication sessions
- Responsibilities:
  - Create and store sessions in Redis
  - Validate session tokens
  - Expire and invalidate sessions
- Dependencies: RedisConnection

### Data Models

**User Model**:
```typescript
interface User {
  id: string           // UUID
  email: string        // Unique, validated
  passwordHash: string // bcrypt hash
  createdAt: Date
  lastLoginAt: Date | null
}

Validation:
- email: RFC 5322 format
- password: min 8 chars, 1 uppercase, 1 number
```

**Session Model**:
```typescript
interface Session {
  token: string       // JWT token
  userId: string      // Reference to User
  expiresAt: Date     // Expiration timestamp
  rememberMe: boolean // Extended session flag
}

Storage: Redis with TTL matching expiresAt
```

### Error Handling

- **Validation Errors**: 400 Bad Request with field-specific errors
- **Auth Failures**: 401 Unauthorized with generic message
- **Rate Limiting**: 429 Too Many Requests after 5 failed attempts
- **Server Errors**: 500 Internal Server Error, log full details

### Testing Strategy

- Unit Tests: AuthService, password hashing, JWT generation (Jest, 85% coverage)
- Integration Tests: Full auth flows with test database (Supertest)
- Security Tests: SQL injection, timing attacks, brute force

### Design Decisions

**Decision: JWT vs Session Cookies**
- Chosen: JWT tokens with Redis session store
- Rationale: Stateless API design, supports mobile clients, Redis provides fast revocation
- Trade-off: Slightly more complex than pure session cookies

**Decision: bcrypt for Password Hashing**
- Chosen: bcrypt with cost factor 12
- Rationale: Industry standard, resistant to GPU attacks, adjustable cost
- Trade-off: Slower than alternatives, acceptable for auth workload

---

## Example 2: Real-Time Notification System Design

### Overview
Event-driven notification system supporting WebSocket delivery, push notifications, and email with user preferences.

### Architecture

**System Overview**: Event-driven architecture where system events trigger notifications routed through a message queue to appropriate delivery channels.

**Component Architecture**:
```
Event Sources → Message Queue (RabbitMQ) → Notification Service
                                          ↓
                      WebSocket Server | Push Service | Email Service
```

### Components

**NotificationService**
- Purpose: Orchestrate notification delivery
- Responsibilities:
  - Consume events from message queue
  - Apply user preferences and filtering
  - Route to appropriate delivery channels
  - Handle delivery failures and retries
- Dependencies: MessageQueue, PreferencesRepository, DeliveryChannels

**WebSocketServer**
- Purpose: Real-time browser delivery
- Responsibilities:
  - Maintain WebSocket connections
  - Deliver notifications to active users
  - Handle connection lifecycle
- Dependencies: RedisAdapter (for multi-server coordination)

**PushNotificationService**
- Purpose: Mobile push notification delivery
- Responsibilities:
  - Format notifications for iOS/Android
  - Send via FCM/APNS
  - Handle device token management
- Dependencies: FCM SDK, APNS SDK, DeviceTokenRepository

### Data Models

**Notification Model**:
```typescript
interface Notification {
  id: string
  userId: string
  type: NotificationType  // enum: info, warning, critical
  title: string
  message: string
  data: Record<string, any>  // Additional context
  createdAt: Date
  readAt: Date | null
}
```

**UserPreferences Model**:
```typescript
interface NotificationPreferences {
  userId: string
  channels: {
    websocket: boolean
    push: boolean
    email: boolean
  }
  types: {
    [type: string]: boolean  // Per-type preferences
  }
  quietHours: {
    enabled: boolean
    start: string  // HH:mm format
    end: string
  }
}
```

### Error Handling

- **Delivery Failures**: Retry 3 times with exponential backoff
- **Invalid Devices**: Remove invalid device tokens
- **Service Outages**: Queue notifications, deliver when restored
- **Critical Alerts**: Bypass user preferences, force delivery

### Testing Strategy

- Unit Tests: Preference filtering, routing logic
- Integration Tests: End-to-end notification delivery
- Load Tests: 1000 concurrent WebSocket connections, 10k notifications/minute

### Design Decisions

**Decision: RabbitMQ vs Kafka**
- Chosen: RabbitMQ
- Rationale: Simpler operational model, sufficient throughput, better routing capabilities
- Trade-off: Less suited for event replay than Kafka

---

## Example 3: File Upload Service Design

### Overview
Scalable file upload service with virus scanning, thumbnail generation, and cloud storage.

### Architecture

**System Overview**: Asynchronous processing pipeline with background workers handling post-upload tasks.

**Data Flow**:
1. Client uploads to pre-signed URL (direct to S3)
2. S3 triggers webhook notification
3. Background worker: scan, process, generate metadata
4. Update database with file details
5. Notify user of completion

### Components

**UploadController**
- Purpose: Generate pre-signed upload URLs
- Responsibilities:
  - Validate user permissions
  - Check file size/type limits
  - Generate S3 pre-signed URL
  - Return upload instructions
- Dependencies: S3Service, AuthMiddleware

**FileProcessingWorker**
- Purpose: Post-upload processing
- Responsibilities:
  - Scan for viruses (ClamAV)
  - Generate thumbnails (images)
  - Extract metadata
  - Update file status in database
- Dependencies: S3Service, ClamAVService, ImageProcessor, FileRepository

### Data Models

**File Model**:
```typescript
interface File {
  id: string
  userId: string
  filename: string
  mimeType: string
  sizeBytes: number
  storageKey: string     // S3 key
  status: FileStatus     // enum: uploading, processing, ready, failed
  thumbnailKey: string | null
  metadata: Record<string, any>
  uploadedAt: Date
}
```

### Error Handling

- **Virus Detected**: Delete file, log security event, notify user
- **Processing Failed**: Retry 3 times, mark as failed, notify user
- **Storage Failure**: Retry with exponential backoff
- **Invalid File Type**: Reject at validation, return 400

### Testing Strategy

- Unit Tests: Validation logic, metadata extraction
- Integration Tests: Full upload and processing pipeline
- Security Tests: Malicious file detection, file bomb protection

---

## Key Design Elements

### Always Include

1. **Overview**: High-level summary of approach
2. **Architecture**: System structure and data flow
3. **Components**: Detailed component responsibilities
4. **Data Models**: Entity definitions with validation
5. **Error Handling**: Strategy for failures
6. **Testing Strategy**: How to validate the design
7. **Design Decisions**: Rationale for key choices

### Quality Indicators

- ✅ Clear traceability to requirements
- ✅ Well-defined component boundaries
- ✅ Comprehensive error handling
- ✅ Testability considerations
- ✅ Documented trade-offs

### Common Patterns

- **Service Layer**: Business logic separated from HTTP handling
- **Repository Pattern**: Data access abstraction
- **Event-Driven**: Asynchronous, loosely coupled processing
- **Background Workers**: Heavy processing off main request path


