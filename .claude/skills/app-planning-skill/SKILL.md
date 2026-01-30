---
name: App Planning
description: Guide users from app idea to feature breakdown to implementation specs. Use when the user has an app idea but no features defined yet, wants to start a new project from scratch, or needs help breaking down an app concept into implementable features.
---

# App Planning

Transform app ideas into structured feature lists and complete specifications.

## When to Use This Skill

Use this skill when:
- Starting a new app from just an idea
- User says "I want to build [app description]"
- No existing features or codebase
- Need to break down an app concept
- Planning a new project from scratch

## App Planning Workflow

### Phase 1: Understand the App Idea

**Ask Discovery Questions**:

1. **App Purpose**: What problem does this app solve? Who is it for?
2. **User Types**: Who will use it? Different roles?
3. **Core Value**: What's the main thing users do in this app?
4. **Constraints**: Platform (web/mobile/desktop)? Technology preferences? Timeline? Budget?
5. **Inspiration**: Any similar apps? What would you do differently?

### Phase 2: Identify Core Features

**Feature Categories to Consider**:

**User Management**:
- User registration/authentication?
- User profiles?
- Account management?

**Core Functionality**:
- What's the main workflow?
- What do users create/view/manage?
- What actions can they take?

**Discovery & Navigation**:
- Search functionality?
- Filtering and sorting?
- Categories or tags?

**Social/Collaborative**:
- Sharing features?
- Comments or ratings?
- Following/notifications?

**Content Management**:
- Create/edit/delete content?
- Media upload?
- Drafts or versioning?

**Help User Prioritize**:
```
Essential (MVP):
- [Features needed for basic functionality]

Important (Phase 2):
- [Features that enhance core value]

Nice-to-Have (Future):
- [Features that can wait]
```

### Phase 3: Feature Breakdown

**For each essential feature, create**:

```markdown
## Feature: [Name]

**User Need**: [What user problem this solves]
**Priority**: Essential / Important / Nice-to-Have
**Estimated Complexity**: Simple / Medium / Complex
**Dependencies**: [What must exist first]

**User Stories** (preliminary):
- As a [user], I want to [action], so that [benefit]

**Next Step**: Create complete spec for this feature
```

### Phase 4: Sequencing Strategy

**Recommend implementation order**:

1. **Foundation Features** (always first):
   - User authentication (if needed)
   - Basic data models
   - Core infrastructure

2. **Core Value Features** (next):
   - The main thing users do
   - Essential workflows

3. **Enhancement Features** (later):
   - Search, filters, advanced features
   - Social features
   - Analytics, reporting

### Phase 5: Create Specs for Each Feature

**For each feature in sequence**:

```
Now let's create complete specs for: [Feature Name]

Use spec-orchestrator or commands:
@spec-orchestrator create spec for [feature]
or
/spec-workflow [feature-name]

This will create:
- Requirements (with EARS acceptance criteria)
- Design (architecture and components)
- Tasks (implementation breakdown)
```

## App Planning Template

Use this structure:

```markdown
# App Plan: [App Name]

## Vision
[What is this app? Who is it for? What problem does it solve?]

## Target Users
- Primary: [Main user type]
- Secondary: [Other user types]

## Core Value Proposition
[The main thing this app does that provides value]

## Platform & Technology
- Platform: [Web / Mobile / Desktop / All]
- Frontend: [Technology choice]
- Backend: [Technology choice]
- Database: [Technology choice]

## Feature Breakdown

### Essential Features (MVP)
1. **[Feature 1]**
   - User Need: [What problem this solves]
   - Complexity: [Simple/Medium/Complex]
   - Dependencies: [Prerequisites]
   - Status: [ ] Planned → [ ] Spec Created → [ ] Implemented

2. **[Feature 2]**
   ...

### Important Features (Phase 2)
[Features for version 2]

### Nice-to-Have (Future)
[Features that can wait]

## Implementation Sequence

Phase 1 - Foundation:
- [ ] Feature A
- [ ] Feature B

Phase 2 - Core Value:
- [ ] Feature C
- [ ] Feature D

Phase 3 - Enhancement:
- [ ] Feature E
- [ ] Feature F

## Next Steps
1. Create spec for [first feature]
2. Implement first feature
3. Test and validate
4. Move to next feature
```

## Example: Recipe Sharing App

**User Says**: "I want to build a recipe sharing app"

**App Planning Response**:

