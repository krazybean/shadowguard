# shadowguard

> See permission failures before they break production.

[![npm version](https://img.shields.io/npm/v/shadowguard.svg)](https://www.npmjs.com/package/shadowguard)  
[![license](https://img.shields.io/npm/l/shadowguard.svg)](LICENSE)

---

## Why this exists

Most permission bugs don’t show up until production.

You add a new permission check and suddenly:
- users get locked out  
- endpoints fail  
- internal tools break  

The problem isn’t writing permission checks —  
it’s introducing them safely.

**shadowguard lets you observe failures before enforcing anything.**

---

## Installation

```bash
npm install shadowguard
```

## Basic Usage

```js
import { requireCapability } from "shadowguard"

const user = { id: "123", capabilities: [] }

// Safe: logs only, never throws
requireCapability(user, "admin", { mode: "log" })
```

Switching to enforce mode is a single change:

```js
requireCapability(user, "admin", { mode: "enforce" })
```

`log` → logs missing permissions
`enforce` → throws when unauthorized

## Protecting a route

```js
app.get("/admin/users", (req, res) => {
  requireCapability(req.user, "admin", { mode: "log" })

  return getAllUsers()
})
```

Logging: 

```json
{
  "event": "capability_check",
  "userId": "user_123",
  "capability": "admin",
  "allowed": false,
  "mode": "log"
}
```

## Enforcing access

```js
app.get("/admin/users", (req, res) => {
  requireCapability(req.user, "admin", { mode: "enforce" })

  return getAllUsers()
})
```

## Handling enforcement errors

```js
try {
  requireCapability(user, "admin", { mode: "enforce" })
} catch (err) {
  return res.status(403).json({ error: "Forbidden" })
}
```

## Custom logging

```js
requireCapability(user, "admin", {
  mode: "log",
  logger: (event) => {
    console.log("[shadowguard]", event)
  }
})
```

Use this to:
 - send logs to observability tools
 - measure rollout impact
 - audit access behavior

## Integrating with your system

```js
onst user = {
  id: "123",
  capabilities: getUserCapabilities(userId)
}

requireCapability(user, "admin", { mode: "log" })
```

shadowguard does not replace your system —
it wraps it safely.

## Safe rollout strategy

```js
// Step 1: observe
requireCapability(user, "admin", { mode: "log" })

// Step 2: fix gaps (based on logs)

// Step 3: enforce
requireCapability(user, "admin", { mode: "enforce" })
```

## API:

```ts
requireCapability(user, capability, options?)
```

## Options:
```ts
{
  mode?: "log" | "enforce"
  logger?: (event) => void
}
```

## Default User Shape

```ts
{
  id: string
  capabilities?: string[]
}
```

## Event Shape
```ts
{
  event: "capability_check",
  userId?: string,
  capability: string,
  allowed: boolean,
  mode: "log" | "enforce"
}
```

## Testing
```js
npm test
```

Guarantees:

 - `log` mode never throws
 - `enforce` mode throws when unauthorized
 - logging is consistent

 Running the example:

 ```bash
 npx tsx examples/basic.ts
 ```

 
