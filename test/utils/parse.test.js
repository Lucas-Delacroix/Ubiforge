const test = require("node:test");
const assert = require("node:assert/strict");

const { coerceCommaList } = require("../../src/utils/parse");

test("coerceCommaList handles undefined and empty values", () => {
  assert.deepEqual(coerceCommaList(undefined), []);
  assert.deepEqual(coerceCommaList(""), []);
});

test("coerceCommaList splits comma-separated strings", () => {
  assert.deepEqual(coerceCommaList("curl, wget ,git"), ["curl", "wget", "git"]);
});

test("coerceCommaList returns arrays untouched", () => {
  const list = ["curl", "git"];
  assert.deepEqual(coerceCommaList(list), list);
});

