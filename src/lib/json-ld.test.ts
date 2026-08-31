import assert from "node:assert/strict";
import test from "node:test";

import { serializeJsonLd } from "./json-ld.ts";

test("neutraliza menor-que ao serializar JSON-LD", () => {
  const serialized = serializeJsonLd({ text: "</script><script>alert(1)</script>" });

  assert.ok(!serialized.includes("<"));
  assert.match(serialized, /\\u003c\/script>/);
});
