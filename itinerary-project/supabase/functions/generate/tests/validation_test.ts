import { assertEquals, assertArrayIncludes } from "@std/assert";
import { parseJsonWith } from "../utils/validate.ts";
import { TripSchema } from "../utils/trip.ts";

// test cases from the input_validaton suite, which tests for combinations of required fields missing
const required_input_cases = JSON.parse(
  await Deno.readTextFile(new URL("../../../../data/input_validation.json", import.meta.url))
);

// test cases from the date_validation suite, which tests for different date formats
const date_input_cases = JSON.parse(
  await Deno.readTextFile(new URL("../../../../data/date_validation.json", import.meta.url))
);

for (const c of [...required_input_cases, ...date_input_cases]) {
  Deno.test(`Running: ${c.name}`, async () => {
    const req = new Request("http://localhost/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(c.body),
    });

    const parsed = await parseJsonWith(req, TripSchema);

    if (parsed.ok) {
      assertEquals(200, c.expected.expectedStatus);
      assertEquals(parsed.data, c.body);
    } else {
      assertEquals(400, c.expected.expectedStatus);
      assertArrayIncludes(
        // deno-lint-ignore no-unused-vars
        parsed.errors.map(({ message, ...rest }) => rest),
        c.expected.errors
      );
    }
  });
}
