---
date: 2025-11-20
---

# The Absence of Errors Double Fallacy: Introducing the New HTTP Method GOAT

## Introduction: The Interview Paradox

Picture this: you're sitting in an interview, and the interviewer asks, "What HTTP status codes do you know?" or "What's the difference between GET and POST?" Almost every candidate confidently rattles off the same textbook answers: "200 for success, 404 for not found, POST is for creating resources, GET is idempotent..." The responses are so predictable they could be scripted. But here's the thing—after conducting interviews and years of working on real projects, I've discovered something fascinating: **the gap between what we _think_ we know about HTTP standards and what actually happens exists and it's very big**. In real-world applications, I've seen developers sometimes ignore HTTP conventions to meet business requirements—a POST method that should be idempotent becomes non-idempotent because "the business needs it that way." And sometimes they make mistakes in places where we don't expect.

QA should know about the testing principle **"The Absence of Errors Fallacy"** but when they answer questions about what status codes and HTTP methods exist, they say what should exist according to official specs, this way making a **double fallacy**.

This article isn't just another tutorial on HTTP status codes—it's a journey through the strange and wonderful world of how developers actually implement web standards when theory meets reality, complete with real-life examples that will make you question everything you thought you knew about HTTP, and my brand new **GOAT method** that breaks all the rules but exists.

---

## The Strange Errors Server

To demonstrate these concepts in action, I've prepared a special demonstration server called **"Strange Errors Server"** that showcases various HTTP fallacies and unconventional implementations. 

