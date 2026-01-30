# Design Decision Templates

Templates and frameworks for making and documenting design decisions.

## Decision Record Template

Use this template for all significant design decisions:

```markdown
### Decision: [Brief descriptive title]

**Context**: 
[What situation or requirement necessitates this decision? What problem are we solving?]

**Options Considered**:

1. **[Option 1 Name]**
   - **Pros**: 
     - [Benefit 1]
     - [Benefit 2]
   - **Cons**: 
     - [Drawback 1]
     - [Drawback 2]
   - **Risk**: [Implementation risks]
   - **Cost**: [Development/operational cost]

2. **[Option 2 Name]**
   - **Pros**: [Benefits]
   - **Cons**: [Drawbacks]
   - **Risk**: [Risks]
   - **Cost**: [Costs]

3. **[Option 3 Name]**
   - **Pros**: [Benefits]
   - **Cons**: [Drawbacks]
   - **Risk**: [Risks]
   - **Cost**: [Costs]

**Decision**: [Chosen option]

**Rationale**: 
[Detailed explanation of why this option was selected. Reference specific requirements,
constraints, or priorities that influenced the decision.]

**Implications**:
- **Implementation**: [What this means for development]
- **Performance**: [Performance impact]
- **Maintenance**: [Ongoing maintenance considerations]
- **Testing**: [Testing implications]
- **Operations**: [Deployment and operational impact]

**Requirements Addressed**: [References to specific requirements: REQ-1.2, REQ-2.3]

**Trade-offs Accepted**: [What trade-offs were made and why they're acceptable]

**Review Date**: [Optional: Date to review this decision]
```

---

## Technology Selection Framework

Use this framework when choosing technologies:

### 1. Define Requirements

**Functional Needs**:
- What must the technology do?
- What features are essential vs nice-to-have?

**Non-Functional Needs**:
- Performance requirements
- Scalability requirements
- Security requirements
- Reliability requirements

**Constraints**:
- Team skill levels
- Existing infrastructure
- Budget limitations
- Time constraints
- Compliance requirements

### 2. Evaluation Criteria

Create weighted scoring matrix:

| Criterion | Weight | Option A | Option B | Option C |
|-----------|--------|----------|----------|----------|
| Meets requirements | 25% | 9/10 | 8/10 | 7/10 |
| Team expertise | 20% | 7/10 | 9/10 | 5/10 |
| Community support | 15% | 9/10 | 8/10 | 6/10 |
| Performance | 15% | 8/10 | 9/10 | 7/10 |
| Cost | 10% | 7/10 | 6/10 | 9/10 |
| Maturity | 10% | 9/10 | 8/10 | 6/10 |
| Documentation | 5% | 8/10 | 9/10 | 7/10 |
| **Weighted Total** | | **8.2** | **8.1** | **6.9** |

### 3. Risk Assessment

For each option, assess:
- **Technical Risk**: How proven is this technology?
- **Team Risk**: Can the team learn and use it effectively?
- **Vendor Risk**: What if vendor discontinues support?
- **Integration Risk**: How well does it integrate with existing systems?
- **Performance Risk**: Will it meet performance requirements at scale?

### 4. Proof of Concept

For high-risk decisions:
- Build small POC to validate assumptions
- Test critical features
- Measure performance
- Assess developer experience

---

## Architecture Decision Framework

Use this when making architectural choices:

### Step 1: Understand the Problem

Questions to answer:
1. What specific problem are we solving?
2. What are the must-have capabilities?
3. What scale do we need to support (now and future)?
4. What are the critical non-functional requirements?
5. What are the absolute constraints?

### Step 2: Identify Options

Brainstorm 3-5 viable approaches:
- Industry standard patterns
- Patterns used in similar systems
- Novel approaches if standard patterns insufficient
- Hybrid approaches combining patterns

### Step 3: Evaluate Trade-offs

For each option, assess:

**Performance**:
- Latency characteristics
- Throughput capabilities
- Resource efficiency

**Scalability**:
- How does it scale vertically?
- How does it scale horizontally?
- What are scaling limits?

**Complexity**:
- Development complexity
- Operational complexity
- Debugging difficulty

**Cost**:
- Development time
- Infrastructure costs
- Ongoing maintenance

**Flexibility**:
- How easy to change?
- How easy to extend?
- How coupled to specific technologies?

### Step 4: Match to Context

Consider:
- Team size and experience
- Time to market requirements
- Budget constraints
- Existing infrastructure
- Regulatory requirements
- Company standards

### Step 5: Make Decision

Choose option that:
- Meets all must-have requirements
- Best fits the context and constraints
- Has acceptable trade-offs
- Team can execute effectively

---

## Database Selection Template

