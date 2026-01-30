# Architecture Patterns

Common architectural patterns and when to use them in your designs.

## Layered Architecture

**Description**: Organize code into horizontal layers with clear responsibilities.

**Typical Layers**:
- **Presentation Layer**: UI, API endpoints, request handling
- **Business Logic Layer**: Services, domain logic, workflows
- **Data Access Layer**: Repositories, database queries, caching
- **Infrastructure Layer**: External services, file system, messaging

**When to Use**:
- Traditional web applications
- Clear separation of concerns needed
- Team is familiar with pattern
- Moderate complexity applications

**Pros**:
- Clear separation of concerns
- Easy to understand and maintain
- Well-supported by frameworks
- Good for team collaboration

**Cons**:
- Can become rigid
- May lead to unnecessary layers
- Performance overhead from layer crossings

**Example Structure**:
```
/controllers     # Presentation
/services        # Business Logic
/repositories    # Data Access
/infrastructure  # External integrations
```

---

## Microservices Architecture

**Description**: Decompose application into small, independent services that communicate via APIs.

**Characteristics**:
- Each service owns its data
- Services communicate via HTTP/gRPC/messaging
- Independent deployment and scaling
- Technology diversity possible

**When to Use**:
- Large, complex applications
- Multiple teams working independently
- Need independent scaling
- Different parts have different technology needs

**Pros**:
- Independent deployment and scaling
- Technology flexibility
- Fault isolation
- Team autonomy

**Cons**:
- Increased operational complexity
- Distributed system challenges
- Network latency
- Data consistency challenges

**Example Services**:
```
auth-service      # Authentication and authorization
user-service      # User management
payment-service   # Payment processing
notification-service  # Email, SMS, push notifications
```

---

## Event-Driven Architecture

**Description**: Components communicate by producing and consuming events.

**Components**:
- **Event Producers**: Generate events when state changes
- **Event Bus**: Routes events to consumers
- **Event Consumers**: React to events and perform actions
- **Event Store**: Persists events for audit and replay

**When to Use**:
- Asynchronous processing needed
- Multiple systems need to react to same event
- Audit trail required
- Eventual consistency acceptable

**Pros**:
- Loose coupling between components
- Easy to add new event consumers
- Natural audit trail
- Supports replay and debugging

**Cons**:
- Harder to trace flow
- Eventual consistency challenges
- More complex error handling
- Debugging can be difficult

**Example Flow**:
```
User Registration Event
├─> Send welcome email
├─> Create user profile
├─> Notify admin
└─> Update analytics
```

---

## Model-View-Controller (MVC)

**Description**: Separate data (Model), presentation (View), and logic (Controller).

**Components**:
- **Model**: Data structures, business logic, validation
- **View**: UI representation, templates, components
- **Controller**: Request handling, model coordination, view selection

**When to Use**:
- Web applications with server-side rendering
- Clear separation between UI and logic
- Framework supports MVC (Rails, Django, ASP.NET MVC)

**Pros**:
- Clear separation of concerns
- Parallel development (frontend/backend)
- Well-understood pattern
- Good framework support

**Cons**:
- Can lead to fat controllers
- View and model coupling
- Not ideal for SPAs

---

## Client-Server Architecture

**Description**: Frontend client communicates with backend server via API.

**Variants**:
- **Thin Client**: Most logic on server, client handles UI only
- **Thick Client**: Significant logic on client (SPA, mobile app)

**When to Use**:
- Web or mobile applications
- Clear separation between frontend and backend
- Multiple clients (web, mobile) sharing same backend

**Pros**:
- Clear separation of concerns
- Can support multiple client types
- Independent scaling
- Technology flexibility

**Cons**:
- Network dependency
- API versioning challenges
- More complex deployment

**Example**:
```
React Frontend ←→ REST API ←→ Node.js Backend ←→ Database
```

---

## Serverless Architecture

**Description**: Run code in stateless functions triggered by events.

**Characteristics**:
- No server management
- Pay-per-execution pricing
- Automatic scaling
- Event-driven execution

