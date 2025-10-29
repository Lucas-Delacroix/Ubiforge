"use strict";

const { ask, PromptCancelledError } = require("../utils/prompts");
const { validateNonEmpty } = require("../utils/validation");
const { coerceCommaList } = require("../utils/parse");
const {
  SUPPORTED_FLAVORS,
  SUPPORTED_RELEASES,
  SUPPORTED_ARCHES,
  toPromptChoices,
} = require("../domain/ubuntu");
const { defaultOutputDir } = require("../config/defaults");

/**
 * @typedef {import('../types/config').UbiforgeConfig} UbiforgeConfig
 */

function buildQuestions(seed = {}) {
  const choicesFlavor = toPromptChoices(SUPPORTED_FLAVORS);
  const choicesRelease = toPromptChoices(SUPPORTED_RELEASES);
  const choicesArch = toPromptChoices(SUPPORTED_ARCHES);

  return [
    {
      name: "flavor",
      message: "Choose Ubuntu base edition:",
      type: () => (seed.flavor ? null : "select"),
      choices: choicesFlavor,
      initial: 0,
    },
    {
      name: "release",
      message: "Choose Ubuntu release (LTS recommended):",
      type: () => (seed.release ? null : "select"),
      choices: choicesRelease,
      initial: 0,
    },
    {
      name: "arch",
      message: "Choose architecture:",
      type: () => (seed.arch ? null : "select"),
      choices: choicesArch,
      initial: 0,
    },
    {
      name: "sourceKind",
      message: "Select base ISO source:",
      type: "select",
      choices: [
        { title: "Download official ISO", value: "download-official" },
        { title: "Use local ISO", value: "local-iso" },
      ],
      initial: 0,
    },
    {
      name: "isoPath",
      message: "Path to local ISO:",
      type: (prev, values) =>
        values.sourceKind === "local-iso" ? "text" : null,
      validate: validateNonEmpty("Provide a valid path"),
    },
    {
      name: "outputDir",
      message: "Output directory for artifacts:",
      type: "text",
      initial: seed.outputDir || defaultOutputDir,
      validate: validateNonEmpty("Provide an output directory"),
    },
    {
      name: "packagesRaw",
      message: "Extra packages to include (comma-separated, optional):",
      type: "text",
      initial: "",
    },
  ];
}

function finalizeConfig(seed = {}, answers = {}) {
  const packages = coerceCommaList(answers.packagesRaw);

  /** @type {UbiforgeConfig} */
  const finalConfig = {
    mode: "interactive",
    flavor: seed.flavor || answers.flavor,
    release: seed.release || answers.release,
    arch: seed.arch || answers.arch,
    source:
      answers.sourceKind === "local-iso"
        ? { kind: "local-iso", path: answers.isoPath }
        : { kind: "download-official" },
    outputDir: answers.outputDir,
    packages,
    debug: !!seed.debug,
  };

  return finalConfig;
}

async function confirmConfig(config) {
  const { confirm } = await ask([
    {
      name: "confirm",
      type: "confirm",
      message: "Confirm configuration and continue?",
      initial: true,
    },
  ]);

  if (!confirm) {
    throw new PromptCancelledError("User did not confirm configuration");
  }
}

async function interactiveFlow(seed = {}) {
  const answers = await ask(buildQuestions(seed));
  const finalConfig = finalizeConfig(seed, answers);
  await confirmConfig(finalConfig);
  return finalConfig;
}

module.exports = { interactiveFlow, buildQuestions, finalizeConfig };

