# Reverse Engineering Workflow - Legacy Code to Specs

**Transform existing codebases into spec-driven development.**

---

## Overview

The reverse engineering workflow allows you to analyze existing code (legacy systems, external codebases, inherited projects) and automatically generate specifications (requirements, design, tasks) for spec-driven development.

**Key Benefits**:
- ✅ Document undocumented code
- ✅ Understand what's implemented
- ✅ Identify gaps and missing pieces
- ✅ Create refactoring plans
- ✅ Integrate legacy code into modern workflow
- ✅ Maintain spec-driven development going forward

---

## When to Use

**Use this workflow when**:
- You have existing code without documentation
- You're refactoring a legacy system
- You've inherited a project
- Code was developed with a different method
- You need to understand implementation status
- You want to retrofit specs onto existing code

**Examples**:
- Legacy monolith → Spec-driven refactoring
- External codebase → Documented system
- Inherited project → Complete understanding
- Prototype → Production-ready with specs

---

## Quick Start (15 minutes)

### Step 1: Place Your Code

Put existing code in `apps/[app-name]/`:

```bash
# Your existing code
apps/my-legacy-app/
├── src/          ← Your source code
├── tests/        ← Your tests (if any)
├── package.json  ← Dependencies
└── README.md     ← Existing docs (if any)
```

### Step 2: Set Context

```bash
/set-context my-legacy-app
```

### Step 3: Analyze

```bash
/analyze-codebase
```

**Agent will**:
1. Ask for analysis scope (full app, specific module, files)
2. Ask for additional context (logs, docs)
3. Choose depth (quick 30min or deep 2-3hr)
4. Analyze your code
5. Generate specs

### Step 4: Review & Refine

```bash
# Check generated specs
ls apps/my-legacy-app/specs/

# Review requirements
cat apps/my-legacy-app/specs/*-requirements.md

# Check implementation status
cat apps/my-legacy-app/context/IMPLEMENTATION_STATUS.md
```

### Step 5: Start Refactoring

```bash
# Fix critical issues
/implement-task [feature] 1.1

# Add missing tests
/implement-task [feature] 3.1

# Complete missing features
/implement-feature [missing-feature]
```

**Done!** Your legacy code is now in spec-driven development. 🎉

---

## Complete Workflow

### Phase 1: Preparation

#### 1.1 Organize Your Code

Place code in multi-app structure:

```
apps/
└── my-legacy-app/
    ├── src/              ← Source code
    │   ├── components/
    │   ├── services/
    │   ├── models/
    │   └── utils/
    ├── tests/            ← Tests (if any)
    ├── docs/             ← Existing docs (if any)
    ├── package.json      ← Dependencies
    └── README.md         ← Overview
```

#### 1.2 Gather Context

Collect any available context:
- Development logs
- Existing documentation
- Commit history notes
- Known issues list
- Design decisions
- Future plans

Save these to:
```
apps/my-legacy-app/docs/
├── dev-log.md           ← Development timeline
├── known-issues.md      ← Known bugs/issues
├── architecture.txt     ← Existing architecture notes
└── TODO.md              ← Future plans
```

#### 1.3 Set Work Context

```bash
/set-context my-legacy-app
```

### Phase 2: Analysis

#### 2.1 Run Analysis

**Quick Analysis** (30 minutes):
```bash
/analyze-codebase quick
```

**Deep Analysis** (2-3 hours):
```bash
/analyze-codebase deep
```

#### 2.2 Provide Context

Agent will ask questions:

```markdown
📊 ANALYSIS CONFIGURATION

What should I analyze?
A) Entire app (apps/my-legacy-app/)
B) Specific feature/module
C) Specific files

Do you have additional context?
- Development logs?
- Existing documentation?
- Known issues?

Analysis depth:
- Quick (30 min)
- Deep (2-3 hr)
```

**Provide what you have**:
- Logs: `apps/my-legacy-app/docs/dev-log.md`
- Docs: `apps/my-legacy-app/docs/architecture.txt`
- Issues: `apps/my-legacy-app/docs/known-issues.md`

#### 2.3 Monitor Progress

Agent will report progress:

```markdown
Analyzing:
- Directory structure... ✅
- Entry points... ✅
- Features... ✅ (5 found)
- Architecture... ✅
- Tests... ✅ (45% coverage)
- Security... ⚠️ (3 issues)
- Performance... ⚠️ (2 concerns)
- Issues... ✅ (8 found)
```

