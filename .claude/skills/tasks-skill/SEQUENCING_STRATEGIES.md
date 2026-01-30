# Task Sequencing Strategies

How to order implementation tasks for optimal development flow.

## Strategy 1: Foundation-First

**Best For**: New projects, complex systems with many interdependencies

**Sequence**:
```
1. Project setup and core interfaces
2. Database schema and migrations
3. Data models with validation
4. Repository/data access layer
5. Business logic services
6. API endpoints and controllers
7. Integration and wiring
8. End-to-end testing
```

**Advantages**:
- Solid foundation before building features
- Reduces rework from architectural changes
- Clear dependency chain
- Team can work on different layers

**Disadvantages**:
- Longer time before visible functionality
- Risk of over-engineering foundation
- No early user feedback

**When to Use**:
- Building new system from scratch
- Complex domain with many entities
- Team has clear understanding of all requirements
- Foundation components are well-understood

---

## Strategy 2: Feature-Slice (Vertical)

**Best For**: MVPs, user-facing applications, agile development

**Sequence**:
```
1. Core feature (complete vertical slice)
   - Database → Business Logic → API → UI
2. Secondary feature (complete slice)
3. Third feature (complete slice)
4. Cross-cutting concerns and polish
```

**Advantages**:
- Early user value delivery
- Faster feedback cycles
- Reduced integration risk
- Demonstrates progress quickly

**Disadvantages**:
- May require refactoring as features expand
- Potential for technical debt
- Less reusable foundation initially

**When to Use**:
- Building MVP or proof-of-concept
- User feedback is critical
- Need to demonstrate progress quickly
- Requirements may change based on feedback

---

## Strategy 3: Risk-First

**Best For**: Projects with high technical uncertainty, proof-of-concepts

**Sequence**:
```
1. Highest risk/most uncertain components
2. External integrations and dependencies
3. Core business logic
4. Standard implementations
5. User interface and experience
6. Polish and optimization
```

**Advantages**:
- Early validation of technical feasibility
- Reduces project risk
- Informs architectural decisions
- Identifies problems early

**Disadvantages**:
- May not deliver user value early
- Requires strong technical expertise
- Can be demotivating if complex work first

**When to Use**:
- Unproven technology or approach
- Complex external integrations
- Performance requirements are uncertain
- Team needs to validate assumptions

---

## Strategy 4: Hybrid (Recommended)

**Best For**: Most real-world projects

**Sequence**:
```
1. Minimal foundation (essential setup only)
2. High-risk/high-value feature slice
3. Expand foundation as needed
4. Additional feature slices
5. Integration and polish
```

**Advantages**:
- Balances risk management with early value
- Flexible and adaptable
- Pragmatic approach
- Satisfies multiple stakeholders

**Disadvantages**:
- Requires good judgment
- Less prescriptive
- Needs experienced decision-making

**When to Use**:
- Most production projects
- Mix of new and proven technologies
- Need both early value and solid foundation
- Experienced team

---

## Choosing Your Strategy

### Questions to Ask

**About Requirements**:
- How stable are the requirements?
- Do we have full clarity or will we learn as we go?

**About Risk**:
- What are the biggest technical unknowns?
- What could prevent us from delivering?

**About Timeline**:
- When do we need first value delivery?
- What are the milestone dates?

**About Team**:
- How experienced is the team?
- Can we work in parallel?

**About Stakeholders**:
- Do they need early visible progress?
- Is technical foundation more important?

### Decision Matrix

| Situation | Recommended Strategy |
|-----------|---------------------|
| New complex system, stable requirements | Foundation-First |
| MVP, need early feedback | Feature-Slice |
| Uncertain tech, high risk | Risk-First |
| Production app, mixed needs | Hybrid |
| Mobile app, API exists | Feature-Slice |
| Enterprise system, integration heavy | Foundation-First or Risk-First |

---

## Detailed Sequencing Patterns

### Pattern: Authentication Feature

**Foundation-First**:
```
1. Database setup and user table
2. User model and validation
3. Password hashing utilities
4. User repository
5. Authentication service
6. Login endpoint
7. Session management
8. Integration tests
```

