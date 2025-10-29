const test = require("node:test");
const assert = require("node:assert/strict");

const { normalizeOptions, hasMinimumFlags } = require("../src/cli");

test("normalizeOptions lowercases and trims values", () => {
  const opts = {
    nonInteractive: true,
    flavor: " Desktop ",
    release: " 24.04 ",
    arch: " AMD64 ",
    download: true,
    output: "/tmp/out",
    withPackages: "curl , git , ",
    debug: true,
  };

  const config = normalizeOptions(opts);
  assert.equal(config.mode, "flags");
  assert.equal(config.flavor, "desktop");
  assert.equal(config.release, "24.04");
  assert.equal(config.arch, "amd64");
  assert.deepEqual(config.source, { kind: "download-official" });
  assert.deepEqual(config.packages, ["curl", "git"]);
  assert.equal(config.outputDir, "/tmp/out");
  assert.equal(config.debug, true);
});

test("normalizeOptions prefers sourceIso over download flag", () => {
  const opts = {
    flavor: "desktop",
    arch: "amd64",
    release: "24.04",
    sourceIso: "/isos/base.iso",
    download: true,
  };

  const config = normalizeOptions(opts);
  assert.deepEqual(config.source, { kind: "local-iso", path: "/isos/base.iso" });
});

test("hasMinimumFlags validates required fields", () => {
  const config = {
    flavor: "server",
    release: "24.04",
    arch: "amd64",
    source: { kind: "download-official" },
    outputDir: "/tmp/out",
  };

  assert.equal(hasMinimumFlags(config), true);
  assert.equal(hasMinimumFlags({}), false);
});