### Phase 3: Review Results

#### 3.1 Check Generated Specs

```bash
# List all specs
ls apps/my-legacy-app/specs/

# View structure
tree apps/my-legacy-app/specs/
```

**Expected files**:
```
apps/my-legacy-app/specs/
├── SPEC_CREATION_STATUS.md         ← Overview
├── user-auth-requirements.md       ← Feature 1 requirements
├── user-auth-design.md             ← Feature 1 design
├── user-auth-tasks.md              ← Feature 1 refactoring tasks
├── data-management-requirements.md ← Feature 2 requirements
├── data-management-design.md       ← Feature 2 design
├── data-management-tasks.md        ← Feature 2 refactoring tasks
└── [... for each feature]
```

#### 3.2 Review Requirements

```bash
cat apps/my-legacy-app/specs/*-requirements.md
```

**Verify**:
- Do requirements match actual functionality?
- Is anything missing?
- Is anything incorrect?

**Refine if needed**:
```bash
# Edit requirements
edit apps/my-legacy-app/specs/user-auth-requirements.md

# Add missing business context
# Correct misunderstandings
# Clarify ambiguous areas
```

#### 3.3 Review Design

```bash
cat apps/my-legacy-app/specs/*-design.md
```

**Verify**:
- Is architecture correctly documented?
- Are components accurately described?
- Are data models correct?

#### 3.4 Review Tasks

```bash
cat apps/my-legacy-app/specs/*-tasks.md
```

**Check**:
- Are gaps correctly identified?
- Are priorities reasonable?
- Are estimates realistic?

#### 3.5 Check Implementation Status

```bash
cat apps/my-legacy-app/context/IMPLEMENTATION_STATUS.md
```

**Review**:
- Feature status (implemented, partial, missing)
- Test coverage
- Security concerns
- Performance issues
- Technical debt

### Phase 4: Prioritize Work

#### 4.1 Identify Critical Issues

From task files, find:

**🔴 Critical** (do immediately):
- Security vulnerabilities
- Data loss risks
- System-breaking bugs

**⚠️ High Priority** (do soon):
- Missing tests
- Error handling gaps
- Input validation issues

**🔶 Medium Priority** (do eventually):
- Technical debt
- Code quality issues
- Performance optimizations

**✅ Low Priority** (nice to have):
- Documentation improvements
- Refactoring for readability
- New features

#### 4.2 Create Action Plan

Example plan:

```markdown
## Week 1: Critical Fixes
- [ ] Fix SQL injection vulnerability (security-tasks.md, Task 1.1)
- [ ] Add rate limiting to auth (user-auth-tasks.md, Task 1.2)
- [ ] Fix data validation (data-management-tasks.md, Task 1.1)

## Week 2: Testing
- [ ] Add tests for auth module (user-auth-tasks.md, Task 3.1)
- [ ] Add tests for data API (data-management-tasks.md, Task 3.2)
- [ ] Integration tests (integration-tasks.md, Task 1.1)

## Week 3: Missing Features
- [ ] Complete admin dashboard (admin-tasks.md, Task 2.1)
- [ ] Implement email notifications (notifications-tasks.md, Task 2.2)

## Week 4: Technical Debt
- [ ] Refactor error handling (refactoring-tasks.md, Task 4.1)
- [ ] Optimize N+1 queries (performance-tasks.md, Task 4.2)
```

### Phase 5: Implementation

#### 5.1 Start with Critical Issues

```bash
# Context already set
/set-context my-legacy-app

# Implement security fix
/implement-task user-auth 1.1

# Implement validation
/implement-task data-management 1.1
```

#### 5.2 Add Missing Tests

```bash
# Add tests for untested code
/implement-task user-auth 3.1
/implement-task data-management 3.2
/implement-task integration 1.1
```

#### 5.3 Complete Missing Features

```bash
# Implement missing admin dashboard
/implement-feature admin-dashboard

# Implement notifications
/implement-feature email-notifications
```

#### 5.4 Refactor Technical Debt

```bash
# Standardize error handling
/implement-task refactoring 4.1

# Optimize performance
/implement-task performance 4.2
```

### Phase 6: Maintain Spec-Driven Development

#### 6.1 For New Features

**Use spec-first approach**:
```bash
# Create spec
@spec-orchestrator create spec for user-profiles

# Implement
/implement-feature user-profiles
```

#### 6.2 Track Progress

**Check status regularly**:
```bash
/prime
```

