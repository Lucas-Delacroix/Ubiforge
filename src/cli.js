"use strict";

const { program } = require("commander");
const pkg = require("../package.json");
const { interactiveFlow } = require("./interactive");
const { executePlan } = require("./index");

function coerceList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeOptions(opts) {
  const normalized = {
    mode: opts.nonInteractive ? "flags" : "interactive",
    flavor: opts.flavor || null, 
    release: opts.release || null, 
    arch: opts.arch || null,
    source: opts.sourceIso
      ? { kind: "local-iso", path: opts.sourceIso }
      : opts.download
      ? { kind: "download-official" }
      : null,
    outputDir: opts.output || null,
    packages: coerceList(opts.withPackages),
    debug: !!opts.debug,
  };
  return normalized;
}

function hasMinimumFlags(config) {
  if (!config) return false;
  return (
    !!config.flavor &&
    !!config.release &&
    !!config.arch &&
    (!!config.source || true) && 
    !!config.outputDir
  );
}

async function run() {
  program
    .name("ubiforge")
    .description(
      "Create custom Ubuntu ISOs (Desktop/Server) interactively or via flags."
    )
    .version(pkg.version)
    .option("-n, --non-interactive", "Run only via flags, no prompts")
    .option("-f, --flavor <flavor>", "desktop | server")
    .option("-r, --release <release>", "Ex.: 24.04, 22.04")
    .option("-a, --arch <arch>", "amd64 | arm64")
    .option("-o, --output <dir>", "Directory for output artifacts")
    .option("--source-iso <path>", "Path to local ISO")
    .option("--download", "Download official ISO as base")
    .option(
      "--with-packages <list>",
      "List of extra packages to include (comma-separated)"
    )
    .option("--debug", "Detailed logging for debugging");

  program.parse(process.argv);
  const opts = program.opts();
  const config = normalizeOptions(opts);

  if (config.mode === "interactive") {
    const finalConfig = await interactiveFlow(config);
    await executePlan(finalConfig);
    return;
  }

  if (!hasMinimumFlags(config)) {
    console.error(
      "Required flags are missing. Add --flavor, --release, --arch, and --output, or remove --non-interactive to use interactive mode."
    );
    process.exit(2);
  }

  if (!config.source) {
    config.source = { kind: "download-official" };
  }

  await executePlan(config);
}

module.exports = { run };

