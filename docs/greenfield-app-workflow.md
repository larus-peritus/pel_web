# Greenfield App Development Workflow

Complete guide for starting a new app from just an idea.

## The Challenge

You have an app idea but:
- ❌ No features defined
- ❌ No technical design
- ❌ No implementation plan
- ❌ Don't know where to start

## The Solution

Systematic progression: **Idea → Features → Specs → Implementation**

---

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: APP PLANNING                                          │
│ From idea to feature breakdown                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    @app-planner [your idea]
                              │
                    ┌─────────┴─────────┐
                    │  Discovery        │
                    │  - Vision         │
                    │  - Users          │
                    │  - Platform       │
                    │  - Constraints    │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Feature          │
                    │  Identification   │
                    │  - Core features  │
                    │  - User flows     │
                    │  - Functionality  │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Prioritization   │
                    │  - Essential (MVP)│
                    │  - Important      │
                    │  - Nice-to-Have   │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Sequencing       │
                    │  - Foundation     │
                    │  - Core Value     │
                    │  - Enhancement    │
                    └─────────┬─────────┘
                              │
                              ▼
                        APP_PLAN.md
                  (Feature list with priorities)

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1-3: SPEC CREATION (Per Feature)                         │
│ Requirements → Design → Tasks for each feature                  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   Feature A             Feature B             Feature C
        │                     │                     │
        ▼                     ▼                     ▼
@spec-orchestrator    @spec-orchestrator    @spec-orchestrator
        │                     │                     │
 ┌──────┴──────┐       ┌──────┴──────┐       ┌──────┴──────┐
 │ Requirements│       │ Requirements│       │ Requirements│
 │   (EARS)    │       │   (EARS)    │       │   (EARS)    │
 └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
        │                     │                     │
 ┌──────┴──────┐       ┌──────┴──────┐       ┌──────┴──────┐
 │   Design    │       │   Design    │       │   Design    │
 │(Architecture)│       │(Architecture)│       │(Architecture)│
 └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
        │                     │                     │
 ┌──────┴──────┐       ┌──────┴──────┐       ┌──────┴──────┐
 │    Tasks    │       │    Tasks    │       │    Tasks    │
 │ (Breakdown) │       │ (Breakdown) │       │ (Breakdown) │
 └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
        │                     │                     │
        ▼                     ▼                     ▼
   Complete              Complete              Complete
     Spec                  Spec                  Spec

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: IMPLEMENTATION (Per Feature)                          │
│ Build, test, validate each feature                             │
└─────────────────────────────────────────────────────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
  [Implement]           [Implement]           [Implement]
  [Test]                [Test]                [Test]
  [Validate]            [Validate]            [Validate]
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                              ▼
                        Complete App
