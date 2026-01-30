# Requirements Examples

Real-world examples of well-structured requirements using EARS format.

## Example 1: User Authentication System

### Introduction
A secure authentication system for a web application that supports email/password login, session management, and password reset functionality.

### Requirement 1: User Registration

**User Story**: As a new user, I want to create an account with email and password, so that I can access personalized features.

#### Acceptance Criteria

1. WHEN user provides valid email and password THEN system SHALL create new account
2. WHEN user provides existing email THEN system SHALL display "Email already registered" error
3. WHEN user provides invalid email format THEN system SHALL display "Invalid email format" error
4. IF password is shorter than 8 characters THEN system SHALL display "Password must be at least 8 characters" error
5. IF password lacks uppercase letter THEN system SHALL display "Password must contain uppercase letter" error
6. IF password lacks number THEN system SHALL display "Password must contain number" error
7. WHEN account creation succeeds THEN system SHALL send confirmation email
8. WHEN account creation succeeds THEN system SHALL redirect to onboarding page
9. WHEN user submits registration form THEN system SHALL complete within 2 seconds

### Requirement 2: User Login

**User Story**: As a registered user, I want to log in with my credentials, so that I can access my account.

#### Acceptance Criteria

1. WHEN user provides valid email and password THEN system SHALL authenticate user within 2 seconds
2. WHEN authentication succeeds THEN system SHALL create session token
3. WHEN authentication succeeds THEN system SHALL redirect to user dashboard
4. WHEN user provides invalid credentials THEN system SHALL display "Invalid email or password" error
5. IF user fails authentication 3 times THEN system SHALL lock account for 15 minutes
6. IF account is locked THEN system SHALL display "Account locked. Try again in X minutes" message
7. WHEN user selects "Remember me" THEN system SHALL extend session to 30 days
8. IF "Remember me" is NOT selected THEN system SHALL expire session after 24 hours

### Requirement 3: Password Reset

**User Story**: As a user who forgot my password, I want to reset it via email, so that I can regain access to my account.

#### Acceptance Criteria

1. WHEN user requests password reset THEN system SHALL send reset email within 1 minute
2. WHEN reset email is sent THEN system SHALL include link valid for 1 hour
3. IF reset link is expired THEN system SHALL display "Link expired. Request new reset" message
4. WHEN user clicks valid reset link THEN system SHALL display password reset form
5. WHEN user sets new password THEN system SHALL validate password meets requirements
6. WHEN new password is set THEN system SHALL invalidate all existing sessions
7. WHEN password reset completes THEN system SHALL send confirmation email
8. IF user requests reset for non-existent email THEN system SHALL display generic message (security)

---

## Example 2: E-commerce Shopping Cart

### Introduction
Shopping cart functionality for an e-commerce platform supporting product management, quantity updates, and checkout preparation.

### Requirement 1: Add to Cart

**User Story**: As a shopper, I want to add products to my cart, so that I can purchase multiple items together.

#### Acceptance Criteria

1. WHEN user clicks "Add to Cart" button THEN system SHALL add product to cart
2. WHEN product is added THEN system SHALL display confirmation message
3. WHEN product is added THEN system SHALL update cart count indicator
4. IF product is already in cart THEN system SHALL increment quantity by 1
5. IF product stock is insufficient THEN system SHALL display "Insufficient stock" error
6. IF product stock is insufficient THEN system SHALL NOT add to cart
7. WHEN user adds product THEN system SHALL persist cart for 7 days
8. WHERE user is NOT authenticated THEN system SHALL store cart in browser
9. WHERE user IS authenticated THEN system SHALL store cart in database
10. IF user logs in THEN system SHALL merge browser cart with database cart

### Requirement 2: Update Cart Quantities

**User Story**: As a shopper, I want to change product quantities in my cart, so that I can buy the exact amount I need.

#### Acceptance Criteria

1. WHEN user increases quantity THEN system SHALL update cart total immediately
2. WHEN user decreases quantity to 0 THEN system SHALL remove product from cart
3. IF requested quantity exceeds stock THEN system SHALL display "Only X available" message
4. IF requested quantity exceeds stock THEN system SHALL set quantity to maximum available
5. WHEN quantity changes THEN system SHALL recalculate subtotal within 500ms
6. WHEN quantity changes THEN system SHALL recalculate taxes and shipping
7. IF cart becomes empty THEN system SHALL display "Your cart is empty" message
8. WHILE user is updating quantities system SHALL disable checkout button