**Update as you work**:
- Specs get updated automatically by builder agents
- IMPLEMENTATION_STATUS.md tracks progress
- Task files mark completed items

---

## Real-World Examples

### Example 1: E-Commerce Legacy App

**Scenario**: 5-year-old e-commerce app, no docs, 50K LOC

#### Step 1: Preparation

```bash
# Move code to multi-app structure
mv old-ecommerce-app apps/ecommerce-legacy/

# Set context
/set-context ecommerce-legacy
```

#### Step 2: Deep Analysis

```bash
/analyze-codebase deep
```

**Provided**:
- Dev logs from past 2 years
- Known issues list
- Old architecture diagram

#### Step 3: Results

**Found**:
- 8 major features
- 3 implemented, 2 partial, 3 planned but never built
- 45% test coverage
- 12 security issues (3 critical)
- 47 TODO comments

**Generated**:
- 24 spec files (8 features × 3 phases)
- Complete architecture documentation
- 156 refactoring tasks

#### Step 4: Action Plan

```markdown
Month 1: Critical Security
- Fix SQL injection (3 places)
- Add authentication to admin routes
- Implement rate limiting

Month 2: Testing
- Add tests for payment processing
- Add tests for order management
- Integration tests for checkout flow

Month 3: Complete Features
- Finish abandoned cart emails
- Complete inventory tracking
- Build admin analytics

Month 4: Technical Debt
- Refactor monolithic services
- Optimize database queries
- Update outdated dependencies
```

#### Step 5: Execution

```bash
# Month 1
/implement-task payment 1.1  # SQL injection fix
/implement-task admin 1.2    # Auth on admin
/implement-task api 1.3      # Rate limiting

# Month 2
/implement-task payment 3.1  # Payment tests
/implement-task orders 3.2   # Order tests
/implement-task checkout 3.3 # Integration tests

# Months 3-4
/implement-feature abandoned-cart-emails
/implement-feature inventory-tracking
/implement-task refactoring 4.1
```

**Result**: 6 months later, fully refactored, 85% test coverage, zero critical issues.

### Example 2: Inherited Prototype

**Scenario**: Taking over a prototype that's going to production

#### Step 1: Quick Analysis

```bash
# Place code
cp -r prototype/* apps/recipe-proto/

# Analyze quickly
/set-context recipe-proto
/analyze-codebase quick
```

#### Step 2: Results

**Found**:
- 3 core features implemented
- No tests (0% coverage)
- No error handling
- No input validation
- Hardcoded config
- No logging

#### Step 3: Production-Ready Plan

```markdown
Week 1: Essential Fixes
- [ ] Add error handling everywhere
- [ ] Add input validation
- [ ] Move config to env vars
- [ ] Add structured logging

Week 2: Testing
- [ ] Unit tests for all services
- [ ] Component tests for UI
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows

Week 3: Production Prep
- [ ] Add monitoring/alerting
- [ ] Set up CI/CD
- [ ] Add database migrations
- [ ] Security audit
```

#### Step 4: Execute

```bash
/implement-task core 1.1  # Error handling
/implement-task core 1.2  # Input validation
/implement-task core 1.3  # Config management
/implement-task core 1.4  # Logging

/implement-task testing 2.1  # Unit tests
/implement-task testing 2.2  # Component tests
/implement-task testing 2.3  # Integration tests

/implement-task production 3.1  # Monitoring
/implement-task production 3.2  # CI/CD
```

**Result**: Prototype → Production-ready in 3 weeks.

---

## Advanced Techniques

### Incremental Analysis

**Analyze specific modules**:

```bash
/analyze-codebase

# When asked for scope:
"Analyze only:
- apps/my-app/src/auth/
- apps/my-app/src/api/"
```

**Use case**: Large codebase, focus on high-priority modules first.

### Combining with Logs

**Provide detailed context**:

```bash
/analyze-codebase deep

# When asked for context:
"I have:
- Development log: apps/my-app/docs/dev-history.md
- Architecture doc: apps/my-app/docs/arch.md
- Known issues: apps/my-app/docs/bugs.md"
```

**Result**: AI generates more accurate specs by understanding context.

### Iterative Refinement

**Re-analyze after changes**:

```bash
# Initial analysis
/analyze-codebase

# Make major refactoring
/implement-task refactoring 4.1

# Re-analyze to update docs
/analyze-codebase quick
```

