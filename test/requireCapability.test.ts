import { describe, expect, it } from "vitest";

import { CapabilityDeniedError, requireCapability } from "../src/requireCapability";

describe("requireCapability", () => {
  it("does not throw in log mode when user is missing capability", () => {
    const user = { id: "u_1", capabilities: [] };

    expect(() => {
      requireCapability(user, "admin", { mode: "log" });
    }).not.toThrow();
  });

  it("throws CapabilityDeniedError in enforce mode when user is missing capability", () => {
    const user = { id: "u_2", capabilities: [] };

    expect(() => {
      requireCapability(user, "admin", { mode: "enforce" });
    }).toThrow(CapabilityDeniedError);
  });

  it("does not throw for allowed user in both log and enforce modes", () => {
    const user = { id: "u_3", capabilities: ["admin"] };

    expect(() => {
      requireCapability(user, "admin", { mode: "log" });
    }).not.toThrow();

    expect(() => {
      requireCapability(user, "admin", { mode: "enforce" });
    }).not.toThrow();
  });

  it("calls logger with expected event shape", () => {
    const logs: any[] = [];
    const logger = (event: any) => logs.push(event);

    const user = { id: "u_4", capabilities: [] };

    requireCapability(user, "admin", {
      mode: "log",
      logger,
      context: { route: "GET /admin/users" },
    });

    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      userId: "u_4",
      capability: "admin",
      allowed: false,
      mode: "log",
      wouldThrow: true,
      message: "Missing capability: admin",
      context: { route: "GET /admin/users" },
    });
    expect(typeof logs[0].timestamp).toBe("string");
  });
});
