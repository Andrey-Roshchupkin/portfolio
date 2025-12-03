---
date: 2025-12-03
---

# One Million Dollar Bug: How I Caught It with Go Tests

## Introduction

No, I'm not the lucky one who discovered the bug before the bank's employees. At least, this article doesn't mention my role at the time of the events that occurred in Kazan, Russia, in 2023. I pieced this story together from various sources, and below is its content in English. For those who want to read the original sources in Russian, see: [SecurityLab.ru](https://www.securitylab.ru/news/536506.php) and [Kazan Vедомости](https://kazved.ru/news/zitel-kazani-razbogatel-na-68-mln-rublei-vyyaviv-uyazvimost-v-prilozenii-ak-bars-banka-5859626).

---

## The Incident

In 2023, a young man from Kazan, Russia, discovered a **vulnerability in the mobile banking application of Ak Bars Bank**. He transferred a certain amount of money from a betting account to his **blocked bank card**. The bank rejected the transaction and returned the funds to the betting account, but **the same amount also appeared on another, unblocked card** belonging to the same client. This allowed him to use the credited funds: transfer them and withdraw from the card.

The man exploited this vulnerability by repeatedly transferring money from his betting account to his blocked card. Starting with a small amount, he performed **30,000 similar operations over 10 days** and increased his capital by **68 million rubles** (approximately **$1 million** at the time).

The bank's employees detected the manipulations and blocked the account. The man had already withdrawn a substantial portion of the funds in cash, purchased a car, and disappeared. The police were notified of the financial crime and the perpetrator was eventually detained.

However, I found **no subsequent media reports about his punishment or the recovery of the funds**.

---

## The Bug

The vulnerability was a **logical error in transaction processing**. When a transfer to a blocked card was rejected, the system:
1. Returned the funds to the source account (correct behavior)
2. **Incorrectly credited the same amount to another card** belonging to the same client (the bug)

---

## Reverse Engineering the System

This story caught my attention because it's very illustrative. While on vacation, I was working on **backend test automation in Go**, and I didn't have to think long about what the test scenario should look like. However, at that point, I only had a test description and no concrete implementation. So I approached this problem using **reverse engineering** and recreated the system using the **black box principle**.

Yes, we don't know what the actual bank's code looked like, and my example is far from a real banking system, but it includes some **key characteristics that are relevant to real banks**.

As a result, I created **two versions of the server**: one that reproduces the bug from the story, and one that demonstrates the correct behavior.

Both servers include several **key characteristics typical of real banking systems**:

- **Precise Money Handling**: Using a custom `Money` type that stores amounts in cents (integers) to avoid floating-point precision errors—a critical requirement for financial systems
- **Database Transactions**: All money transfers are wrapped in database transactions to ensure atomicity and data consistency
- **Account Status Management**: Accounts can be in "active" or "blocked" states, with proper validation before operations
- **Transaction Status Tracking**: Every transaction is recorded with status ("pending", "completed", "failed", "returned") for audit and recovery purposes
- **Balance Validation**: The system checks account balance before allowing transfers to prevent overdrafts
- **Comprehensive Error Handling**: Proper error types and status codes for different failure scenarios (insufficient funds, blocked accounts, invalid amounts)
- **Structured Logging**: All operations are logged with context for debugging and audit trails

---

## Building the Test Framework

I had **two servers with Swagger documentation and PostgreSQL databases** connected, and I started developing tests in Go. A separate article will cover the test framework in detail, but I want to mention one key architectural difference here.

In **E2E testing from the end-user perspective**, I used **TypeScript with class inheritance** to describe business logic—creating base test classes and extending them for specific scenarios. However, for **backend testing in Go**, I needed a **composition-based approach** because Go doesn't support class inheritance. Instead, Go uses struct composition and helper functions to build reusable test components. This wasn't difficult—it required understanding and accepting a different architectural paradigm.

As a result, I built a solid framework with **test coverage for all routes** and several **user scenarios**.

### Test Coverage

The test suite includes:

- **Integration Tests**: 60 tests covering individual API endpoints (users, accounts, transactions, health)
- **E2E Tests**: 2 tests for complete user lifecycle scenarios
- **Property-Based Tests**: 9 tests using gopter to discover edge cases through combinatorial testing
- **Concurrent Tests**: 2 tests for race conditions and concurrent transaction handling

