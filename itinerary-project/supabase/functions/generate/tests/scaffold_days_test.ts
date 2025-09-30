import { assert, assertEquals } from "@std/assert";

import { buildDays } from "../construction/days.ts";

type Fixture = {
  name: string;
  body: {
    destinations: unknown[];
    dates: Record<string, string>;
  };
  expected: {
    expectedStatus: number;
    days?: unknown[];
    errors?: unknown[];
  };
};

const cases: Fixture[] = JSON.parse(
  await Deno.readTextFile(new URL("../../../../data/scaffold_days.json", import.meta.url))
);

function deepAssertEquals(actual: unknown, expected: unknown, path = "value"): void {
  if (expected === "<insert>") {
    return;
  }

  if (Array.isArray(expected)) {
    assert(Array.isArray(actual), `${path} should be an array`);
    assertEquals((actual as unknown[]).length, expected.length, `${path} length mismatch`);
    expected.forEach((item, index) => {
      deepAssertEquals((actual as unknown[])[index], item, `${path}[${index}]`);
    });
    return;
  }

  if (expected && typeof expected === "object") {
    assert(actual && typeof actual === "object", `${path} should be an object`);
    for (const key of Object.keys(expected as Record<string, unknown>)) {
      deepAssertEquals(
        (actual as Record<string, unknown>)[key],
        (expected as Record<string, unknown>)[key],
        path ? `${path}.${key}` : key
      );
    }
    return;
  }

  assertEquals(actual, expected, `${path} mismatch`);
}

for (const c of cases) {
  Deno.test(`Running: ${c.name}`, () => {
    const result = buildDays(c.body.destinations as never[], c.body.dates as never);

    if (result.ok) {
      assertEquals(c.expected.expectedStatus, 200, `${c.name} status mismatch`);
      assert(c.expected.days, `${c.name} missing expected day fixtures`);
      deepAssertEquals(result.data, c.expected.days, `${c.name} days`);
    } else {
      assertEquals(c.expected.expectedStatus, 400, `${c.name} status mismatch`);
      const expectedError = c.expected.errors?.[0];
      assert(expectedError, `${c.name} missing expected error fixture`);
      deepAssertEquals(result.error, expectedError, `${c.name} error`);
    }
  });
}