**Feature-Slice**:
```
1. End-to-end login flow (database → service → API)
2. End-to-end registration flow
3. Password reset flow
4. Session management
5. Refactor and optimize
```

**Risk-First**:
```
1. JWT token generation and validation (highest uncertainty)
2. Password hashing strategy
3. Basic login flow
4. Session management
5. Additional features
```

### Pattern: E-commerce Cart

**Foundation-First**:
```
1. Product, Cart, CartItem models
2. Product and Cart repositories
3. Cart service business logic
4. Cart API endpoints
5. Cart UI components
```

**Feature-Slice**:
```
1. Add product to cart (complete flow)
2. Update quantities (complete flow)
3. Remove from cart (complete flow)
4. View cart (complete flow)
5. Checkout preparation
```

---

## Dependency Management

### Handling Dependencies

**Parallel Development**:
```
Task 1.1 ──┐
Task 1.2 ──┼─→ Task 2.1 → Task 3.1
Task 1.3 ──┘
```

Mark tasks that can be done in parallel:
```markdown
- [ ] 1.1 Create User model (can parallelize)
- [ ] 1.2 Create Product model (can parallelize)
- [ ] 1.3 Create Order model (can parallelize)
- [ ] 2.1 Create Cart service (depends on 1.1, 1.2)
```

### Circular Dependencies

**Problem**: Service A needs Service B, Service B needs Service A

**Solutions**:
1. **Interface Extraction**: Create interfaces first, implement later
2. **Layered Approach**: Build A partially, then B, then complete A
3. **Event-Driven**: Use events to decouple

---

## Special Considerations

### Database Migrations

**When to Create**:
- Early in foundation-first (before data models)
- Just-in-time in feature-slice (per feature)
- After schema design in risk-first

### Testing Tasks

**Integrate with Implementation**:
```markdown
- [ ] 2.1 Implement authentication service
  - Create service with login method
  - Add password verification
  - Write unit tests (included in same task)
  - Requirements: REQ-1.2
```

**Separate if Needed**:
```markdown
- [ ] 2.1 Implement authentication service
- [ ] 2.2 Test authentication service
  - Unit tests for all methods
  - Integration tests for database
  - Security tests for auth flows
```

### Refactoring Tasks

**Include Dedicated Refactoring**:
```markdown
- [ ] 5. Refactoring and optimization
- [ ] 5.1 Extract common utilities
- [ ] 5.2 Optimize database queries
- [ ] 5.3 Improve error handling consistency
```

---

## Adaptation During Implementation

### When to Adjust Sequence

**Signals to Adapt**:
- Tasks taking much longer than expected
- Discovering new dependencies
- Requirements changing
- Technical approach not working

**How to Adapt**:
1. Stop and reassess
2. Update task breakdown
3. Resequence remaining tasks
4. Communicate changes to team

**Example Adjustment**:
```
Original: Foundation → Features
Adjusted: Minimal Foundation → One Feature → Expand Foundation → More Features
Reason: Need early feedback on user experience
```

---

## Team Coordination

### For Solo Developers

- Choose strategy that matches your working style
- Foundation-first if you like clarity
- Feature-slice if you like visible progress
- Risk-first if you're tackling unknowns

### For Small Teams (2-4)

- Use parallel work opportunities
- Assign independent components to different developers
- Regular integration points
- Clear interfaces between components

### For Larger Teams (5+)

- More emphasis on foundation-first
- Parallel work on different layers
- Strong interface definitions
- Regular integration and testing

---

## Summary

**Choose Foundation-First When**:
- Building complex, new systems
- Requirements are stable
- Team size allows parallel layer development
- Foundation clarity is critical

**Choose Feature-Slice When**:
- Building MVPs or user-facing apps
- Need early feedback
- Requirements may evolve
- Demonstrating progress is important

**Choose Risk-First When**:
- High technical uncertainty
- Unproven integrations
- Need to validate approaches
- Failure would be costly

**Choose Hybrid When**:
- Real-world production projects
- Mix of certainty and uncertainty
- Need both value and foundation
- Experienced team

Most projects benefit from **Hybrid** approach: minimal foundation + high-risk/high-value feature + iterate.


