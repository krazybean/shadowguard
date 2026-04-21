# shadowguard

See permission failures before they break production.

## What this is

A tiny safety layer for permission checks that lets you start in audit mode, learn what would fail, and enforce safely when you are ready.

## Quick example

```ts
requireCapability(user, "admin", { mode: "log" });
```
