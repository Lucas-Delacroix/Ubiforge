"use strict";

const prompts = require("prompts");

const FLAVORS = [
  { title: "Ubuntu Desktop", value: "desktop" },
  { title: "Ubuntu Server", value: "server" },
];

const RELEASES = [
  { title: "24.04 LTS (Noble)", value: "24.04" },
  { title: "22.04 LTS (Jammy)", value: "22.04" },
];

const ARCHES = [
  { title: "amd64 (x86_64)", value: "amd64" },
  { title: "arm64 (aarch64)", value: "arm64" },
];

async function interactiveFlow(seed = {}) {
  const initial = [];

  if (!seed.flavor) {
    initial.push({
      type: "select",
      name: "flavor",
      message: "Choose the Base Ubuntu flavor to use:",
      choices: FLAVORS,
      initial: 0,
    });
  }

  if (!seed.release) {
    initial.push({
      type: "select",
      name: "release",
      message: "Choose the version (LTS recommended):",
      choices: RELEASES,
      initial: 0,
    });
  }

  if (!seed.arch) {
    initial.push({
      type: "select",
      name: "arch",
      message: "Choose the arch",
      choices: ARCHES,
      initial: 0,
    });
  }

  initial.push({
    type: "select",
    name: "sourceKind",
    message: "Choose the source of the base ISO:",
    choices: [
      { title: "Download official ISO", value: "download-official" },
      { title: "Use local ISO", value: "local-iso" },
    ],
    initial: 0,
  });

  const baseAnswers = await prompts(initial, {
    onCancel: () => {
      console.log("Aborted.");
      process.exit(0);
    },
  });

  let source = null;
  if (baseAnswers.sourceKind === "local-iso") {
    const { isoPath } = await prompts(
      {
        type: "text",
        name: "isoPath",
        message: "Path to local ISO:",
        validate: (v) => (!!v && v.trim().length > 0) || "Please provide a valid path",
      },
      { onCancel: () => process.exit(0) }
    );
    source = { kind: "local-iso", path: isoPath };
  } else {
    source = { kind: "download-official" };
  }

  const { outputDir } = await prompts(
    {
      type: "text",
      name: "outputDir",
      message: "Directory for output artifacts (e.g., build/ubiforge):",
      initial: seed.outputDir || "build/ubiforge",
      validate: (v) => (!!v && v.trim().length > 0) || "Please provide a directory path",
    },
    { onCancel: () => process.exit(0) }
  );

  const { packagesRaw } = await prompts(
    {
      type: "text",
      name: "packagesRaw",
      message:
        "Extra packages to include (comma-separated, optional):",
      initial: "",
    },
    { onCancel: () => process.exit(0) }
  );

  const packages = String(packagesRaw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const finalConfig = {
    mode: "interactive",
    flavor: seed.flavor || baseAnswers.flavor,
    release: seed.release || baseAnswers.release,
    arch: seed.arch || baseAnswers.arch,
    source,
    outputDir,
    packages,
    debug: !!seed.debug,
  };

  const { confirm } = await prompts(
    {
      type: "confirm",
      name: "confirm",
      message: "Confirm configuration and continue?",
      initial: true,
    },
    { onCancel: () => process.exit(0) }
  );

  if (!confirm) {
    console.log("Aborted.");
    process.exit(0);
  }

  return finalConfig;
}

module.exports = { interactiveFlow };