```

---

## Step-by-Step Guide

### Step 0: App Planning

**Start**: You have just an idea

```bash
@app-planner I want to build a habit tracking app
```

**What Happens**:

1. **Discovery Questions**:
   - What's the app for?
   - Who will use it?
   - What problem does it solve?
   - Platform (web/mobile/desktop)?
   - Technology preferences?

2. **Feature Brainstorming**:
   Agent helps identify all features:
   - User authentication
   - Habit management (CRUD)
   - Daily tracking
   - Streak visualization
   - Reminders
   - Statistics/analytics
   - Social features
   - etc.

3. **Prioritization**:
   ```
   Essential (MVP):
   - User authentication
   - Habit management
   - Daily tracking
   - Streak display
   - Basic reminders
   
   Important (Phase 2):
   - Advanced statistics
   - Habit categories
   - Custom schedules
   
   Nice-to-Have (Future):
   - Social sharing
   - Habit templates
   - Journal notes
   ```

4. **Sequencing**:
   ```
   Week 1-2: Foundation
   - [ ] User authentication
   - [ ] Habit data models
   
   Week 3-4: Core Functionality
   - [ ] Daily tracking
   - [ ] Streak calculation
   
   Week 5: Enhancement
   - [ ] Reminders
   - [ ] Basic stats
   ```

5. **Output**: `APP_PLAN.md` created

**Time**: 30-60 minutes

---

### Step 1-3: Create Specs (Per Feature)

**For each feature in your plan**, create complete specs:

#### Feature A: User Authentication

```bash
@spec-orchestrator create spec for user authentication
```

**Flow**:
1. **Requirements Phase**:
   - User stories (As a user, I want to...)
   - EARS acceptance criteria (WHEN... THEN...)
   - Non-functional requirements
   - Constraints

2. **Design Phase**:
   - Architecture (REST API, JWT tokens, bcrypt)
   - Components (AuthService, UserModel, TokenManager)
   - Data models (User schema, Session schema)
   - Error handling
   - Testing strategy

3. **Tasks Phase**:
   - Task 1: Setup project and auth routes
   - Task 2: Create User model with validation
   - Task 3: Implement registration endpoint
   - Task 4: Implement login endpoint
   - Task 5: Add JWT middleware
   - Task 6: Write tests

**Output**:
- `specs/user-authentication-requirements.md`
- `specs/user-authentication-design.md`
- `specs/user-authentication-tasks.md`

**Time per feature**: 1-2 hours

**Repeat** for each essential feature:
- Habit management → Create spec
- Daily tracking → Create spec
- Streak display → Create spec
- Basic reminders → Create spec

---

### Step 4: Implementation (Per Feature)

**Option A: Sequential** (Recommended for solo)
```
1. Spec user-authentication
2. Implement user-authentication
3. Test and validate
4. ✅ Feature complete

5. Spec habit-management
6. Implement habit-management
7. Test and validate
8. ✅ Feature complete

[Continue for all features]
```

**Option B: Parallel** (For teams)
```
1. Spec all MVP features
   - user-authentication
   - habit-management
   - daily-tracking
   - streak-display

2. Create worktrees (isolated environments)
   /create_worktree user-authentication
   /create_worktree habit-management
   /create_worktree daily-tracking
   /create_worktree streak-display

3. Assign to team members
   - Dev A: user-authentication (worktree port 4010)
   - Dev B: habit-management (worktree port 4020)
   - Dev C: daily-tracking (worktree port 4030)
   - Dev D: streak-display (worktree port 4040)

4. Merge as features complete
```

---

## Complete Example: Recipe Sharing App

### Phase 0: App Planning

**Input**:
```
@app-planner I want to build a recipe sharing app
```

**Output**: `APP_PLAN.md`
```markdown
# App Plan: Recipe Sharing App

## Vision
A platform for home cooks to share, discover, and organize recipes.

## Target Users
- Home cooks sharing recipes
- People looking for new recipes
- Users organizing recipe collections

## Essential Features (MVP)
1. User Authentication → Week 1
2. Recipe Creation (CRUD) → Week 2
3. Recipe Browsing (Feed) → Week 3
4. Recipe Saving (Bookmarks) → Week 4

## Important Features (Phase 2)
5. Search & Filters
6. Ratings & Comments
7. User Profiles & Following