```markdown
# App Plan: Recipe Sharing App

## Vision
A platform where home cooks can share, discover, and save recipes.

## Target Users
- Home cooks who want to share recipes
- People looking for new recipes to try
- Users organizing their recipe collection

## Core Value Proposition
Easy recipe sharing with great discovery and organization tools.

## Feature Breakdown

### Essential Features (MVP)

1. **User Authentication**
   - User Need: Secure accounts to save recipes and follow others
   - Complexity: Medium
   - Dependencies: None (foundation feature)
   - Status: [ ] Planned

2. **Recipe Creation**
   - User Need: Share recipes with ingredients and instructions
   - Complexity: Medium
   - Dependencies: User Authentication
   - Status: [ ] Planned

3. **Recipe Browsing**
   - User Need: Discover recipes from other users
   - Complexity: Simple
   - Dependencies: Recipe Creation
   - Status: [ ] Planned

4. **Recipe Saving**
   - User Need: Save favorite recipes to personal collection
   - Complexity: Simple
   - Dependencies: User Authentication, Recipe Browsing
   - Status: [ ] Planned

### Important Features (Phase 2)

5. **Search & Filters**
   - User Need: Find specific recipes quickly
   - Complexity: Medium

6. **Recipe Ratings & Comments**
   - User Need: Get feedback and help others
   - Complexity: Medium

7. **User Profiles**
   - User Need: Follow favorite recipe creators
   - Complexity: Simple

### Nice-to-Have (Future)

8. **Meal Planning**
9. **Shopping Lists**
10. **Nutrition Information**

## Implementation Sequence

**Phase 1 - Foundation (Week 1-2)**:
- [ ] User Authentication → Create spec: /spec-workflow user-authentication
- [ ] Recipe Data Model → Create spec: /spec-workflow recipe-management

**Phase 2 - Core Value (Week 3-4)**:
- [ ] Recipe Creation → Create spec: /spec-workflow recipe-creation
- [ ] Recipe Browsing → Create spec: /spec-workflow recipe-browsing
- [ ] Recipe Saving → Create spec: /spec-workflow recipe-saving

**Phase 3 - Enhancement (Week 5-6)**:
- [ ] Search & Filters → Create spec: /spec-workflow search-filters
- [ ] Ratings & Comments → Create spec: /spec-workflow ratings-comments

## Next Step

Let's start with User Authentication:
@spec-orchestrator create spec for user authentication
```

## Integration with Spec Workflow

**After app planning**:

```
✅ App Plan Complete: Recipe Sharing App

You have 7 features identified.

Ready to create specs? Start with:

Option 1: One at a time (recommended)
@spec-orchestrator create spec for user-authentication

Option 2: Batch create
/spec-workflow user-authentication
/spec-workflow recipe-creation
/spec-workflow recipe-browsing
...

Option 3: Create worktrees for parallel work
/spec-workflow user-authentication
/create_worktree user-authentication

/spec-workflow recipe-creation
/create_worktree recipe-creation
```

## Best Practices

### Start Small
- ✅ Focus on MVP features first
- ✅ Get one feature working before adding more
- ✅ Validate with users early

### Think in Features
- ✅ Break app into discrete features
- ✅ Each feature should provide standalone value
- ✅ Features should be independently implementable

### Consider Dependencies
- ✅ Identify what needs to exist first
- ✅ Build foundation before fancy features
- ✅ User auth usually comes first if needed

### Maintain Flexibility
- ✅ App plan is a living document
- ✅ Adjust based on learnings
- ✅ Don't over-plan - start building

## Common App Types

### Social Apps
Essential: User auth, profiles, content creation, feed, following
Important: Search, notifications, messaging
Nice-to-Have: Stories, live features, advanced algorithms

### E-commerce Apps
Essential: Product catalog, cart, checkout, orders
Important: Search/filters, reviews, user accounts
Nice-to-Have: Recommendations, wishlists, gift cards

### Productivity Apps
Essential: Core workflow, data management, basic organization
Important: Search, filters, collaboration
Nice-to-Have: Integrations, automation, analytics

### Content Apps
Essential: Content creation, viewing, basic discovery
Important: Search, categories, user engagement
Nice-to-Have: Recommendations, social features, monetization

## Summary

App Planning bridges idea → features → specs:

1. **Understand** the app vision
2. **Identify** core features
3. **Prioritize** into MVP, Phase 2, Future
4. **Sequence** implementation order
5. **Create specs** for each feature using spec-orchestrator

Then implement feature by feature, spec by spec, systematically building your app!


