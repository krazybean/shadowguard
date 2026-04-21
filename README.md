# shadowguard

> See permission failures before they break production.

[![npm version](https://img.shields.io/npm/v/shadowguard.svg)](https://www.npmjs.com/package/shadowguard)
[![license](https://img.shields.io/npm/l/shadowguard.svg)](LICENSE)

---

## What this is

A tiny safety layer for permission checks.

Most permission bugs don’t show up until production.

You deploy a new check, and suddenly:
- users get locked out
- endpoints start failing
- behavior changes in ways you didn’t expect

**shadowguard lets you see what would fail before enforcing anything.**

---

## Install

```bash
npm install shadowguard