**Documentation**: [https://github.com/Andrey-Roshchupkin/strange-errors-server?tab=readme-ov-file#strange-errors-server-](https://github.com/Andrey-Roshchupkin/strange-errors-server?tab=readme-ov-file#strange-errors-server-)

This server runs on `http://localhost:3000` and includes:

### API Routes

#### **Articles API (Non-Idempotent POST)**

- `GET /api/articles` - Get all articles
- `POST /api/article` - Create a new article (creates duplicates on repeated calls)
- `DELETE /api/article/{id}` - Delete an article by ID

#### **Users API (Idempotent POST)**

- `POST /api/user` - Create a new user with email (returns error if user already exists)

#### **Health Check**

- `GET /api/health-check` - Regular health check
- `GOAT /api/health-check` - Custom method with progressive behavior

#### **Documentation**

- `GET /swagger/` - Interactive API documentation
- `GET /swagger/doc.json` - OpenAPI specification

The server demonstrates the difference between idempotent and non-idempotent POST methods, showcases incorrect HTTP status codes, and features the infamous **GOAT method** that progressively becomes more destructive with each call. Try it yourself to discover what's wrong with the HTTP responses!

---

## The Idempotency Paradox: When POST Methods Break the Rules

Let's start with idempotency and compare the two POST methods from our server. According to the [HTTP/1.1 specification (RFC 7231)](https://tools.ietf.org/html/rfc7231#section-4.3.3), POST methods are not required to be idempotent, but in practice, many real-world APIs implement them as such for business reasons.

Take payment systems, for example. Both [PayPal](https://developer.paypal.com/docs/api/orders/v2/#orders_create) and [Stripe](https://stripe.com/docs/api/idempotent_requests) use POST methods for payments but implement idempotency through special headers like `Idempotency-Key`. This allows the same payment request to be safely retried without creating duplicate charges.

However, according to REST recommendations, payment systems should ideally use PUT methods with endpoints like `payments/{paymentID}`, where the ID is generated on the frontend. But here's the catch: if a PUT method is used and the client (or a malicious actor) sends multiple requests with different or random IDs, the system could end up creating or processing many separate transactions—potentially resulting in duplicate or fraudulent payments. This vulnerability arises because each unique payment ID would be treated as a new transaction, making it difficult to prevent abuse or accidental double processing. That's why many payment providers prefer to use POST methods and implement their own idempotency mechanisms (like requiring an `Idempotency-Key`), rather than strictly following the "pure" REST approach. This helps them control transaction creation and avoid the risk of one transaction being completed multiple times due to repeated or manipulated requests.

Our **Strange Errors Server** demonstrates this exact dilemma with two different POST implementations:

### **Non-Idempotent POST: Articles API**

The articles endpoint follows the traditional POST behavior - it creates a new resource every time, even with identical data:

```bash
# First call - creates article (ID generated by server)
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"Test Article","content":"Test content"}' \
  http://localhost:3000/api/article

# HTTP/1.1 888 OK
# Response: {"message":"New article added.","status":"OK"}

# Second call with same data - creates duplicate (new ID generated)
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"Test Article","content":"Test content"}' \
  http://localhost:3000/api/article

# HTTP/1.1 888 OK
# Response: {"message":"New article added.","status":"OK"}
```

As you can see, both calls return success, and if we check the articles list, we'll find two identical articles with different IDs. This is the "standard" POST behavior according to HTTP specifications.

### **Idempotent POST: Users API**

The users endpoint breaks the HTTP rule to follow business logic - it prevents duplicate users:

```bash
# First call - creates user
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@exa‌mple.‌com"}' \
  http://localhost:3000/api/user

# HTTP/1.1 201 Created
# Response: {"id":1,"name":"Alice","email":"alice@exa‌mple.‌com"}

# Second call with same data - returns error
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@exa‌mple.‌com"}' \
  http://localhost:3000/api/user

# HTTP/1.1 400 Bad Request
# Response: {"message":"","status":"USER_EXISTS","error":"User with name 'Alice' already exists"}
```

Here's where we break the HTTP specification to follow business logic. According to HTTP standards, POST methods should create new resources, but in our case, we're implementing idempotency to prevent duplicate users - a common business requirement that overrides the technical specification.

This is exactly what happens in real-world applications: **developers choose business logic over strict HTTP compliance**, creating APIs that work better for their specific use cases but deviate from the "pure" REST approach.

## The Status Code Deception: When Errors Hide in Plain Sight

Attentive readers might have noticed something unusual in our examples - the status code `888` instead of the expected `201`. For experienced engineers, this looks obviously wrong, but in real projects, status codes that handle errors can be wrong and not so obvious. It can be **subtle error handling mistakes that are hard to spot**.

Let's look at our updated user creation endpoint that now includes email validation:

```bash
# Valid email - creates user successfully
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"ValidUser","email":"valid@exa‌mple.‌com"}' \
  http://localhost:3000/api/user

# HTTP/1.1 201 Created
# Response: {"id":1,"name":"ValidUser","email":"valid@exa‌mple.‌com"}

# Invalid email - returns wrong status code
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"InvalidUser","email":"ab"}' \
  http://localhost:3000/api/user

# HTTP/1.1 500 Internal Server Error
# Response: {"message":"","status":"INTERNAL_ERROR","error":"Internal server error: email validation failed"}
```

Here's the problem: when the email validation fails, we return a `500 Internal Server Error` instead of the correct `400 Bad Request`. According to HTTP standards, a `500` error indicates a server-side problem, but email validation failure is clearly a client-side issue that should return `400`.

This type of error handling mistake is **surprisingly common in production systems**. Developers often return `500` errors for validation failures, either out of habit or because they're treating all errors the same way in their error handling middleware.

### **The Honeypot Defense: When Wrong Status Codes Are Intentional**

Interestingly, setting wrong status codes can sometimes be a deliberate security tactic called a **"honeypot."** Some systems intentionally return misleading status codes to confuse potential attackers or scrapers. This approach is used in real-world security strategies, such as deploying decoy resources or fake endpoints to detect or mislead malicious actors. For more on this, see [How to detect suspicious activity in your AWS account by using private decoy resources](https://aws.amazon.com/blogs/security/how-to-detect-suspicious-activity-in-your-aws-account-by-using-private-decoy-resources/) and Cloudflare's [AI Labyrinth](https://blog.cloudflare.com/ai-labyrinth/) (an example of industrial-scale use of "traps" and fake content to confuse bots). For example:

- Returning `404 Not Found` instead of `403 Forbidden` to hide the existence of protected resources
- Using `500 Internal Server Error` for rate limiting to make it look like a server problem rather than intentional blocking
- Returning `200 OK` with error messages in the response body to bypass simple status code-based detection

While this can be an effective defense mechanism, it also creates the exact problem we're discussing - **status codes that don't match their actual meaning**, making debugging and integration more difficult for legitimate users.

## The GOAT Method: When HTTP Standards Meet Creativity

Finally, let's explore our most creative example - the custom **`GOAT` HTTP method**. This demonstrates how developers can create entirely new HTTP methods when business needs require it:

```bash
# First call to GOAT method
curl -X GOAT http://localhost:3000/api/health-check

# Response: {"status":"OK","message":"Hello! I am a brand new GOAT. Everything is fine."}

# Second call - behavior changes
curl -X GOAT http://localhost:3000/api/health-check

# Response: {"status":"Annoyed","message":"Why are you calling me again?"}
```

As you can see, the **GOAT method has progressive behavior** that changes with each call. Readers can discover the full behavior of this method by themselves - try calling it multiple times to see what happens!

### **Custom HTTP Methods: Yes, You _Can_ Do It (But Should You?)**

The **GOAT method** in this demo is a playful example, but it proves a real point: you _can_ implement any custom HTTP method you want—GOAT, BANANA, or anything else. The HTTP protocol allows it, and servers can be programmed to recognize and handle these methods.

As a QA engineer, if you notice a custom HTTP method (like GOAT, BANANA, etc.) in the API documentation or during your testing, don't just assume it's a mistake or ignore it. Instead, ask: **"Does the business really need this specific custom method, or could a standard method (GET, POST, PUT, DELETE, PATCH, etc.) be used instead?"** Standard methods are almost always preferable because they're widely supported and understood by browsers, proxies, and client tools. Custom methods are allowed by the protocol, but they should only be used when there's a real, justified business need—otherwise, they can cause compatibility and maintenance issues. Always clarify the business reason behind any non-standard method you encounter.

**Custom methods come with real drawbacks:**

- **Browser Support**: Browsers only support standard methods; custom ones won't work in fetch/XHR or HTML forms.
- **Framework and Library Support**: Many backend frameworks and HTTP clients reject or ignore unknown methods.
- **Infrastructure Compatibility**: Proxies, load balancers, and security tools may block or mishandle custom methods.
- **Maintainability**: Other developers may be confused by non-standard methods, making your API harder to use and document.

That said, if you have a very specific business need—such as a private API, a legacy integration, or a protocol that truly doesn't fit any standard method—custom methods are technically possible. Just be aware of the trade-offs: **you gain flexibility, but you lose compatibility and ease of use**.

**In summary:** Custom HTTP methods like GOAT are fun and possible, but always prefer standard methods unless you have a compelling reason to do otherwise.

## Conclusion: The Absence of Errors Double Fallacy

Throughout this article, we've explored how the gap between HTTP theory and practice creates a perfect storm for QA engineers and developers. We've seen:

1. **Idempotency Paradox**: How business logic often overrides HTTP specifications, making POST methods behave differently than expected
2. **Status Code Deception**: How wrong status codes can be either mistakes or intentional security measures
3. **Custom Method Creativity**: How developers create new HTTP methods when standard ones don't fit their needs

### **The Double Fallacy Explained**

The **"Absence of Errors Double Fallacy"** occurs when:

1. **First Fallacy**: QA engineers know about the "Absence of Errors Fallacy" (the principle that the absence of errors doesn't prove correctness)
2. **Second Fallacy**: But they still give textbook answers about HTTP standards, assuming real-world implementations follow the specifications

This creates a **dangerous blind spot** where experienced professionals confidently state what _should_ happen according to standards, while real systems behave completely differently.

### **Why This Matters**

In real projects, developers make pragmatic choices that prioritize:

- **Business requirements** over HTTP purity
- **Security through obscurity** over standard error codes
- **Custom solutions** over standard methods
- **Performance** over strict compliance

As QA engineers, we need to:

- **Test according to business needs**, not just what the system actually does or what the standards say
- **Question our assumptions** about HTTP behavior
- **Look beyond status codes** to understand the real system behavior
- **Be prepared for non-standard implementations**

### **Understanding HTTP Methods: What They Are and Their Limitations**

To fully appreciate why developers sometimes deviate from HTTP standards—and why our **GOAT method** example is both possible and problematic—it's important to understand what HTTP methods actually are at a technical level.

**What is an HTTP Method?**

An HTTP method is simply a **string** (a sequence of characters) that appears in the request line of an HTTP request. According to the [HTTP/1.1 specification (RFC 7231)](https://tools.ietf.org/html/rfc7231#section-4), a method token is defined as a case-sensitive string that can contain letters, digits, and certain special characters. In practice, methods are typically uppercase alphabetic strings like `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, and `OPTIONS`.

When you send a request like `curl -X GOAT http://localhost:3000/api/health-check`, the method `GOAT` is just a string that gets placed in the HTTP request line: `GOAT /api/health-check HTTP/1.1`. The server can read this string and decide how to handle it—there's no built-in validation that restricts methods to only standard ones.

**Method Length Limitations:**

While the HTTP specification doesn't explicitly define a maximum length for method names, practical limitations exist:
- **Request Line Length**: The entire HTTP request line (method + path + version) is typically limited to 8KB by most servers and proxies
- **Server Configuration**: Web servers like Nginx and Apache have default limits (often 4KB-8KB) for request line length
- **Framework Constraints**: Many frameworks impose their own limits—for example, Express.js has a default limit of 2KB for the request line
- **Practical Considerations**: Extremely long method names (hundreds of characters) may be rejected by intermediate proxies, load balancers, or security tools

In practice, method names are kept short (typically 1-10 characters) for readability and compatibility, but technically, a method like `VERY_LONG_CUSTOM_METHOD_NAME_FOR_SPECIFIC_BUSINESS_LOGIC` could work if the server is configured to handle it.

**Browser Limitations:**

- **Standard Methods Only**: Browsers' `fetch()` API and XMLHttpRequest only support standard HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS). Custom methods like `GOAT` won't work in browser JavaScript—attempting `fetch(url, { method: 'GOAT' })` may throw an error or be silently converted to GET
- **Form Method Restrictions**: HTML forms only support GET and POST methods, making it impossible to use custom methods directly from web pages
- **CORS Preflight**: Custom methods trigger CORS preflight requests, which many servers may reject if not properly configured

**Framework and Infrastructure Limitations:**

- **Method Validation**: Many frameworks (Express.js, Django, Flask, Spring Boot) validate HTTP methods against a whitelist and may reject or ignore non-standard ones by default. For example, Express.js requires explicit route registration for custom methods
- **Router Constraints**: Most routing systems are pre-configured for standard methods, requiring explicit configuration to support custom methods like `GOAT`
- **Client Libraries**: Popular HTTP client libraries (axios, requests, HttpClient) may filter or reject unknown methods, or require special configuration
- **Infrastructure Compatibility**: Proxies, load balancers, API gateways, and security tools (WAFs) often only recognize standard methods, potentially blocking or logging custom implementations as suspicious activity

These limitations explain why our **GOAT method** example works with `curl` (which sends raw HTTP requests) but would fail in browser-based applications or when using many standard HTTP client libraries. This is exactly why developers often choose pragmatic solutions over strict HTTP compliance—when browsers, frameworks, or infrastructure don't support custom methods, developers must find workarounds that actually work in production.

### **The Takeaway**

The next time you're in an interview or working on a project, remember: **Understanding business needs is more important than following industry standards**. HTTP standards are guidelines, not laws. Real systems are messy, creative, and often break the rules for good business reasons. The absence of standard HTTP behavior doesn't mean there are no errors - it means you need to dig deeper to understand what business requirements drove these decisions.

When you encounter non-standard HTTP behavior, ask yourself: **"What business need does this serve?"** rather than "Why doesn't this follow the standard?" The answer will often reveal the real logic behind seemingly "incorrect" implementations.

Try the **Strange Errors Server** yourself, explore its endpoints, and discover the fascinating ways developers bend HTTP to meet their needs. You might be surprised by what you find.

---

### Interactive Demo and Source Code

For a hands-on experience with all the HTTP examples from this article, you can:

- **View the Complete Source Code:** [https://github.com/Andrey-Roshchupkin/strange-errors-server](https://github.com/Andrey-Roshchupkin/strange-errors-server) - All server code is available with detailed README and setup instructions
