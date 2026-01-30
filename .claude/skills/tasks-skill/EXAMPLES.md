# Task Planning Examples

Complete task breakdown examples for different types of features.

## Example 1: User Authentication System

### Implementation Tasks: User Authentication

**Overview**: Implement secure authentication supporting registration, login, and password reset.

**Strategy**: Foundation-first with early risk validation

**Task List**:

- [ ] 1. Set up authentication foundation
- [ ] 1.1 Create project structure and core interfaces
  - Set up directory structure: /models, /services, /controllers, /repositories
  - Define TypeScript interfaces for User, Session, AuthRequest, AuthResponse
  - Create base configuration for environment variables
  - Install dependencies: bcrypt, jsonwebtoken, express-validator
  - Requirements: REQ-1.1

- [ ] 1.2 Set up testing framework and database
  - Configure Jest for unit and integration testing
  - Set up test database with Docker Compose
  - Create database migration scripts for users and sessions tables
  - Configure test environment with separate DB
  - Requirements: REQ-1.1, REQ-2.1

- [ ] 2. Implement core data models
- [ ] 2.1 Create User model with validation
  - Implement User class with id, email, passwordHash, createdAt fields
  - Add validation methods for email format (RFC 5322)
  - Add validation for password strength (8+ chars, uppercase, number)
  - Write unit tests covering valid/invalid scenarios
  - Requirements: REQ-1.2, REQ-2.1

- [ ] 2.2 Implement Session model and storage
  - Create Session class with token, userId, expiresAt, rememberMe fields
  - Implement Redis connection and session storage functions
  - Add session expiration logic (24h default, 30d with rememberMe)
  - Write unit tests for session creation and expiration
  - Requirements: REQ-1.2, REQ-4.1

- [ ] 3. Create authentication services (depends on 2.1, 2.2)
- [ ] 3.1 Implement user registration service
  - Create UserService with register method
  - Add email uniqueness check
  - Implement password hashing with bcrypt (cost 12)
  - Add error handling for duplicate emails
  - Write unit tests for registration scenarios
  - Requirements: REQ-1.2

- [ ] 3.2 Implement login and session service
  - Create AuthService with login method
  - Implement password verification
  - Add JWT token generation with 24h expiry
  - Implement session creation in Redis
  - Add account lockout after 3 failed attempts (15 min)
  - Write unit tests for login success and failure cases
  - Requirements: REQ-1.2, REQ-4.1

- [ ] 3.3 Implement password reset service
  - Add password reset request method (generates token)
  - Implement reset token storage with 1h expiration
  - Add password update method with token validation
  - Invalidate all sessions on password change
  - Write unit tests for reset flow
  - Requirements: REQ-1.3

- [ ] 4. Create API endpoints (depends on 3.1, 3.2, 3.3)
- [ ] 4.1 Implement registration endpoint
  - Create POST /auth/register endpoint
  - Add request validation middleware
  - Implement proper HTTP status codes (201, 400, 409)
  - Add error response formatting
  - Write integration tests for registration API
  - Requirements: REQ-1.2, REQ-2.3

- [ ] 4.2 Implement login endpoint
  - Create POST /auth/login endpoint
  - Add authentication middleware
  - Implement logout functionality (POST /auth/logout)
  - Return JWT token in response
  - Write integration tests for login/logout
  - Requirements: REQ-1.2, REQ-4.1

- [ ] 4.3 Implement password reset endpoints
  - Create POST /auth/reset-request endpoint
  - Create POST /auth/reset-confirm endpoint
  - Add email sending for reset link (stub for now)
  - Write integration tests for reset flow
  - Requirements: REQ-1.3

- [ ] 5. Security hardening and testing (depends on 4.1, 4.2, 4.3)
- [ ] 5.1 Add security middleware and rate limiting
  - Implement rate limiting for auth endpoints (5 req/min)
  - Add CORS configuration
  - Add security headers (helmet.js)
  - Create JWT validation middleware for protected routes
  - Write security-focused integration tests
  - Requirements: REQ-4.1, REQ-2.3

