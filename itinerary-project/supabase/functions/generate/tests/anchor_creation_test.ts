import { assert, assertEquals } from "@std/assert";

import { buildDays } from "../construction/days.ts";
import { insertAnchors, Issue } from "../construction/anchors.ts";
import { Itinerary } from "../utils/itinerary.ts";
import { Trip } from "../utils/trip.ts";

type Fixture =
  | {
      name: string;
      body: Trip;
      expected: {
        expectedStatus: 200;
        days: Itinerary["days"];
      };
    }
  | {
      name: string;
      body: Trip;
      expected: {
        expectedStatus: 400;
        errors: Omit<Issue, "message">[];
      };
    };

const cases: Fixture[] = JSON.parse(
  await Deno.readTextFile(new URL("../../../../data/anchor_creation.json", import.meta.url))
);

/**
 * Helper function to ignore the id's when comparing day blocks
 * @param days - Array of days with blocks
 * @returns normalised array of days with id's normalised
 */
const normaliseDays = (days: Itinerary["days"]) =>
  days.map((day) => ({
    ...day,
    // deno-lint-ignore no-unused-vars
    blocks: day.blocks.map(({ id, ...rest }) => ({ ...rest, id: "<insert>" })),
  }));

for (const c of cases) {
  Deno.test(`Running: ${c.name}`, () => {
    const daysResult = buildDays(c.body.destinations, c.body.dates);
    assert(daysResult.ok, `${c.name} failed to scaffold days`);
    const result = insertAnchors(c.body, daysResult.data);

    if (result.ok) {
      assertEquals(c.expected.expectedStatus, 200, `${c.name} status mismatch`);
      assert("days" in c.expected, `${c.name} missing expected success fixture`);
      const actualDays = normaliseDays(result.data);
      const expectedDays = normaliseDays(c.expected.days);
      assertEquals(actualDays, expectedDays, `${c.name} days`);
    } else {
      assertEquals(c.expected.expectedStatus, 400, `${c.name} status mismatch`);
      assert("errors" in c.expected, `${c.name} missing expected error fixture`);
      const expectedError = c.expected.errors[0];
      assert(expectedError, `${c.name} missing expected error fixture`);
      // deno-lint-ignore no-unused-vars
      assertEquals((({ message, ...rest }) => rest)(result.error), expectedError, `${c.name} error`);
    }
  });
}
