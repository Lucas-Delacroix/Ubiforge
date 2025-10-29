"use strict";

const SUPPORTED_FLAVORS = [
  { key: "desktop", label: "Ubuntu Desktop" },
  { key: "server", label: "Ubuntu Server" },
];

const SUPPORTED_RELEASES = [
  { key: "24.04", label: "24.04 LTS (Noble)" },
  { key: "22.04", label: "22.04 LTS (Jammy)" },
];

const SUPPORTED_ARCHES = [
  { key: "amd64", label: "amd64 (x86_64)" },
  { key: "arm64", label: "arm64 (aarch64)" },
];

function toPromptChoices(list) {
  return list.map(({ key, label }) => ({ title: label, value: key }));
}

module.exports = {
  SUPPORTED_FLAVORS,
  SUPPORTED_RELEASES,
  SUPPORTED_ARCHES,
  toPromptChoices,
};