- [ ] 5.2 End-to-end integration testing
  - Create complete user registration flow test
  - Create complete login/logout flow test
  - Create complete password reset flow test
  - Test error scenarios and edge cases
  - Validate security measures
  - Requirements: REQ-1.2, REQ-4.1, REQ-1.3

---

## Example 2: Real-Time Notification System

### Implementation Tasks: Notification System

**Overview**: Build event-driven notifications with WebSocket, push, and email delivery.

**Strategy**: Hybrid - minimal foundation + high-value feature slice

**Task List**:

- [ ] 1. Minimal notification foundation
- [ ] 1.1 Set up message queue and event system
  - Install and configure RabbitMQ
  - Create event publisher utility
  - Create event consumer base class
  - Set up development environment with Docker
  - Requirements: REQ-1.1

- [ ] 1.2 Create notification data models
  - Define Notification interface (id, userId, type, title, message, data)
  - Define UserPreferences interface (channels, types, quietHours)
  - Create database schema and migrations
  - Write model validation functions
  - Requirements: REQ-2.1, REQ-2.2

- [ ] 2. Implement WebSocket delivery (complete feature slice)
- [ ] 2.1 Set up WebSocket server
  - Configure Socket.io server
  - Implement connection authentication
  - Add connection management (connect/disconnect)
  - Set up Redis adapter for multi-server support
  - Test WebSocket connection establishment
  - Requirements: REQ-1.1, REQ-1.2

- [ ] 2.2 Implement WebSocket notification delivery
  - Create NotificationService with deliver method
  - Implement user preference filtering
  - Add WebSocket emit functionality
  - Handle offline users (queue for later)
  - Write integration tests for WebSocket delivery
  - Requirements: REQ-1.1, REQ-1.2, REQ-2.1

- [ ] 2.3 Test end-to-end WebSocket flow
  - Create test event publisher
  - Verify notification routing through queue
  - Test delivery to connected clients
  - Test offline queuing
  - Requirements: REQ-1.1, REQ-1.2

- [ ] 3. Add notification preferences (depends on 2.2)
- [ ] 3.1 Implement preferences API
  - Create GET /notifications/preferences endpoint
  - Create PUT /notifications/preferences endpoint
  - Add preference validation
  - Implement preference persistence
  - Write API integration tests
  - Requirements: REQ-2.1

- [ ] 3.2 Apply preferences to delivery
  - Update NotificationService to check preferences
  - Implement channel filtering (websocket/push/email)
  - Implement type filtering
  - Add quiet hours logic
  - Test preference filtering
  - Requirements: REQ-2.1, REQ-2.2

- [ ] 4. Implement notification history
- [ ] 4.1 Create notification storage
  - Implement notification repository
  - Add notification persistence on delivery
  - Create database indexes for efficient queries
  - Implement 30-day auto-archive
  - Test storage and retrieval
  - Requirements: REQ-3.1

- [ ] 4.2 Create history API
  - Create GET /notifications endpoint (paginated)
  - Implement read/unread status
  - Add mark-as-read endpoint
  - Add delete notification endpoint
  - Write integration tests
  - Requirements: REQ-3.1

- [ ] 5. Add push and email channels (depends on 3.2)
- [ ] 5.1 Implement push notification service
  - Integrate FCM for Android
  - Integrate APNS for iOS  
  - Add device token management
  - Implement push delivery method
  - Test push notifications
  - Requirements: REQ-1.3

- [ ] 5.2 Implement email notification service
  - Integrate email service (SendGrid/SES)
  - Create email templates
  - Implement email delivery method
  - Add email queuing for batch sending
  - Test email delivery
  - Requirements: REQ-1.3

---

## Example 3: File Upload Service

### Implementation Tasks: File Upload System

