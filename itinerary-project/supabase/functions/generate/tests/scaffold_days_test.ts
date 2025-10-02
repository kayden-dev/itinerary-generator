import { assert, assertEquals } from "@std/assert";

import { buildDays, Issue } from "../construction/days.ts";
import { Destination, Trip } from "../utils/trip.ts";
import { Itinerary } from "../utils/itinerary.ts";

type Fixture = {
  name: string;
  body: {
    destinations: Trip["destinations"];
    dates: Trip["dates"];
  };
  expected: {
    expectedStatus: number;
    days?: Itinerary["days"];
    errors?: Omit<Issue, "message">[];
  };
};

const cases: Fixture[] = JSON.parse(
  await Deno.readTextFile(new URL("../../../../data/scaffold_days.json", import.meta.url))
);

for (const c of cases) {
  Deno.test(`Running: ${c.name}`, () => {
    const result = buildDays(c.body.destinations as Destination[], c.body.dates as Trip["dates"]);

    if (result.ok) {
      assertEquals(c.expected.expectedStatus, 200, `${c.name} status mismatch`);
      assert(c.expected.days, `${c.name} missing expected day fixtures`);
      assertEquals(result.data, c.expected.days, `${c.name} days`);
    } else {
      assertEquals(c.expected.expectedStatus, 400, `${c.name} status mismatch`);
      const expectedError = c.expected.errors?.[0];
      assert(expectedError, `${c.name} missing expected error fixture`);
      // deno-lint-ignore no-unused-vars
      assertEquals((({ message, ...rest }) => rest)(result.error), expectedError, `${c.name} error`);
    }
  });
}