```markdown
### Database Decision

**Data Characteristics**:
- Type: [Structured/Semi-structured/Unstructured]
- Volume: [Current and projected]
- Relationships: [Complex/Simple/None]
- Schema: [Fixed/Flexible/Schema-less]
- Query Patterns: [Simple lookups/Complex queries/Analytics]

**Requirements**:
- Read/Write Ratio: [e.g., 80% read, 20% write]
- Consistency: [Strong/Eventual]
- Availability: [Uptime requirements]
- Performance: [Latency and throughput requirements]
- Transactions: [ACID required? Distributed transactions?]

**Options Compared**:

**Option A: [Database Name]**
- Type: [Relational/Document/Key-Value/Graph/Time-series]
- Strengths: [What it excels at]
- Weaknesses: [What it struggles with]
- Cost: [Licensing, infrastructure, operational]
- Team Experience: [High/Medium/Low]

**Option B: [Database Name]**
- [Same structure as Option A]

**Decision**: [Chosen database]

**Rationale**: [Why this database best fits requirements]

**Migration Strategy**: [How to adopt this database]
```

---

## API Design Decision Template

```markdown
### API Style Decision

**Requirements**:
- Client Types: [Web/Mobile/3rd-party/Internal services]
- Operations: [CRUD/Complex operations/Real-time]
- Data Access Patterns: [Simple entities/Complex queries/Nested resources]
- Performance: [Latency requirements]
- Caching: [Requirements and strategies]

**Options**:

**REST**:
- Pros: Standard, well-understood, good caching, stateless
- Cons: Over-fetching, under-fetching, multiple round trips
- Best For: CRUD operations, resource-based APIs, public APIs

**GraphQL**:
- Pros: Flexible queries, single endpoint, strong typing
- Cons: Complexity, caching challenges, learning curve
- Best For: Complex data requirements, mobile apps, rapid iteration

**gRPC**:
- Pros: High performance, strongly typed, bi-directional streaming
- Cons: Limited browser support, less human-readable, tooling
- Best For: Service-to-service, high performance, streaming

**WebSockets**:
- Pros: Real-time, bi-directional, low latency
- Cons: Stateful, scaling challenges, more complex
- Best For: Real-time updates, chat, live dashboards

**Decision**: [Chosen approach]

**Rationale**: [Why this fits best]
```

---

## Component Responsibility Decision

```markdown
### Component: [Component Name]

**Purpose**: [What problem does this solve?]

**Responsibilities** (What it DOES):
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

**Non-Responsibilities** (What it DOES NOT do):
- [What other components handle]
- [What is out of scope]

**Interface Design**:
- Public methods: [What operations are exposed?]
- Events emitted: [What events does it publish?]
- Dependencies: [What does it need from other components?]

**Boundary Validation**:
- Is responsibility single and focused? [Yes/No]
- Are boundaries clear with other components? [Yes/No]
- Is this testable in isolation? [Yes/No]
- Does this map to a specific requirement? [Yes - which ones?]
```

---

## Security Decision Template

```markdown
### Security Approach: [Authentication/Authorization/Encryption/etc.]

**Threat Model**:
- What are we protecting? [Data, operations, resources]
- Who are the threats? [External attackers, insider threats, accidents]
- What are attack vectors? [Common vulnerabilities]

**Requirements**:
- [Security requirement 1 from specs]
- [Security requirement 2 from specs]
- [Compliance requirements: GDPR, HIPAA, SOC 2, etc.]

**Options**:

**Option 1**: [Approach name]
- Security Level: [How secure]
- Complexity: [Implementation difficulty]
- User Experience: [Impact on users]
- Standard Compliance: [What standards does it meet]

**Option 2**: [Approach name]
- [Same structure]

**Decision**: [Chosen approach]

**Rationale**: [Why this balances security, usability, and complexity]

**Implementation**:
- [How will this be implemented]
- [What libraries/services will be used]
- [What testing is required]
```

---

## When to Document Decisions

Document decisions that:
- ✅ Significantly impact architecture
- ✅ Affect multiple components
- ✅ Have important trade-offs
- ✅ Are likely to be questioned later
- ✅ Set precedents for future decisions
- ✅ Involve technology choices
- ✅ Impact performance, security, or cost significantly

Don't document:
- ❌ Routine implementation details
- ❌ Obvious choices with no alternatives
- ❌ Temporary or experimental decisions
- ❌ Decisions easily reversed

---

## Review and Update

**When to Review Decisions**:
- When requirements change
- When new technologies emerge
- At project milestones
- When performance issues arise
- During retrospectives

**Update Decision Records**:
- Add "Update" section with date
- Explain what changed and why
- Keep original decision for history
- Link to new decision if superseded