**Use case**: Keep specs up-to-date as you refactor.

---

## Best Practices

### Before Analysis

**✅ Do**:
- Organize code into `apps/[app-name]/`
- Gather all available context (logs, docs)
- Set work context
- Have tests in standard location
- Clean up obvious cruft

**❌ Don't**:
- Mix process code with app code
- Skip gathering context
- Expect perfect results without review
- Ignore generated specs

### During Analysis

**✅ Do**:
- Provide all context you have
- Choose appropriate depth
- Be patient (deep analysis takes time)
- Answer agent questions

**❌ Don't**:
- Interrupt the analysis
- Skip providing logs/docs
- Rush with quick analysis if you need deep
- Assume AI understands business context

### After Analysis

**✅ Do**:
- Review all generated specs carefully
- Verify requirements are accurate
- Correct misunderstandings
- Add missing business context
- Prioritize critical issues
- Create action plan

**❌ Don't**:
- Assume specs are perfect
- Skip reviewing
- Ignore security/critical issues
- Start implementing without plan
- Forget to update specs as you refactor

---

## Troubleshooting

### Issue: Analysis Takes Too Long

**Cause**: Deep analysis on large codebase

**Solutions**:
1. Use quick analysis first
2. Analyze specific modules
3. Break into multiple sessions

### Issue: Generated Specs Are Inaccurate

**Cause**: AI inferred incorrectly

**Solutions**:
1. Provide more context (logs, docs)
2. Review and edit specs manually
3. Re-run with better scope
4. Point to specific files

### Issue: Missing Features Not Detected

**Cause**: Features only in docs, not code

**Solutions**:
1. Provide documentation to agent
2. Mention specific missing features
3. Create specs manually for new features

### Issue: Can't Understand Architecture

**Cause**: Complex or unclear structure

**Solutions**:
1. Provide architecture diagram/doc
2. Explain key components to agent
3. Analyze modules incrementally
4. Create architecture doc manually

---

## Comparison: Greenfield vs Reverse Engineering

| Aspect | Greenfield Workflow | Reverse Engineering |
|--------|-------------------|---------------------|
| **Start Point** | App idea | Existing code |
| **Specs Creation** | Before code | After code |
| **Order** | Specs → Code | Code → Specs |
| **Accuracy** | High (specs drive code) | Best effort (inferred) |
| **Review Needed** | Requirements phase | All generated specs |
| **Use Cases** | New apps | Legacy, inherited code |
| **Time to Specs** | 45-75 min | 30 min - 3 hr |
| **Agent** | @app-planner, @spec-orchestrator | @code-analyzer |
| **Command** | /batch-spec | /analyze-codebase |

**Both workflows end at the same place**: Documented, spec-driven development.

---

## FAQ

**Q: Can I use this on production code?**  
A: Yes! It's designed for that. Analysis is read-only.

**Q: Will it find all bugs?**  
A: No. It identifies patterns and obvious issues, not a full audit.

**Q: How accurate are generated specs?**  
A: ~80-90% accurate. Always review and refine.

**Q: Can it handle any language?**  
A: Yes, but better with structured languages (TypeScript, Python, Go).

**Q: What if code is really messy?**  
A: It will document "as-is" and mark areas needing refactoring.

**Q: Can I analyze part of a codebase?**  
A: Yes! Specify which files/modules to analyze.

**Q: How long does analysis take?**  
A: Quick: 30 min, Deep: 2-3 hr (depending on size).

**Q: Do I need to provide anything?**  
A: Just code. But logs/docs help immensely.

**Q: Can I re-analyze after changes?**  
A: Yes! Re-run to update specs.

**Q: What about microservices?**  
A: Treat each service as separate app in `apps/`.

---

## Summary

**Reverse Engineering Workflow**:
1. Place code in `apps/[app-name]/`
2. Set context: `/set-context [app-name]`
3. Analyze: `/analyze-codebase [quick/deep]`
4. Review generated specs
5. Prioritize issues
6. Implement with spec-driven development

**Result**: Legacy code → Documented, maintainable, spec-driven system ✨

---

## Related Documentation

- [Multi-App Architecture](MULTI_APP_ARCHITECTURE.md)
- [Work Context](WORK_CONTEXT.md)
- [Greenfield Workflow](greenfield-app-workflow.md)
- [Implementation Workflow](implementation-workflow.md)
- [README](../README.md)

---

**Transform your legacy code into spec-driven development!** 🔍→📄→✅

