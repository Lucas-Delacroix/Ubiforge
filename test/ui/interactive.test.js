const test = require("node:test");
const assert = require("node:assert/strict");

const { buildQuestions, finalizeConfig } = require("../../src/ui/interactive");

test("buildQuestions skips prompts when seed has values", () => {
  const seed = { flavor: "desktop", release: "24.04", arch: "amd64" };
  const questions = buildQuestions(seed);

  const flavorQuestion = questions.find((q) => q.name === "flavor");
  const releaseQuestion = questions.find((q) => q.name === "release");
  const archQuestion = questions.find((q) => q.name === "arch");

  assert.equal(typeof flavorQuestion.type, "function");
  assert.equal(flavorQuestion.type(), null);
  assert.equal(releaseQuestion.type(), null);
  assert.equal(archQuestion.type(), null);
});

test("buildQuestions asks for ISO path only when local source selected", () => {
  const questions = buildQuestions({});
  const isoQuestion = questions.find((q) => q.name === "isoPath");

  assert.equal(typeof isoQuestion.type, "function");
  assert.equal(isoQuestion.type(null, { sourceKind: "download-official" }), null);
  assert.equal(
    isoQuestion.type(null, { sourceKind: "local-iso" }),
    "text"
  );
});

test("finalizeConfig merges seed and answers, parsing packages", () => {
  const seed = { flavor: "desktop", debug: true };
  const answers = {
    release: "22.04",
    arch: "arm64",
    sourceKind: "local-iso",
    isoPath: "/tmp/ubuntu.iso",
    outputDir: "build/output",
    packagesRaw: "curl,git",
  };

  const config = finalizeConfig(seed, answers);

  assert.equal(config.flavor, "desktop");
  assert.equal(config.release, "22.04");
  assert.equal(config.arch, "arm64");
  assert.deepEqual(config.source, { kind: "local-iso", path: "/tmp/ubuntu.iso" });
  assert.equal(config.outputDir, "build/output");
  assert.deepEqual(config.packages, ["curl", "git"]);
  assert.equal(config.debug, true);
});

test("finalizeConfig defaults to download source when not local", () => {
  const seed = {};
  const answers = {
    flavor: "server",
    release: "24.04",
    arch: "amd64",
    sourceKind: "download-official",
    outputDir: "build/out",
    packagesRaw: "",
  };

  const config = finalizeConfig(seed, answers);
  assert.deepEqual(config.source, { kind: "download-official" });
});