**When to Use**:
- Variable or unpredictable load
- Event-driven workloads
- Cost optimization important
- Quick deployment needed

**Pros**:
- No infrastructure management
- Automatic scaling
- Pay only for usage
- Quick deployment

**Cons**:
- Cold start latency
- Vendor lock-in
- Debugging challenges
- Limited execution time

**Example Functions**:
```
Image Upload → Resize → Store → Update Database
API Request → Validate → Process → Respond
Scheduled Job → Query → Process → Notify
```

---

## Repository Pattern

**Description**: Abstraction layer between business logic and data access.

**Components**:
- **Repository Interface**: Defines data operations
- **Repository Implementation**: Implements using specific data store
- **Entities**: Domain objects
- **Business Logic**: Uses repositories without knowing data source

**When to Use**:
- Need to abstract data access
- Want to support multiple data sources
- Testing requires mocking data layer
- Domain-driven design

**Pros**:
- Testability (easy to mock)
- Flexibility (swap data sources)
- Clear separation
- Consistent interface

**Cons**:
- Additional abstraction layer
- More code to maintain
- Can be overkill for simple apps

**Example**:
```typescript
interface UserRepository {
  findById(id: string): Promise<User>
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
}

class PostgresUserRepository implements UserRepository {
  // Implementation using PostgreSQL
}

class MongoUserRepository implements UserRepository {
  // Implementation using MongoDB
}
```

---

## CQRS (Command Query Responsibility Segregation)

**Description**: Separate read and write operations into different models.

**Components**:
- **Commands**: Operations that change state (write model)
- **Queries**: Operations that read state (read model)
- **Write Model**: Optimized for updates and validation
- **Read Model**: Optimized for querying and display

**When to Use**:
- Different read and write patterns
- High read vs write ratio
- Complex domain logic
- Event sourcing

**Pros**:
- Optimized read and write models
- Scalability (scale reads and writes independently)
- Security (separate permissions)
- Clear intent (command vs query)

**Cons**:
- Increased complexity
- Eventual consistency
- More code to maintain
- Learning curve

**Example**:
```
Write Side:
  Command: CreateOrder → Validate → Save → Publish Event

Read Side:
  Event: OrderCreated → Update Read Model → Index for Search
  Query: GetOrders → Read Optimized Model
```

---

## Choosing the Right Pattern

### Decision Framework

**For Simple CRUD Apps**:
- Start with Layered Architecture
- Add Repository Pattern if data abstraction needed

**For APIs and Services**:
- Use Client-Server with RESTful design
- Consider Serverless for event-driven workloads

**For Complex Domains**:
- Consider Event-Driven for loose coupling
- CQRS if read/write patterns differ significantly

**For Large Scale**:
- Microservices for independent teams and services
- Event-Driven for async communication
- CQRS for read/write scaling

**For Rapid Development**:
- MVC with framework defaults
- Serverless for quick deployment

### Questions to Ask

1. **Scale**: How many users? How much data?
2. **Team**: Size? Distributed? Skill levels?
3. **Performance**: Latency requirements? Throughput needs?
4. **Complexity**: Simple CRUD or complex workflows?
5. **Integration**: Many external systems?
6. **Evolution**: How will this change over time?

### Combining Patterns

You can combine patterns effectively:
- **Layered + Repository**: Very common combination
- **Microservices + Event-Driven**: Excellent for service communication
- **Client-Server + CQRS**: Optimize for different read/write patterns
- **Serverless + Event-Driven**: Natural fit for event processing

### Anti-Patterns to Avoid

❌ **Over-Engineering**: Don't use microservices for a simple app
❌ **Under-Engineering**: Don't skip layers in a complex application
❌ **Pattern Mixing**: Don't mix incompatible patterns without reason
❌ **Premature Optimization**: Choose for current needs, not imagined scale
❌ **Ignoring Requirements**: Pattern must support actual requirements

## Further Reading

- [Kiro Design Phase](../../kiro/spec-process-guide/process/design-phase.md)
- [Decision Templates](DECISION_TEMPLATES.md)
- [Design Examples](EXAMPLES.md)


