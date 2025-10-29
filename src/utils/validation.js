"use strict";

function validateNonEmpty(message = "Value is required") {
  return (value) => (!!value && String(value).trim().length > 0) || message;
}

function allowedKeys(list) {
  return list.map((x) => x.key);
}

function validateFlagValues(config) {
  const errors = [];
  try {
    const domain = require("../domain/ubuntu");
    const flavors = allowedKeys(domain.SUPPORTED_FLAVORS);
    const releases = allowedKeys(domain.SUPPORTED_RELEASES);
    const arches = allowedKeys(domain.SUPPORTED_ARCHES);

    if (config.flavor && !flavors.includes(config.flavor)) {
      errors.push(
        `Invalid --flavor '${config.flavor}'. Allowed: ${flavors.join(", ")}`
      );
    }
    if (config.release && !releases.includes(config.release)) {
      errors.push(
        `Invalid --release '${config.release}'. Allowed: ${releases.join(", ")}`
      );
    }
    if (config.arch && !arches.includes(config.arch)) {
      errors.push(
        `Invalid --arch '${config.arch}'. Allowed: ${arches.join(", ")}`
      );
    }
  } catch (e) {
    // If domain import fails, return empty errors to avoid crashing; CLI can handle.
  }
  return errors;
}

module.exports = { validateNonEmpty, validateFlagValues };
