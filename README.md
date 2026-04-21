# shadowguard

A tiny safety layer for permission checks.

`shadowguard` helps you add permission checks without risky production breakage.

Start in audit mode, see what would be denied, then enforce when ready.

## One-line idea

Check a capability now, enforce later.

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

## What this library is

- A small wrapper around permission checks
- A safe path from observation to enforcement
- Useful when you want audit-first rollout

## What this library is not

- Not an auth system
- Not role storage
- Not login/session management
- Not a policy framework

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
