import { describe, expect, it } from "vitest";
import { DEFAULT_RUN, advanceRun, chargePhone, finishBoot } from "@/state/runState";

describe("battery shutdown flow", () => {
  it("does not reboot or skip time when an action drains the battery", () => {
    const run = { ...DEFAULT_RUN, battery: 1 };

    const drained = advanceRun(run, 10, 5);

    expect(drained.battery).toBe(0);
    expect(drained.booted).toBe(false);
    expect(drained.day).toBe(run.day);
    expect(drained.t).toBe(run.t + 10);
  });

  it("only boots after the player chooses to charge the dead phone", () => {
    const dead = { ...DEFAULT_RUN, battery: 0, booted: false };
    const charging = chargePhone(dead);

    expect(charging.booted).toBe(true);
    expect(charging.battery).toBeGreaterThan(0);
    expect(finishBoot(charging).booted).toBe(false);
  });
});