**Total: 73 tests** covering all server routes and critical user scenarios.

---

## The Results

### Test Isolation and Performance

Each test is **completely isolated** and uses **testcontainers** to spin up its own PostgreSQL database instance. This is a critical requirement for specialized backend testing because it requires **full database control**. While I typically test backend happy paths within E2E tests from the user's perspective, specialized backend testing demands database isolation to verify exact state changes, transaction rollbacks, and data consistency.

This isolation doesn't come at a performance cost—**all tests complete in less than 55 seconds**.

### Test Results Summary

When running tests against the **server with the bug**, the results are:

```
📦 Package Results:
  ❌ tests/tests/integration: 58/60 passed (2 failed)
  ✅ tests/tests/e2e: 2/2 passed
  ✅ tests/tests/concurrent: 2/2 passed
  ❌ tests/tests/property: 7/9 passed (2 failed)

❌ Failed Tests (4):
  1. tests/tests/property/TestTransfer_PairwiseAccountStatuses/active_to_blocked
  2. tests/tests/property/TestTransfer_PairwiseAccountStatuses
  3. tests/tests/integration/TestTransfer_BlockedDestinationAccount
  4. tests/tests/integration/TestTransfer_BlockedDestinationCard

✅ Passed Tests: 69
⏱️  Total execution time: 52.59s
```

### Which Tests Caught the Bug and Why

The **4 failing tests** all detect the same vulnerability: **transfers to blocked destination accounts or cards**.

1. **`TestTransfer_BlockedDestinationAccount`** and **`TestTransfer_BlockedDestinationCard`** (Integration tests): These tests verify that when transferring to a blocked destination, the system should reject the transaction and **not change any balances**. However, the buggy server incorrectly credits the blocked destination account, causing balance verification to fail.

2. **`TestTransfer_PairwiseAccountStatuses`** (Property-based test): This test uses **pairwise testing** to cover all combinations of account statuses (active/blocked). The `active_to_blocked` scenario specifically catches the bug—when transferring from an active account to a blocked one, the test expects no balance change, but the bug causes the destination balance to increase incorrectly.

All these tests share a common verification: **when a transfer to a blocked account is rejected, balances must remain unchanged**. The bug violates this invariant by crediting the blocked account, which the tests detect through balance consistency checks.

**On the server without the bug, all 73 tests pass**, confirming that the fix correctly handles blocked destination accounts.

---

## Key Principles of Backend Testing in Banking Systems

So, with Go tests, I caught a million-dollar bug. I also systematized my knowledge about backend testing in banking systems, and here are the **key principles** I want to share:

### 1. Start Testing with Documentation (Early Testing)

**Begin testing before writing a single line of test code**—start by reviewing the API documentation (Swagger/OpenAPI) and verifying it against business requirements.

**Why this matters**: You can catch bugs **without executing a single API request**. During development of these servers, I discovered my own errors: the server returned incorrect status codes in some operations, and these errors were also incorrectly documented in Swagger. By simply comparing the documentation with business requirements, I identified mismatches that would have caused test failures later.

**How to implement**:
1. Review Swagger/OpenAPI documentation first
2. Compare documented behavior with business requirements
3. Check status codes, request/response structures, error handling
4. Verify that documented behavior makes business sense
5. Don't blindly trust Swagger—question everything