### Requirement 3: Cart Persistence and Sync

**User Story**: As a shopper, I want my cart saved across devices, so that I can continue shopping later.

#### Acceptance Criteria

1. WHEN authenticated user adds to cart THEN system SHALL sync to database within 2 seconds
2. WHEN user logs in on different device THEN system SHALL load cart from database
3. IF cart is older than 7 days THEN system SHALL archive cart items
4. WHEN network connection is lost THEN system SHALL queue updates for sync
5. WHEN connection restores THEN system SHALL sync queued updates
6. IF products in cart are no longer available THEN system SHALL display "Some items are no longer available"
7. IF prices changed since adding to cart THEN system SHALL display price change notification
8. WHERE user is on mobile app THEN system SHALL sync cart with web version

---

## Example 3: File Upload System

### Introduction
File upload functionality supporting multiple file types, progress tracking, and error handling for a document management system.

### Requirement 1: File Selection and Validation

**User Story**: As a user, I want to upload documents to share with my team, so that we can collaborate on files.

#### Acceptance Criteria

1. WHEN user selects file under 50MB THEN system SHALL accept file for upload
2. WHEN user selects file over 50MB THEN system SHALL display "File exceeds 50MB limit" error
3. IF file type is PDF, DOCX, or XLSX THEN system SHALL accept file
4. IF file type is NOT supported THEN system SHALL display "Unsupported file type" error with list of supported types
5. WHEN user selects multiple files THEN system SHALL validate each file independently
6. IF multiple files selected exceed 200MB total THEN system SHALL display "Total size exceeds 200MB" error
7. WHEN validation passes THEN system SHALL enable upload button
8. IF validation fails THEN system SHALL disable upload button

### Requirement 2: Upload Process and Progress

**User Story**: As a user uploading a large file, I want to see upload progress, so that I know how long to wait.

#### Acceptance Criteria

1. WHEN upload starts THEN system SHALL display progress bar
2. WHILE upload is in progress system SHALL update progress percentage every second
3. WHILE upload is in progress system SHALL display estimated time remaining
4. WHILE upload is in progress system SHALL allow user to cancel
5. IF user cancels upload THEN system SHALL stop upload and remove partial file
6. WHEN upload completes THEN system SHALL display "Upload successful" message
7. WHEN upload completes THEN system SHALL generate thumbnail (for images)
8. IF upload fails THEN system SHALL display specific error message
9. IF upload fails due to network THEN system SHALL offer retry option
10. WHEN network error occurs THEN system SHALL auto-retry 3 times before showing error

### Requirement 3: Upload Security and Processing

**User Story**: As a system administrator, I want uploaded files scanned for malware, so that our system remains secure.

#### Acceptance Criteria

1. WHEN file upload completes THEN system SHALL scan file for viruses
2. WHILE scan is in progress system SHALL display "Processing..." message
3. IF malware is detected THEN system SHALL delete file immediately
4. IF malware is detected THEN system SHALL log security event
5. IF malware is detected THEN system SHALL notify user "File rejected due to security policy"
6. WHEN scan completes without issues THEN system SHALL make file available
7. WHERE user is NOT authenticated THEN system SHALL NOT allow file upload
8. WHEN file is uploaded THEN system SHALL encrypt at rest using AES-256
9. IF file contains PII THEN system SHALL apply data retention policy

---

## Example 4: Real-Time Notification System

### Introduction
Real-time notification system for web and mobile applications supporting multiple notification types and delivery methods.

### Requirement 1: Notification Delivery

**User Story**: As a user, I want to receive real-time notifications, so that I stay informed about important events.

#### Acceptance Criteria

1. WHEN event occurs THEN system SHALL deliver notification within 1 second
2. WHERE user is online THEN system SHALL send via WebSocket
3. WHERE user is offline THEN system SHALL queue notification for delivery
4. WHEN user comes online THEN system SHALL deliver queued notifications
5. IF notification queue exceeds 100 items THEN system SHALL deliver summary notification
6. WHERE user has mobile app installed THEN system SHALL send push notification
7. IF user has notifications disabled THEN system SHALL NOT send notifications
8. WHEN critical alert occurs THEN system SHALL override user preferences

### Requirement 2: Notification Preferences

**User Story**: As a user, I want to control which notifications I receive, so that I'm not overwhelmed.

