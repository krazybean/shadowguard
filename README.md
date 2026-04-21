# shadowguard

See permission failures before they break production.

Most permission bugs don’t show up until production.

You deploy a new check, and suddenly users are locked out, endpoints break, or behavior changes in ways you didn’t expect.

shadowguard lets you see what would fail before enforcing anything.

## What this is

A tiny safety layer for permission checks that lets you start in audit mode, learn what would fail, and enforce safely when you are ready.

## Quick example

```ts
requireCapability(user, "admin", { mode: "log" });
```
