export type EnforcementMode = "off" | "log" | "enforce";

export type CapabilityUser = {
  id?: string | number;
  capabilities?: readonly string[];
  [key: string]: unknown;
};

export type CapabilityCheckEvent = {
  timestamp: string;
  userId: string | number | undefined;
  capability: string;
  allowed: boolean;
  mode: EnforcementMode;
  wouldThrow: boolean;
  message: string;
  context?: Record<string, unknown>;
};

export type RequireCapabilityOptions<TUser extends CapabilityUser> = {
  mode?: EnforcementMode;
  message?: string;
  context?: Record<string, unknown>;
  hasCapability?: (user: TUser, capability: string) => boolean;
  logger?: (event: CapabilityCheckEvent) => void;
  onDenied?: (event: CapabilityCheckEvent) => void;
};

export class CapabilityDeniedError extends Error {
  readonly event: CapabilityCheckEvent;

  constructor(event: CapabilityCheckEvent) {
    super(event.message);
    this.name = "CapabilityDeniedError";
    this.event = event;
  }
}

function defaultHasCapability<TUser extends CapabilityUser>(
  user: TUser,
  capability: string,
): boolean {
  const list = user.capabilities;
  return Array.isArray(list) && list.includes(capability);
}

function defaultLogger(event: CapabilityCheckEvent): void {
  if (event.allowed || event.mode === "off") {
    return;
  }

  const action = event.wouldThrow ? "would deny" : "denied";
  console.warn(
    `[shadowguard] ${action} capability check`,
    JSON.stringify({
      userId: event.userId,
      capability: event.capability,
      mode: event.mode,
      context: event.context,
    }),
  );
}

export function requireCapability<TUser extends CapabilityUser>(
  user: TUser,
  capability: string,
  options: RequireCapabilityOptions<TUser> = {},
): boolean {
  const {
    mode = "log",
    message = `Missing capability: ${capability}`,
    context,
    hasCapability = defaultHasCapability,
    logger = defaultLogger,
    onDenied,
  } = options;

  const allowed = hasCapability(user, capability);
  if (allowed) {
    return true;
  }

  const event: CapabilityCheckEvent = {
    timestamp: new Date().toISOString(),
    userId: user.id,
    capability,
    allowed,
    mode,
    wouldThrow: mode === "log",
    message,
    context,
  };

  if (mode !== "off") {
    logger(event);
  }

  onDenied?.(event);

  if (mode === "enforce") {
    throw new CapabilityDeniedError(event);
  }

  return false;
}
