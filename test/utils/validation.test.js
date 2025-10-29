const test = require("node:test");
const assert = require("node:assert/strict");

const { validateFlagValues } = require("../../src/utils/validation");

test("validateFlagValues returns empty array for valid config", () => {
  const config = {
    flavor: "desktop",
    release: "24.04",
    arch: "amd64",
  };
  const errors = validateFlagValues(config);
  assert.equal(errors.length, 0);
});

test("validateFlagValues reports invalid entries", () => {
  const config = {
    flavor: "invalid-flavor",
    release: "99.99",
    arch: "x86",
  };
  const errors = validateFlagValues(config);
  assert.equal(errors.length, 3);
  assert.match(errors[0], /Invalid --flavor 'invalid-flavor'/);
  assert.match(errors[1], /Invalid --release '99.99'/);
  assert.match(errors[2], /Invalid --arch 'x86'/);
});

