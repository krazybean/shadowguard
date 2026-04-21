# shadowguard

[![npm version](https://img.shields.io/npm/v/shadowguard.svg)](https://www.npmjs.com/package/shadowguard)
[![license](https://img.shields.io/npm/l/shadowguard.svg)](LICENSE)
[![tests](https://img.shields.io/badge/tests-passing-brightgreen)](#)

## Why this exists

Most permission bugs don’t show up until production.

shadowguard lets you see what will break before enforcing anything.

## What this is

A tiny safety layer for permission checks.

## What this is NOT

- Not an auth system
- Not role management
- Not a framework

## One-line idea

Check a capability now, enforce later.

## Try it in 10 seconds

```bash
npm install shadowguard
```

## Install

```bash
npm install shadowguard
```

## Primary usage

```ts
import { requireCapability } from "shadowguard";

requireCapability(user, "admin", { mode: "log" });
```

That is the core workflow.

- `mode: "log"` means: do not break flows, log what would have been blocked.
- later, switch to `mode: "enforce"` to throw on denied access.

## 🧪 Real-world example

```ts
app.get("/admin/users", (req, res) => {
  requireCapability(req.user, "admin", { mode: "log" });

  return getAllUsers();
});
```

Why this is useful:

- You can add the check today without breaking production traffic.
- You get visibility into denied admin access attempts.
- When confidence is high, change to `mode: "enforce"` for strict blocking.

## API

```ts
requireCapability(user, capability, options?)
```

Returns:

- `true` if allowed
- `false` if denied in `"off"` or `"log"` mode
- throws `CapabilityDeniedError` if denied in `"enforce"` mode

## Rollout pattern

1. Start with `mode: "log"`.
2. Watch denied events.
3. Fix false positives.
4. Move critical paths to `mode: "enforce"`.

## License

MIT
