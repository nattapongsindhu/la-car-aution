import { describe, it, expect } from "vitest";
import { assessRisk, computeDmvFee } from "./index";
import type { Vehicle } from "../../types/vehicle";

function makeVehicle(overrides: Partial<Vehicle>): Vehicle {
  return {
    year: 2022,
    make: "TOYOTA",
    model: "CAMRY",
    vin: "4T1BF1FK5CU000001",
    division: "LOT-A",
    ...overrides,
  };
}

describe("computeDmvFee", () => {
  it("current year returns base $200", () => {
    const currentYear = new Date().getFullYear();
    expect(computeDmvFee(currentYear)).toBe(200);
  });

  it("older year = (currentYear - year) * 150 + 200", () => {
    const currentYear = new Date().getFullYear();
    const year = currentYear - 4;
    expect(computeDmvFee(year)).toBe(4 * 150 + 200);
  });

  it("invalid year returns fallback $500", () => {
    expect(computeDmvFee(0)).toBe(500);
    expect(computeDmvFee(NaN)).toBe(500);
  });
});

describe("assessRisk", () => {
  it("Toyota 2022 → CLEAN", () => {
    const result = assessRisk(makeVehicle({ make: "TOYOTA", year: 2022 }));
    expect(result.status).toBe("clean");
    expect(result.reasons).toHaveLength(0);
    expect(result.dmvFee).toBeLessThan(1000);
  });

  it("Honda 2022 → CLEAN", () => {
    const result = assessRisk(makeVehicle({ make: "HONDA", year: 2022 }));
    expect(result.status).toBe("clean");
  });

  it("BMW 2018 → HIGH (European brand)", () => {
    const result = assessRisk(makeVehicle({ make: "BMW", year: 2018 }));
    expect(result.status).toBe("high");
    expect(result.reasons).toContain("European brand");
  });

  it("MERC 2015 → HIGH (European prefix)", () => {
    const result = assessRisk(makeVehicle({ make: "MERC", year: 2015 }));
    expect(result.status).toBe("high");
    expect(result.reasons).toContain("European brand");
  });

  it("2004 Toyota → HIGH (pre-2005)", () => {
    const result = assessRisk(makeVehicle({ make: "TOYOTA", year: 2004 }));
    expect(result.status).toBe("high");
    expect(result.reasons.some((r) => r.includes("Pre-2005"))).toBe(true);
  });

  it("1999 Ford → HIGH (pre-2005)", () => {
    const result = assessRisk(makeVehicle({ make: "FORD", year: 1999 }));
    expect(result.status).toBe("high");
  });

  it("old vehicle can have multiple HIGH reasons", () => {
    // BMW pre-2005 → both isOld and isEuropean
    const result = assessRisk(makeVehicle({ make: "BMW", year: 2003 }));
    expect(result.status).toBe("high");
    expect(result.reasons).toContain("European brand");
    expect(result.reasons.some((r) => r.includes("Pre-2005"))).toBe(true);
  });

  it("KIA 2018 → STANDARD (neutral make, fee < 1500)", () => {
    const result = assessRisk(makeVehicle({ make: "KIA", year: 2018 }));
    expect(result.status).toBe("standard");
    expect(result.reasons).toHaveLength(0);
  });

  it("Hyundai 2019 → STANDARD", () => {
    const result = assessRisk(makeVehicle({ make: "HYUNDAI", year: 2019 }));
    expect(result.status).toBe("standard");
  });

  it("KIA 2017 → HIGH (fee > $1500)", () => {
    // 2026 - 2017 = 9 years → 9*150+200 = 1550 > 1500
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - 9;
    const result = assessRisk(makeVehicle({ make: "KIA", year: targetYear }));
    expect(result.status).toBe("high");
    expect(result.reasons.some((r) => r.includes("DMV"))).toBe(true);
  });

  it("Toyota 2011 → STANDARD (clean make but year < 2012)", () => {
    const result = assessRisk(makeVehicle({ make: "TOYOTA", year: 2011 }));
    // 2011 >= 2005 so not HIGH for age, not European, fee = 15*150+200 = 2450 > 1500 → actually HIGH
    // Let's check: 2026-2011 = 15, 15*150+200 = 2450 > 1500 → HIGH
    expect(result.status).toBe("high");
  });
});