#### Acceptance Criteria

1. WHEN user opens settings THEN system SHALL display all notification categories
2. WHEN user toggles category THEN system SHALL save preference immediately
3. WHEN user disables category THEN system SHALL NOT send notifications for that category
4. IF user enables digest mode THEN system SHALL batch notifications hourly
5. IF user sets quiet hours THEN system SHALL NOT send notifications during those hours
6. IF critical alert occurs during quiet hours THEN system SHALL send notification anyway
7. WHEN user updates preferences THEN system SHALL apply to all devices within 5 seconds
8. WHERE user is on mobile THEN system SHALL respect system notification settings

### Requirement 3: Notification History

**User Story**: As a user, I want to view notification history, so that I can review past notifications.

#### Acceptance Criteria

1. WHEN user opens notifications THEN system SHALL display last 100 notifications
2. WHEN user scrolls to bottom THEN system SHALL load next 100 notifications
3. IF notification is unread THEN system SHALL display with highlight
4. WHEN user clicks notification THEN system SHALL mark as read
5. WHEN user clicks notification THEN system SHALL navigate to relevant content
6. IF notification target no longer exists THEN system SHALL display archived message
7. WHEN user deletes notification THEN system SHALL remove from history
8. WHEN notification is 30 days old THEN system SHALL archive automatically

---

## Example 5: Search Functionality

### Introduction
Full-text search functionality with filtering, sorting, and advanced query capabilities.

### Requirement 1: Basic Search

**User Story**: As a user, I want to search for content by keywords, so that I can quickly find what I need.

#### Acceptance Criteria

1. WHEN user types in search box THEN system SHALL show autocomplete suggestions
2. WHILE user is typing system SHALL update suggestions every 300ms
3. WHEN user presses Enter THEN system SHALL execute search within 1 second
4. WHEN search completes THEN system SHALL display results with relevance ranking
5. IF no results found THEN system SHALL display "No results for '[query]'" message
6. IF no results found THEN system SHALL suggest similar searches
7. WHEN search returns results THEN system SHALL highlight matching keywords
8. WHEN search has more than 20 results THEN system SHALL paginate with 20 per page

### Requirement 2: Advanced Search

**User Story**: As a power user, I want to use filters and operators, so that I can find exactly what I'm looking for.

#### Acceptance Criteria

1. WHEN user applies date filter THEN system SHALL show results within date range
2. WHEN user applies multiple filters THEN system SHALL combine with AND logic
3. WHEN user uses quotes THEN system SHALL search for exact phrase
4. WHEN user uses minus sign THEN system SHALL exclude terms
5. IF search query is malformed THEN system SHALL display helpful error message
6. WHEN user selects category filter THEN system SHALL show only results in that category
7. WHEN user clears filters THEN system SHALL show all results
8. WHERE user has permissions THEN system SHALL only show accessible results

### Requirement 3: Search Performance

**User Story**: As a user, I want fast search results, so that I can work efficiently.

#### Acceptance Criteria

1. WHEN database has under 100K records THEN system SHALL return results within 500ms
2. WHEN database has over 100K records THEN system SHALL return results within 2 seconds
3. WHILE search is processing system SHALL display loading indicator
4. IF search takes over 5 seconds THEN system SHALL display timeout message
5. WHEN multiple users search simultaneously THEN system SHALL maintain performance
6. WHEN search index is being rebuilt THEN system SHALL use stale index
7. IF search load is high THEN system SHALL queue requests fairly
8. WHEN search completes THEN system SHALL cache results for 5 minutes

---

## Key Patterns Summary

### Success Patterns

1. **Specific and Measurable**: Use exact numbers and criteria
2. **Complete Coverage**: Include normal, edge, and error cases
3. **Clear Triggers**: Use WHEN/IF/WHILE/WHERE appropriately
4. **User-Focused**: Written from user perspective
5. **Testable**: Every criterion can be verified

### Common Elements

- Performance targets with specific times
- Error messages with specific content
- Conditional logic with clear precedence
- Context-aware behavior (mobile, offline, authenticated)
- Security considerations (authentication, authorization)
- Accessibility and user experience requirements

### Usage Tips

- Start with user stories to understand value
- Use EARS format for all acceptance criteria
- Cover authentication, validation, and error cases
- Include performance and security requirements
- Think about different contexts (mobile, offline, etc.)
- Make criteria testable and measurable