## Nice-to-Have (Future)
8. Meal Planning
9. Shopping Lists
10. Nutrition Calculator
```

### Phase 1-3: Spec Each Feature

**Week 1**: User Authentication
```
@spec-orchestrator create spec for user authentication
→ requirements-user-authentication.md
→ design-user-authentication.md
→ tasks-user-authentication.md
```

**Week 2**: Recipe Creation
```
@spec-orchestrator create spec for recipe creation
→ requirements-recipe-creation.md
→ design-recipe-creation.md
→ tasks-recipe-creation.md
```

**Week 3**: Recipe Browsing
```
@spec-orchestrator create spec for recipe browsing
→ requirements-recipe-browsing.md
→ design-recipe-browsing.md
→ tasks-recipe-browsing.md
```

**Week 4**: Recipe Saving
```
@spec-orchestrator create spec for recipe saving
→ requirements-recipe-saving.md
→ design-recipe-saving.md
→ tasks-recipe-saving.md
```

### Phase 4: Implement

**Sequential Implementation**:
- Week 1: Spec + Implement user auth
- Week 2: Spec + Implement recipe creation
- Week 3: Spec + Implement recipe browsing
- Week 4: Spec + Implement recipe saving

**Result**: MVP ready to launch!

---

## Best Practices

### Keep MVP Lean
✅ **Do**:
- 3-5 essential features
- Focus on core value
- Ship and iterate

❌ **Don't**:
- Over-plan (analysis paralysis)
- Include every idea in MVP
- Build before validating

### Feature Sizing
✅ **Do**:
- Break large features into smaller ones
- Each feature = 1-2 weeks max
- Independent, testable features

❌ **Don't**:
- Monolithic features (3+ weeks)
- Tightly coupled features
- Unclear boundaries

### Dependency Management
✅ **Do**:
- Auth first (if needed)
- Foundation before enhancement
- Core before nice-to-have

❌ **Don't**:
- Build enhancements before core
- Ignore dependencies
- Jump around randomly

### Iteration Strategy
✅ **Do**:
- One feature at a time
- Validate each feature
- Adjust plan based on learnings

❌ **Don't**:
- Try to build everything at once
- Skip validation
- Rigidly follow initial plan

---

## Timeline Estimates

### Small App (3-5 features)
- **Planning**: 1 hour
- **Specs**: 4-6 hours (1-1.5h per feature)
- **Implementation**: 2-4 weeks
- **Total**: 1 month

### Medium App (6-10 features)
- **Planning**: 2 hours
- **Specs**: 8-12 hours
- **Implementation**: 6-8 weeks
- **Total**: 2 months

### Large App (10+ features)
- **Planning**: 3 hours
- **Specs**: 12-20 hours
- **Implementation**: 12+ weeks
- **Total**: 3+ months

*Note*: Implementation time assumes solo developer, 20-30 hours/week

---

## FAQ

**Q: Do I need to spec all features before implementing any?**

A: No! Recommended approach:
1. Plan all features (APP_PLAN.md)
2. Spec first feature
3. Implement first feature
4. Validate
5. Spec next feature
6. Implement next feature
7. Repeat

This allows you to learn and adjust as you go.

**Q: What if I discover new features during implementation?**

A: Update APP_PLAN.md and prioritize:
- Essential → Add to current phase
- Important → Add to Phase 2
- Nice-to-Have → Add to Future

The plan is a living document.

**Q: Should I use worktrees?**

A: Worktrees are optional:

**Use worktrees if**:
- Multiple developers
- Working on multiple features in parallel
- Need isolated environments (different ports, databases)

**Skip worktrees if**:
- Solo developer
- Working on one feature at a time
- Simple project

**Q: How do I know if my MVP is lean enough?**

A: Ask:
- Can a user get core value with just these features?
- Can I build it in 4-6 weeks?
- Does each feature directly serve the core value?

If yes to all, your MVP is lean enough.

---

## Summary

**Greenfield App Development = 4 Phases**:

1. **App Planning** (`@app-planner`)
   - Idea → Feature list
   - Prioritize MVP
   - Output: APP_PLAN.md

2. **Spec Creation** (`@spec-orchestrator`)
   - Per feature: Requirements → Design → Tasks
   - Output: 3 docs per feature

3. **Implementation** (Per feature)
   - Follow tasks.md
   - Test and validate

4. **Iteration**
   - Launch MVP
   - Gather feedback
   - Spec Phase 2 features
   - Continue

**Result**: Systematic path from idea to shipped app!

---

**Related Documentation**:
- [Main Guide](../SPEC_DRIVEN_DEVELOPMENT.md)
- [App Planner Agent](../.claude/agents/app-planner.md)
- [App Planning Skill](../.claude/skills/app-planning-skill/SKILL.md)
- [Workflow Patterns](workflow-patterns.md)