This principle relates to **"The Absence of Errors Double Fallacy"** (see [my article](https://andrey-roshchupkin.github.io/portfolio/post/the-absence-of-errors)): just because documentation exists doesn't mean it's correct. Early documentation review is a form of **shift-left testing** that catches issues before they propagate to implementation.

### 2. Input Validation and Boundary Value Testing

**Test all input validation rules and boundary conditions**—verify that the system correctly handles valid inputs, rejects invalid inputs, and properly processes values at the boundaries of acceptable ranges.

**Why this matters**: Invalid or malicious input is a common attack vector. Missing validation can lead to data corruption, security vulnerabilities, or system crashes. Boundary values (zero, negative, maximum, minimum) are where bugs often hide.

**How to implement**:
1. Test missing required fields (should return 400 Bad Request)
2. Test invalid data types and formats
3. Test boundary values:
   - Zero amounts (should be rejected for transfers)
   - Negative amounts (should be rejected)
   - Amounts below minimum (e.g., less than 0.01)
   - Maximum values (if applicable)
4. Test invalid enum values (e.g., invalid account status)
5. Verify that invalid inputs don't modify the database
6. Use table-driven tests to cover multiple validation scenarios efficiently

**Example test cases**:
- Missing `sourceCardNumber` → 400
- Negative transfer amount → 400
- Zero transfer amount → 400
- Amount less than 0.01 → 400

### 3. Response Schema Validation

**Verify that API responses match their documented schemas (models)**, not just that they're non-empty. An empty object `{}` is technically non-empty but doesn't match the expected schema.

**Why this matters**: A response can be non-empty but still incorrect. For example, a response might return `{}` instead of the expected structure with required fields. Schema validation ensures that:
- All required fields are present
- Field types are correct
- Nested objects match their schemas
- The response structure matches the API contract

**How to implement**:
1. Don't just check `response != nil` or `response != ""`
2. Validate the complete response structure against the schema
3. Check that all required fields are present and have correct types
4. Verify nested objects and arrays match their schemas
5. Use generated client models (from Swagger) to ensure type safety
6. Create assertion functions for each response type (e.g., `AssertTransferResponse`, `AssertCreateAccountResponse`)

**Example**: Instead of checking `resp != nil`, verify:
- `resp.Payload != nil`
- `resp.Payload.TransactionID > 0`
- `resp.Payload.Amount` matches expected value
- All required fields are present and correctly typed

### 4. Database State Verification After Every Action

The most fundamental principle: **after every API call, verify the database state directly**. Don't rely solely on API responses—check what actually changed in the database.

**Why this matters**: API responses can be misleading. A server might return "success" but fail to update the database, or return "error" but still modify data. In banking systems, incorrect database state can lead to financial losses.

**How to implement**: After each operation, query the database to verify:
- Account balances match expected values
- Transactions are recorded correctly
- Related entities (users, cards, accounts) are in the expected state
- No unexpected changes occurred in other tables

### 5. Integer-Based Money Operations (Never Use Float)

**All money operations must use integer arithmetic**, storing amounts in the smallest currency unit (cents, kopecks, etc.), never floating-point numbers.

**Why this matters**: Floating-point arithmetic introduces precision errors that are unacceptable in financial systems. For example, `0.1 + 0.2` in floating-point doesn't equal `0.3` exactly. In banking, these tiny errors accumulate and can lead to significant discrepancies over thousands of transactions.

**How to implement**:
1. Store all monetary amounts as integers (in cents/kopecks)
2. Use integer arithmetic for all calculations (addition, subtraction, multiplication)
3. Only convert to decimal representation for display or API responses
4. Never use `float` or `double` types for money in any part of the system
5. In tests, use integer-based money types and verify calculations using integer comparisons

**Example**: Instead of storing `$10.50` as `10.5` (float), store it as `1050` (cents, integer). This eliminates precision errors entirely.

### 6. Balance Consistency (Money Conservation)

**The fundamental banking invariant**: Money cannot be created or destroyed. The total balance across all accounts must remain constant, except when money enters or leaves the system through external operations.

**Why this matters**: This is how the million-dollar bug was caught. When a transfer to a blocked account was rejected, the system incorrectly created money by crediting the destination account while also returning funds to the source.

**How to implement**: Before and after each money transfer operation:
1. Calculate the total balance of all accounts
2. Verify that the total remains unchanged (for internal transfers)
3. If the total changes unexpectedly, you've found a critical bug

### 7. No Negative Balances

**Another banking invariant**: No account should ever have a negative balance (unless explicitly allowed by business rules, such as overdraft protection).

**Why this matters**: Negative balances indicate that the system allowed spending more money than exists, which is a critical vulnerability.

**How to implement**: After each operation that affects balances, scan all accounts and verify that no balance is negative.

### 8. State Verification After Errors

When an operation fails (returns an error), **verify that nothing changed in the database**. Failed operations should not have side effects.

**Why this matters**: This principle caught the bug. When transferring to a blocked account failed, the system should have left all balances unchanged. Instead, it incorrectly modified balances.

**How to implement**: 
1. Capture a database snapshot before the operation
2. Perform the operation (expecting it to fail)
3. Compare the final state with the initial snapshot
4. Verify that no changes occurred

### 9. Error Response Correctness

**Verify not only that an error occurred, but also that the error response is correct**—check the HTTP status code, error message structure, and that the error type matches the failure scenario.

**Why this matters**: Different error types require different handling. A 400 (Bad Request) indicates a client error (validation), while 404 (Not Found) indicates a missing resource. Incorrect status codes can mislead clients and make debugging difficult. During development, I discovered that my server returned incorrect status codes that were also incorrectly documented in Swagger.

**How to implement**:
1. Verify the HTTP status code matches the error type:
   - `400 Bad Request` for validation errors (missing fields, invalid values)
   - `404 Not Found` for non-existent resources (cards, accounts, users)
   - `500 Internal Server Error` only for unexpected server failures
2. Check that error responses match the documented error schema
3. Verify error messages are meaningful (if included)
4. Ensure error responses don't leak sensitive information
5. Test that different error scenarios return appropriate status codes

**Example**: 
- Transfer to non-existent card → 404 (not 400 or 500)
- Transfer with missing amount → 400 (not 404 or 500)
- Transfer with insufficient funds → 400 (business rule violation)

### 10. Business Rules Verification

**Test that the system correctly enforces all business rules**, not just technical validation. Business rules define what operations are allowed or prohibited based on business logic.

**Why this matters**: Business rules are critical in banking systems. Violations can lead to financial losses, regulatory issues, or security breaches. Technical validation (e.g., "amount is a number") is different from business rules (e.g., "cannot transfer more than account balance").

**How to implement**:
1. Test insufficient funds scenarios (transfer amount > account balance)
2. Test blocked account restrictions (cannot transfer from/to blocked accounts)
3. Test same-card transfers (should be rejected)
4. Test account status restrictions
5. Test minimum/maximum transfer limits (if applicable)
6. Verify that business rule violations return appropriate errors (usually 400)
7. Ensure business rule violations don't modify the database

**Example business rules tested**:
- Cannot transfer more than account balance → 400
- Cannot transfer from blocked account → 400
- Cannot transfer to same card → 400
- Cannot transfer to blocked destination → 400 (and balances unchanged)

### 11. Non-Existent Resource Handling

**Verify that the system correctly handles requests for non-existent resources** (cards, accounts, users) and returns appropriate 404 errors without modifying the database.

**Why this matters**: Missing resource handling is a common source of bugs. The system should:
- Return 404 (Not Found) for non-existent resources
- Not create resources implicitly
- Not modify existing resources
- Not leak information about resource existence

**How to implement**:
1. Test operations with non-existent source cards/accounts → 404
2. Test operations with non-existent destination cards/accounts → 404
3. Test operations with non-existent user IDs → 404
4. Verify that 404 responses don't modify the database
5. Ensure error messages don't reveal sensitive information (e.g., "card exists but is blocked" vs "card not found")

**Example test cases**:
- Transfer from non-existent card → 404, database unchanged
- Get account by non-existent ID → 404
- Transfer to non-existent card → 404, database unchanged

### 12. Idempotency Testing

**Idempotency** means that performing the same operation multiple times produces the same result as performing it once.

**Why this matters**: In distributed systems, network issues can cause duplicate requests. The system must handle repeated identical operations correctly without creating duplicate transactions or incorrect balances.

**How to implement**: 
1. Perform an operation (e.g., get user list, create account)
2. Repeat the same operation multiple times
3. Verify that the database state remains correct
4. For read operations, verify the database wasn't modified
5. For write operations, verify that duplicates don't create incorrect state

### 13. Property-Based Testing

Instead of writing specific test cases, **define properties (invariants) that should always hold true**, and let the testing framework generate random inputs to verify these properties.

**Why this matters**: Property-based testing discovers edge cases that manual test cases might miss. It's particularly powerful for financial systems where you need to verify invariants across a wide range of inputs.

**How to implement**:
1. Define a property (e.g., "total balance remains constant for any valid transfer")
2. Generate random test data (amounts, account statuses, etc.)
3. Run the operation with generated data
4. Verify the property holds true
5. If it fails, the framework will show you the exact input that broke the property

**Example properties tested**:
- Total balance consistency for any transfer amount
- No negative balances for any valid operation
- Predictable results for repeated identical operations
- Balance consistency for complex transaction chains

### 14. Pairwise Testing for Combinatorial Coverage

When testing combinations of multiple parameters (e.g., source account status × destination account status), **pairwise testing** ensures you cover all combinations systematically and deterministically.

**Why this matters**: Testing all combinations manually is tedious and error-prone. Pairwise testing ensures you don't miss critical combinations (like the "active to blocked" scenario that caught the bug).

**How to implement**: 
1. Identify parameters that affect behavior (e.g., account statuses: active/blocked)
2. Create a test matrix covering all combinations
3. Run each combination as a separate test case
4. Verify expected behavior for each combination

### 15. Concurrent Operation Testing

Test how the system handles **multiple simultaneous operations** on the same resources (e.g., concurrent transfers from the same account).

**Why this matters**: Real systems handle concurrent requests. Race conditions can cause incorrect balances, duplicate transactions, or lost updates.

**How to implement**:
1. Launch multiple goroutines/threads performing the same or related operations
2. Wait for all operations to complete
3. Verify that:
   - No negative balances were created
   - Total balance remains consistent
   - The number of successful operations matches expected behavior
   - All operations are recorded correctly

### 16. Transaction Recording Verification

Every financial operation must be **recorded in the database** for audit and recovery purposes.

**Why this matters**: Without proper transaction records, you can't audit operations, recover from errors, or investigate discrepancies.

**How to implement**: After each operation:
1. Verify that a transaction record was created (or updated)
2. Check that transaction details (amount, source, destination, status) are correct
3. Verify transaction status matches the operation result (completed, failed, pending)

### 17. Isolation Through Test Containers

Each test should run in **complete isolation** with its own database instance. Tests should not depend on each other or share state.

**Why this matters**: 
- Tests can run in any order
- Tests can run in parallel
- One failing test doesn't affect others
- You have full control over database state

**How to implement**: Use testcontainers or similar tools to spin up a fresh database instance for each test, ensuring complete isolation.

---

These principles are **language-agnostic** and apply to backend testing in any financial system. They focus on **verifying invariants** (properties that should always be true) rather than just checking API responses, which is crucial for catching logical errors that can lead to financial losses.

---

## Conclusion

This article covered the story of a million-dollar bug, how I recreated it through reverse engineering, and the **17 key principles** of backend testing in banking systems that helped catch it. While this article is coming to an end, **my story continues**.

In my next article, I'll dive deep into the **architecture of the Go test framework** that implements all these principles. I'll share:
- The architectural decisions behind the framework design
- How composition in Go enables reusable test components
- Best practices I've learned as an **SDET** (Software Development Engineer in Test)
- Practical patterns for building maintainable and scalable test suites
- How to structure tests for maximum coverage with minimal duplication

The framework demonstrates how to apply all 17 principles in practice, showing that comprehensive backend testing doesn't have to be slow or complex—all 73 tests complete in less than 55 seconds.

---

## Try It Yourself

For those who don't want to wait or simply want to try the demo and explore everything independently, here's the link to the GitHub repository:

**GitHub**: [https://github.com/Andrey-Roshchupkin/one-million-bug-go-backend-testing](https://github.com/Andrey-Roshchupkin/one-million-bug-go-backend-testing)

---

## What's Your Experience?

I've shared **17 principles** that I've found essential for backend testing in banking systems. But I'm curious—**have I missed any critical principles** that you've discovered in your testing experience?

Whether you're testing financial systems, e-commerce platforms, or any other backend services where data integrity is crucial, I'd love to hear:
- What principles or practices have you found most valuable?
- Have you encountered similar bugs that could have been caught with these approaches?
- What challenges have you faced when testing backend systems?

**Share your thoughts and experiences in the comments**—let's learn from each other!