**Overview**: Scalable file upload with S3, virus scanning, and thumbnail generation.

**Strategy**: Risk-first - validate S3 integration early

**Task List**:

- [ ] 1. Validate S3 integration (high risk item)
- [ ] 1.1 Set up S3 and generate pre-signed URLs
  - Configure AWS SDK and S3 client
  - Implement pre-signed URL generation
  - Test direct browser upload to S3
  - Verify S3 webhook triggers
  - Requirements: REQ-1.1

- [ ] 2. Build minimal upload foundation
- [ ] 2.1 Create file data models
  - Define File interface (id, userId, filename, mimeType, sizeBytes, status)
  - Create database schema and migrations
  - Implement file metadata validation
  - Requirements: REQ-2.1

- [ ] 2.2 Implement upload controller
  - Create POST /files/upload-url endpoint
  - Add file size/type validation
  - Generate and return pre-signed URL
  - Store file metadata with "uploading" status
  - Write integration tests
  - Requirements: REQ-1.1, REQ-1.2

- [ ] 3. Implement background processing
- [ ] 3.1 Set up worker infrastructure
  - Create background worker framework
  - Configure job queue (Bull/BullMQ)
  - Set up S3 event notifications to queue
  - Test job execution
  - Requirements: REQ-3.1

- [ ] 3.2 Implement virus scanning
  - Integrate ClamAV or cloud scanning service
  - Create virus scanning job
  - Handle malicious file detection (delete, log, notify)
  - Update file status after scan
  - Test with test virus (EICAR)
  - Requirements: REQ-3.2

- [ ] 3.3 Implement thumbnail generation
  - Add image processing library (Sharp)
  - Create thumbnail generation job (for images only)
  - Store thumbnails in S3
  - Update file record with thumbnail key
  - Test thumbnail generation
  - Requirements: REQ-3.3

- [ ] 3.4 Implement metadata extraction
  - Extract image dimensions and EXIF data
  - Extract document page counts
  - Store metadata in file record
  - Test metadata extraction
  - Requirements: REQ-3.3

- [ ] 4. Complete file management API
- [ ] 4.1 Implement file retrieval endpoints
  - Create GET /files/:id endpoint
  - Create GET /files (list with pagination)
  - Add filtering by type and status
  - Generate temporary download URLs
  - Write integration tests
  - Requirements: REQ-2.2

- [ ] 4.2 Implement file deletion
  - Create DELETE /files/:id endpoint
  - Remove file from S3
  - Remove thumbnail from S3
  - Delete database record
  - Write integration tests
  - Requirements: REQ-2.2

- [ ] 5. Error handling and monitoring
- [ ] 5.1 Add comprehensive error handling
  - Handle upload failures (mark as failed)
  - Retry failed processing jobs (3 attempts)
  - Notify users of failures
  - Log all errors with context
  - Requirements: REQ-4.1

- [ ] 5.2 Add monitoring and health checks
  - Create health check endpoint
  - Add metrics for uploads, scans, processing
  - Set up alerting for failures
  - Test monitoring system
  - Requirements: REQ-4.2

---

## Key Patterns in Examples

### Common Elements
- **Clear hierarchy**: Epics and tasks
- **Dependencies noted**: "depends on X.Y"
- **Requirements traced**: REQ-X.Y references
- **Testing included**: Within or alongside tasks
- **File/component specifics**: What to create
- **Completion criteria**: Implicit in description

### Sequencing Patterns
- **Foundation-First**: Auth example - setup, models, services, API
- **Hybrid**: Notification example - minimal foundation + complete feature
- **Risk-First**: Upload example - validate S3 early

### Task Sizing
- Each task is 2-6 hours
- Complex features broken into sub-tasks
- Testing integrated with implementation

### Use These as Templates
- Copy structure for similar features
- Adapt sequence strategy to your needs
- Maintain level of detail shown
- Include all key elements (requirements, files, tests)


